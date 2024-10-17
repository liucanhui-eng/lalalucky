import Text "mo:base/Text";
import Int "mo:base/Int";
import Nat64 "mo:base/Nat64";
import Nat "mo:base/Nat";
import List "mo:base/List";
import Principal "mo:base/Principal";
import Blob "mo:base/Blob";
import Error "mo:base/Error";
import Bool "mo:base/Bool";
import Iter "mo:base/Iter";
import Array "mo:base/Array";
import Int64 "mo:base/Int64";
import Option "mo:base/Option";
import PayCenterTypes "libs/PayCenterTypes";
import IcpLedgerCanister "../commons/libs/IcpLedgerCanister";
import TimeUtil "../commons/libs/TimeUtil";
import CommonTypes "../commons/libs/CommonTypes";
import RegisterActivity "libs/RegisterActivity";
import TextUtils "../commons/libs/TextUtils";
import IcpIndex "libs/IcpIndex";
import Hex "../commons/libs/Hex";
actor class X()=this{

    type Ledger = CommonTypes.Ledger;
    type User = PayCenterTypes.User;
    type ShowUser = CommonTypes.ShowUser;
    type TransferResult= IcpLedgerCanister.Result;
    type RegisterActivityUser = RegisterActivity.RegisterActivityUser;

    stable var register_activity_list = List.nil<RegisterActivityUser>();

    stable var users : List.List<User> = List.nil();

    stable var register_activite_count = 500 ; 

    // let one_icp :Nat= 100000000;

    type icp_ledger_canister_ = IcpLedgerCanister.Self;
    type icp_index_interface = IcpIndex.Self;

    let icp_ledger_canister_instance : icp_ledger_canister_ = actor ("ryjl3-tyaaa-aaaaa-aaaba-cai");
    let icp_index_canister_instance : icp_index_interface = actor ("qhbym-qaaaa-aaaaa-aaafq-cai");

     public shared func set_register_activite_count(count:Nat,passwd:Text) : async Text {
        if(passwd != "123456"){
            return "{\"code\":500,\"message\":\"only use by local\"}";
        };
        if(count < List.size(register_activity_list)){
            return "{\"code\":500,\"message\":\"register_activite_count must be greater than the number of registered activities\"}";
        };
        register_activite_count := count;
        Nat.toText(register_activite_count);
     };
     public shared func get_register_activite_count() : async {
        total_count:Nat;
        join_count : Nat;
     }{
        
        return {
            total_count = register_activite_count;
            join_count = List.size(register_activity_list);
        };
        
     };

    public shared ({ caller }) func deposit(transaction_id : Nat64, deposit_amount : Nat64) : async Text {
        //对账
        if (Principal.isAnonymous(caller)) {
            throw Error.reject("anonymous user is not allowed to transfer funds");
        };

        let result = await icp_index_canister_instance.get_account_identifier_transactions({
            max_results  = 1;
            start = ?(transaction_id+1);
            account_identifier = TextUtils.toAddress(Principal.fromActor(this));
        });

        switch(result){
            case (#Ok(result)){
                let transactions = result.transactions;
                if(Array.size(transactions) == 0 ){
                    return "{\"code\":500,\"message\":\"transaction not found\"" # debug_show(result) # "}";
                };
                let transaction = transactions[0];
                if(transaction_id != transaction.id){
                    return "{\"code\":501,\"message\":\"transaction id is wrong\"" # debug_show(result) # "}";
                };
                let op : IcpIndex.Operation= transaction.transaction.operation;
                switch(op){
                    case(#Transfer{from;amount;fee}){
                        if(from != TextUtils.toAddress(caller)){
                            return "{\"code\":502,\"message\":\"caller id is wrong\"" # debug_show(result) # "}";
                        };
                        if ((amount.e8s+fee.e8s) != deposit_amount){
                            return "{\"code\":503,\"message\":\"transaction amount is wrong\"" # debug_show(result) # "}";
                        }
                    };
                    case(_){
                        return "{\"code\":504,\"message\":\"transaction id is wrong\"" # debug_show(result) # "}";
                    }
                };
            };
            case (#Err(e)){
                return "{\"code\":505,\"message\":\""#debug_show(e)#"\"}";
            }
        };


        //todo 存款有最小值吗？
        // let canister_balance = await icp_ledger_canister_instance.icrc1_balance_of({owner = Principal.fromActor(this);subaccount = null});
        // assert canister_balance == PayCenterTypes.get_all_amount(users)+amount;

        //获取user
        let user = PayCenterTypes.getUser(users,caller);
        switch(user){
            case (null){
                return "{\"code\":506,\"message\":\"user not found\"}";
            };
            case (?user){
                

                if (
                    List.some<Ledger>(
                        user.ledgers,
                        func(x : Ledger) : Bool {
                            return x.transaction_id == Nat64.toNat(transaction_id);
                        },
                    )
                ){
                    return "{\"code\":507,\"message\":\"repeat  transaction_id "# Nat64.toText(transaction_id) # " \"}";
                };
                PayCenterTypes.update_user_amount(user,Nat64.toNat(deposit_amount),PayCenterTypes.fee, Nat64.toNat(transaction_id), #DEPOSIT);
                PayCenterTypes.update_user_amount(get_pay_center_user(),-PayCenterTypes.fee,0, Nat64.toNat(transaction_id), #FEE);
            }
        };
        return "{\"code\":200,\"message\":\"success\"}";
    };
    public shared ({ caller }) func deposit_test(transaction_id : Nat, amount : Nat,passwd:Text) : async Text {

        if(passwd != "123456"){
            return "{\"code\":500,\"message\":\"only use by local\"}";
        };
        //对账
        // if (Principal.isAnonymous(caller)) {
        //     throw Error.reject("anonymous user is not allowed to transfer funds");
        // };
        //todo 存款有最小值吗？
        // let canister_balance = await icp_ledger_canister_instance.icrc1_balance_of({owner = Principal.fromActor(this);subaccount = null});
        // assert canister_balance == PayCenterTypes.get_all_amount(users)+amount;

        //获取user
        let user = PayCenterTypes.getUser(users,caller);
        switch(user){
            case (null){
                return "{\"code\":500,\"message\":\"user not found\"}";
            };
            case (?user){
               PayCenterTypes.update_user_amount(user,amount,PayCenterTypes.fee, transaction_id, #DEPOSIT);
                PayCenterTypes.update_user_amount(get_pay_center_user(),-PayCenterTypes.fee,0, transaction_id, #FEE);
            }
        };
        return "{\"code\":200,\"message\":\"success\"}";
    };


    public shared ({ caller }) func pay_center_total_amount() : async {
        canister_total_amount: Nat;
        user_total_amount : Int;
        total_fee : Int;
    } {
        let canister_icp_balance = await icp_ledger_canister_instance.icrc1_balance_of({owner = Principal.fromActor(this);subaccount = null});
        var user_total_amount : Int = 0;
        var total_fee:Int = 0;
        let this_id = Principal.toText(Principal.fromActor(this));
        List.iterate(users,func(user:User):(){
            if(user.principal_id == this_id){
                let ledgers = user.ledgers;
                List.iterate(ledgers,func(ledger:Ledger):(){
                    if(ledger.event == #FEE){
                        total_fee := total_fee + ledger.amount;
                    };
                });
            };
            user_total_amount := user_total_amount + user.wallet_blance
        });
        return {
            canister_total_amount = canister_icp_balance;
            user_total_amount = user_total_amount;
            total_fee = total_fee;
        };
  };
  public shared func user_error_ledger() : async [ShowUser]{
    //  let canister_icp_balance = await icp_ledger_canister_instance.icrc1_balance_of({owner = Principal.fromActor(this);subaccount = null});
    //  var user_total_amount : Nat64 = 0;
     let error_user = List.filter(users,func(user:User):Bool{
          var sum : Int = 0;
        List.iterate(user.ledgers,func(ledger:Ledger):(){
            sum := sum + ledger.amount;
        });
        return user.wallet_blance != sum;
     });
     let error_count = List.size(error_user);
     if(error_count ==0){
      return [];
     };
     let show =List.map<User,ShowUser>(error_user,func(user:User):ShowUser{
        return {
                ic_account_id = user.ic_account_id;
                principal_id = user.principal_id;
                user_name = user.user_name;
                logo = user.logo;
                wallet_blance = user.wallet_blance;
                ledgers = List.toArray(user.ledgers);
                new_user = false;
            }
     });
     return List.toArray(show) ;
  };
    public shared ({ caller }) func show_user() : async ShowUser {
        //对账
//        if (Principal.isAnonymous(caller)) {
//            throw Error.reject("anonymous user is not allowed to transfer funds");
//        };
        let find = PayCenterTypes.getUser(users,caller);
        switch(find){
            case (null){
                let new_user = PayCenterTypes.new_user(caller);
                users := List.push<User>(new_user,users);
                return PayCenterTypes.showUser(new_user,true);
            };
            case (?find){
                return PayCenterTypes.showUser(find,false);
            }
        };
    };
     public shared ({ caller }) func whoami() : async Text {
        return Principal.toText(caller);
     };

    // public shared ({ caller }) func statistics() : async {
    //     amount : Nat64;
    //     total_input_amount : Nat64;
    //     total_withdraw_amount : Nat64;
    //     total_income_amount : Nat64;
    // } {

    // };

    public shared func addLedger( passwd : Text,amount : Nat,tx_id:Nat) : async Text {
        let user = PayCenterTypes.getUser(users,Principal.fromActor(this));
        switch(user){
            case (null){
                return "{\"code\":500,\"message\":\" plase login first\"}";
            };
            case (?user){
                //校验密码
                if (not (passwd == "123456")){
                    return "{\"code\":500,\"message\":\" passwd is wrong\"}";
                };
               //校验余额
               PayCenterTypes.update_user_amount(user,amount,0,tx_id, #MANUAL);
               return "{\"code\":200,\"message\":\"success\"}";
            }
        }
    };


    public shared func show_all_user( passwd : Text) : async [ShowUser] {
        if (passwd != "123456"){
            return [];
        };
        Array.map<User, ShowUser>(List.toArray(users), func (user:User):ShowUser {
            {
                ic_account_id = user.ic_account_id;
                principal_id = user.principal_id;
                user_name = user.user_name;
                logo = user.logo;
                wallet_blance = user.wallet_blance;
                ledgers = List.toArray(user.ledgers);
                new_user = false;
            }
        })
    };

    public shared func query_user_by_user_name( username : Text) : async ?ShowUser {


        let find = List.filter<User>(users,func(user:User):Bool{
            return user.user_name == username;
        });
        if(List.size(find) == 0){
            return null;
        };
        let user : ?User = List.get<User>(find,0);
        switch(user){
            case (null){
                return null;
            };
            case (?user){
                ?{
                    ic_account_id = user.ic_account_id;
                    principal_id = user.principal_id;
                    user_name = user.user_name;
                    logo = user.logo;
                    wallet_blance = user.wallet_blance;
                    ledgers = List.toArray(user.ledgers);
                    new_user = false;
                };
            }
        }

        // Array.map<User, ShowUser>(List.toArray(users), func (user:User):ShowUser {
            
        // })
    };
    public shared ({ caller }) func withdraw( amount : Nat , address : Text) : async Text {



        if (Principal.isAnonymous(caller)) {
            throw Error.reject("anonymous user is not allowed to transfer funds");
        };
        if(amount < PayCenterTypes.fee * 10){
            //
            return "{\"code\":500,\"message\":\" amount is too small mast than 0.001\"}";
        };
        //
        let user = PayCenterTypes.getUser(users,caller);
        switch(user){
            case (null){
                return "{\"code\":501,\"message\":\" plase login first\"}";
            };
            case (?user){
                //校验余额
                if (not PayCenterTypes.withdraw_check(user,amount)){
                    return  "{\"code\":502,\"message\":\" balance is not enough\"}";
                };

                //判断是否可以提现
                if (
                    List.some<RegisterActivityUser>(
                        register_activity_list,
                        func(x : RegisterActivityUser) : Bool {
                            return x.principal_id == Principal.toText(caller);
                        },
                    )
                ){
                    // pay 金额超过1 ICP  且余额超过 1 ICP
                    if(
                       not List.some<Ledger>(
                        user.ledgers,
                        func(x : Ledger) : Bool {
                            return x.event == #WITHDRAW;
                        },
                    )
                    ){
                        var play_amount:Int = 0;
                        var deposit_amount:Int = 0;
                        for(ledger in List.toArray(user.ledgers).vals()){
                            switch(ledger.event){
                                case (#PLAY){
                                    play_amount := play_amount + ledger.amount;
                                };
                                case (#DEPOSIT){
                                    deposit_amount := deposit_amount + ledger.amount;
                                };
                                case(_){};
                            };
                        };
                        // if(Int.abs(play_amount) < RegisterActivity.give_amount){
                        //     return "{\"code\":503,\"message\":\"please play more than " # Int.toText(RegisterActivity.give_amount)#"\"}";
                        // };
                        // if(deposit_amount < RegisterActivity.give_amount){
                        //     return "{\"code\":504,\"message\":\"please deposit more than " # Int.toText(RegisterActivity.give_amount)#"\"}";
                        // };
                    };
                };

                let transfer_result = await icp_ledger_canister_instance.transfer({
                    memo = 0;
                    amount = {e8s=Nat64.fromNat(amount)-10_000};
                    fee = { e8s = 10_000 };
                    from_subaccount = null;
                    to= Blob.fromArray(Hex.decode2(address));
                    created_at_time = null;
                });

                //todo 取款有最小值吗？
                switch (transfer_result){
                    case (#Ok(index)){
                        PayCenterTypes.update_user_amount(user,-amount,-PayCenterTypes.fee, Nat64.toNat(index), #WITHDRAW);
                        return return  "{\"code\":200,\"message\":\" success\"}";
                    };
                    case (#Err(msg)){
                        return return  "{\"code\":505,\"message\":\"" # debug_show(msg) # "\"}";
                    }
                };
            }
        };
        return "{\"code\":200,\"message\":\" success\"}";
    };
    public shared func show_icp_amount() : async Nat {
        return await icp_ledger_canister_instance.icrc1_balance_of(
            {
                owner = Principal.fromActor(this);
                subaccount = null;
            }
        );
    };
    // public shared ({ caller }) func play(player : Principal, ticket_price : Nat64) : async TransferResult {
    //     let amount = Nat64.toNat(ticket_price); 

    //     if (Principal.isAnonymous(player)) {
    //         throw Error.reject("anonymous user is not allowed to access");
    //     };
    //     let user = PayCenterTypes.getUser(users,player);
    //     switch(user){
    //         case (null){
    //             return #Err(#GenericError({error_code=500;message = "user not found"}));
    //         };
    //         case (?user){
    //              //todo  caller in write_list 
    //             let result = await icp_ledger_canister_instance.icrc1_transfer(
    //                 {
    //                     to = {owner = caller;subaccount = null};
    //                     fee = null;
    //                     memo = null;
    //                     from_subaccount = null;
    //                     created_at_time = null;
    //                     amount = amount-PayCenterTypes.fee;
    //                 }
    //             );
    //             switch (result){
    //                 case (#Ok(index)){
    //                     PayCenterTypes.update_user_amount(user,-amount,0, index, #PLAY);
    //                     return #Ok(index)
    //                 };
    //                 case(#Err(msg)){
    //                     return #Err(msg);
    //                 }
    //             }
    //         }
    //     };
    // };
    public shared ({ caller }) func play(player : Principal, ticket_price : Nat64,index:Int,pname:Text) : async TransferResult {
        let amount = Nat64.toNat(ticket_price); 

        if(Principal.toText(caller) != "3mx6v-vqaaa-aaaak-ao3kq-cai"){
            return #Err(#GenericError({error_code=500;message = "permission denied"}));
        };
        let user = PayCenterTypes.getUser(users,player);
        let shop_user = get_or_add_user(caller,pname);
        switch(user){
            case (null){
                return #Err(#GenericError({error_code=500;message = "user not found"}));
            };
            case (?user){
                //校验用户余额
                if(user.wallet_blance < amount){
                    return #Err(#GenericError({error_code=500;message = "user not enough amount"}));
                };
                PayCenterTypes.update_user_amount(user,-amount,0, index, #PLAY);
                PayCenterTypes.update_user_amount(shop_user,amount,0, index, #SHOP_SELL_TICKET);
                return #Ok(Int.abs(index))
            }
        };
    };

    public shared ({ caller }) func claim_airdrop( player : Principal ,device_id:Text) : async Bool {
        if (Principal.isAnonymous(player)) {
            return false;
        };
        let access = RegisterActivity.can_join(register_activity_list,device_id,caller,register_activite_count);
        if(not access){
            return false;
        };
        let find = PayCenterTypes.getUser(users,player);
        switch(find){
            case (null){
                return false;
            };
            case(?user){
                let pid= Principal.toText(player);
                register_activity_list := List.push<RegisterActivityUser>({
                    principal_id = pid;
                    device_id = device_id;
                    time = TimeUtil.getCurrentSecond();
                },register_activity_list);
                PayCenterTypes.update_user_amount(user,RegisterActivity.give_amount,0, -1, #BONUS);
                PayCenterTypes.update_user_amount(get_pay_center_user(),-RegisterActivity.give_amount,0, -1, #BONUS);
            }
        };
        return true;
    };

    public shared ({ caller }) func give_airdrop(device_id:Text) : async Bool {
        return RegisterActivity.can_join(register_activity_list,device_id,caller,register_activite_count);
    };

    public shared func get_address() : async Text {
//        if (passwd != "lucky_win"){
//            return "password error";
//        };
        return TextUtils.toAddress(Principal.fromActor(this));
    };

    public shared ({ caller }) func win( player : Principal,win_amount : Nat64,times:Nat,tid:Int) : async TransferResult {
        let amount = Nat64.toNat(win_amount);
        if (Principal.toText(caller) != "3mx6v-vqaaa-aaaak-ao3kq-cai") {
            return #Err(#GenericError({error_code=500;message = "permission denied"}));
        };
        let shop_user = PayCenterTypes.getUser(users,caller);

        let user = PayCenterTypes.getUser(users,player);
        switch(user,shop_user){
            case (null,_){
                return #Err(#GenericError({error_code=500;message = "user not found"}));
            };
            case (_,null){
                return #Err(#GenericError({error_code=501;message = "caller not found"}));
            };
            case (?user,?shop_user){
                PayCenterTypes.update_user_amount(user,amount,0, tid, #WIN({times=times}));
                PayCenterTypes.update_user_amount(shop_user,-amount,0, tid, #WIN({times=times}));
                return #Ok(Int.abs(tid))
            }
        };
    };


    // public shared ({ caller }) func win( player : Principal ,index:Nat,win_amount : Nat64,times:Nat) : async TransferResult {
    //     let amount = Nat64.toNat(win_amount);
    //     // 鉴权  有白名单
    //     if (Principal.isAnonymous(caller)) {
    //         throw Error.reject("anonymous user is not allowed to access");
    //     };
        
    //     let transaction_id = Nat64.fromNat(index);

    //     let result = await icp_index_canister_instance.get_account_identifier_transactions({
    //         max_results  = 1;
    //         start = ?(transaction_id+1);
    //         account_identifier = TextUtils.toAddress(Principal.fromActor(this));
    //     });

    //     switch(result){
    //         case (#Ok(result)){
    //             let transactions = result.transactions;
    //             if(Array.size(transactions) == 0 ){
    //                 return #Err(#GenericError({error_code=501;message = "transaction not found" # debug_show(result)}));
    //             };
    //             let transaction = transactions[0];
    //             if(transaction_id != transaction.id){
    //                 return #Err(#GenericError({error_code=502;message = "transaction id is wrong" # debug_show(result)}));
    //             };
    //             let op : IcpIndex.Operation= transaction.transaction.operation;
    //             switch(op){
    //                 case(#Transfer{from;amount}){
    //                     if(from != TextUtils.toAddress(caller)){
    //                         return #Err(#GenericError({error_code=503;message = "caller id is wrong" # debug_show(result)}));
    //                     };
    //                     if ((amount.e8s) != win_amount){
    //                         return #Err(#GenericError({error_code=504;message = "ctransaction amount is wrong" # debug_show(result)}));
    //                     }
    //                 };
    //                 case(_){
    //                     return #Err(#GenericError({error_code=505;message = "transaction id is wrong" # debug_show(result)}));
    //                 }
    //             };
    //         };
    //         case (#Err(e)){
    //             return #Err(#GenericError({error_code=506;message = debug_show(result)}));
    //         }
    //     };
    //     let user = PayCenterTypes.getUser(users,player);
    //     switch(user){
    //         case (null){
    //             return #Err(#GenericError({error_code=507;message = "user not found"}));
    //         };
    //         case (?user){
    //             if (
    //                 List.some<Ledger>(
    //                     user.ledgers,
    //                     func(x : Ledger) : Bool {
    //                         return x.transaction_id == Nat64.toNat(transaction_id);
    //                     },
    //                 )
    //             ){
    //                 return #Err(#GenericError({error_code=508;message = "repeat  transaction_id" # Nat64.toText(transaction_id)}));
    //             };
    //             PayCenterTypes.update_user_amount(user,amount,0, index, #WIN({times=times}));
    //             //let canister_balance = await icp_ledger_canister_instance.icrc1_balance_of({owner = Principal.fromActor(this);subaccount = null});
    //             //assert canister_balance == PayCenterTypes.get_all_amount(users);
    //             return #Ok(200);
    //         }
    //     }
    //     //todo  caller in write_list 
        
        
    // };

    public shared ({ caller }) func update_user( logo : Text , user_name:Text ) : async Text {
        if (Principal.isAnonymous(caller)) {
            throw Error.reject("anonymous user is not allowed to access");
        };
        //根据 查询是否有同名用户
        let find = List.filter<User>(
            users,
            func(x : User) : Bool {
                return x.user_name == user_name and x.principal_id != Principal.toText(caller);
            },
        );
        if(Option.isSome(find)){
            return "{\"code\":501,\"message\":\"user name is exist\"}";
        };
        let user = PayCenterTypes.getUser(users,caller);
        switch(user){
            case (null){
                return "{\"code\":500,\"message\":\"user not found\"}";
            };
            case (?user){
                user.logo := logo;
                user.user_name := user_name;
                return "{\"code\":200,\"message\":\"success\"}";
            }
        };

    };



    private func get_pay_center_user():User{
        let find =  PayCenterTypes.getUser(users,Principal.fromActor(this));
        switch(find){
            case (null){
                let new_user =  {
                    ic_account_id = TextUtils.toAddress(Principal.fromActor(this));
                    principal_id = Principal.toText(Principal.fromActor(this));
                    var user_name = "pay_center";
                    var logo ="xxx";
                    var wallet_blance:Int = 0 ;
                    var ledgers = List.nil<Ledger>();
                };
                users := List.push<User>(new_user,users);
                return new_user;
            };
            case (?find){
                return find;
            }
        };
    };
    private func get_or_add_user(user:Principal,user_name:Text):User{
        let find =  PayCenterTypes.getUser(users,user);
        switch(find){
            case (null){
                let new_user =  {
                    ic_account_id = TextUtils.toAddress(user);
                    principal_id = Principal.toText(user);
                    var user_name =user_name;
                    var logo ="xxx";
                    var wallet_blance:Int = 0 ;
                    var ledgers = List.nil<Ledger>();
                };
                users := List.push<User>(new_user,users);
                return new_user;
            };
            case (?find){
                return find;
            }
        };
    }




};
