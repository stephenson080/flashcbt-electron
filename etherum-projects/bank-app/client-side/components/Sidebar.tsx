import {
  Grid,
  Sidebar,
  Menu,
  Icon,
  Header,
  Image,
  Segment,
} from 'semantic-ui-react';
import {useState, Fragment} from 'react';
import User from '../models/user';
import {useRouter} from 'next/router';
import {Role} from '../store/types';
import Link from 'next/link';

type Props = {
  visible: boolean;
  children: any;
  user: User;
};

export default function SidebarComponent(props: Props) {
  if (!props.user) {
    return null;
  }
  if (props.user.role === Role.User) {
    return (
      <Grid>
        <Grid.Column>
          <Sidebar.Pushable>
            <Sidebar
              as={Menu}
              animation="push"
              icon="labeled"
              style={{
                backgroundColor: 'blue',
                color: 'white',
                height: '100%',
                border: 'none',
              }}
              vertical
              visible={props.visible}
              width="thin"
            >
              <Menu.Item style={{backgroundColor: 'white', fontSize: '1.3rem', fontWeight: 'bold'}}>
                BITWallet
                <Image style={{margin: '20px 0'}} src="/images/user.png" />
                {props.user ? props.user.username : ''}
                <br />
              </Menu.Item>
              <Link href="/user/dashboard">
                <Menu.Item style={{color: 'white'}}>
                  <Icon name="home" />
                  Dashboard
                </Menu.Item>
              </Link>

              <Link href="/user/deposit">
                <Menu.Item style={{color: 'white'}}>
                  <Icon name="angle double down" />
                  Deposit
                </Menu.Item>
              </Link>
              <Link href="/user/withdraw">
                <Menu.Item style={{color: 'white'}}>
                  <Icon name="angle double left" />
                  Withdraw
                </Menu.Item>
              </Link>
              <Link href="/user/transfer">
                <Menu.Item style={{color: 'white'}}>
                  <Icon name="angle double up" />
                  Transfer
                </Menu.Item>
              </Link>
              <Link href="/user/transactions">
                <Menu.Item style={{color: 'white'}}>
                  <Icon name="server" />
                  Transactions
                </Menu.Item>
              </Link>
            </Sidebar>

            <Sidebar.Pusher>{props.children}</Sidebar.Pusher>
          </Sidebar.Pushable>
        </Grid.Column>
      </Grid>
    );
  }
  return (
    <Grid>
      <Grid.Column>
        <Sidebar.Pushable>
          <Sidebar
            as={Menu}
            animation="push"
            icon="labeled"
            style={{
              backgroundColor: 'blue',
              color: 'white',
              height: '100%',
              border: 'none',
            }}
            vertical
            visible={props.visible}
            width="thin"
          >
            <Menu.Item style={{backgroundColor: 'white', fontSize: '1.3rem', fontWeight: 'bold'}}>
              BITWallet
              <Image style={{margin: '20px 0'}} src="/images/user.png" />
              {props.user ? props.user.username : ''}
              <br />
              {props.user ? props.user.email : ''}
            </Menu.Item>
            <Link href="/admin/dashboard">
              <Menu.Item style={{color: 'white'}}>
                <Icon name="home" />
                Dashboard
              </Menu.Item>
            </Link>
            <Link href="/admin/customers">
              <Menu.Item style={{color: 'white'}}>
                <Icon name="users" />
                Customers
              </Menu.Item>
            </Link>
            <Link href="/admin/transactions">
              <Menu.Item style={{color: 'white'}}>
                <Icon name="server" />
                Transactions
              </Menu.Item>
            </Link>
          </Sidebar>

          <Sidebar.Pusher>{props.children}</Sidebar.Pusher>
        </Sidebar.Pushable>
      </Grid.Column>
    </Grid>
  );
}
