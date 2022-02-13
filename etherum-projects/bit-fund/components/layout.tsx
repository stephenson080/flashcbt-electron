import Nav from "./Nav"

export default function Layout(props : any) {
  return (
    <div>
      <Nav activeItem = {props.activeItem} />
      {props.children}
      <h3>footer</h3>
    </div>
  );
}
