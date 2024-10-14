import Text "mo:base/Text";
import Int "mo:base/Int";
import Nat64 "mo:base/Nat64";
import Nat "mo:base/Nat";
import List "mo:base/List";
import Principal "mo:base/Principal";
import PayCenterTypes "libs/PayCenterTypes";
import IcpLedgerCanister "../commons/libs/IcpLedgerCanister";
actor {

    type User = PayCenterTypes.User;

    stable let users : List.List<User> = List.nil();

    type icp_ledger_canister_ = IcpLedgerCanister.Self;

    let icpLedgerCanisterInstance : icp_ledger_canister_ = actor ("ryjl3-tyaaa-aaaaa-aaaba-cai");

    public query func receiveLog(
        data : [{
            txid : Nat;
            deposit_time : Nat64;
            event : Text;
            amount : Nat64;
            user_id : Text;
            user_name : Text;
            currency_type : Text;
            platform : Text;
            currency_unit : Text;
        }]
    ) : async Text {
        //ToDo 检查流水号是否断层
        for (item in data.vals()) {
            PayCenterTypes.addLedgers(users,
            {
                txid = item.txid;
                time = item.deposit_time;
                event = #DEPOSIT;
                amount = item.amount;
                currency_type = #ICP;
                platform = #BINANCE;
                currency_unit = #E8S;
            },item.user_id,item.user_name);
        };
        return "{\"code\":200}";
    };



    public shared ({caller}) func pay(user_id:Text,user_name:Text,amount : Nat):async Nat{
        let user = PayCenterTypes.getUser(users,user_id);
        switch (user){
            case (null){
                return 0;
            };
            case _ {
                
            }
        };
        return 0;
        
        
        // let result = await icpLedgerCanisterInstance.icrc1_transfer({
        //     to =  { owner = caller; subaccount = null };
        //     fee = null;
        //     memo = null;
        //     from_subaccount = null;
        //     created_at_time = null;
        //     amount = amount;
        //  });

    }





};
