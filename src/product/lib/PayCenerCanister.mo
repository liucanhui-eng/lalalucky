// This is a generated Motoko binding.
// Please use `import service "ic:canister_id"` instead to call canisters on the IC if possible.

module {
  public type CurrencyType = { #ICP };
  public type CurrencyUnit = { #E8S };
  public type Ledger = {
    fee : Int;
    transaction_id : Int;
    time : Int;
    currency_type : CurrencyType;
    currency_unit : CurrencyUnit;
    event : LedgerEvent;
    amount : Int;
  };
  public type LedgerEvent = {
    #FEE;
    #WIN : { times : Nat };
    #SHOP_SELL_TICKET;
    #TRANSFER;
    #BONUS;
    #PLAY;
    #MANUAL;
    #WITHDRAW;
    #DEPOSIT;
    #ORIGIN;
  };
  public type ShowUser = {
    wallet_blance : Int;
    user_name : Text;
    logo : Text;
    new_user : Bool;
    principal_id : Text;
    ledgers : [Ledger];
    ic_account_id : Text;
  };
  public type TransferError = {
    #GenericError : { message : Text; error_code : Nat };
    #TemporarilyUnavailable;
    #BadBurn : { min_burn_amount : Nat };
    #Duplicate : { duplicate_of : Nat };
    #BadFee : { expected_fee : Nat };
    #CreatedInFuture : { ledger_time : Nat64 };
    #TooOld;
    #InsufficientFunds : { balance : Nat };
  };
  public type TransferResult = { #Ok : Nat; #Err : TransferError };
  public type Self = actor {
    addLedger : shared (Text, Nat, Nat) -> async Text;
    claim_airdrop : shared (Principal, Text) -> async Bool;
    deposit : shared (Nat64, Nat64) -> async Text;
    deposit_test : shared (Nat, Nat, Text) -> async Text;
    get_address : shared () -> async Text;
    get_register_activite_count : shared () -> async Nat;
    give_airdrop : shared Text -> async Bool;
    pay_center_total_amount : shared () -> async {
        canister_total_amount : Nat;
        total_fee : Int;
        user_total_amount : Int;
      };
    play : shared (Principal, Nat64, Int, Text) -> async TransferResult;
    query_user_by_user_name : shared Text -> async ?ShowUser;
    set_register_activite_count : shared (Nat, Text) -> async Text;
    show_all_user : shared Text -> async [ShowUser];
    show_icp_amount : shared () -> async Nat;
    show_user : shared () -> async ShowUser;
    update_user : shared (Text, Text) -> async Text;
    user_error_ledger : shared () -> async [ShowUser];
    whoami : shared () -> async Text;
    win : shared (Principal, Nat64, Nat, Int) -> async TransferResult;
    withdraw : shared (Nat, Text) -> async Text;
  }
}