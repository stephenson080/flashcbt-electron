// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract Account {
    string private username;
    address private userAddress;

    constructor ( address usAddress, string memory usname){
        username = usname;
        userAddress = usAddress;
    }

    function depositFunds() public payable {
        require(msg.value > 0, "Invalid Funds!");
    }

    function withdrawFunds(uint amount) public payable checkUserAddress checkAccountBal(amount){
        address payable userAdd = payable(userAddress);
        userAdd.transfer(amount);
    }

    function transferFunds(uint amount, address to) public payable checkUserAddress checkAccountBal(amount) {
        address payable toAdd = payable(to);
        toAdd.transfer(amount);
    }
    


    function getAccountDetails() public view checkUserAddress returns(string memory, address, uint, address){
        return (
            username,
            userAddress,
            address(this).balance,
            address(this)
        );
    }
    function getAcctBalance() public view checkUserAddress returns(uint){
        return address(this).balance;
    }

    modifier checkUserAddress(){  
        require(msg.sender == userAddress, "Sorry you are not Authorised to make this transaction");
        _;
    }
    modifier checkAccountBal(uint amount){
        require(address(this).balance >= amount, "Insuficient Funds!");
        _;
    }
}