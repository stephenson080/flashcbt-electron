import {useState, FormEvent} from 'react';
import {GetStaticPropsContext} from 'next';
import {Container, Button, Form, Message, Icon} from 'semantic-ui-react';

import campaignManager from '../../../../ethereum/scripts/campaignManager';
import CampaignInstance from '../../../../ethereum/scripts/campaign';
import Layout from '../../../../components/layout';
import {IMsg} from '../../add-project';
import web3 from '../../../../ethereum/scripts/web3';

export async function getStaticPaths() {
  const campaigns = await campaignManager.methods.getDeployedCampaigns().call();

  return {
    fallback: false,
    paths: campaigns.map((cam: string) => ({
      params: {
        address: `${cam}`,
      },
    })),
  };
}

type Props = {
  address: string;
};

interface State {
  amount: string;
  vendor: string;
  description: string;
}

export async function getStaticProps(context: GetStaticPropsContext) {
  let add: string | undefined | string[];

  add = context.params?.address;

  const cam = CampaignInstance(add);
  //   const summary = await cam.methods.getSummary().call();
  return {
    props: {
      address: add,
    },
  };
}

export default function CreateRequest(props: Props) {
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<State>({
    vendor: '',
    amount: '',
    description: '',
  });
  const [msg, setMsg] = useState<IMsg>();
  const [success, setSuccess] = useState(false);

  async function createRequest(e: FormEvent) {
    try {
      e.preventDefault();
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
    <Layout>
      <Container>
        <h2>Create Request</h2>
        <p>Fill in the form to create a request</p>
        <Form
          onSubmit={createRequest}
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
            label="Vendor:"
            size="big"
            placeholder="enter vendor's address"
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
          <Button style={{height: '50px'}} color="violet" animated>
            <Button.Content visible>Create</Button.Content>
            <Button.Content hidden>
              <Icon name="arrow right" />
            </Button.Content>
          </Button>
        </Form>
      </Container>
    </Layout>
  );
}
