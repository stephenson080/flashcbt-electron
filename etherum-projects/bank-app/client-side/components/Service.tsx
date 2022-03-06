import {Service} from './Services';
import {Image} from 'semantic-ui-react';

type Props = {
  service: Service;
};
export default function Serv(props: Props) {
  return (
    <div style = {{padding: '20px'}}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '60%',
        }}
      >
        <Image src={`/images/${props.service.imageUrl}`} />
      </div>
      <h1 style = {{textAlign: 'center'}}>{props.service.title}</h1>
      <p style = {{textAlign: 'center'}}>{props.service.description}</p>
    </div>
  );
}
