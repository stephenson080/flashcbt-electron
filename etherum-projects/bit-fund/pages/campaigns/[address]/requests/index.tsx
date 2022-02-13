import {useState} from 'react';
import {GetStaticPropsContext} from 'next';
import {Container, Button, Table, Message, Grid} from 'semantic-ui-react';
import Link from 'next/link';

import CampaignInstance from '../../../../ethereum/scripts/campaign';
import campaignManager from '../../../../ethereum/scripts/campaignManager';
import Layout from '../../../../components/layout';

import CreateRequestForm from '../../../../components/addRequestForm';
import web3 from '../../../../ethereum/scripts/web3';

import {IMsg} from '../../add-project';

type Props = {
  address: string;
  requests: Request[];
  donorsCount: number;
};

type Request = {
  description: string;
  value: string;
  vendor: string;
  completed: boolean;
  approvedCount: string;
};

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

export async function getStaticProps(context: GetStaticPropsContext) {
  let add: string | undefined | string[];

  let requests: Request[] = [];

  add = context.params?.address;

  const cam = CampaignInstance(add);
  const requestCount = await cam.methods.requestCount().call();
  const donorsCount = await cam.methods.donorsCount().call();
  console.log(donorsCount);
  for (let i = 0; i < +requestCount; i++) {
    const req = await cam.methods.requests(i).call();
    requests.push({
      description: req['0'],
      value: web3.utils.fromWei(req['1'], 'ether'),
      vendor: req['2'],
      completed: req['3'],
      approvedCount: req['4'],
    });
  }
  return {
    props: {
      address: add,
      requests: requests,
      donorsCount: donorsCount,
    },
  };
}

export default function ViewRequests(props: Props) {
  const [openModal, setOpenModal] = useState(false);
  const [msg, setMsg] = useState<IMsg>();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  async function approveRequest(reqIndex: string) {
    try {
      const accounts = await web3.eth.getAccounts();
      setLoading(true);
      setMsg(undefined);
      setSuccess(false);
      const cam = CampaignInstance(props.address);
      await cam.methods.approveRequest(reqIndex).send({
        from: accounts[0],
      });
      setVisible(true);
      setMsg({
        content: 'You have approved this request',
        header: 'Operation Successful!',
      });
      setSuccess(true);
    } catch (error) {
      setVisible(true);
      setMsg({
        content: error.message,
        header: 'Oops! Something went wrong!',
      });
      setError(true);
    } finally {
      setLoading(false);
    }
  }
  async function finalizeRequest(reqIndex: string, amount: string) {
    try {
      const accounts = await web3.eth.getAccounts();
      setLoading(true);
      setMsg(undefined);
      setSuccess(false);
      setVisible(false);
      const convertedAmount = web3.utils.toWei(amount, 'ether');
      const cam = CampaignInstance(props.address);
      await cam.methods.finalizeRequest(reqIndex).send({
        from: accounts[0],
        value: convertedAmount,
      });
      setVisible(true);
      setMsg({
        content:
          'You have finalized this request. The vendors money on the way',
        header: 'Operation Successful!',
      });
      setSuccess(true);
    } catch (error) {
      setVisible(true);
      setMsg({
        content: error.message,
        header: 'Oops! Something went wrong!',
      });
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <Container>
        <CreateRequestForm
          address={props.address}
          openModal={openModal}
          closeModal={() => setOpenModal(false)}
        />
        <Grid>
          <Grid.Row style = {{margin: '20px 0'}}>
            <Grid.Column width = '13'>
              <h2>Requests</h2>
            </Grid.Column>
            <Grid.Column width = '3'>
              <Button onClick={() => setOpenModal(true)} color="violet">
                Create Request
              </Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Grid.Row>
          <Grid.Column width = '10'>
          <Table color="violet">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>S/N</Table.HeaderCell>
              <Table.HeaderCell>Amount (eth)</Table.HeaderCell>
              <Table.HeaderCell>Vendor</Table.HeaderCell>
              <Table.HeaderCell>No. of Approvers</Table.HeaderCell>
              <Table.HeaderCell>Description</Table.HeaderCell>
              <Table.HeaderCell>Completed</Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {props.requests.map((req, i) => {
              let sn = i;
              return (
                <Table.Row key={i}>
                  <Table.Cell>{ i + 1}</Table.Cell>
                  <Table.Cell>{req.value}</Table.Cell>
                  <Table.Cell>{req.vendor}</Table.Cell>
                  <Table.Cell>
                    {req.approvedCount}/{props.donorsCount}
                  </Table.Cell>
                  <Table.Cell>{req.description}</Table.Cell>
                  <Table.Cell>{req.completed ? 'Yes' : 'No'}</Table.Cell>
                  <Table.Cell>
                    <Button
                      basic
                      color="green"
                      loading={loading}
                      onClick={() => approveRequest(i.toString())}
                    >
                      Approve
                    </Button>
                  </Table.Cell>
                  <Table.Cell>
                    <Button
                      basic
                      color="violet"
                      loading={loading}
                      onClick={() => finalizeRequest(i.toString(), req.value)}
                    >
                      Finalize
                    </Button>
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
          </Grid.Column>
        </Grid.Row>
        
        {visible && (
          <Message
            success={success}
            style={{width: '50%'}}
            error={error}
            onDismiss={() => setVisible(false)}
            content={msg?.content}
            header={msg?.header}
          />
        )}
      </Container>
    </Layout>
  );
}
