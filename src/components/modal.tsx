import type React from "react";
import "./modal.css";

interface Props {
  title?: string;
  active: boolean;
  children?: React.ReactNode;
  closeModal: () => void;
}

function Modal(props: Props) {
  const { title = "", active = false, children = <></>, closeModal } = props;

  // Prevents clicks on modal div close the modal
  const preventClose = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <div
      className={`modalContainer ${!active ? "inactive" : ""}`}
      onClick={closeModal}
    >
      <div
        className={`modal ${title == "" ? "pt-20" : ""}`}
        onClick={preventClose}
      >
        {title != "" && (
          <div className="titleRow">
            <h2>{title}</h2>
          </div>
        )}

        <div className={`modalContent`}>{children}</div>
      </div>
    </div>
  );
}

export default Modal;
