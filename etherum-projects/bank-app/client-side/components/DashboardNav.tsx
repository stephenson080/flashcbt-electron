import {Icon, Dropdown} from 'semantic-ui-react';
import {Role} from '../store/types';
import User from '../models/user';

export interface Balances {
  values: string
  image: {avatar: boolean, src: string},
  text: string,
  key: string
}

type Props = {
  sideBarVisibility: boolean;
  setSidebar: () => void;
  page: string;
  logout: () => void;
  user: User;
  bal: Balances[] | undefined
};

export default function DashboardNav(props: Props) {
  function bal() {

    return props.user.role === Role.User && (
      <span>
        Balance: {' '}
        <Dropdown
          inline
          options={props.bal}
          defaultValue={props.bal ? props.bal[0]?.values : ''}
        />
      </span>
    );
  }
  return (
    <div
      style={{
        height: '200px',
        borderBottomLeftRadius: '20px',
        borderBottomRightRadius: '20px',
        backgroundColor: 'white',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px',
        }}
      >
        <div style={{fontSize: '1.5rem'}}>
          <p onClick={props.setSidebar}>
            <Icon
              link
              fitted
              size="big"
              name={props.sideBarVisibility ? 'cancel' : 'bars'}
            />
            {bal()}
          </p>
        </div>
        <p
          onClick={props.logout}
          style={{fontSize: '1.2rem', cursor: 'pointer'}}
        >
          Logout
          <Icon size="big" name="sign out alternate" />
        </p>
      </div>

      <h1
        style={{
          marginTop: '30px',
          textAlign: 'center',
          marginBottom: '-20px',
        }}
      >
        {props.page}
      </h1>
    </div>
  );
}
