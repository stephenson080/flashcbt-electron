const { expect } = require("chai");
const Bank = artifacts.require('Bank')

let accounts
let bank

describe("Bank", function(){
    before(async function () {
        accounts = await web3.eth.getAccounts();
        bank = await Bank.new();
    });

    describe("Deployment", function(){
        it('Checking Bank details', async function(){

            console.log(`Getting bank details...`)
            const bankDetails = await bank.getBankDetails()

            console.log(`Manger address: ${bankDetails[1]} Bank Address: ${bankDetails[0]} 
            Number of Customers: ${bankDetails[2]['words'][0]}`
            )

            expect(bankDetails[1]).to.equal(accounts[0])
            expect(bankDetails[2]['words'][0]).to.equal(0)
        })
    })

    describe("checking customers", function(){
        it("checking customers after creating", async function(){
            console.log(`creating new account request...`)
            await bank.createAccountRequest("Steve", {from: accounts[1]})
            await bank.createAccountRequest("John", {from: accounts[2]})
            
            console.log(`Admin creating new account...`)
            const a = await bank.createAccount(accounts[1])
            const b = await  bank.createAccount(accounts[2])
            
            console.log(`Getting Number of Customers...`)

            const bankCustomers = await bank.getCustomers()
            console.log(`Number of Customers: ${bankCustomers}`)

            // expect(bankCustomers).to.equal(2)
        
        })
    })
})