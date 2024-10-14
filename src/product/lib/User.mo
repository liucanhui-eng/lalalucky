import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Bool "mo:base/Bool";
import List "mo:base/List";
import Int "mo:base/Int";
import Blob "mo:base/Blob";
import Time "mo:base/Time";
import Nat64 "mo:base/Nat64";
import Int64 "mo:base/Int64";
import TimeUtil "../../commons/libs/TimeUtil";
module{


    public  type User={
        user_id:Text;
        user_name:Text;
        var tickets:List.List<TicketEntity>;
        var ledgers:List.List<Ledger>;
        var wallet_balance:Nat64;
        var wallet_address:Blob;
        var wallet_address_new:Text;
    };
    public  type Ledger={
        id:Int;
        time:Int;
        amount:Int64;
        event:LedgerEvent;
        win_times : ?Nat;
    };
    public type LedgerEvent={#DEPOSIT;#WITHDRAW;#PLAY;#WIN;#FEE};



    public  type UserShow={
        user_id:Text;
        user_name:Text;
        tickets:[TicketEntity];
        ledgers:[Ledger];
        wallet_balance:Nat64;
        wallet_address:Text;
    };

    //考虑做成实体票票
    public type TicketEntity={
        no:Nat;
        time:Int;
        win:Bool;
        level:Nat;
    };
    public func addLedger(user : User,amount:Int64,event:LedgerEvent,index:?Nat64,win_times:?Nat){
        let new_Ledger = {
            id=TimeUtil.getCurrentMillisecond();
            time=TimeUtil.getCurrentSecond();
            amount=amount;
            event=event;
            index = index;
            win_times = win_times;
        };
        user.ledgers:=List.push<Ledger>(new_Ledger,user.ledgers);
    };

    public func addTicket(user : User,ticket_no:Nat,win:Bool,level:Nat):List.List<TicketEntity>{
        return List.push<TicketEntity>({
            no = ticket_no;
            time = TimeUtil.getCurrentSecond();
            win = win;
            level = level;
        },user.tickets);
    };



    public func newUser(user_id:Text,user_name:Text,amount:Nat64,wallet_address:Text,user_table:List.List<User>):List.List<User>{
        return List.push<User>({
            user_id = user_id;
            user_name = user_name;
            var tickets = List.nil<TicketEntity>();
            var ledgers = List.nil<Ledger>();
            var wallet_address = Text.encodeUtf8(wallet_address);
            var wallet_address_new = wallet_address;
            var wallet_balance = amount
        },user_table);
    };

    public func findUser(user_id:Text,user_name:Text,user_table:List.List<User>):?User{
        return List.get<User>(List.filter<User>(user_table,func(user:User):Bool{user.user_id == user_id and user.user_name == user_name}),0);
    };
    public func findUserById(user_id:Text,user_table:List.List<User>):?User{
        return List.get<User>(List.filter<User>(user_table,func(user:User):Bool{user.user_id == user_id}),0);
    };
    public func findUserShow(user_id:Text,user_name:Text,user_table:List.List<User>):?UserShow{
        let user= findUser(user_id,user_name,user_table);
        switch(user){
            case(null){
                return null;
            };
            case(?user){
                return ?{
                    user_id = user.user_id;
                    user_name = user.user_name;
                    tickets = List.toArray(user.tickets);
                    wallet_balance = user.wallet_balance;
                    wallet_address = user.wallet_address_new;
                    ledgers = List.toArray(user.ledgers);
                };
            };
        }
    };
    // 充值接口 新账户创建 旧账户 更新余额
    public func deposit(user_id:Text,user_name:Text,amount:Nat64,wallet_address:Text,user_table:List.List<User>):List.List<User>{
        let user = findUserById(user_id,user_table);
        switch(user){
            case(null){
                return newUser(user_id,user_name,amount,wallet_address,user_table);
            };
            case(?user){
                user.wallet_balance:=user.wallet_balance+amount;
                if(user.user_name != user_name){
                    var new_user_table =List.filter<User>(user_table,func(user:User):Bool{user.user_id != user_id});
                    new_user_table := List.push({
                        user_id = user.user_id;
                        user_name = user_name;
                        var tickets = user.tickets;
                        var ledgers = user.ledgers;
                        var wallet_balance = user.wallet_balance;
                        var wallet_address = user.wallet_address;
                        var wallet_address_new = user.wallet_address_new;
                    },new_user_table);
                    return new_user_table;
                }
            };
        };
        return user_table;
    };






}