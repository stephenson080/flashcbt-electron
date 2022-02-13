import {Fragment, useState, FormEvent} from 'react';
import {Form, Button, Message, Icon} from 'semantic-ui-react';


import {IMsg} from '../pages/campaigns/add-project';
import web3 from '../ethereum/scripts/web3';
import CampaignInstance from '../ethereum/scripts/campaign';
import { useRouter } from 'next/router';

type Props = {
  address: string;
  minContribution: string
};

export default function ContributeForm(props: Props) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<IMsg>();
  const [success, setSuccess] = useState(false);
  const [amount, setAmount] = useState('');

  const router = useRouter()

  async function contribute(e: FormEvent) {
    try {
      e.preventDefault();
      console.log(props.address)

      setLoading(true);
      setMsg(undefined);
      setSuccess(false);
      const accounts = await web3.eth.getAccounts();
      const convertedAmount = web3.utils.toWei(amount, 'ether');
      const cam = CampaignInstance(props.address);

      await cam.methods.contribute().send({
        from: accounts[0],
        value: convertedAmount
      });
      setMsg({
        content: 'THanks for Contributing to this Project',
        header: "Operation Successful"
      })
      setSuccess(true)
      router.replace(`/campaigns/${props.address}`)
    } catch (error) {
        setMsg({
          header: 'Oops! Something went wrong',
          content: error.message
        })
    }
    finally {
      setLoading(false)
    }
  }
  return (
    <Fragment>
      <h2 style={{color: 'blueviolet', fontWeight: 'bolder'}}>
        Contribute to this Project
      </h2>
      <p>Enter minimum of {props.minContribution} eth to Contribute</p>
      <Form
        onSubmit={contribute}
        style={{marginTop: '55px'}}
        loading={loading}
        error={!!msg?.content}
      >
        <Form.Input
          type="text"
          style={{width: '50%'}}
          label="Min. Amount:"
          size="big"
          placeholder="enter minimum amount for project"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <Message
          success={success}
          style={{width: '50%'}}
          error
          content={msg?.content}
          header={msg?.header}
        />
        <Button style={{width: '50%', height: '50px'}} color="violet" animated>
          <Button.Content visible>Create</Button.Content>
          <Button.Content hidden>
            <Icon name="arrow right" />
          </Button.Content>
        </Button>
      </Form>
    </Fragment>
  );
}
