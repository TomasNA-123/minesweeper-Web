import "./mineButton.css";

interface Props {
  buttonData: string;
  click: () => void;
}

function MineButton(props: Props) {
  const { buttonData, click } = props;
  return (
    <button className="mineButton" onClick={click}>
      {buttonData}
    </button>
  );
}

export default MineButton;
