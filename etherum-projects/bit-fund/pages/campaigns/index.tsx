import {NextPage} from 'next';
import campaignManager from '../../ethereum/scripts/campaignManager';
import web3 from '../../ethereum/scripts/web3';
import Layout from '../../components/layout';
import Campaign from '../../components/Campaign';
import {Container, Button} from 'semantic-ui-react';
import {useRouter} from 'next/router';

const abi = [
  {
    inputs: [
      {internalType: 'uint256', name: 'minAmount', type: 'uint256'},
      {internalType: 'address', name: 'creator', type: 'address'},
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [{internalType: 'uint256', name: 'index', type: 'uint256'}],
    name: 'approveRequest',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'contribute',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {internalType: 'string', name: 'des', type: 'string'},
      {internalType: 'uint256', name: 'val', type: 'uint256'},
      {internalType: 'address', name: 'vendor', type: 'address'},
    ],
    name: 'createRequest',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{internalType: 'address', name: '', type: 'address'}],
    name: 'donors',
    outputs: [{internalType: 'bool', name: '', type: 'bool'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'donorsCount',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{internalType: 'uint256', name: 'index', type: 'uint256'}],
    name: 'finalizeRequest',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getSummary',
    outputs: [
      {internalType: 'address', name: '', type: 'address'},
      {internalType: 'uint256', name: '', type: 'uint256'},
      {internalType: 'uint256', name: '', type: 'uint256'},
      {internalType: 'uint256', name: '', type: 'uint256'},
      {internalType: 'uint256', name: '', type: 'uint256'},
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'manager',
    outputs: [{internalType: 'address', name: '', type: 'address'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'minContribution',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'requestCount',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    name: 'requests',
    outputs: [
      {internalType: 'string', name: 'description', type: 'string'},
      {internalType: 'uint256', name: 'value', type: 'uint256'},
      {internalType: 'address', name: 'vendor', type: 'address'},
      {internalType: 'bool', name: 'completed', type: 'bool'},
      {internalType: 'uint256', name: 'approvedCount', type: 'uint256'},
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

interface ICampaign {
  campaigns: any[];
}

export async function getStaticProps() {
  let campaigns: any[] = [];
  const camp = await campaignManager.methods.getDeployedCampaigns().call();
  for (let add of camp) {
    const cam = new web3.eth.Contract(abi, add);
    const minContribution = await cam.methods.minContribution().call();
    campaigns.push({
      meta:
        'Min. Contribution: ' +
        web3.utils.fromWei(minContribution, 'ether') +
        ' ether',
      header: `Project address ${cam.options.address}`,
      fluid: true,
      href: `/campaigns/${cam.options.address}`,
    });
  }
  return {
    props: {
      campaigns: campaigns,
    },
  };
}

export default function Campaigns(props: ICampaign): NextPage {
  const router = useRouter();

  function goToAddProject() {
    router.replace('/campaigns/add-project');
  }
  return (
    <div>
      <Layout activeItem="all-projects">
        <Container>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            <div style={{backgroundColor: 'white'}}>
              <h2 style={{margin: '18px 0'}}>Open Projects</h2>
              <Campaign items={props.campaigns} />
            </div>
            <Button
              color="violet"
              onClick={goToAddProject}
              style={{marginTop: '18px', width: '35%', height: '50px'}}
              content="Create Project"
              icon="add"
              labelPosition="left"
            />
          </div>
        </Container>
      </Layout>
    </div>
  );
}
