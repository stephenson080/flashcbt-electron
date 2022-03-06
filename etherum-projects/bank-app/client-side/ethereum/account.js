import Account from '../../artifacts/contracts/account.sol/Account.json'
import web3 from './web3-config'

export default function Acct(address){
    return new web3.eth.Contract(Account.abi, address)
}