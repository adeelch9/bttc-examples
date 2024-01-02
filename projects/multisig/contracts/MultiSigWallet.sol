// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MultiSigWallet {
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

    constructor(address[] memory _owners, uint _numConfirmationRequired) {
        require(_owners.length > 1, "owners required must grater than 1");
        require(
            _numConfirmationRequired > 0 &&
                _numConfirmationRequired <= _owners.length,
            "Num of confirmation is not sync with num of owner"
        );
        numConfirm = _numConfirmationRequired;

        for (uint i = 0; i < _owners.length; i++) {
            require(_owners[i] != address(0), "Invalid Owner");
            owners.push(_owners[i]);
            isOwner[_owners[i]] = true;
        }
    }

    function submitTransaction(address _to) public payable {
        require(_to != address(0), "Invalid address");
        require(msg.value > 0, "Transfer amount must be grater than 0 ");
        uint transactionId = transactions.length;

        transactions.push(
            Transaction({to: _to, value: msg.value, executed: false})
        );

        emit TransactionSubmitted(transactionId, msg.sender, _to, msg.value);
    }

    function confirmTransaction(uint _transactionId) public onlyOwner {
        require(_transactionId < transactions.length, "Invalid transaction");
        require(
            !isConfirmed[_transactionId][msg.sender],
            "Transaction is already confirm by owner"
        );
        isConfirmed[_transactionId][msg.sender] = true;
        emit TransactionConfirmed(_transactionId);

        if (isTransactionConfirmed(_transactionId)) {
            executeTransaction(_transactionId);
        }
    }

    function isTransactionConfirmed(
        uint _transactionId
    ) public view returns (bool) {
        require(_transactionId < transactions.length, "Invalid transaction");
        uint confirmation;
        for (uint i = 0; i < numConfirm; i++) {
            if (isConfirmed[_transactionId][owners[i]]) {
                confirmation++;
            }
        }
        return confirmation >= numConfirm;
    }

    function executeTransaction(uint _transactionId) public payable {
        require(_transactionId < transactions.length, "Invalid transaction");
        require(
            !transactions[_transactionId].executed,
            "Transaction is already executed"
        );

        (bool success, ) = transactions[_transactionId].to.call{
            value: transactions[_transactionId].value
        }("");

        require(success, "Transaction Execution Failed ");
        transactions[_transactionId].executed = true;
        emit TransactionExecuted(_transactionId);
    }
}
