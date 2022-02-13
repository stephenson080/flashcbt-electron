import {Card} from 'semantic-ui-react';
export interface CardItemsType {
  header: string;
  description: string;
  meta: string;
}

type CampaignsProps = {
  items: CardItemsType[];
};

export default function Campaign(props: CampaignsProps) {
  return <Card.Group style = {{marginRight: '40px'}} items={props.items} />;
}
