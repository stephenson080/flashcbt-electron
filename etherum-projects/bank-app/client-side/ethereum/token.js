import ABI from '../../artifacts/contracts/Token.sol/Token.json'
import web3 from './web3-config'

export function getFmtToken(){
    return new web3.eth.Contract(ABI.abi, '0xB2CC15Af02a53D1c3652763faa46654955dCE560')
}

export function getCRMToken(){
    return new web3.eth.Contract(ABI.abi, '0x153cD151289F03D10ca89c52D3a0e2e9Dda80c0b')
}

export function getQmToken(){
    return new web3.eth.Contract(ABI.abi, '0xcbc4511419e97b99B3cD7b9A8D3B998942BBB996')
}

export default function getToken(address) {
    return new web3.eth.Contract(ABI.abi, address)
}