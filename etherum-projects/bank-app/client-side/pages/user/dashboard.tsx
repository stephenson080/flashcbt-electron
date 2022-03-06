import {Fragment, useState, useEffect} from 'react';
import SidebarComponent from '../../components/Sidebar';
import Tokens, {TokenType} from '../../components/Token';

import {Token} from '../../components/Token';
import {
  Container,
  Table,
  Button,
  Icon,
  Message,
  Dimmer,
  Loader,
} from 'semantic-ui-react';
import DashboardNav, {Balances} from '../../components/DashboardNav';
import web3 from '../../ethereum/web3-config';
import {MessageType, Role} from '../../store/types';
import {useSelector, useDispatch} from 'react-redux';
import {Store} from '../_app';
import User from '../../models/user';
import {useRouter} from 'next/router';
import getTokens from '../../ethereum/tokens';
import {autoLogin, logout} from '../../store/actions/auth_action';
import {addTransactionToDB} from '../../store/actions/user-actions';
import {TransactionType} from '../admin/transactions';
import Acct from '../../ethereum/account';
import {getFmtToken, getCRMToken, getQmToken} from '../../ethereum/token';
import AcctDetails, {CardItemsType} from '../../components/UserAccountDetails';
import BuyToken from '../../components/BuyToken';
import SendToken from '../../components/SendToken';
import Head from 'next/head';

export interface Customer {
  created: boolean;
  username: string;
  userAddress: string;
  userAcct: string | undefined;
}

type Props = {
  tokens: Token[];
};
interface TokenState {
  showModal: boolean;
  showBuyTokenModal: boolean;
  showSendToken: boolean;
  curTokenName: string;
  curUserAddress: string;
  curContractAddress: string;
  type: string;
}

export async function getStaticProps() {
  const tokens = await getTokens(undefined);
  return {
    props: {
      tokens: tokens,
    },
  };
}

