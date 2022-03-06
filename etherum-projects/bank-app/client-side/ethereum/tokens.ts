import {getFmtToken, getCRMToken, getQmToken} from './token';
import {Token} from '../components/Token';
const tokens: Token[] = [];

export default async function getTokens(index: number | undefined) {
  const fmtToken = getFmtToken();
  const crmToken = getCRMToken();
  const qmtToken = getQmToken();
  const fmtDetails = await fmtToken.methods.getSummary().call();
  const crmDetails = await crmToken.methods.getSummary().call();
  const qmtDetails = await qmtToken.methods.getSummary().call();
  tokens.push(
    {
      name: fmtDetails[0],
      symbol: fmtDetails[1],
      imageUrl: 'fmt.png',
      price: 1 / +fmtDetails[3],
      totalSupply: fmtDetails[2],
      address: fmtToken._address,
    },
    {
      name: crmDetails[0],
      symbol: crmDetails[1],
      imageUrl: 'crm.png',
      price: 1 / +crmDetails[3],
      totalSupply: crmDetails[2],
      address: crmToken._address,
    },
    {
      name: qmtDetails[0],
      symbol: qmtDetails[1],
      imageUrl: 'qmt.png',
      price: 1 / +qmtDetails[3],
      totalSupply: qmtDetails[2],
      address: qmtToken._address,
    }
  );
  if (index) {
    return tokens[index];
  }
  return tokens;
}
