// This is a generated Motoko binding.
// Please use `import service "ic:canister_id"` instead to call canisters on the IC if possible.

module {
  public type Ledger = {
    id : Int;
    to_user_id : Text;
    time : Int;
    win_times : ?Nat;
    from_user_id : Text;
    event : LedgerEvent;
    index : ?Nat64;
    amount : Nat64;
  };
  public type LedgerEvent = { #WIN; #BOND; #PLAY; #PROFIT };
  public type PlayRecord = {
    win : Bool;
    user_name : Text;
    ticket_price : Nat64;
    ticket_no : Int;
    win_times : ?Nat;
    user_id : Text;
    level : Nat;
    play_time : Int;
    user_portrait : Text;
  };
  public type TicketView = {
    pid : Text;
    total_bonus : Nat64;
    running : Bool;
    inventory : Nat;
    rate : Text;
    win1 : [Nat];
    win2 : [Nat];
    win3 : [Nat];
    win4 : [Nat];
    win5 : [Nat];
    win6 : [Nat];
    end_time : ?Int;
    level : Nat;
    start_time : Int;
    currency : Text;
    batch : Nat64;
    pname : Text;
    price : Nat64;
    stickets : [Text];
    total_count : Nat;
    pay_out : Text;
  };
  public type showPlayWinRecordResult = { total : Nat; list : [PlayRecord] };
  public type Self = actor {
    add_ledger_list_map : shared (Text, Text, [Ledger]) -> async Bool;
    add_p_info : shared (Text, Text, TicketView) -> async Bool;
    add_play_win_record : shared (Text, Text, [PlayRecord]) -> async Bool;
    add_win_map : shared (Text, Text, [(Nat, Nat64)]) -> async Bool;
    add_win_times_map : shared (Text, Text, [(Nat, Nat)]) -> async Bool;
    show_batch_time_list : shared Text -> async [
        { start_time : Int; batch : Nat64 }
      ];
    show_batch_time_list_test : shared Text -> async [Text];
    show_ledger_list_map : shared (Text, Text) -> async ?[Ledger];
    show_p_info : shared (Text, Text) -> async ?TicketView;
    show_play_win_record : shared (
        Text,
        Text,
        Nat,
        Nat,
      ) -> async showPlayWinRecordResult;
    show_win_map : shared (Text, Text) -> async ?[(Nat, Nat64)];
    show_win_times_map : shared (Text, Text) -> async ?[(Nat, Nat)];
  }
}