import {Modal, Form, Container, Message, Icon, Button} from 'semantic-ui-react';
import {useState} from 'react';

import {MessageType} from '../store/types';
import getToken from '../ethereum/token';
import web3 from '../ethereum/web3-config';

type Props = {
  contractAddress: string;
  userAddress: string;
  showModal: boolean;
  tokenName: string;
  closeModal: () => void;
  pushTransaction: (hash : string) => void
};

interface BuyTokenState {
  contractAddress: string;
  userAddress: string;
  amount: string;
}

export default function BuyToken(props: Props) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMsg] = useState<MessageType>();
  const [state, setState] = useState<BuyTokenState>({
    contractAddress: props.contractAddress,
    userAddress: props.userAddress,
    amount: '',
  });

  async function buyToken() {
    try {
      setSuccess(false);
      setLoading(true);
      setMsg(undefined);
      const tokenContract = await getToken(props.contractAddress);
      await tokenContract.methods.buyToken().send({
        from: props.userAddress,
        value: web3.utils.toWei(state.amount.toString(), 'ether'),
      }).on('transactionHash', (hash : string) => {
        props.pushTransaction(hash)
      })
      setSuccess(true);
      setLoading(false);
      setMsg({
        type: 'SUCCESS',
        content: `You now have ${props.tokenName}`,
        header: 'Operation Success',
      });
    } catch (error) {
      setMsg({
        type: 'DANGER',
        content: error.message,
        header: 'Something went wrong',
      });
      setLoading(false);
    }
  }
  return (
    <Modal dimmer open={props.showModal}>
      <Modal.Header style={{backgroundColor: 'blue', color: 'white'}}>
        {' '}
        <Icon
          loading={loading}
          name={loading ? 'asterisk' : 'add circle'}
        />{' '}
        {loading
          ? 'Processing Transaction... Please Wait!'
          : `Buy ${props.tokenName}`}
      </Modal.Header>
      <Modal.Content>
        <Container>
          <h5 style={{marginLeft: '28px'}}>
            Fill in the Form to buy {props.tokenName}
          </h5>
          <Form
            style={{marginTop: '55px', marginLeft: '28px'}}
            loading={loading}
            error={!!message?.content}
          >
            <Form.Input
              disabled
              type="text"
              style={{width: '80%'}}
              label="Contract Address"
              size="big"
              placeholder="enter contract Address"
              value={props.contractAddress}
              onChange={(e) =>
                setState({
                  ...state,
                  contractAddress: e.target.value,
                })
              }
            />
            <Form.Input
              required
              type="text"
              style={{width: '80%'}}
              label="User Address"
              size="big"
              placeholder="Enter your Address"
              value={props.userAddress}
              onChange={(e) =>
                setState({
                  ...state,
                  userAddress: e.target.value,
                })
              }
            />
            <Form.Input
              required
              type="text"
              style={{width: '80%'}}
              label="Amount (Ether)"
              size="big"
              placeholder="enter amount in ether"
              value={state.amount}
              onChange={(e) => {
                console.log('djhjsdhjdhj');
                setState({
                  ...state,
                  amount: e.target.value,
                });
              }}
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
        <Button disabled={loading ? true : false} positive onClick={buyToken}>
          Buy
        </Button>
      </Modal.Actions>
    </Modal>
  );
}
