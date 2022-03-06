const { expect } = require("chai");
const Account = artifacts.require('Account')

let accounts
let acct



describe("Account", function () {

    before(async function () {
        accounts = await web3.eth.getAccounts();
        acct = await Account.new(accounts[0], 'Steve');
    });

    describe('Deployment', function() {
        it("Should return account details", async function () {
            // const Account = await ethers.getContractFactory("Account");
            
            // await acct.deployed();
    
            const acctDetails = await acct.getAccountDetails()
    
            const bal = await acct.getAcctBalance()
    
            expect(acctDetails[0]).to.equal('Steve')
            expect(acctDetails[1]).to.equal(accounts[0])
            expect(bal['words'][0]).to.equal(0)
    
        });
    })

    describe("Checking balance after making transactions", function() {
        it("deposit to Account", async function () {
            let amount = '1000000'

            console.log(`Depositing ${amount} to Account...`)
            await acct.depositFunds({value: amount})

            console.log('Funds Deposited!. Getting Balance...')
            const bal = await acct.getAcctBalance()

            expect(bal['words'][0]).to.equal(+amount)
    
        })

        it("withdraw from Account", async function(){
            let withdrawAmount = '100'

            console.log(`Getting old balance...`)
            const bal = await acct.getAcctBalance()
            
            console.log(`Withdrawing ${withdrawAmount} to user Address...`)
            await acct.withdrawFunds(withdrawAmount)

            console.log(`Funds Withdrawed!. Getting Balance...`)
            const newBal = await acct.getAcctBalance()

            expect(newBal['words'][0]).to.equal(bal['words'][0] - parseInt(withdrawAmount))

        })

        it("tranferring funds", async function(){
            let transAmount1 = '100'
            let transAmount2 = '100'

            console.log(`Getting old balance...`)
            const bal = await acct.getAcctBalance()

            console.log(`Transfering ${+transAmount1 + +transAmount2} to ${accounts[1]}...`)
            await acct.transferFunds(transAmount1, accounts[1])
            await acct.transferFunds(transAmount2, accounts[1])

            console.log(`Funds Transferred!. Getting Balance...`)
            const newBal = await acct.getAcctBalance()

            expect(newBal['words'][0]).to.equal(bal['words'][0] - 200)

        })
    })
    
});



// contract("Account", (accounts) => {
//     it("Account instance has correct username and address", async function (done) {
//         const acct = await Account.new(accounts[0], "St");
//         const de = await acct.getAccountDetails()

//         assert.equal(de[0], 'St', 'instance has right username')
//         assert.equal(de[1], accounts[0], 'instance has right user-address')
//         done()
//     });

// });
