import Layout from '../../components/layout';
import {Container, Form, Button, Icon, Message} from 'semantic-ui-react';
import {useState, FormEvent, useEffect} from 'react';

import campaignManager from '../../ethereum/scripts/campaignManager';
import web3 from '../../ethereum/scripts/web3';

export type IMsg = {
  content: string;
  header: string;
};

export default function AddProject() {
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [msg, setMsg] = useState<IMsg>();
  const [success, setSuccess] = useState(false)


  const createProject = async (e: FormEvent) => {
    try {
      e.preventDefault();
      const accounts = await web3.eth.getAccounts();
      setLoading(true);
      setMsg(undefined)
      setSuccess(false)
      const convertedAmount = web3.utils.toWei(amount, 'ether');
      await campaignManager.methods.createCampaign(convertedAmount).send({
        from: accounts[0],
      });
      setMsg({
        content: 'You have created a new Project',
        header: 'Operation Successful!'
      })
      setSuccess(true)
    } catch (error) {
      setMsg({
        content: error.message,
        header: 'Oops! Something went wrong!'
      })
    }
    finally {
      setLoading(false);
    }
    
  };
  return (
    <div>
      <Layout activeItem="add-project">
        <Container style={{marginTop: '35px', backgroundColor: 'white'}}>
          <h2 style={{color: 'blueviolet', fontWeight: 'bolder'}}>
            Create New Project
          </h2>
          <p>Enter minimum of 0.00001 eth to create a project</p>
          <Form
            onSubmit={createProject}
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
            <Message success = {success} style={{width: '50%'}} error content={msg?.content} header={msg?.header} />
            <Button style={{width: '50%', height: '50px'}} color="violet" animated>
              <Button.Content visible>Create</Button.Content>
              <Button.Content hidden>
                <Icon name="arrow right" />
              </Button.Content>
            </Button>
          </Form>
        </Container>
      </Layout>
    </div>
  );
}
