import Text "mo:base/Text";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Array "mo:base/Array";
import Bool "mo:base/Bool";
import Nat "mo:base/Nat";
import Nat64 "mo:base/Nat64";
import List "mo:base/List";
import Int "mo:base/Int";
import TicketFactory "../commons/libs/TicketFactory";

actor {

    type TicketView = TicketFactory.TicketView;
    type PlayRecord = TicketFactory.PlayRecord;
    type Ledger = TicketFactory.Ledger;

    // product ticket info
    private var p_record_map : HashMap.HashMap<Text, TicketView> = HashMap.HashMap<Text, TicketView>(0, Text.equal, Text.hash);
    private stable var p_record_map_entries : [(Text, TicketView)] = [];

    //// play record info
    private var play_win_record_map : HashMap.HashMap<Text, [PlayRecord]> = HashMap.HashMap<Text, [PlayRecord]>(0, Text.equal, Text.hash);
    private stable var play_win_record_entries : [(Text, [PlayRecord])] = [];
    // win map
    private var win_map : HashMap.HashMap<Text, [(Nat, Nat64)]> = HashMap.HashMap<Text, [(Nat, Nat64)]>(6, Text.equal, Text.hash);
    private stable var win_entries : [(Text, [(Nat, Nat64)])] = [];

    //win_times_map
    private var win_times_map : HashMap.HashMap<Text, [(Nat, Nat)]> = HashMap.HashMap<Text, [(Nat, Nat)]>(6, Text.equal, Text.hash);
    private stable var win_times_entries : [(Text, [(Nat, Nat)])] = [];

    // play record info
    private var ledger_list_map : HashMap.HashMap<Text, [Ledger]> = HashMap.HashMap<Text, [Ledger]>(0, Text.equal, Text.hash);
    private stable var ledger_list_entries : [(Text, [Ledger])] = [];

    public func add_p_info(pid : Text, batch : Text, ticket : TicketView) : async Bool {
        p_record_map.put(get_key(pid, batch), ticket);
        return true;
    };
    public func show_batch_time_list_test(pid : Text) : async [Text] {
        Iter.toArray(p_record_map.keys());
    };

    public func show_batch_time_list(pid : Text) : async [{
        batch : Nat64;
        start_time : Int;
    }] {
        var result_list = List.nil<{ batch : Nat64; start_time : Int }>();
        // p_record_map.ke;
        for (key in p_record_map.keys()) {
            if (Text.startsWith(key, #text pid)) {
                let v = p_record_map.get(key);
                switch (v) {
                    case (null) {};
                    case (?v) {
                        result_list := List.push<{ batch : Nat64; start_time : Int }>(
                            {
                                batch = v.batch;
                                start_time = v.start_time;
                            },
                            result_list,
                        );
                    };
                };
            };
        };
        List.toArray(result_list);
    };

    public func show_p_info(pid : Text, batch : Text) : async ?TicketView {
        p_record_map.get(get_key(pid, batch));
    };

    public func add_play_win_record(pid : Text, batch : Text, records : [PlayRecord]) : async Bool {
        play_win_record_map.put(get_key(pid, batch), records);
        return true;
    };

    public type showPlayWinRecordResult = {
        list : [PlayRecord];
        total : Nat;
        start_index : Nat;
        end_index : Nat;
    };
    public func show_play_win_record(pid : Text, batch : Text, page_no : Nat, page_size : Nat) : async showPlayWinRecordResult {
        let record_list = play_win_record_map.get(get_key(pid, batch));
        switch (record_list) {
            case (null) {
                {
                    list = [];
                    total = 0;
                    start_index = 0;
                    end_index = 0;
                };
            };
            case (?record_list) {
                let total = Array.size(record_list);
                assert page_no > 0;
                assert page_size > 0;
                let start_index = (page_no - 1) * page_size;
                var end_index = start_index + page_size;
                if (end_index >= total) {
                    end_index := total -1;
                };
                return {
                    list = Array.subArray<PlayRecord>(record_list, start_index, end_index);
                    total = total;
                    start_index = start_index;
                    end_index = end_index;
                };
            };
        };

    };

    public func add_win_map(pid : Text, batch : Text, records : [(Nat, Nat64)]) : async Bool {
        win_map.put(get_key(pid, batch), records);
        return true;
    };
    public func show_win_map(pid : Text, batch : Text) : async ?[(Nat, Nat64)] {
        win_map.get(get_key(pid, batch));
    };

    public func add_win_times_map(pid : Text, batch : Text, records : [(Nat, Nat)]) : async Bool {
        win_times_map.put(get_key(pid, batch), records);
        return true;
    };
    public func show_win_times_map(pid : Text, batch : Text) : async ?[(Nat, Nat)] {
        win_times_map.get(get_key(pid, batch));
    };

    public func add_ledger_list_map(pid : Text, batch : Text, records : [Ledger]) : async Bool {
        ledger_list_map.put(get_key(pid, batch), records);
        return true;
    };
    public func show_ledger_list_map(pid : Text, batch : Text) : async ?[Ledger] {
        let ledger_list_map_item = ledger_list_map.get(get_key(pid, batch));
        switch (ledger_list_map_item) {
            case (null) null;
            case (?ledger_list_map_item) ?ledger_list_map_item;
        };
    };

    private func get_key(pid : Text, batch : Text) : Text {
        return pid # "_" # batch;
    };

    system func preupgrade() {
        p_record_map_entries := Iter.toArray(p_record_map.entries());
        play_win_record_entries := Iter.toArray(play_win_record_map.entries());
        win_entries := Iter.toArray(win_map.entries());
        win_times_entries := Iter.toArray(win_times_map.entries());
        ledger_list_entries := Iter.toArray(ledger_list_map.entries());

    };

    system func postupgrade() {
        p_record_map := HashMap.fromIter<Text, TicketView>(Iter.fromArray<(Text, TicketView)>(p_record_map_entries), Array.size(p_record_map_entries), Text.equal, Text.hash);
        play_win_record_map := HashMap.fromIter<Text, [PlayRecord]>(Iter.fromArray<(Text, [PlayRecord])>(play_win_record_entries), Array.size(play_win_record_entries), Text.equal, Text.hash);
        win_map := HashMap.fromIter<Text, [(Nat, Nat64)]>(Iter.fromArray<(Text, [(Nat, Nat64)])>(win_entries), Array.size(win_entries), Text.equal, Text.hash);
        win_times_map := HashMap.fromIter<Text, [(Nat, Nat)]>(Iter.fromArray<(Text, [(Nat, Nat)])>(win_times_entries), Array.size(win_times_entries), Text.equal, Text.hash);
        ledger_list_map := HashMap.fromIter<Text, [Ledger]>(Iter.fromArray<(Text, [Ledger])>(ledger_list_entries), Array.size(ledger_list_entries), Text.equal, Text.hash);
        //win_times_map
        p_record_map_entries := [];
        play_win_record_entries := [];
        win_entries := [];
        win_times_entries := [];
        ledger_list_entries := [];
    };

};
