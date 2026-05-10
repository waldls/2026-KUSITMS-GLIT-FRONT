"use client";

import { cn } from "@/lib/utils/cn";

type SingleButtonProps = {
  type: "single";
  btnLabel: string;
  onBtnClick: () => void;
};

type DoubleButtonProps = {
  type: "double";
  btnLLabel: string;
  btnRLabel: string;
  onBtnLClick: () => void;
  onBtnRClick: () => void;
};

interface ModalBaseProps {
  isOpen: boolean;
  title: string;
  contents?: string;
  onClose?: () => void;
  className?: string;
}

type ModalProps = ModalBaseProps & (SingleButtonProps | DoubleButtonProps);

const Modal = (props: ModalProps) => {
  const { isOpen, title, contents, onClose, className } = props;

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-gray-900/75" aria-hidden="true" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        className={cn("rounded-8 bg-gray-850 relative w-65.5 overflow-hidden", className)}>
        <div className="flex flex-col items-center gap-1 px-9 py-5">
          <div className="flex flex-col items-center gap-1">
            <p className="body-3 text-center break-words text-white">{title}</p>
            {contents && (
              <p className="body-4 w-full text-center break-words text-gray-500">{contents}</p>
            )}
          </div>
        </div>

        <div className="flex w-full">
          {props.type === "single" ? (
            <button
              type="button"
              onClick={props.onBtnClick}
              className="body-2 text-sea-blue-400 flex w-full cursor-pointer items-center justify-center border-t-[0.4px] border-t-gray-700 px-10 py-2.75">
              {props.btnLabel}
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={props.onBtnLClick}
                className="body-2 flex flex-1 cursor-pointer items-center justify-center border-t-[0.4px] border-r-[0.4px] border-gray-700 px-10 py-2.75 text-white">
                {props.btnLLabel}
              </button>
              <button
                type="button"
                onClick={props.onBtnRClick}
                className="body-2 text-sea-blue-400 flex flex-1 cursor-pointer items-center justify-center border-t-[0.4px] border-gray-700 px-10 py-2.75">
                {props.btnRLabel}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

Modal.displayName = "Modal";

export default Modal;