export default function Dashboard(props: Props) {
  const [sidebarVisble, setSidebar] = useState(false);
  const [curAddress, setCurAddress] = useState('');
  const [message, setMsg] = useState<MessageType>();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [tokenState, setTokenState] = useState<TokenState>({
    showModal: false,
    curContractAddress: '',
    curTokenName: '',
    curUserAddress: '',
    showBuyTokenModal: false,
    type: '',
    showSendToken: false,
  });
  const [acctDetails, setAcctDetails] = useState<CardItemsType[]>([]);
  const [pageLoading, setPageLoading] = useState(false);
  const [bal, setBal] = useState<Balances[]>([]);
  //   const [icon, setIcon] = useState('bars')

  const dispatch = useDispatch();

  const user = useSelector<Store, User>((state) => state.auth.user!);
  const router = useRouter();
  useEffect(() => {
    getAcct();
    const userId = localStorage.getItem('userId');
    if (userId) {
      if (!user) {
        setPageLoading(true);
        dispatch(
          autoLogin(userId, (m) => {
            setPageLoading(false);
            if (m === 'SUCCESS') {
              if (user!.role === Role.Admin) {
                router.replace('/admin/dashboard');
              } else {
                router.replace('/user/dashboard');
              }
            } else {
              router.replace('/auth/login');
            }
          })
        );
      }
    } else {
      router.replace('/auth/login');
    }
  }, []);

  useEffect(() => {
    getAcctDetails(user);
  }, [user]);

  async function getAcct() {
    const accounts = await web3.eth.getAccounts();
    setCurAddress(accounts[0]);
  }

  function getTokenDetails(token: Token, action: string) {
    if (action == 'BUYTOKEN') {
      setTokenState({
        ...tokenState,
        showBuyTokenModal: true,
        curContractAddress: token.address,
        curTokenName: token.name,
        curUserAddress: curAddress,
        type: action,
      });
    } else {
      setTokenState({
        ...tokenState,
        showSendToken: true,
        curContractAddress: token.address,
        curTokenName: token.name,
        curUserAddress: curAddress,
        type: action,
      });
    }
  }

  async function getAcctDetails(user: User) {
    try {
      const accounts = await web3.eth.getAccounts();
      if (!user) {
      } else {
        setPageLoading(true);
        const acctInstance = Acct(user.acctAddress);
        const summary = await acctInstance.methods.getAccountDetails().call({
          from: accounts[0],
        });
        const fmtToken = getFmtToken();
        const crmToken = getCRMToken();
        const qmtToken = getQmToken();
        const fmtbalance = await fmtToken.methods
          .getBalance(user.user_address)
          .call();
        const crmbalance = await crmToken.methods
          .getBalance(user.user_address)
          .call();
        const qmbalance = await qmtToken.methods
          .getBalance(user.user_address)
          .call();
        const acctDetails: CardItemsType[] = [
          {
            header: 'Main Account',
            meta: `${web3.utils.fromWei(summary[2], 'ether')} ether`,
            description: 'Etheruem Account',
          },
          {
            header: 'FreeMintToken',
            meta: `${web3.utils.fromWei(fmtbalance)}`,
            description: 'Free Token',
          },
          {
            header: 'CryptMint Token',
            meta: `${web3.utils.fromWei(crmbalance)}`,
            description: 'CryptMint Token',
          },
          {
            header: 'QMint Token',
            meta: `${web3.utils.fromWei(qmbalance)}`,
            description: 'QMint Token',
          },
        ];
        const bal: Balances[] = [
          {
            key: '0',
            image: {avatar: true, src: '/images/ethereum.png'},
            values: `${web3.utils.fromWei(summary[2], 'ether')}`,
            text: `Main Account: ${web3.utils.fromWei(summary[2], 'ether')}`,
          },
          {
            key: '1',
            image: {avatar: true, src: '/images/fmt.png'},
            values: `${web3.utils.fromWei(fmtbalance)}`,
            text: `FreeMint Token: ${web3.utils.fromWei(fmtbalance)}`,
          },
          {
            key: '2',
            image: {avatar: true, src: '/images/crm.png'},
            values: `${web3.utils.fromWei(crmbalance)}`,
            text: `CryptMint Token: ${web3.utils.fromWei(crmbalance)}`,
          },
          {
            key: '3',
            image: {avatar: true, src: '/images/qmt.png'},
            values: `${web3.utils.fromWei(qmbalance)}`,
            text: `QMint Token: ${web3.utils.fromWei(qmbalance)}`,
          },
        ];

        setPageLoading(false);
        setBal(bal);
        setAcctDetails(acctDetails);
      }
    } catch (error) {
      setMsg({
        type: 'DANGER',
        header: 'Something went wrong',
        content: error.message,
      });
      setPageLoading(false);
    }
  }
  function handleLogout() {
    setPageLoading(true);
    dispatch(
      logout((m) => {
        setPageLoading(false);
        if (m === 'SUCCESS') {
          localStorage.clear();
          router.replace('/auth/login');
        }
      })
    );
  }

  function pushTransactions(hash: string) {
    dispatch(addTransactionToDB(user.uid, hash, TransactionType.MINT_TOKEN));
  }

  return (
    <Fragment>
      <SidebarComponent user={user} visible={sidebarVisble}>
        <Head>
          <title>Dashboard</title>
        </Head>
        <Dimmer active={pageLoading}>
          <Loader size="massive" indeterminate>
            Please Wait...
          </Loader>
        </Dimmer>
        <SendToken
          closeModal={() =>
            setTokenState({
              ...tokenState,
              showSendToken: false,
            })
          }
          pushTransaction={pushTransactions}
          tokenName={tokenState.curTokenName}
          contractAddress={tokenState.curContractAddress}
          userAddress={tokenState.curUserAddress}
          showModal={tokenState.showSendToken}
        />
        <BuyToken
          closeModal={() =>
            setTokenState({
              ...tokenState,
              showBuyTokenModal: false,
            })
          }
          pushTransaction={pushTransactions}
          tokenName={tokenState.curTokenName}
          contractAddress={tokenState.curContractAddress}
          userAddress={tokenState.curUserAddress}
          showModal={tokenState.showBuyTokenModal}
        />
        <DashboardNav
          bal={bal}
          user={user}
          logout={handleLogout}
          page="Dashboard"
          sideBarVisibility={sidebarVisble}
          setSidebar={() => setSidebar((visible) => !visible)}
        />
        <div>
          <Container>
            <h1
              style={{margin: '20px 0', fontWeight: 'bolder', fontSize: '2rem'}}
            >
              Your Account
            </h1>
            {acctDetails.length > 0 && <AcctDetails items={acctDetails} />}
            <h1
              style={{margin: '20px 0', fontWeight: 'bolder', fontSize: '2rem'}}
            >
              Tokens
            </h1>
            {props.tokens && (
              <Tokens
                tokenType={TokenType.USER}
                getTokenDetails={getTokenDetails}
                tokens={props.tokens}
              />
            )}
          </Container>
        </div>
      </SidebarComponent>
    </Fragment>
  );
}
