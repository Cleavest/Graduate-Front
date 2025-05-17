# Σύνθετες Λειτουργίες και Gas Optimization

## Εισαγωγή

Σε αυτό το επίπεδο, θα εξετάσουμε αναλυτικά τις πιο σύνθετες λειτουργίες και τεχνικές βελτιστοποίησης gas. Η κατανόηση των διαφορών στην διαχείριση του gas μεταξύ Sui Move και Solidity είναι κρίσιμη για την ανάπτυξη αποδοτικών έξυπνων συμβολαίων. Θα δούμε πώς οι δύο γλώσσες αντιμετωπίζουν σύνθετες λειτουργίες και πώς μπορούμε να βελτιστοποιήσουμε την κατανάλωση gas.

## Σύνθετες Λειτουργίες

### Solidity

```solidity
contract ComplexOperations {
    // Σύνθετη δομή δεδομένων
    struct User {
        uint256 balance;
        uint256[] transactions;
        mapping(address => bool) permissions;
        uint256 lastUpdate;
        bool isActive;
    }

    // Global state
    mapping(address => User) public users;
    uint256 public totalUsers;

    // Events για παρακολούθηση
    event UserUpdated(address indexed user, uint256 newBalance);
    event PermissionGranted(address indexed user, address indexed granter);

    // Σύνθετη λειτουργία με πολλαπλά βήματα
    function complexOperation(
        address user,
        uint256[] calldata amounts
    ) public {
        User storage userData = users[user];

        // 1. Έλεγχος εγκυρότητας
        require(userData.isActive, "User not active");

        // 2. Επεξεργασία πολλαπλών transactions
        uint256 totalAmount = 0;
        for(uint256 i = 0; i < amounts.length; i++) {
            userData.balance += amounts[i];
            userData.transactions.push(amounts[i]);
            totalAmount += amounts[i];
        }

        // 3. Ενημέρωση permissions
        userData.permissions[msg.sender] = true;
        userData.lastUpdate = block.timestamp;

        // 4. Event emission
        emit UserUpdated(user, userData.balance);
        emit PermissionGranted(user, msg.sender);
    }

    // Βελτιστοποιημένη λειτουργία με batch operations
    function optimizedOperation(
        address[] calldata _users,
        uint256[] calldata _amounts
    ) public {
        require(_users.length == _amounts.length, "Length mismatch");

        // Batch processing για καλύτερη απόδοση
        for(uint256 i = 0; i < _users.length; i++) {
            users[_users[i]].balance += _amounts[i];
            users[_users[i]].lastUpdate = block.timestamp;
        }
    }

    // Gas-efficient storage patterns
    function createUser() public {
        User storage newUser = users[msg.sender];
        newUser.isActive = true;
        newUser.lastUpdate = block.timestamp;
        totalUsers++;
    }
}
```

### Sui Move

```move
module gas_example::complex {
    use sui::object::{Self, UID};
    use sui::tx_context::TxContext;
    use std::vector;
    use std::table::{Self, Table};
    use sui::event;
    use sui::clock::Clock;
    use sui::transfer;

    // Σύνθετη δομή δεδομένων
    struct User has key {
        id: UID,
        balance: u64,
        transactions: vector<u64>,
        permissions: Table<address, bool>,
        last_update: u64,
        is_active: bool
    }

    // Events για παρακολούθηση
    struct UserUpdated has copy, drop {
        user: address,
        new_balance: u64
    }

    struct PermissionGranted has copy, drop {
        user: address,
        granter: address
    }

    // Δημιουργία νέου χρήστη
    public fun create_user(ctx: &mut TxContext) {
        let user = User {
            id: object::new(ctx),
            balance: 0,
            transactions: vector::empty(),
            permissions: table::new(),
            last_update: 0,
            is_active: true
        };
        transfer::share_object(user);
    }

    // Σύνθετη λειτουργία με πολλαπλά βήματα
    public fun complex_operation(
        user: &mut User,
        amounts: vector<u64>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        // 1. Έλεγχος εγκυρότητας
        assert!(user.is_active, 0);

        // 2. Επεξεργασία transactions
        let i = 0;
        let len = vector::length(&amounts);
        let total_amount = 0;

        while (i < len) {
            let amount = *vector::borrow(&amounts, i);
            user.balance = user.balance + amount;
            vector::push_back(&mut user.transactions, amount);
            total_amount = total_amount + amount;
            i = i + 1;
        };

        // 3. Ενημέρωση permissions
        table::add(&mut user.permissions, tx_context::sender(ctx), true);
        user.last_update = clock::timestamp_ms(clock);

        // 4. Event emission
        event::emit(UserUpdated {
            user: tx_context::sender(ctx),
            new_balance: user.balance
        });
        event::emit(PermissionGranted {
            user: tx_context::sender(ctx),
            granter: tx_context::sender(ctx)
        });
    }

    // Βελτιστοποιημένη λειτουργία με batch processing
    public fun batch_update_users(
        users: vector<&mut User>,
        amounts: vector<u64>,
        clock: &Clock
    ) {
        let i = 0;
        let len = vector::length(&users);

        while (i < len) {
            let user = vector::borrow_mut(users, i);
            let amount = *vector::borrow(&amounts, i);
            user.balance = user.balance + amount;
            user.last_update = clock::timestamp_ms(clock);
            i = i + 1;
        };
    }
}
```

