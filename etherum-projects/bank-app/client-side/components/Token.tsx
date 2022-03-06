import {Card, Icon, Image, Grid, Button} from 'semantic-ui-react';
import User from '../models/user';
import { Role } from '../store/types';

export interface Token {
  name: string;
  symbol: string;
  price: number;
  imageUrl: string;
  totalSupply: string;
  address: string;
}

export enum TokenType {
  GUEST, USER, ADMIN
}

type Props = {
  tokens: Token[];
  getTokenDetails: (token : Token, action: string) => void,
  tokenType: TokenType
};

export default function Tokens(props: Props) {
  return (
    <Card.Group centered>
      {props.tokens.map((tk, i) => {
        return (
          <Card  key = {i} raised>
            
            <Image  wrapped src={`/images/${tk.imageUrl}`} ui={false} />
            <Card.Content>
              <Card.Header>
                {tk.name} ({tk.symbol})
              </Card.Header>
              <Card.Meta>{tk.address}</Card.Meta>
              <Card.Description>
                Price: {tk.price} ether <br/>
                {tk.symbol === 'FMT' ? 'Create a Wallet and This free' : 'You can buy this here buy'}
              </Card.Description>
            </Card.Content>
            <Card.Content extra>
              <div className = 'ui two buttons'>
                {(props.tokenType === TokenType.GUEST || props.tokenType === TokenType.USER) && <Button basic color = 'blue' onClick = {() => {
                  props.getTokenDetails(tk, 'BUYTOKEN')
                }}>
                  Buy {tk.name}
                </Button>}
                { props.tokenType === TokenType.ADMIN && <Button basic color = 'orange' onClick = {() => {
                  props.getTokenDetails(tk, 'MINT')
                }}>
                    Mint Token
                </Button>}
                { props.tokenType === TokenType.USER && <Button basic color = 'orange' onClick = {() => {
                  props.getTokenDetails(tk, 'SEND')
                }}>
                    Send Token
                </Button>}
              </div>
            </Card.Content>
          </Card>
        );
      })}
    </Card.Group>
  );
}
