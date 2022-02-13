import {Menu, Input, Segment} from 'semantic-ui-react';
import {useRouter} from 'next/router';

export default function Nav(props: any) {
  const router = useRouter();
  return (
    <Segment inverted>
      <Menu stackable secondary inverted pointing>
        <Menu.Item
          header
          name="BITFUND"
          active={props.activeItem === 'home'}
          onClick={() => {
            router.replace('/');
          }}
        />

        <Menu.Menu position="right">
          <Menu.Item>
            <Input icon="search" placeholder="Search..." />
          </Menu.Item>
          <Menu.Item
            color="violet"
            name="All Projects"
            active={props.activeItem === 'all-projects'}
            onClick={() => {
              router.replace('/campaigns');
            }}
          />
          <Menu.Item
            name="Add Project"
            color="violet"
            active={props.activeItem === 'add-project'}
            onClick={() => {
              router.replace('/campaigns/add-project');
            }}
          />
        </Menu.Menu>
      </Menu>
    </Segment>
  );
}
