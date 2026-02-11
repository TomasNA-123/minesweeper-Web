import "./counter.css";

interface Props {
  value: number;
}

function Counter(props: Props) {
  const { value } = props;
  const displayNumber = value.toString().padStart(3, "0");
  return <span className="counter">{displayNumber}</span>;
}

export default Counter;
