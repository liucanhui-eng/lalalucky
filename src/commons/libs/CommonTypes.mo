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
module {

    public type LedgerEvent = { #DEPOSIT; #PLAY; #WIN:{times:Nat}; #WITHDRAW ; #BONUS ; #TRANSFER; #ORIGIN;#FEE; #MANUAL; #SHOP_SELL_TICKET };
    public type CurrencyType = { #ICP };
    public type CurrencyUnit = { #E8S;};

    public type ShowUser = {
        ic_account_id : Text;
        principal_id : Text;
        user_name : Text;
        logo : Text;
        wallet_blance : Int;
        new_user:Bool;
        ledgers : [Ledger];
    };

    //principal id，IC account ID，balance，ledger（流水）- （存）1) amount e8s; 2)
    //time; 3)transaction id；4）event type（存/取play/win/bonus/transfer）；5）origin
    public type Ledger = {
        transaction_id : Int;
        fee : Int;
        time : Int;
        event : LedgerEvent;
        amount : Int;
        currency_type : CurrencyType;
        currency_unit : CurrencyUnit;
    };
    
};
