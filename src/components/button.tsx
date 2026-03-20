import "./button.css";

interface Props {
  typeButton: string;
  content: string;
  choiced?: boolean;
  className?: string;
  click: (...arg: any[]) => void;
}

function Button(props: Props) {
  const { typeButton, content, choiced = false, className = "", click } = props;
  return (
    <button
      className={`btn ${typeButton} ${choiced ? "choiced" : ""} ${className}`}
      onClick={click}
    >
      {content}
    </button>
  );
}

export default Button;
