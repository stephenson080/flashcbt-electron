const Web3 = require('web3')
const HDwalletProvider = require('@truffle/hdwallet-provider')

const compiledCampaignManager = require('./build/CampaignManager.json')


const compiledCampaignManagerObject = JSON.parse(compiledCampaignManager)

// console.log(JSON.parse(compiledCampaignManager).evm.bytecode.object)

const options = {
    transactionConfirmationBlocks: 1
};

let mnemonicPhrase = 'analyst animal toe sell grape warfare north essence upset fashion castle what'
let network = 'https://rinkeby.infura.io/v3/49373fdfe7c345c987d6dedba4e98dfb'

const provider = new HDwalletProvider(mnemonicPhrase, network)

const web3Instance = new Web3(provider, null, options)

console.log(compiledCampaignManagerObject.abi)

async function deploy() {
    const accounts = await web3Instance.eth.getAccounts()

    const inbox = new web3Instance.eth.Contract(compiledCampaignManagerObject.abi)

    const deployTx =  inbox.deploy({
        data: compiledCampaignManagerObject.evm.bytecode.object,
    })

    const deployedInstance = await deployTx.send({
        from: accounts[0],
        gas: await deployTx.estimateGas()
    })
    .on("transactionHash", (txhash) => {
        console.log(`https://ropsten.etherscan.io/tx/${txhash}`);
    })
    .on('receipt', (receipt) => {
        console.log(`Receipt after mining with contract address: ${receipt.contractAddress}`); 
        console.log(`Receipt after mining with events: `); 
     })
    console.log(deployedInstance.options.address)    
    provider.engine.stop();

}

deploy()