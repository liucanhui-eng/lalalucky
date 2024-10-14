import Random "mo:base/Random";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import List "mo:base/List";
import Bool "mo:base/Bool";

module {

    public type NatList = List.List<Nat>;

    public func getRandomList(max : Nat, size : Nat) : async NatList {
        var arr : NatList = List.nil();
        for (i in Iter.range(0, size -1)) {
            var random = await getRandom(max);
            while (List.size(List.filter(arr, func(item : Nat) : Bool { item == random })) > 0) {
                random := await getRandom(max);
            };
            arr := List.push(random, arr);
        };
        return arr;

    };
    public func getRandom(max : Nat) : async Nat {
        let entropy = await Random.blob();
        let finite = Random.Finite(entropy);
        let randomValue = finite.range(10);
        switch (randomValue) {
            case (?randomValue) { 
                if(randomValue > max){
                    return await getRandom(max);
                };
                return randomValue;
            };
            case (null) {
                return 0;
            };
        };
        return 0;
    };
};
