import {useState, FormEvent} from 'react';
import {Container, Message, Form, Modal, Button} from 'semantic-ui-react';

import {IMsg} from '../pages/campaigns/add-project';

import CampaignInstance from '../ethereum/scripts/campaign';
import web3 from '../ethereum/scripts/web3';

interface State {
  amount: string;
  vendor: string;
  description: string;
}

type Props = {
  address: string;
  openModal: boolean;
  closeModal: () => void;
};
export default function CreateRequestForm(props: Props) {
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<State>({
    vendor: '',
    amount: '',
    description: '',
  });
  const [msg, setMsg] = useState<IMsg>();
  const [success, setSuccess] = useState(false);

  async function createRequest() {
    try {
      setLoading(true);
      setMsg(undefined);
      setSuccess(false);
      const accounts = await web3.eth.getAccounts();
      const convertedAmount = web3.utils.toWei(state.amount, 'ether');
      const cam = CampaignInstance(props.address);

      await cam.methods
        .createRequest(state.description, convertedAmount, state.vendor)
        .send({
          from: accounts[0],
        });
      setMsg({
        content: 'You have created a new Request',
        header: 'Operation Successful!',
      });
      setSuccess(true);
    } catch (error) {
      setMsg({
        content: error.message,
        header: 'Oops! Something went wrong!',
      });
    } finally {
      setLoading(false);
    }
  }
  return (
    <Modal dimmer open={props.openModal}>
      <Modal.Header>Create a new request</Modal.Header>
      <Modal.Content>
        <Container>
          Fill in the Form to create a new request
          <Form
            style={{marginTop: '55px'}}
            loading={loading}
            error={!!msg?.content}
          >
            <Form.Input
              type="text"
              style={{width: '50%'}}
              label="Amount:"
              size="big"
              placeholder="enter amount for request"
              value={state.amount}
              onChange={(e) =>
                setState({
                  ...state,
                  amount: e.target.value,
                })
              }
            />
            <Form.Input
              type="text"
              style={{width: '50%'}}
              label="Vendor:"
              size="big"
              placeholder="enter vendor's address"
              value={state.vendor}
              onChange={(e) =>
                setState({
                  ...state,
                  vendor: e.target.value,
                })
              }
            />
            <Form.Input
              type="text"
              style={{width: '50%'}}
              label="Description:"
              size="big"
              placeholder="enter a short description of the request"
              value={state.description}
              onChange={(e) =>
                setState({
                  ...state,
                  description: e.target.value,
                })
              }
            />
            <Message
              success={success}
              style={{width: '50%'}}
              error
              content={msg?.content}
              header={msg?.header}
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
          onClick={createRequest}
        >
          Create
        </Button>
      </Modal.Actions>
    </Modal>
  );
}
