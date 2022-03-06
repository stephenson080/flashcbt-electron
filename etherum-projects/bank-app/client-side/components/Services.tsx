import {Grid} from 'semantic-ui-react';
import Service from './Service';

export interface Service {
  imageUrl: string;
  title: string;
  description: string;
}

type Props = {
  services: Service[];
};
export default function Services(props: Props) {
  return (
    <Grid>
      <Grid.Row style = {{backgroundColor: 'whitesmoke'}}>
        {props.services.map((service, i) => (
          <Grid.Column
            key={i}
            mobile="16"
            largeScreen="4"
            style={{margin: '15px 0'}}
          >
            <Service service={service} />
          </Grid.Column>
        ))}
      </Grid.Row>
    </Grid>
  );
}
