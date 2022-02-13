import {GetStaticPropsContext} from 'next';
import {Container, Card, Grid, Button} from 'semantic-ui-react';

import web3 from '../../ethereum/scripts/web3';
import campaignManager from '../../ethereum/scripts/campaignManager';
import Layout from '../../components/layout';

import ContributeForm from '../../components/ContributeForm';
import CampaignInstance from '../../ethereum/scripts/campaign';
import Link from 'next/link';
import { useEffect } from 'react';

interface ICampaign {
  manager: string;
  minContribution: string;
  balance: string;
  donorsCount: string;
  requestCount: string;
  address: string;
}

interface Props {
  campaign: ICampaign;
}

export async function getStaticPaths() {
  const campaigns = await campaignManager.methods.getDeployedCampaigns().call();

  return {
    fallback: false,
    paths: campaigns.map((cam: string) => ({
      params: {
        address: cam,
      },
    })),
  };
}

export async function getStaticProps(context: GetStaticPropsContext) {
  let add: string | undefined | string[];

  add = context.params?.address;

  const cam = CampaignInstance(add);
  const summary = await cam.methods.getSummary().call();
  return {
    props: {
      campaign: {
        address: add,
        manager: summary[0],
        requestCount: summary[1],
        minContribution: summary[2],
        donorsCount: summary[3],
        balance: summary[4],
      },
    },
  };
}

export default function Campaign(props: Props) {
  useEffect(() => {
    web3.eth.getAccounts().then(acc => console.log(acc))
  }, [])
  const items = [
    {
      header: props.campaign.manager,
      meta: 'Project Owner',
      description: 'sjhdhjdm',
      style: {overflowWrap: 'break-word'},
    },
    {
      header: web3.utils.fromWei(props.campaign.minContribution),
      meta: 'Amount in Ether',
      description: `You can only contribute atleast ${props.campaign.minContribution} to this project`,
    },
    {
      header: props.campaign.donorsCount,
      meta: 'Number of Donors',
      description: `You can only contribute atleast to this project`,
    },
    {
      header: props.campaign.requestCount,
      meta: 'Number of Requests',
      description: `Owner can create requests to make transfer to vendors`,
    },
    {
      header: web3.utils.fromWei(props.campaign.balance),
      meta: 'Amount in ether',
      description: `Current balance of the project`,
    },
  ];
  return (
    <div>
      <Layout>
        <Container>
          <Grid>
            <Grid.Row>
              <Grid.Column
                style={{backgroundColor: 'white'}}
                mobile="16"
                largeScreen="10"
                tablet="10"
              >
                <h2>Project Details</h2>
                <Card.Group items={items} />
              </Grid.Column>
              <Grid.Column
                style={{backgroundColor: 'white'}}
                largeScreen="6"
                mobile="16"
                tablet="6"
              >
                <ContributeForm
                  minContribution={web3.utils.fromWei(
                    props.campaign.minContribution,
                    'ether'
                  )}
                  address={props.campaign.address}
                />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Link href={`/campaigns/${props.campaign.address}/requests`}>
                  <a>
                    <Button color="violet">View Requests</Button>
                  </a>
                </Link>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </Layout>
    </div>
  );
}
