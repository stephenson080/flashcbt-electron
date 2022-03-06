import {Modal, Message, Form, Button, Container, Icon} from 'semantic-ui-react';
import {useState, useEffect} from 'react';
import {useDispatch} from 'react-redux';

import {signup} from '../store/actions/auth_action';
import {MessageType} from '../store/types';

import web3 from '../ethereum/web3-config';
import bank from '../ethereum/bankInstance';



type Props = {
  showModal: boolean;
  closeModal: () => void;
  msg: MessageType;
};

export interface SignUpState {
  email: string;
  username: string;
  user_address: string;
  password: string;
  confirmPassword: string;
}
export default function Signup(props: Props) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMsg] = useState<MessageType>();
  const [state, setState] = useState<SignUpState>({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    user_address: '',
  });

  const msg = props.msg;

  const dispatch = useDispatch();

  useEffect(() => {
    getAccounts();
  }, []);
  useEffect(() => {
    if (msg.type === 'SUCCESS') {
      setSuccess(true);
    }
    setMsg({
      content: msg.content,
      header: msg.header,
      type: msg.type,
    });
  }, [msg]);
  async function getAccounts() {
    const accounts = await web3.eth.getAccounts();
    setState({
      ...state,
      user_address: accounts[0],
    });
  }
  const createWallet = async () => {
    setLoading(true);
    setMsg(undefined);
    setSuccess(false);
    dispatch(
      signup(state, async (m) => {
        if (m === 'SUCCESS') {
          try {
            await bank.methods
              .createAccountRequest(state.username)
              .send({from: state.user_address});
            setLoading(false);
          } catch (error) {
            setMsg({
              content: error.message,
              header: 'Some went wrong',
              type: 'DANGER',
            });
            setSuccess(false);
            setLoading(false);
          }
        }
        setLoading(false);
      })
    );
  };
  return (
    <Modal dimmer open={props.showModal}>
      <Modal.Header style={{backgroundColor: 'blue', color: 'white'}}>
        {' '}
        <Icon
          loading={loading}
          name={loading ? 'asterisk' : 'add circle'}
        />{' '}
        {loading
          ? 'Creating Your Wallet! Please Wait...'
          : 'Create Your BITWallet'}
      </Modal.Header>
      <Modal.Content>
        <Container>
          <h5 style={{marginLeft: '28px'}}>
            Fill in the Form to create a new Wallet
          </h5>
          <Form
            style={{marginTop: '55px', marginLeft: '28px'}}
            loading={loading}
            error={!!message?.content}
          >
            <Form.Input
              type="email"
              style={{width: '80%'}}
              label="Email"
              size="big"
              placeholder="enter your email"
              value={state.email}
              onChange={(e) =>
                setState({
                  ...state,
                  email: e.target.value,
                })
              }
            />
            <Form.Input
              type="text"
              style={{width: '80%'}}
              label="Username"
              size="big"
              placeholder="enter your username"
              value={state.username}
              onChange={(e) =>
                setState({
                  ...state,
                  username: e.target.value,
                })
              }
            />
            <Form.Input
              type="password"
              style={{width: '80%'}}
              label="Password"
              size="big"
              placeholder="enter your password"
              value={state.password}
              onChange={(e) =>
                setState({
                  ...state,
                  password: e.target.value,
                })
              }
            />
            <Form.Input
              type="password"
              style={{width: '80%'}}
              label="Confirm Password"
              size="big"
              placeholder="confirm your password"
              value={state.confirmPassword}
              onChange={(e) =>
                setState({
                  ...state,
                  confirmPassword: e.target.value,
                })
              }
            />
            <Message
              success={success}
              style={{width: '50%'}}
              error
              content={message?.content}
              header={message?.header}
            />
          </Form>
        </Container>
      </Modal.Content>
      <Modal.Actions>
        <Button
          disabled={loading ? true : false}
          negative
          onClick={props.closeModal}
        >
          Cancel
        </Button>
        <Button
          disabled={loading ? true : false}
          positive
          onClick={createWallet}
        >
          Create
        </Button>
      </Modal.Actions>
    </Modal>
  );
}
