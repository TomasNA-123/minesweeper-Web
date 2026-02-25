import "./sideInterface.css";

interface Props {
  title: string;
  children?: React.ReactNode;
}

function SideInterface(props: Props) {
  const { title, children } = props;

  return (
    <div className="secondaryContent">
      <div className="titleRow">
        <h2>{title}</h2>
      </div>

      {children}
    </div>
  );
}

export default SideInterface;
