import Nat "mo:base/Nat";
import Text "mo:base/Text";
import List "mo:base/List";
import Iter "mo:base/Iter";
import Int "mo:base/Int";
import Bool "mo:base/Bool";
import Array "mo:base/Array";
import TimeUtil "TimeUtil";
import RandomUtil "../../product/lib/RandomUtil";

module {

    public let empty : Text = "EMPTY";
    public type User = {
        userId : Text;
        var ticketList : [var Nat];
        var amount : Nat;
        var record : [Record];
    };
    public type Record={
        var amount : Int;
        var time: Int;
        var changeType : Text;
    };

    public type PlayRecord={
        user_id : Text;//用户principleId
        user_name : Text;//用户名
        user_portrait : Text;//用户头像
        ticket_no : Int;//抽到的奖票号码
        win : Bool;//是否中奖
        level : Nat;//中了几等奖
        win_times: ?Nat;//奖金的倍数
        ticket_price : Nat64;//奖票价格
        play_time : Int;//抽奖时间
    };

    public  type Ledger={
        id:Int; //流水号       
        from_user_id : Text; //支付的用户principleId
        to_user_id : Text; //接收的用户principleId
        amount:Nat64; //支付金额
        event:LedgerEvent; //支付事件类型
        win_times : ?Nat; //支付奖金倍数
        time:Int; //支付时间
        index : ?Nat64; //支付返回的transactionId
    };

    public type LedgerEvent={#PLAY;#WIN;#BOND;#PROFIT};

    public func addPlayRecord(list:List.List<PlayRecord>, user_id : Text, user_name : Text, user_portrait : Text, ticket_no :Int, win : Bool, level : Nat, win_times:?Nat, ticket_price:Nat64):List.List<PlayRecord> {
        let newList = List.push({
            user_id = user_id;
            user_name = user_name;
            user_portrait = user_portrait;
            ticket_no = ticket_no;
            win =win;
            level = level;
            win_times = win_times;
            ticket_price = ticket_price;
            play_time = TimeUtil.getCurrentSecond();           
        },list);
        return newList;
    };

    public func addLedger(list:List.List<Ledger>, id: Int, from_user_id : Text, to_user_id : Text, amount : Nat64, event:LedgerEvent, win_times : ?Nat, index : ?Nat64):List.List<Ledger> {
        let newList = List.push({
            id=id;
            from_user_id=from_user_id;
            to_user_id=to_user_id;
            amount=amount;
            event=event;
            win_times = win_times;
            index = index;
            time=TimeUtil.getCurrentSecond();                  
        },list);
        return newList;
    };

    //消费类型  'DEPOSIT' 充值 'withdraw'提现 'consumption'消费 'bonus'获奖

    public type WinCheckResult = {
        win:Bool;
        level:Nat;
        message:Text;
    };


    public type Ticket = {
        var inventory : Nat;
        var stickets : [var Text];
        var win1 : [Nat];
        var win2 : [Nat];
        var win3 : [Nat];
        var win4 : [Nat];
        var win5 : [Nat];
        var win6 : [Nat];
        var running : Bool;
        //期数
        var batch : Nat64;
        //抽奖号码总数
        var total_count : Nat;
        //货币种类
        currency : Text;
        //产品ID
        var pid : Text;
        //产品名称
        var pname : Text;
        // 抽奖单价
        var price : Nat64;
        // 抽奖等级
        level : Nat;
        // 开始时间
        start_time : Int;
        // 结束时间
        var end_time : ?Int;
        // 总奖金
        var total_bonus : Nat64;
        // 中奖率
        rate : Text;
        //中奖金额
        pay_out : Text;
    };
    public type TicketView = {
        inventory : Nat;
        stickets : [Text];
        win1 : [Nat];
        win2 : [Nat];
        win3 : [Nat];
        win4 : [Nat];
        win5 : [Nat];
        win6 : [Nat];
        running : Bool;
        batch : Nat64;
        total_count:Nat;
        //货币种类
        currency : Text;
        //产品ID
        pid : Text;
        //产品名称
        pname : Text;
        // 抽奖单价
        price : Nat64;
        // 抽奖等级
        level : Nat;
        // 开始时间
        start_time : Int;
        // 结束时间
        end_time : ?Int;
        // 总奖金
        total_bonus : Nat64;
        // 中奖率
        rate : Text;
        //中奖金额
        pay_out : Text;
    };





    // public func add(user_id : Text,ticket:Ticket) : TicketRecord {
    //     ticket.inventory := ticket.inventory -1;
    //     return List.push<Text>(ticket, stickets);
    // };

    //查询是否存在，如果存在返回下标不存在返回null
    public func findIndex(record : [var Text], element : Text) : ?Nat {
        let len = Array.size(Array.freeze(record));
        for (j in Iter.range(0, len -1)) {
            let item = record[j];
            if (Text.equal(item, element)) {
                return ?j;
            };
        };
        return null;
    };

    public func make(ticket : Ticket, userId : Text,record:?{id: Text; seed: Blob}) : async Int {
        if (not ticket.running) {
            return -1;
        };
        var seed = Text.encodeUtf8("xx");

        switch(record){
            case (?record) {
                seed := record.seed;
            };
            case (null) {
                return -2;
            };
        };
        var ticketNo = await RandomUtil.getRandomBySeed(ticket.total_count,seed);
        while (not Text.equal(ticket.stickets[ticketNo], empty)) {
            if ((ticketNo + 1) >= ticket.total_count) {
                ticketNo := 0;
            } else {
                ticketNo := ticketNo+1;
            };
        };
        ticket.stickets[ticketNo] := userId;
        ticket.inventory := ticket.inventory -1;
        return ticketNo;
    };
    public func buildWinCheckResult(win:Bool,level : Nat, message : Text) : WinCheckResult {
        return {
                win=win;
                level=level;
                message=message;
            };
    };
    public func win(ticket : Ticket,ticket_no : Nat, userId : Text) : WinCheckResult {
        if (not ticket.running) {
            return buildWinCheckResult(false,0,"活动未开始");
        };
        let find1 = Array.find(
            ticket.win1,
            func(item : Nat) : Bool {
                return item == ticket_no;
            },
        );
        switch (find1) {
            case (?find1) {
                return buildWinCheckResult(true,1,userId # ",您的号码是" # Nat.toText(ticket_no) # "，恭喜您，您中奖了一等奖");
            };
            case (null) {};
        };
        let find2 = Array.find(
            ticket.win2,
            func(item : Nat) : Bool {
                return item == ticket_no;
            },
        );
        switch (find2) {
            case (?find2) {
                return buildWinCheckResult(true,2,userId # ",您的号码是" # Nat.toText(ticket_no) # "，恭喜您，您中奖了二等奖");
            };
            case (null) {};
        };
        let find3 = Array.find(
                    ticket.win3,
                    func(item : Nat) : Bool {
                        return item == ticket_no;
                    },
                );
        switch (find3) {
            case (?find3) {
                return buildWinCheckResult(true,3,userId # ",您的号码是" # Nat.toText(ticket_no) # "，恭喜您，您中奖了三等奖");
            };
            case (null) {};
        };
        let find4 = Array.find(
                    ticket.win4,
                    func(item : Nat) : Bool {
                        return item == ticket_no;
                    },
                );
        switch (find4) {
            case (?find4) {
                return buildWinCheckResult(true,4,userId # ",您的号码是" # Nat.toText(ticket_no) # "，恭喜您，您中奖了四等奖");
            };
            case (null) {};
        };
        let find5 = Array.find(
                    ticket.win5,
                    func(item : Nat) : Bool {
                        return item == ticket_no;
                    },
                );
        switch (find5) {
            case (?find5) {
                return buildWinCheckResult(true,5,userId # ",您的号码是" # Nat.toText(ticket_no) # "，恭喜您，您中奖了5等奖");
            };
            case (null) {};
        };
        let find6 = Array.find(
                    ticket.win6,
                    func(item : Nat) : Bool {
                        return item == ticket_no;
                    },
                );
        switch (find6) {
            case (?find6) {
                return buildWinCheckResult(true,6,userId # ",您的号码是" # Nat.toText(ticket_no) # "，恭喜您，您中奖了6等奖");
            };
            case (null) {};
        };
        return buildWinCheckResult(false,0,userId # ",您的号码是" # Nat.toText(ticket_no) # "，很遗憾，您未中奖");
    };
};
