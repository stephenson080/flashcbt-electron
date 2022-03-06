import {Modal, Message, Form, Button, Container, Icon} from 'semantic-ui-react';
import {useState, useEffect} from 'react';
import {useDispatch} from 'react-redux';

import {signup, forgotPass} from '../store/actions/auth_action';
import {MessageType} from '../store/types';


type Props = {
  showModal: boolean;
  closeModal: () => void;
  msg: MessageType;
};

export interface ForgotState {
  email: string;
}
export default function ForgotPassword(props: Props) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMsg] = useState<MessageType>();
  const [state, setState] = useState<ForgotState>({
    email: ''
  });

  const msg = props.msg;

  const dispatch = useDispatch();

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
  
  const resetPassword = async () => {
    setLoading(true);
    setMsg(undefined);
    setSuccess(false);
    dispatch(forgotPass(state, (m) => {
        setLoading(false)
    }))
    setLoading(false)
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
          ? 'Sending Mail! Please Wait...'
          : 'Reset your Password'}
      </Modal.Header>
      <Modal.Content>
        <Container>
          <h5 style={{marginLeft: '28px'}}>
            Enter your Email address you registered with!
          </h5>
          <Form
            style={{marginTop: '55px', marginLeft: '28px'}}
            loading={loading}
            error={!!message?.content}
            size = 'large'
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
          onClick={resetPassword}
        >
          Reset Password
        </Button>
      </Modal.Actions>
    </Modal>
  );
}
