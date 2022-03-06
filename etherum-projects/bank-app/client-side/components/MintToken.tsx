import { Modal, Icon, Button, Container, Form, Message } from "semantic-ui-react";
import getToken from "../ethereum/token";
import { useState } from "react";

import {MessageType} from '../store/types';

type Props = {
    contractAddress: string;
    userAddress: string;
    showModal: boolean;
    tokenName: string;
    closeModal: () => void;
    pushTransaction: (hash: string) => void
  };
  
  interface MintTokenState {
    contractAddress: string;
    userAddress: string;
    amount: string;
  }

export default function MintToken(props : Props) {
    const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMsg] = useState<MessageType>();
  const [state, setState] = useState<MintTokenState>({
    contractAddress: props.contractAddress,
    userAddress: props.userAddress,
    amount: '',
  });

  async function mintToken() {
    try {
      setSuccess(false);
      setLoading(true);
      setMsg(undefined);
      const tokenContract = await getToken(props.contractAddress);
      await tokenContract.methods.mintToken(state.amount.toString()).send({

        from: props.userAddress,
      }).on('transactionHash', (hash: string) => {
        props.pushTransaction(hash)
      })
      setSuccess(true);
      setLoading(false);
      setMsg({
        type: 'SUCCESS',
        content: `You now have minted ${state.amount} ${props.tokenName}`,
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
          : `Mint ${props.tokenName}`}
      </Modal.Header>
      <Modal.Content>
        <Container>
          <h5 style={{marginLeft: '28px'}}>
            Fill in the Form to Mint {props.tokenName}
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
              label={`Amount of ${props.tokenName} to Mint`}
              size="big"
              placeholder={`enter amount of ${props.tokenName}  to mint`}
              value={state.amount}
              onChange={(e) => {
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
        <Button disabled={loading ? true : false} positive onClick={mintToken}>
          Mint
        </Button>
      </Modal.Actions>
    </Modal>
    )
}