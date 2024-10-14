import Nat "mo:base/Nat";
import List "mo:base/List";
import Text "mo:base/Text";
import Int "mo:base/Int";
import Bool "mo:base/Bool";
import Array "mo:base/Array";
import Hash "mo:base/Hash";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Blob "mo:base/Blob";
import Nat64 "mo:base/Nat64";
import Int64 "mo:base/Int64";
import Random "mo:base/Random";
import Float "mo:base/Float";
import Debug "mo:base/Debug";
import Option "mo:base/Option";
import Timer "mo:base/Timer";
import RandomUtil "lib/RandomUtil";
import Cycles "mo:base/ExperimentalCycles";
import Principal "mo:base/Principal";
import Error "mo:base/Error";
import IcpLedgerCanister "../commons/libs/IcpLedgerCanister";
import TimeUtil "../commons/libs/TimeUtil";
import TextUtils "../commons/libs/TextUtils";
import CommonTypes "../commons/libs/CommonTypes";
import TicketFactory "../commons/libs/TicketFactory";
import HistoryRecordsCanister "lib/HistoryRecordsCanister";
import PayCenerCanister "lib/PayCenerCanister";
import Hex "../commons/libs/Hex";

actor class X()=this {

  let icp_ledger_canister : IcpLedgerCanister.Self = actor ("ryjl3-tyaaa-aaaaa-aaaba-cai"); 
  let pay_center_canister : PayCenerCanister.Self = actor ("3fuvj-dyaaa-aaaak-ao3la-cai");
  let history_records_canister : HistoryRecordsCanister.Self = actor ("3cvt5-oaaaa-aaaak-ao3lq-cai");
  // let pay_center_wallet_address : Text = "9e1f06c5d8468c41c9bbc5bf316ff415b342a625fa46679fe887a62e11291cfa";
  let company_wallet_address : Text = "2a6b47b9993b2b55e444dab257d662cca0a33b4166b26a462fb4ff5e728abb6b";
  type TransferResult = IcpLedgerCanister.Result_6;

  //所有用户抽奖记录
  stable var playRecordList = List.nil<TicketFactory.PlayRecord>();
  //中奖记录
  stable var playRecordsForWinners = List.nil<TicketFactory.PlayRecord>();
  //抽奖流水
  stable var ledgerList = List.nil<TicketFactory.Ledger>();
  //转账到支付中心失败记录
  stable var failedToPayCenterledgerList = List.nil<TicketFactory.Ledger>();
  //转账后更新支付中心里的用户状态的失败记录
  stable var failedListToUpdateUserPostPay = List.nil<TicketFactory.Ledger>();
  //每个用户的抽奖记录
  // var user2PlayRecordsMap = HashMap.HashMap<Text, List.List<TicketFactory.PlayRecord>>(5, Text.equal, Text.hash);
  //todo 改为stable变量，否则数据在canister重启时会丢失
  // stable var user2PlayRecordsMap = StableHashMap.StableHashMap<Text, List.List<TicketFactory.PlayRecord>>(5, Text.equal, Text.hash);

  stable var logs = List.nil<Text>();

  //支持的最大用户数
  stable var max_users_num = 0;
  //奖池总票数
  stable var total_tickets_count: Nat = 0;
  //每张奖票价格
  stable var ticket_price:Nat64 = 0;

  stable var next_transaction_id: Int = 0;
  //最近一次对账成功时的tranction_id
  stable var last_tid_for_success_recon: Int = 0;
  stable var balanceForPlay: Int = 0;

  type TimerId = Timer.TimerId;
  stable var timerId: TimerId = 1;

  //用户种子列表
  stable var seeds_for_users : [var ?RandomUtil.Record] = Array.tabulateVar<?RandomUtil.Record>(max_users_num, func(_:Nat) { null });
  //生成种子的下一个index
  stable var next_seed_idx = 0;

  //奖池赢率
  var win_rate:Float = 20.3;

  //不同等级奖对应不同奖金
  var winMap = HashMap.HashMap<Nat,Nat64>(6, Nat.equal, Hash.hash);
  private stable var winMap_entries : [(Nat, Nat64)] = [];
  
  //不同中奖级别对应不同中奖倍数
  let win_times_map = HashMap.HashMap<Nat,Nat>(6, Nat.equal, Hash.hash);
  win_times_map.put(1, 100);
  win_times_map.put(2, 50);
  win_times_map.put(3, 20);
  win_times_map.put(4, 10);
  win_times_map.put(5, 5);
  win_times_map.put(6, 2);

  //默认奖池配置
  stable let ticketSet : TicketFactory.Ticket = {
    var batch:Nat64=0;
    var inventory = total_tickets_count;
    var stickets : [var Text] = Array.init<Text>(0, TicketFactory.empty); 
    var win1 = [];
    var win2 = [];
    var win3 = [];
    var win4 = [];
    var win5 = [];
    var win6 = [];
    var running = false;
    var total_count = total_tickets_count;
    currency  = "ICP";
    var pid  = "INSTANT_WIN";   
    var pname = "INSTANT_WIN";
    var price = ticket_price;
    level = 6;
    start_time =TimeUtil.getCurrentSecond();
    var end_time = null;
    // 总奖金
    var total_bonus = 0;
    // 中奖率
    rate = Float.toText(win_rate);
    //中奖回报率
    pay_out = "90";
  };

  //初始化奖池
  public shared func init(pid:Text, pname:Text, new_batch_number:Nat64, new_ticket_price:Nat64, new_total_tickets_count:Nat) : async Text {

    if (ticketSet.running) {
      return "请先暂停奖池，再初始化";
    };

    //总奖数

    var total_wins_num : Nat = Int.abs(Float.toInt(Float.fromInt(new_total_tickets_count) * win_rate / 100)) ;
    // let win_counts_for_1000_tickets = win_rate * 10;
    // let win1_count = Int.abs(Float.toInt(Float.ceil(Float.fromInt(total_wins_num) * 1 / win_counts_for_1000_tickets)));
    // let win2_count = Int.abs(Float.toInt(Float.ceil(Float.fromInt(total_wins_num) * 2 / win_counts_for_1000_tickets)));
    // let win3_count = Int.abs(Float.toInt(Float.ceil(Float.fromInt(total_wins_num) * 5 / win_counts_for_1000_tickets)));
    // let win4_count = Int.abs(Float.toInt(Float.ceil(Float.fromInt(total_wins_num) * 15 / win_counts_for_1000_tickets)));
    // let win5_count = Int.abs(Float.toInt(Float.ceil(Float.fromInt(total_wins_num) * 30 / win_counts_for_1000_tickets)));

    var win1_count = new_total_tickets_count * 1 / 1000;
    var win2_count = new_total_tickets_count * 2 / 1000;
    var win3_count = new_total_tickets_count * 5 / 1000;
    var win4_count = new_total_tickets_count * 15 / 1000;
    var win5_count = new_total_tickets_count * 30 / 1000;

    if(win1_count == 0) win1_count := 1;
    if(win2_count == 0) win2_count := 1;
    if(win3_count == 0) win3_count := 1;
    if(win4_count == 0) win4_count := 1;
    if(win5_count == 0) win5_count := 1;

    let win6_count = Int.abs(total_wins_num - win1_count - win2_count - win3_count - win4_count - win5_count);
   
    Debug.print("生成win个数, 1：" # Nat.toText(win1_count) # " 2:" # Nat.toText(win2_count) # " 3:" # Nat.toText(win3_count) # " 4:" # Nat.toText(win4_count) # " 5:" # Nat.toText(win5_count) # " 6:" # Nat.toText(win6_count));

    let win : [Nat] = await RandomUtil.random_bytes(new_total_tickets_count, total_wins_num);
    // 1000个数的话，1,2,5,15,30,150  总奖金数 900 中奖率 20.3%
    var index=0;
    let win1 : [var Nat] = Array.init<Nat>(win1_count, 0);
    let win2 : [var Nat] = Array.init<Nat>(win2_count, 0);
    let win3 : [var Nat] = Array.init<Nat>(win3_count, 0);
    let win4 : [var Nat] = Array.init<Nat>(win4_count, 0);
    let win5 : [var Nat] = Array.init<Nat>(win5_count, 0);
    let win6 : [var Nat] = Array.init<Nat>(win6_count, 0);
    for(i in Iter.range(0, win1_count-1)){
      win1[i]:=win[index];
      index+=1;
    };
    for(i in Iter.range(0, win2_count-1)){
      win2[i]:=win[index];
      index+=1;
    };
    for(i in Iter.range(0, win3_count-1)){
      win3[i]:=win[index];
      index+=1;
    };
    for(i in Iter.range(0, win4_count-1)){
      win4[i]:=win[index];
      index+=1;
    };
    for(i in Iter.range(0, win5_count-1)){
      win5[i]:=win[index];
      index+=1;
    };
    for(i in Iter.range(0, win6_count-1)){
      win6[i]:=win[index];
      index+=1;
    };
    ticketSet.pid := pid;
    ticketSet.pname := pname;
    Debug.print("生成中奖票");
    ticketSet.win1:=Array.freeze(win1);
    ticketSet.win2:=Array.freeze(win2);
    ticketSet.win3:=Array.freeze(win3);
    ticketSet.win4:=Array.freeze(win4);
    ticketSet.win5:=Array.freeze(win5);
    ticketSet.win6:=Array.freeze(win6);
    ticketSet.batch := new_batch_number;
    ticketSet.inventory := new_total_tickets_count;
    ticketSet.price := new_ticket_price;
    ticketSet.total_count := new_total_tickets_count;
    ticketSet.stickets := Array.init<Text>(new_total_tickets_count, TicketFactory.empty);
    ticketSet.total_bonus := Int64.toNat64(Float.toInt64(Float.fromInt(new_total_tickets_count * Nat64.toNat(new_ticket_price))  * 0.9));

    ticket_price := new_ticket_price;
    total_tickets_count := new_total_tickets_count;
    max_users_num := new_total_tickets_count;
    seeds_for_users := Array.tabulateVar<?RandomUtil.Record>(max_users_num, func(_:Nat) { null });

    winMap.put(1, 100* ticket_price);
    winMap.put(2, 50* ticket_price);
    winMap.put(3, 20* ticket_price);
    winMap.put(4, 10* ticket_price);
    winMap.put(5, 5* ticket_price);
    winMap.put(6, 2* ticket_price);

    next_seed_idx := 0;
    playRecordList := List.nil<TicketFactory.PlayRecord>();
    playRecordsForWinners := List.nil<TicketFactory.PlayRecord>();
    ledgerList := List.nil<TicketFactory.Ledger>();
    failedToPayCenterledgerList := List.nil<TicketFactory.Ledger>();
    failedListToUpdateUserPostPay := List.nil<TicketFactory.Ledger>();
    logs := List.nil<Text>();

    return "初始化成功";
  };

  //启动奖池抽奖
  public shared func start() : async Text {
      if(ticketSet.running)
        return "启动奖池抽奖失败：奖池已经在启动状态";
      //检查保证金是否是奖池金额的30%，如果不是，启动失败
      //let balance = await icp_balance_ledger();
      //let bond = Int64.toNat64(Float.toInt64(Float.fromInt(ticketSet.total_count * Nat64.toNat(ticketSet.price))  * 0.3));
      //if(balance != Nat64.toNat(bond))
        //return "启动奖池失败: 钱包内保证金(" # Nat.toText(balance) # ") 不等于奖池总金额的30% (" # Nat64.toText(bond) # ")";
      ticketSet.running :=true;
      return "启动奖池抽奖";
  };

  //暂停奖池抽奖
  public shared func stop() : async Text {
      ticketSet.running :=false;
      return "暂停奖池抽奖";
  };

  //抽奖
  public shared ({ caller }) func play(idx : Nat, user_name : Text, user_portrait : Text) : async Text {

    if (Principal.isAnonymous(caller)) {
        throw Error.reject("Anonymous user is not allowed to invoke method 'play'");
    };

    if (not ticketSet.running) {
      return "{\"code\":500,\"message\":\"The prize pool has not been activated yet.\"}";
    };

    let start = TimeUtil.getCurrentMillisecond();

    //检查库存
    if (ticketSet.inventory <= 0) {
      return "{\"code\":501,\"message\":\"event has ended。\"}";
    };

    let user_id = Principal.toText(caller);

    //更新交易号，方便和支付中心对账  
    var cost_pay_center_play: Int = 0;
    try{
        next_transaction_id := next_transaction_id + 1;
        let start_pay_center_play = TimeUtil.getCurrentMillisecond();
        let user_pay_result = await pay_center_canister.play(caller, ticket_price, next_transaction_id, ticketSet.pname);        
        let end_pay_center_play = TimeUtil.getCurrentMillisecond();
        cost_pay_center_play := end_pay_center_play - start_pay_center_play;
        switch (user_pay_result) {
          case (#Err(msg)) {
              ignore log_message("Failed to invoke play method from PayCenter. Reason: " # debug_show(msg));    
              return "{code:502,message:"#debug_show(msg)#"}";              
          };
          case (#Ok(index)) {                
              ignore log_message("Succeed to invoke play method from PayCenter");    
              balanceForPlay := balanceForPlay + Nat64.toNat(ticket_price) ;  
              //添加抽奖流水
              ledgerList := TicketFactory.addLedger(ledgerList, next_transaction_id, user_id, await get_address(), ticket_price, #PLAY, null, null);            
          };      
        };
    }catch(e){
        ignore log_message("Exception when invoking play method from PayCenter Canister:" # debug_show(Error.message(e)));
    };

    //生成彩票 更新库存
    let start_make_ticket = TimeUtil.getCurrentMillisecond();
    let ticket_no = await TicketFactory.make(ticketSet, user_id, await commitment(idx));
    let end_make_ticket = TimeUtil.getCurrentMillisecond();
    let cost_make_ticket = end_make_ticket - start_make_ticket;
    if (ticket_no == -1) {
      return "{\"code\":503,\"message\":\"Failed to generate the ticket.\"}";
    };  

    //判断是否中奖
    let result = TicketFactory.win(ticketSet,Int.abs(ticket_no), user_id);

    let times :?Nat = win_times_map.get(result.level);
    playRecordList:=TicketFactory.addPlayRecord(playRecordList, user_id, user_name, user_portrait, ticket_no, result.win, result.level, times, ticket_price);
    // var currentUserPlayRecords :List.List<TicketFactory.PlayRecord>  = switch (user2PlayRecordsMap.get(user_id)) {
    //                                                                               case (?seeds_for_users) { seeds_for_users }; // Unwrap the optional value
    //                                                                               case null { List.nil<TicketFactory.PlayRecord>()}; // Provide a default empty list
    //                                                                           };
    // currentUserPlayRecords := TicketFactory.addPlayRecord(currentUserPlayRecords, user_id, user_name, user_portrait, ticket_no, result.win, result.level, times, ticket_price);
    // user2PlayRecordsMap.put(user_id, currentUserPlayRecords);

    //中奖了获取中奖金额
    //中奖了，发奖金到支付中心
    var cost_pay_to_paycenter = -1;
    var cost_pay_center_win = -1;
    if (result.win) {
      playRecordsForWinners:=TicketFactory.addPlayRecord(playRecordsForWinners, user_id, user_name, user_portrait, ticket_no, result.win, result.level, times, ticket_price);
      let amount =winMap.get(result.level);
      ignore log_message("win level :"#Nat.toText(result.level));
      switch(amount){
        case(null){
          ignore log_message(" amount is null");
        };
        case(?amount){
            ignore log_message(" amount is "#Nat64.toText(amount));          
            try{
                next_transaction_id := next_transaction_id + 1;                
                  //调用支付中心更新用户奖金状态
                let start_pay_center_win = TimeUtil.getCurrentMillisecond();                
                let pay_to_user_result = await pay_center_canister.win(caller, amount, Option.get(times,0), next_transaction_id);  
                let end_pay_center_win = TimeUtil.getCurrentMillisecond();
                cost_pay_center_win := end_pay_center_win - start_pay_center_win;                        
                switch (pay_to_user_result) {
                  case (#Err(msg)) {
                      ignore log_message("Failed to update user's balance. Reason: " # debug_show(msg));                  
                      failedListToUpdateUserPostPay := TicketFactory.addLedger(failedListToUpdateUserPostPay, next_transaction_id, await get_address(), user_id, amount, #WIN, times, null);
                  };
                  case (#Ok(index)) {                
                      ignore log_message("Succeed to update user's balance");  
                      balanceForPlay := balanceForPlay - Nat64.toNat(amount) ;  
                      ledgerList := TicketFactory.addLedger(ledgerList, next_transaction_id, await get_address(), user_id, amount, #WIN, times, null);                    
                  };
                };
            }catch(e){
              ignore log_message("Exception when invoking win method from PayCenter Canister:" # debug_show(Error.message(e)));
            }
        }          
      };
    };
        
    if (ticketSet.inventory == 0) {
       ticketSet.end_time := ?TimeUtil.getCurrentSecond();
       ignore gameOver();
    };

    let end = TimeUtil.getCurrentMillisecond();
    let cost = end - start;
    ignore log_message("cost:"# Int.toText(cost) #", cost_pay_center_play:" # Int.toText(cost_pay_center_play) 
            #", cost_make_ticket:" # Int.toText(cost_make_ticket) #", cost_pay_to_paycenter:" # Int.toText(cost_pay_to_paycenter) 
            #", cost_pay_center_win:" # Int.toText(cost_pay_center_win));
    return "{\"code\":200,\"ticketno\":" # Int.toText(ticket_no) # ",\"win\":" # Bool.toText(result.win) # ",\"cost\":\"" # Int.toText(cost) # "\",\"level\":\"" # Nat.toText(result.level) # "\",\"message\":\"" # result.message # "\"}";
  };

  //这一期奖池结束
  public shared func gameOver() : async() {
      //存储数据到历史合约      
      ignore saveInHistoryCanister();
      //把奖池余额转到公司账户
      let balance = await icp_balance_ledger();
      ignore pay(company_wallet_address, Nat64.fromNat(balance));
  };

  //保存数据到历史合约
  public shared func saveInHistoryCanister() : async Bool {
    
    if(ticketSet.batch <=0 ) {
       ignore log_message("保存历史记录失败：因为奖池期数("# Nat64.toText(ticketSet.batch) #")不合法");
       return false;
    };      
    let pid = ticketSet.pid;
    let batch = Nat64.toText(ticketSet.batch);
    let ticket_view = await show();
    let add_p_info_result = await history_records_canister.add_p_info(pid, batch, ticket_view);
    let add_play_win_record_result = await history_records_canister.add_play_win_record(pid,  batch, await show_winners());
    let add_win_map_result = await history_records_canister.add_win_map(pid, batch, Iter.toArray(winMap.entries()));
    let add_win_times_map_result = await history_records_canister.add_win_times_map(pid, batch, Iter.toArray(win_times_map.entries()));
    ignore log_message("saveInHistoryCanister result:" # "add_p_info_result: " # Bool.toText(add_p_info_result) # "add_play_info_result: " # Bool.toText(add_play_win_record_result) 
                  # "add_win_map_result: " # Bool.toText(add_win_map_result) # "add_win_times_map_result: " # Bool.toText(add_win_times_map_result));
    add_p_info_result and add_play_win_record_result and add_win_map_result and add_win_times_map_result;    
  };

  public func startTimer() : async Text {
        timerId := Timer.recurringTimer(#seconds (60), reconBalanceWithPayCenter);
        return Nat.toText(timerId);
  };

  public func stopTimer() : async () {
        ignore Timer.cancelTimer(timerId);
  };

  func reconBalanceWithPayCenter(): async() {
        let me = await pay_center_canister.show_user();
        let myWalletBalanceInPayCenter = me.wallet_blance;
        ignore log_message("show_user:" # debug_show(me));
        if(balanceForPlay == myWalletBalanceInPayCenter) {
            last_tid_for_success_recon := next_transaction_id;
            var result = "";
            let amount = Int.abs(balanceForPlay);
            let my_wallet_address = await get_address();
            if(balanceForPlay < 0) {
                result := await pay_center_canister.deposit(Nat64.fromNat(Int.abs(last_tid_for_success_recon)), Nat64.fromNat(amount));
            }else if(balanceForPlay > 0) {
                result := await pay_center_canister.withdraw(amount, my_wallet_address);
            };                      
            balanceForPlay := balanceForPlay - balanceForPlay;
            ignore log_message("Succeed to recon. myWalletBalanceInPayCenter: "#Int.toText(myWalletBalanceInPayCenter) 
                                # " = balanceForPlay :"#Int.toText(balanceForPlay)#",last successful recon tid is "# Int.toText(last_tid_for_success_recon));
        }else {
            ignore log_message("Failed to recon. Reason: myWalletBalanceInPayCenter: "#Int.toText(myWalletBalanceInPayCenter) 
                                # " != balanceForPlay :"#Int.toText(balanceForPlay)#",last successful recon tid is "# Int.toText(last_tid_for_success_recon));
        };              
  };

  //查询最近50个抽奖记录
  public query func query_play_record() : async [TicketFactory.PlayRecord] {
      let all =  List.toArray(playRecordList);
      if(Array.size(all) <=50){
        return all ;
      };

      let sort = Array.sort(all, func (x:TicketFactory.PlayRecord,y:TicketFactory.PlayRecord) : { #less; #equal; #greater } {
        if (x.play_time < y.play_time) { #less } else if (x.play_time == y.play_time) { #equal } else { #greater }
      });
      Array.subArray<TicketFactory.PlayRecord>(Array.reverse<TicketFactory.PlayRecord>(sort), 0, 50);
  };

  //显示奖池当前信息
  public query func show() : async TicketFactory.TicketView {
    return {
      inventory = ticketSet.inventory;
      stickets = Array.freeze(ticketSet.stickets);
      win1 = (ticketSet.win1);
      win2 = (ticketSet.win2);
      win3 = (ticketSet.win3);
      win4 = (ticketSet.win4);
      win5 = (ticketSet.win5);
      win6 = (ticketSet.win6);
      running = ticketSet.running ;
      batch = ticketSet.batch;
      total_count = ticketSet.total_count;
      //货币种类
      currency : Text = ticketSet.currency;
      //产品ID
      pid : Text = ticketSet.pid;
      //产品名称
      pname : Text = ticketSet.pname;
      // 抽奖单价
      price : Nat64 = ticketSet.price;
      // 抽奖等级
      level : Nat = ticketSet.level;
      // 开始时间
      start_time : Int = ticketSet.start_time;
      // 结束时间
      end_time : ?Int = ticketSet.end_time;
      // 总奖金
      total_bonus = ticketSet.total_bonus;
      // 中奖率
      rate = ticketSet.rate;
      //中奖金额
      pay_out = ticketSet.pay_out;
    };
  };

  public query func show_winmap() : async Text {

    var pairs = "";
    for ((key, value) in winMap.entries()) {
      pairs := "(" # Nat.toText(key) # ", " # Nat64.toText(value) # ") " # pairs
    };
    pairs;
  };

  //显示奖池当前剩余可用奖票数
  public query func show_inventory() : async Nat {
    return ticketSet.inventory;
  };

  //查看cycles余额
  public query func balance() : async Float {
    let cycles = Cycles.balance();
    return  Float.fromInt64(Int64.fromNat64(Nat64.fromNat(cycles/1000000000000)));
  };

  //查看Canister钱包地址
  public shared func get_address() : async Text {
     return TextUtils.toAddress(Principal.fromActor(this));
  };

  //查看ICP余额
  public shared func icp_balance_ledger() : async Nat {
     let canister_icp_balance = await icp_ledger_canister.icrc1_balance_of({owner = Principal.fromActor(this);subaccount = null});
     return canister_icp_balance;
  };

  public query func check_balance_and_ledgers() : async Text {
     return "match";
  };

  //生成随机数种子
  public shared ({ caller }) func commit() : async Nat {

    if (Principal.isAnonymous(caller)) {
        throw Error.reject("Anonymous user is not allowed to invoke method 'commit'");
    };

    assert(next_seed_idx < max_users_num);

    let user_id = Principal.toText(caller);

    var i = next_seed_idx;
    while (i > 0) {
      i := i - 1;
      ignore do? {
        let r = seeds_for_users[i] !;
        if (r.id == user_id){
          ignore generate_new_seed(i,user_id);
          return i;
        } 
      }
    };
    let idx = next_seed_idx;
    seeds_for_users[idx] := ?{ id = user_id; seed = null };
    next_seed_idx := next_seed_idx + 1;
    ignore generate_next_seed();
    idx
  };

  // This avoids calling Random.blob() more than once if the previous call
  // to Random.blob() has not returned.
  var seed_pending = false;
  func generate_next_seed() : async () {
    if seed_pending return;
    seed_pending := true;
    let blob = await Random.blob();
    var i = next_seed_idx;
    label LOOP while (i > 0) {
      i := i - 1;
      ignore do? {
        let r = seeds_for_users[i] !;
        // Do not overwrite seed. Break the loop if it already exists
        if (r.seed != null) break LOOP;
        seeds_for_users[i] := ?{id = r.id; seed = ?blob};
      };
    };
    seed_pending := false;
  };

  //生成随机数种子
  func generate_new_seed(idx:Nat,id:Text) : async () {
    if seed_pending return;
    seed_pending := true;
    let blob = await Random.blob();
    seeds_for_users[idx] := ?{id = id; seed = ?blob};
    seed_pending := false;
  };

  // 查询特定index下的用户和其随机数种子
  public query func commitment(idx: Nat) : async ?{id: Text; seed: Blob} {
    assert(idx < max_users_num);
    do? {
      let r = seeds_for_users[idx] !;
      let seed = r.seed !;
      {id = r.id; seed }
    }
  };

  //显示所有获奖者的抽奖记录
  public query func show_winners() : async [TicketFactory.PlayRecord] {
      let winners_records =  List.toArray(playRecordsForWinners);      
    
      let sortedRecords = Array.sort<TicketFactory.PlayRecord>(winners_records, func(a, b) {
          if (a.level != b.level) { // 按 中奖级别 升序排序
              if (a.level < b.level) {
                  #less
              }
              else {
                  #greater
              }
          } else {
              if (a.play_time < b.play_time) { // 如果 中奖级别 相同，按 抽奖时间 升序排序
                  #less
              }
              else {
                  #greater
              }
          }
      });

      return sortedRecords;
  };

  public query func show_logs() : async [Text] {
      let logArray =  List.toArray(logs);      
      return logArray;
  };

  public query func show_ledgers() : async [TicketFactory.Ledger] {
      let ledgerArray =  List.toArray(ledgerList);      
      return ledgerArray;
  };

  public query func show_failed_ledgers() : async {failedToPayCenterledgerArray:[TicketFactory.Ledger]; failedArrayToUpdateUserPostPay:[TicketFactory.Ledger]} {
      let failedToPayCenterledgerArray =  List.toArray(failedToPayCenterledgerList);     
      let failedArrayToUpdateUserPostPay =  List.toArray(failedListToUpdateUserPostPay);     
    
      return {failedToPayCenterledgerArray; failedArrayToUpdateUserPostPay};
  };

  //显示当前用户的抽奖记录
  // public query ({ caller }) func show_user() : async [TicketFactory.PlayRecord] {

  //     let user_id = Principal.toText(caller);
  //     switch (user2PlayRecordsMap.get(user_id)) {
  //         case (?seeds_for_users) { List.toArray(seeds_for_users) }; // Unwrap the optional value
  //         case null { [] }; // Provide a default empty list
  //     };
  // };

  //测试使用
  public shared func test_play(sign : Text) : async [Int] {

    if(sign != "123456"){
          return [];
    };
    var tickets : [var Int] = Array.init<Int>(1000, 0);   
    seeds_for_users := Array.tabulateVar<?RandomUtil.Record>(1000, func(_:Nat) { null });
    for(i in Iter.range(0, 1000)){
      let seedIndex : Nat = await commit();
      let ticket_no = await TicketFactory.make(ticketSet,"test",await commitment(seedIndex));
      tickets[i]:=ticket_no;
    }; 
    return Array.freeze(tickets);
  };  

  func log_message(message: Text) : async () {

        Debug.print(message);
        logs := List.push(message, logs);        
  };

  //支付奖金给支付中心
  func pay(address: Text, amount: Nat64) : async Nat64 {

    let transferArgs : IcpLedgerCanister.TransferArgs = {
            // can be used to distinguish between transactions
            memo = 0;
            // the amount we want to transfer
            amount = {e8s=amount};
            // amount = {e8s=amount-fee};
            // the ICP ledger charges 10_000 e8s for a transfer
            // to 需要设置fee吗
            fee = { e8s = 10_000 };
            // we are transferring from the canisters default subaccount, therefore we don't need to specify it
            from_subaccount = null;
            // we take the principal and subaccount from the arguments and convert them into an account identifier
            // to = Blob.toArray(Principal.toLedgerAccount(args.toPrincipal, args.toSubaccount));
            // to = Principal.toLedgerAccount(args.toPrincipal, args.toSubaccount);
            to= Blob.fromArray(Hex.decode2(address));
            // a timestamp indicating when the transaction was created by the caller; if it is not specified by the caller then this is set to the current ICP time
            created_at_time = null;
          };
          let transferResult = await icp_ledger_canister.transfer(transferArgs);
          switch (transferResult) {
            case (#Err(transferError)) {
                ignore log_message("Failed to pay to address:" # address # " with amount " # Nat64.toText(amount));
                return 0;
            };
            case (#Ok(index)) {                
               return index;
            };
          };
  };

  public shared func test_pay(address: Text, amount: Nat64) : async Nat64 {

    let transferArgs : IcpLedgerCanister.TransferArgs = {
            // can be used to distinguish between transactions
            memo = 0;
            // the amount we want to transfer
            amount = {e8s=amount};
            // amount = {e8s=amount-fee};
            // the ICP ledger charges 10_000 e8s for a transfer
            // to 需要设置fee吗
            fee = { e8s = 10_000 };
            // we are transferring from the canisters default subaccount, therefore we don't need to specify it
            from_subaccount = null;
            // we take the principal and subaccount from the arguments and convert them into an account identifier
            // to = Blob.toArray(Principal.toLedgerAccount(args.toPrincipal, args.toSubaccount));
            // to = Principal.toLedgerAccount(args.toPrincipal, args.toSubaccount);
            to= Blob.fromArray(Hex.decode2(address));
            // a timestamp indicating when the transaction was created by the caller; if it is not specified by the caller then this is set to the current ICP time
            created_at_time = null;
          };
          let transferResult = await icp_ledger_canister.transfer(transferArgs);
          switch (transferResult) {
            case (#Err(msg)) {
                ignore log_message("Failed to pay to address:" # address # " with amount " # Nat64.toText(amount));
                return 0;
            };
            case (#Ok(index)) {                
               return index;
            };
          };
  };

  system func preupgrade() {
        winMap_entries := Iter.toArray(winMap.entries());
  };

  system func postupgrade() {
        winMap := HashMap.fromIter<Nat,Nat64>(Iter.fromArray<(Nat,Nat64)>(winMap_entries), Array.size(winMap_entries), Nat.equal, Hash.hash);
        winMap_entries := [];        
  };

  // public shared func test_play11(sign : Text) : async [Int] {

  //   if(sign != "123456"){
  //         return [];
  //   };
  //   var tickets : [var Int] = Array.init<Int>(1000, 0);   
  //   for(i in Iter.range(0, 1000)){
  //     let seedIndex : Nat = await commit();
  //     let ticket_no = await TicketFactory.make(ticketSet,"test",await commitment(seedIndex));
  //     tickets[i]:=ticket_no;
  //   }; 
  //   return Array.freeze(tickets);
  // };  

};
