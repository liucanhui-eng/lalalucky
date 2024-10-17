import Text "mo:base/Text";
import Nat "mo:base/Nat";
import HashMap "mo:base/HashMap";
import List "mo:base/List";
actor {
    public type RecordIndex = {
        p_name : Text;
        issue : Nat;
        index : Nat;
    };
    public type Pid = Text;

    public type RecordIndexMap = HashMap.HashMap<Pid, List.List<RecordIndex>>;

};
