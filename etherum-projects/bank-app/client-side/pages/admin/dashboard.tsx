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
import DashboardNav from '../../components/DashboardNav';
import web3 from '../../ethereum/web3-config';
import {MessageType, Role} from '../../store/types';
import bankContract from '../../ethereum/bankInstance';
import {useSelector, useDispatch} from 'react-redux';
import {Store} from '../_app';
import User from '../../models/user';
import {useRouter} from 'next/router';
import getTokens from '../../ethereum/tokens';
import MintToken from '../../components/MintToken';
import {autoLogin, logout} from '../../store/actions/auth_action';
import {
  addTransactionToDB,
  getTransactionsFromDB,
} from '../../store/actions/user-actions';
import {TransactionType} from './transactions';
import Head from 'next/head';

export interface Customer {
  key: number;
  created: boolean;
  username: string;
  userAddress: string;
  userAcct: string | undefined;
}

// const tokens: Token[] = [
//   {
//     name: 'FreeMint',
//     symbol: 'FMT',
//     price: '0.000000001',
//     imageUrl: 'saving2.jpg',
//   },
//   {
//     name: 'CryptMint',
//     symbol: 'CMT',
//     price: '0.000001',
//     imageUrl: 'saving3.jpg',
//   },
//   {
//     name: 'QMint',
//     symbol: 'QMT',
//     price: '0.001',
//     imageUrl: 'saving.png',
//   },
// ];
type Props = {
  tokens: Token[];
};
interface MintState {
  showModal: boolean;
  showBuyTokenModal: boolean;
  curTokenName: string;
  curUserAddress: string;
  curContractAddress: string;
}

export async function getStaticProps() {
  const tokens = await getTokens(undefined);
  return {
    props: {
      tokens: tokens,
    },
  };
}

export default function AdminDashboard(props: Props) {
  const [sidebarVisble, setSidebar] = useState(false);
  const [curAddress, setCurAddress] = useState('');
  const [message, setMsg] = useState<MessageType>();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [mintState, setMintState] = useState<MintState>({
    showModal: false,
    curContractAddress: '',
    curTokenName: '',
    curUserAddress: '',
    showBuyTokenModal: false,
  });
  const [pendingCustomers, setPendCustomers] = useState<Customer[]>([]);
  const [pageLoading, setPageLoading] = useState(false);
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
              if (user!.role !== Role.Admin) {
                router.replace('/user/dashboard');
              } else {
                router.replace('/admin/dashboard');
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

  async function getAcct() {
    try {
      const pendingCustomers: Customer[] = [];
      const accounts = await web3.eth.getAccounts();
      setCurAddress(accounts[0]);
      const accountsCount = await bankContract.methods
        .getCustomers()
        .call({from: accounts[0]});
      for (let i = 1; i <= accountsCount; i++) {
        const customer = await bankContract.methods
          .customers(i)
          .call({from: accounts[0]});
        if (!customer.created) {
          pendingCustomers.push({
            key: i,
            created: customer.created,
            userAcct: customer.acctAddress,
            userAddress: customer.userAddress,
            username: customer.username,
          });
        }
      }
      setPendCustomers(pendingCustomers);
    } catch (error) {
      setMsg({
        type: 'DANGER',
        content: error.message,
        header: 'Something went wrong'
      })
    }
  }

  function getTokenDetails(token: Token, action: string) {
    if (action === 'MINT') {
      setMintState({
        ...mintState,
        showBuyTokenModal: true,
        curContractAddress: token.address,
        curTokenName: token.name,
        curUserAddress: curAddress,
      });
    }
  }

  async function createWallet(
    userAddress: string,
    username: string,
    index: number
  ) {
    try {
      setLoading(true);
      setSuccess(false);
      setMsg(undefined);
      setError(false);
      await bankContract.methods
        .createAccount(userAddress)
        .send({from: curAddress})
        .on('transactionHash', (hash: string) => {
          dispatch(
            addTransactionToDB(user.uid, hash, TransactionType.CREATE_ACCOUNT)
          );
        });

      const updatedCustomer = await bankContract.methods
        .customers(index)
        .call();
      const fetchedUser = await User.getUserByUsername(username);

      fetchedUser.acctAddress = updatedCustomer.acctAddress;
      await fetchedUser.addUserToDB();
      setLoading(false);
      setSuccess(true);
      setMsg({
        type: 'SUCCESS',
        header: 'Operation Success',
        content: `Your have Created wallet for ${username}`,
      });
    } catch (error) {
      setMsg({
        type: 'DANGER',
        header: 'Something Went Wrong',
        content: error.message,
      });
      setLoading(false);
      setSuccess(false);
      setError(true);
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
  function renderPendingCustomers() {
    if (pendingCustomers.length === 0) {
      return (
        <Table.Row>
          <Table.Cell>No User to Create Wallet For</Table.Cell>
        </Table.Row>
      );
    }
    return (
      pendingCustomers &&
      pendingCustomers.map((cus, i) => {
        let s = i;
        return (
          <Table.Row key={i}>
            <Table.Cell>{++s}</Table.Cell>
            <Table.Cell>{cus.username}</Table.Cell>
            <Table.Cell>{cus.userAddress}</Table.Cell>
            <Table.Cell>
              <Button
                basic
                onClick={() =>
                  createWallet(cus.userAddress, cus.username, cus.key)
                }
                loading={loading}
                color="blue"
              >
                Create Wallet
              </Button>
            </Table.Cell>
          </Table.Row>
        );
      })
    );
  }
  return (
    <Fragment>
      <Head>
        <title>Admin Dashboard</title>
      </Head>
      <SidebarComponent user={user} visible={sidebarVisble}>
        <Dimmer active={pageLoading}>
          <Loader size="massive" indeterminate>
            Please Wait...
          </Loader>
        </Dimmer>
        <MintToken
          pushTransaction={pushTransactions}
          tokenName={mintState.curTokenName}
          userAddress={mintState.curUserAddress}
          contractAddress={mintState.curContractAddress}
          closeModal={() =>
            setMintState({
              ...mintState,
              showBuyTokenModal: false,
            })
          }
          showModal={mintState.showBuyTokenModal}
        />
        <DashboardNav
          bal={undefined}
          user={user}
          logout={handleLogout}
          page="Dashboard"
          sideBarVisibility={sidebarVisble}
          setSidebar={() => setSidebar((visible) => !visible)}
        />
        <div>
          <Container>
            <div
              style={{
                display: 'flex',
                margin: '20px 0',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <h1 style={{fontWeight: 'bolder', fontSize: '2rem'}}>
                Pending Customers
              </h1>
            </div>

            <Table color="blue" fixed singleLine>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>S/N</Table.HeaderCell>
                  <Table.HeaderCell>Username</Table.HeaderCell>
                  <Table.HeaderCell>Address</Table.HeaderCell>
                  <Table.HeaderCell></Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>{renderPendingCustomers()}</Table.Body>
            </Table>
            {(success || error) && (
              <Message
                success={success}
                style={{width: '50%'}}
                error={error}
                onDismiss={() => {
                  setError(false);
                  setSuccess(false);
                }}
                content={message?.content}
                header={message?.header}
              />
            )}

            <h1
              style={{margin: '20px 0', fontWeight: 'bolder', fontSize: '2rem'}}
            >
              Tokens
            </h1>
            {props.tokens && (
              <Tokens
                tokenType={TokenType.ADMIN}
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
