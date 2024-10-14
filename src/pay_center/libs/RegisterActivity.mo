import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Bool "mo:base/Bool";
import List "mo:base/List";
import Principal "mo:base/Principal";
module {

    public let give_amount = 100000000;

    public type RegisterActivityUser = {
        principal_id : Text;
        device_id : Text;
        time : Int;
    };

    public func can_join(list : List.List<RegisterActivityUser>, device_id : Text, user : Principal, count : Nat) : Bool {
        if (List.size(list) >= count) {
            return false;
        };
        if (
            List.some<RegisterActivityUser>(
                list,
                func(x : RegisterActivityUser) : Bool {
                    return x.device_id == device_id or x.principal_id == Principal.toText(user);
                },
            )
        ) {
            return false;
        } else {
            return true;
        };
    };

};
