# Προχωρημένες Έννοιες Gas: Loops και Storage

## Εισαγωγή

Η διαχείριση του gas γίνεται πιο σύνθετη όταν ασχολούμαστε με loops και αποθήκευση δεδομένων. Σε αυτό το κείμενο, θα εξετάσουμε αναλυτικά πώς οι δύο γλώσσες διαχειρίζονται αυτές τις λειτουργίες και πώς επηρεάζουν το gas cost.

## Loops και Gas

### Solidity

```solidity
contract LoopExample {
    uint256[] public numbers;

    // Βασικό loop με υψηλό gas cost
    function addNumbers(uint256 count) public {
        // Κάθε επανάληψη καταναλώνει gas
        for(uint256 i = 0; i < count; i++) {
            numbers.push(i); // Storage operation - υψηλό gas cost
        }
    }

    // Βελτιστοποιημένο loop με batch operations
    function batchAdd(uint256[] memory _numbers) public {
        // Πιο αποδοτικό από το loop
        for(uint256 i = 0; i < _numbers.length; i++) {
            numbers.push(_numbers[i]);
        }
    }

    // Gas-efficient loop με unchecked
    function optimizedLoop(uint256 count) public {
        unchecked {
            for(uint256 i = 0; i < count; i++) {
                numbers.push(i);
            }
        }
    }

    // Loop με σταθερό μέγεθος
    function fixedSizeLoop() public {
        // Πιο προβλέψιμο gas cost
        for(uint256 i = 0; i < 10; i++) {
            numbers.push(i);
        }
    }
}
```

### Sui Move

```move
module gas_example::loops {
    use sui::object::{Self, UID};
    use sui::tx_context::TxContext;
    use std::vector;
    use sui::event;

    struct NumberCollection has key {
        id: UID,
        numbers: vector<u64>
    }

    // Event για παρακολούθηση
    struct NumbersAdded has copy, drop {
        count: u64
    }

    // Δημιουργία collection
    public fun create(ctx: &mut TxContext) {
        let collection = NumberCollection {
            id: object::new(ctx),
            numbers: vector::empty()
        };
        transfer::share_object(collection);
    }

    // Βασικό loop
    public fun add_numbers(
        collection: &mut NumberCollection,
        count: u64
    ) {
        let i = 0;
        while (i < count) {
            vector::push_back(&mut collection.numbers, i);
            i = i + 1;
        };
    }

    // Βελτιστοποιημένο loop με batch
    public fun batch_add_numbers(
        collection: &mut NumberCollection,
        numbers: vector<u64>
    ) {
        let i = 0;
        let len = vector::length(&numbers);
        while (i < len) {
            let num = *vector::borrow(&numbers, i);
            vector::push_back(&mut collection.numbers, num);
            i = i + 1;
        };
    }

    // Loop με event emission
    public fun add_numbers_with_event(
        collection: &mut NumberCollection,
        count: u64,
        ctx: &mut TxContext
    ) {
        let i = 0;
        while (i < count) {
            vector::push_back(&mut collection.numbers, i);
            i = i + 1;
        };
        event::emit(NumbersAdded { count });
    }
}
```

## Διαφορές στην Αποθήκευση

1. **Storage Patterns**

    - Solidity:
        - Global state variables
        - Mappings για key-value storage
        - Arrays για διαδοχικά δεδομένα
        - Structs για οργανωμένα δεδομένα
    - Sui Move:
        - Object-based storage
        - Vectors για διαδοχικά δεδομένα
        - Tables για key-value storage
        - Structs με capabilities

2. **Gas Optimization**

    - Solidity:
        - Χρειάζεται προσεκτική διαχείριση loops
        - Batch operations είναι πιο αποδοτικά
        - Storage slots optimization
        - Memory vs Storage
    - Sui Move:
        - Αυτόματη βελτιστοποίηση για αντικείμενα
        - Καλύτερη διαχείριση μνήμης
        - Object composition
        - Dynamic resource management

3. **Best Practices**
    - Solidity:
        - Χρήση batch operations
        - Προσεκτική διαχείριση storage
        - Βελτιστοποίηση loops
        - Χρήση memory όπου είναι δυνατόν
    - Sui Move:
        - Αξιοποίηση object-based model
        - Κατάλληλη χρήση vectors
        - Event emission για παρακολούθηση
        - Resource management

## Πρακτικά Παραδείγματα

### Παράδειγμα 1: Loop με Storage Operations

#### Solidity

```solidity
// Gas cost: O(n) όπου n είναι το μέγεθος του loop
function storageLoop(uint256 n) public {
    for(uint256 i = 0; i < n; i++) {
        numbers.push(i); // ~20,000 gas per iteration
    }
}
```

#### Sui Move

```move
// Gas cost: O(n) με καλύτερη διαχείριση μνήμης
public fun storage_loop(
    collection: &mut NumberCollection,
    n: u64
) {
    let i = 0;
    while (i < n) {
        vector::push_back(&mut collection.numbers, i);
        i = i + 1;
    };
}
```

### Παράδειγμα 2: Batch Operations

#### Solidity

```solidity
// Πιο αποδοτικό από το loop
function batchOperation(uint256[] memory _numbers) public {
    for(uint256 i = 0; i < _numbers.length; i++) {
        numbers.push(_numbers[i]); // ~15,000 gas per iteration
    }
}
```

#### Sui Move

```move
// Καλύτερη διαχείριση μνήμης
public fun batch_operation(
    collection: &mut NumberCollection,
    numbers: vector<u64>
) {
    let i = 0;
    let len = vector::length(&numbers);
    while (i < len) {
        let num = *vector::borrow(&numbers, i);
        vector::push_back(&mut collection.numbers, num);
        i = i + 1;
    };
}
```

## Συμπεράσματα

1. **Επιλογή Τεχνικής**

    - Solidity:
        - Χρήση batch operations
        - Προσεκτική διαχείριση storage
        - Βελτιστοποίηση loops
    - Sui Move:
        - Αξιοποίηση object model
        - Καλύτερη διαχείριση μνήμης
        - Event-based παρακολούθηση

2. **Gas Optimization**

    - Solidity: Απαιτεί περισσότερη χειροκίνητη βελτιστοποίηση
    - Sui Move: Παρέχει περισσότερη αυτόματη βελτιστοποίηση

3. **Προτεινόμενες Πρακτικές**
    - Χρήση batch operations όπου είναι δυνατόν
    - Προσεκτική διαχείριση storage
    - Βελτιστοποίηση loops
    - Κατάλληλη χρήση events
