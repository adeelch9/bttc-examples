# MultiSigWallet Contract

## Description

A multi-signature (multi-sig) wallet is a type of cryptocurrency wallet that requires multiple signatures or approvals to authorize transactions. This smartcontract demonstrates the multisig features by  approving transactions from multiple wallets to get executed

## How To Use

The contract has the following struct,variables and events that will be used in the contract 

```solidity
   address[] public owners;
    uint public numConfirm;

    struct Transaction {
        address to;
        uint value;
        bool executed;
    }

    mapping(uint => mapping(address => bool)) isConfirmed;
    mapping(address => bool) isOwner;

    Transaction[] public transactions;
    
     event TransactionSubmitted(
        uint transactionId,
        address sender,
        address receiver,
        uint amount
    );
    event TransactionConfirmed(uint transactionId);
    event TransactionExecuted(uint transactionId);

    modifier onlyOwner() {
        require(isOwner[msg.sender], "Not an owner");
        _;
    }
```

## Contract functions

constructor function takes 2 params for initializing the contract

```solidity
   // @param _owners is the address array of owners
   // @param _numConfirmationRequired is the number of confirmations required to execute a transaction
    constructor(address[] memory _owners, uint _numConfirmationRequired)
```

send ether to any address by using `submitTransaction` function <br>
    - Any owner can call this function to submit a new transaction to send Ether to a specified recipient. <br>
    - A new Transaction struct is created and added to the transactions array, representing the pending transaction.

```solidity
    function submitTransaction(address _to) public payable
```

confirm the transaction by using `confirmTransaction` function <br>
    - Only owners can call this function to confirm a specific pending transaction. <br>
    - The function verifies that the transaction ID is valid and that the caller has not already confirmed this transaction.
```solidity
   function confirmTransaction(uint _transactionId) public onlyOwner
```

`isTransactionConfirmed` This view function checks whether a specific transaction has received the required number of confirmations.

```solidity
function isTransactionConfirmed(
        uint _transactionId
    ) public view returns (bool)
```

`executeTransaction` Executes the transction <br>
- Only owners can call this function to execute a confirmed transaction. <br>
- The function verifies that the transaction ID is valid and that the transaction has not been executed before.

```solidity
function executeTransaction(uint _transactionId) public payable 
```


