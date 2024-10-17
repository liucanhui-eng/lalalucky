import Random "mo:base/Random";
import Nat "mo:base/Nat";
import Array "mo:base/Array";
import Debug "mo:base/Debug";
import Blob "mo:base/Blob";
import Nat8 "mo:base/Nat8";

module {

    public type Record = { id: Text; seed: ?Blob };
    
    public func random_bytes(max:Nat, size : Nat) : async [Nat] {  
        let byteArray : [var Nat] = Array.init<Nat>(size, 0);  
        let entropy = await Random.blob();  
        var f = Random.Finite(entropy);  
        var i = 0;
        var count=0;  
        var result:Nat=0;  
        loop {  
        if (i == size) {  
            return Array.freeze<Nat>(byteArray);  
        } else {  
            switch (f.byte()) {  
            case (?byte) {
                count :=count+255;
                result :=result+Nat8.toNat(byte);
                if(count>=max){
                    let newByte = result;
                    if(Array.find<Nat>(Array.freeze(byteArray), func x = x == newByte) == null and newByte <= max ){
                        Debug.print("==========生成随机数个数" # Nat.toText(i));
                        byteArray[i] := newByte;  
                        i := i + 1;  
                    };
                    count :=0;
                    result :=0;  
                };

                
            };  
            case null {  
                let entropy = await Random.blob();  
                f := Random.Finite(entropy);  
            };  
            };  
        };  
    };  
  };

    // public func getRandomList(max : Nat, size : Nat) : async [Nat] {
    //     let entropy = await Random.blob();
    //     var arr = Array.init<Nat>(size, 0);
    //     for (i in Iter.range(0, size -1)) {
    //         var random = await getRandom(max,entropy);
    //         Debug.print("============================已生成随机数 " # Nat.toText(i));
    //         while (Array.find<Nat>(Array.freeze(arr), func x = x == random) != null and random != 0) {
    //             Debug.print("重复生成，重新获取 " # Nat.toText(random));
    //             random := await getRandom(max,entropy);
    //         };
    //         arr[i] := random;
    //     };
    //     return Array.freeze(arr);

    // };
    public func getRandom(max : Nat) : async Nat {
        if (max == 1) {
            return 0;
        };
        let entropy = await Random.blob();
        
        let finite = Random.Finite(entropy);
        let randomValue = finite.range(getRange(max));
        switch (randomValue) {
            case (?randomValue) {
                Debug.print("生成随机数3   " # Nat.toText(randomValue));
                if (randomValue > max) {
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

    public func getRandomBySeed(max : Nat,seed : Blob) : async Nat {
        if (max == 1) {
            return 0;
        };
        let finite = Random.Finite(seed);
        let randomValue = finite.range(getRange(max));
        switch (randomValue) {
            case (?randomValue) {
                Debug.print("生成随机数 by seed   " # Nat.toText(randomValue));
                if (randomValue >= max) {
                    return randomValue - max;
                };
                return randomValue;
            };
            case (null) {
                return 0;
            };
        };
        return 0;
    };

    public func getRange(max : Nat) : Nat8 {
        if (max <= 4) {
            return 2;
        };
        if (max <= 8) {
            return 3;
        };
        if (max <= 16) {
            return 4;
        };
        if (max <= 32) {
            return 5;
        };
        if (max <= 64) {
            return 6;
        };
        if (max <= 128) {
            return 7;
        };
        if (max <= 256) {
            return 8;
        };
        return 10;
    };

};
