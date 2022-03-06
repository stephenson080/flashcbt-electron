const {expect} = require('chai')

// const Token = artifacts.require('Token')
const Token = require('../artifacts/contracts/Token.sol/Token.json')


let accounts, freeMint, qMint, cryptMint

describe("Testing tokens", function(){
    before(async function(){
        accounts = await web3.eth.getAccounts()
        freeMint = await new web3.eth.Contract(Token.abi).deploy({
            data: Token.bytecode,
            arguments: ['FreeMint', "FMT", '1000', '100']
        }).send({
            from: accounts[0],
            gas: '10000000'
        })
        qMint = await new web3.eth.Contract(Token.abi).deploy({
            data: Token.bytecode,
            arguments: ['CryptMint', "CRM", '100', '10']
        }).send({
            from: accounts[0],
            gas: '10000000',
        })
        cryptMint = await new web3.eth.Contract(Token.abi).deploy({
            data: Token.bytecode,
            arguments: ['QMint', "FMT", '10', '5']
        }).send({
            from: accounts[0],
            gas: '10000000'
        })
    })

    describe("Deployment", function(){
        it("Checking Tokens for details", async function(){
            const FMTtotalSup = await freeMint.methods.getSummary().call()
            const QMTtotalSup = await qMint.methods.getSummary().call()
            const CMTtotalSup = await cryptMint.methods.getSummary().call()

            console.log(FMTtotalSup, QMTtotalSup, CMTtotalSup)
        })
    })
})