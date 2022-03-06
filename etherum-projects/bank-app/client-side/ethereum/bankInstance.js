import ABI from '../../artifacts/contracts/bank.sol/Bank.json'
import web3 from './web3-config'

const bankContract = new web3.eth.Contract(ABI.abi, '0x73D4E8391291184C346d8BCeC569408530f18380')

export default bankContract