## Σημαντικές Διαφορές

1. **Διαχείριση Μνήμης**

    - Solidity:
        - Στατική μνήμη με mappings
        - Πιο προβλέψιμο gas cost
        - Global state management
        - Storage slots optimization
    - Sui Move:
        - Δυναμική μνήμη με objects
        - Πιο ευέλικτο αλλά πιο σύνθετο
        - Object-based memory management
        - Καλύτερη διαχείριση πόρων

2. **Βελτιστοποίηση**

    - Solidity:
        - Batch operations
        - Storage optimization
        - Gas-efficient data structures
        - Memory vs Storage management
    - Sui Move:
        - Object-based optimization
        - Parallel execution
        - Dynamic resource management
        - Event-based tracking

3. **Best Practices**
    - Solidity:
        - Χρήση calldata για μεγάλα datasets
        - Batch processing
        - Efficient data structures
        - Storage optimization
    - Sui Move:
        - Object composition
        - Resource sharing
        - Parallel execution patterns
        - Event-based monitoring

## Πρακτική Ανάλυση

### 1. Διαχείριση Σύνθετων Δεδομένων

#### Solidity

```solidity
// Gas cost: O(n) για n transactions
function processTransactions(
    address user,
    uint256[] calldata amounts
) public {
    User storage userData = users[user];
    for(uint256 i = 0; i < amounts.length; i++) {
        userData.balance += amounts[i];
        userData.transactions.push(amounts[i]);
    }
}
```

#### Sui Move

```move
// Καλύτερη διαχείριση μνήμης
public fun process_transactions(
    user: &mut User,
    amounts: vector<u64>
) {
    let i = 0;
    let len = vector::length(&amounts);
    while (i < len) {
        let amount = *vector::borrow(&amounts, i);
        user.balance = user.balance + amount;
        vector::push_back(&mut user.transactions, amount);
        i = i + 1;
    };
}
```

### 2. Batch Processing

#### Solidity

```solidity
// Πιο αποδοτικό για πολλαπλούς χρήστες
function batchProcess(
    address[] calldata _users,
    uint256[] calldata _amounts
) public {
    for(uint256 i = 0; i < _users.length; i++) {
        users[_users[i]].balance += _amounts[i];
    }
}
```

#### Sui Move

```move
// Καλύτερη διαχείριση πόρων
public fun batch_process(
    users: vector<&mut User>,
    amounts: vector<u64>
) {
    let i = 0;
    let len = vector::length(&users);
    while (i < len) {
        let user = vector::borrow_mut(users, i);
        let amount = *vector::borrow(&amounts, i);
        user.balance = user.balance + amount;
        i = i + 1;
    };
}
```

## Συμπεράσματα και Προτάσεις

1. **Επιλογή Γλώσσας**

    - Solidity:
        - Καλύτερη για απλές εφαρμογές
        - Πιο προβλέψιμο gas cost
        - Ευκολότερη ανάπτυξη
    - Sui Move:
        - Καλύτερη για σύνθετες εφαρμογές
        - Πιο ευέλικτη διαχείριση μνήμης
        - Καλύτερη κλιμάκωση

2. **Βελτιστοποίηση**

    - Χρήση batch operations
    - Προσεκτική διαχείριση μνήμης
    - Event-based monitoring
    - Resource management

3. **Προτεινόμενες Πρακτικές**
    - Κατάλληλη επιλογή δομών δεδομένων
    - Βελτιστοποίηση loops
    - Χρήση events για παρακολούθηση
    - Προσεκτική διαχείριση πόρων
