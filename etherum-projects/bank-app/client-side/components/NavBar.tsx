import {Menu, Container, Button} from 'semantic-ui-react';
import {useRouter} from 'next/router';
import Link from 'next/link';

type Props = {
  activeItem: string;
  handleClick: () => void;
};
export default function NavBar(props: Props) {
  const router = useRouter();
  return (
    <Container>
      <Menu stackable style={{padding: '20px 0', fontSize: '20px'}} secondary>
        <Menu.Item
          style={{fontSize: '28px', fontWeight: 'bolder'}}
          name="BITWallet"
          active={props.activeItem === ''}
          onClick={props.handleClick}
        />

        <Menu.Menu position="right">
          <Link href="/">
            <Menu.Item
              name="Home"
              active={props.activeItem === 'messages'}
              onClick={props.handleClick}
            />
          </Link>
          <Link href="/#tokens">
            <Menu.Item
              name="Our Tokens"
              active={props.activeItem === 'tokens'}
              onClick={props.handleClick}
            />
          </Link>
          <Link href = '/#'>
            <Menu.Item
              name="About Us"
              active={props.activeItem === 'about'}
              onClick={props.handleClick}
            />
          </Link>
        </Menu.Menu>
        <Menu.Item>
          <Button onClick={() => router.replace('/auth/login')} color="orange">
            Log In
          </Button>
        </Menu.Item>
      </Menu>
    </Container>
  );
}
