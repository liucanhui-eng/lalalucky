import List "mo:base/List";
import Array "mo:base/Array";
import Text "mo:base/Text";
import Bool "mo:base/Bool";
import Nat64 "mo:base/Nat64";
import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import Blob "mo:base/Blob";
import Int "mo:base/Int";
import User "../../product/lib/User";
import TimeUtil "../../commons/libs/TimeUtil";
import CommonTypes "../../commons/libs/CommonTypes";
import RegisterActivity "RegisterActivity";
import TextUtils "../../commons/libs/TextUtils";
module {

    public let fee : Nat = 10000;
    type RegisterActivityUser = RegisterActivity.RegisterActivityUser;
    public type User = {

        ic_account_id : Text;
        principal_id : Text;
        var user_name : Text;
        var logo : Text;
        var wallet_blance : Int;
        var ledgers : List.List<CommonTypes.Ledger>;
    };

    public type Platform = { #BINANCE };

    public func withdraw_check(user : User, amount : Nat) : Bool {
        return user.wallet_blance >= amount +fee;

    };
    public func getUser(users : List.List<User>, principal : Principal) : ?User {
        let find = List.filter(
            users,
            func(user : User) : Bool {
                return user.principal_id == Principal.toText(principal);
            },
        );
        if (List.size(find) == 0) {
            return null;
        };
        return List.get(find, 0);
    };
    public func showUser(user : User, new_user : Bool) : CommonTypes.ShowUser {
        return {
            ic_account_id = user.ic_account_id;
            principal_id = user.principal_id;
            user_name = user.user_name;
            logo = user.logo;
            wallet_blance = user.wallet_blance;
            ledgers = List.toArray(user.ledgers);
            new_user = new_user;
        };
    };
    public func new_user(principal : Principal) : User {
        let principal_id = Principal.toText(principal);
        {
            principal_id = principal_id;
            var user_name = principal_id;
            var wallet_blance = 0;
            ic_account_id = TextUtils.toAddress(principal);
            var logo = "-1";
            var ledgers = List.nil<CommonTypes.Ledger>();
        };
    };

    // public func addDepositLedgers(user :User,transaction_id : Nat,amount : Nat) {
    //     if (
    //         List.some(
    //             user.ledgers,
    //             func(ledgerItem : Ledger) : Bool {
    //                 return ledgerItem.transaction_id == transaction_id;
    //             },
    //         )
    //     ) {
    //         return;
    //     };
    //     user.ledgers := List.push<Ledger>({
    //         transaction_id = transaction_id;
    //         time = TimeUtil.getCurrentMillisecond();
    //         event = #DEPOSIT;
    //         amount = amount;
    //         currency_type = #ICP;
    //         currency_unit = #E8S;
    //     }, user.ledgers);
    //     user.wallet_blance := user.wallet_blance + amount;
    // };

    public func get_all_amount(users : List.List<User>) : Int {
        var user_total_amount : Int = 0;
        List.iterate(users, func(user : User) : () { user_total_amount := user_total_amount + user.wallet_blance });
        user_total_amount;
    };

    public func update_user_amount(user : User, amount : Int, fee : Int, transaction_id : Int, event : CommonTypes.LedgerEvent) {
        user.wallet_blance := user.wallet_blance + amount;
        user.ledgers := List.push<CommonTypes.Ledger>(
            {
                transaction_id = transaction_id;
                time = TimeUtil.getCurrentMillisecond();
                event = event;
                amount = amount;
                fee = fee;
                currency_type = #ICP;
                currency_unit = #E8S;
            },
            user.ledgers,
        );
    };

};
