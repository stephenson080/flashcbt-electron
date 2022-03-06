import {Table} from 'semantic-ui-react';

export type Props = {
  headers: string[];
  data: string[];
};

export default function CustomTable(props: Props) {
  return (
    <Table celled fixed singleLine>
      <Table.Header>
        <Table.Row>
          {props.headers.map((header, i) => (
            <Table.HeaderCell key = {i}>{header}</Table.HeaderCell>
          ))}
        </Table.Row>
      </Table.Header>

      <Table.Body>
          {
              props.data.map((d, i) => (
                  
              ))
          }
        <Table.Row>
          <Table.Cell>John</Table.Cell>
          <Table.Cell>Approved</Table.Cell>
          <Table.Cell
            title={[
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore',
              'et dolore magna aliqua.',
            ].join(' ')}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Jamie</Table.Cell>
          <Table.Cell>Approved</Table.Cell>
          <Table.Cell>Shorter description</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Jill</Table.Cell>
          <Table.Cell>Denied</Table.Cell>
          <Table.Cell>Shorter description</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  );
}
