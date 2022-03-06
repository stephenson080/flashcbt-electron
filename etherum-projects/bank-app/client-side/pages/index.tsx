import {NextPage} from 'next';
import Head from 'next/head';
// import Image from 'next/image';
import classes from '../styles/Home.module.css';
import {Grid, Container, Image, Button, Transition} from 'semantic-ui-react';
import NavBar from '../components/NavBar';
import Tokens, {Token, TokenType} from '../components/Token';
import Services, {Service} from '../components/Services';
import Signup from '../components/SignUp';
import {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {MessageType} from '../store/types';
import {Store} from './_app';
import getTokens from '../ethereum/tokens';
import BuyToken from '../components/BuyToken';
import web3 from '../ethereum/web3-config';

const services: Service[] = [
  {
    title: 'Savings',
    description: 'Your can use your wallet for Saving ether and our tokens',
    imageUrl: 'saving3.jpg',
  },
  {
    title: 'Withdraw',
    description:
      'Your can use your wallet for Withdraw ether to your other Wallets',
    imageUrl: 'withdraw2.jpg',
  },
  {
    title: 'Transfer',
    description:
      'Your can use your wallet for Transfer ether and our tokens to other users',
    imageUrl: 'transfer.jpg',
  },
  {
    title: 'Buy Tokens',
    description: 'Your can use your wallet to our tokens',
    imageUrl: 'buy.jpg',
  },
];
interface State {
  showModal: boolean;
  showBuyTokenModal: boolean;
  curTokenName: string;
  curUserAddress: string;
  curContractAddress: string;
}

type Props = {
  tokens: Token[];
};

export async function getStaticProps() {
  const tokens = await getTokens(undefined);
  return {
    props: {
      tokens: tokens,
    },
  };
}
const Home: NextPage = (props: Props) => {
  const [state, setState] = useState<State>({
    showModal: false,
    curContractAddress: '',
    curTokenName: '',
    curUserAddress: '',
    showBuyTokenModal: false,
  });

  useEffect(() => {
    getAcct();
  }, []);
  async function getAcct() {
    const accounts = await web3.eth.getAccounts();
    setState({
      ...state,
      curUserAddress: accounts[0],
    });
  }
  const msg = useSelector<Store, MessageType>((state) => state.auth.message);
  function getTokenDetails(token: Token, action: string) {
    if (action === 'BUYTOKEN') {
      setState({
        ...state,
        curContractAddress: token.address,
        curTokenName: token.name,
        showBuyTokenModal: true,
      });
    }
  }
  return (
    <div>
      <Head>
        <title>BITWallet | Home</title>
      </Head>
      <BuyToken
        pushTransaction={(hash) => {
          return;
        }}
        showModal={state.showBuyTokenModal}
        userAddress={state.curUserAddress}
        contractAddress={state.curContractAddress}
        tokenName={state.curTokenName}
        closeModal={() =>
          setState({
            ...state,
            showBuyTokenModal: false,
          })
        }
      />
      <Signup
        showModal={state.showModal}
        closeModal={() =>
          setState({
            ...state,
            showModal: false,
          })
        }
        msg={msg}
      />
      <div style={{backgroundColor: 'whitesmoke'}}>
        <NavBar activeItem="jfn" handleClick={() => {}} />
        <div className={classes.main}>
          <Container>
            <Grid>
              <Grid.Row>
                {/* <Container> */}
                <Grid.Column width="8">
                  <h1>Welcome to BITWallet</h1>
                  <h3>
                    Your <strong>Fast</strong> and <strong>Secure</strong>{' '}
                    Ethereum Wallet
                  </h3>
                  <Button
                    onClick={() => setState({...state, showModal: true})}
                    color="blue"
                  >
                    Create Your Wallet
                  </Button>
                </Grid.Column>
                <Grid.Column width="8">
                  <Image width={400} height={300} src="/images/saving.png" />
                </Grid.Column>
                {/* </Container> */}
              </Grid.Row>
            </Grid>
          </Container>
        </div>
      </div>
      <div className={classes.home_header}>
        <div style={{padding: '20px 0'}}>
          <Container>
            <h1
              style={{
                textAlign: 'center',
                margin: '20px 0',
                fontWeight: 'bolder',
                fontSize: '3rem',
              }}
            >
              Our Tokens
            </h1>
            <div id = 'tokens'>
              <Tokens
                tokenType={TokenType.GUEST}
                getTokenDetails={getTokenDetails}
                tokens={props.tokens}
              />
            </div>
          </Container>
        </div>
        <div style={{padding: '20px 0'}}>
          <Container>
            <h1
              style={{
                textAlign: 'center',
                margin: '20px 0',
                fontWeight: 'bolder',
                fontSize: '3rem',
              }}
            >
              BITWallet Services
            </h1>
            <Services services={services} />
          </Container>
        </div>
      </div>
    </div>
  );
};

export default Home;
