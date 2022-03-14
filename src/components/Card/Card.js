import './Card.css';

const Card = (props) => (
  <div className={`${props.className} card`}>{props.children}</div>
);

export default Card;
