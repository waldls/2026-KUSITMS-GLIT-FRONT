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
  btnLClassName?: string;
  btnRClassName?: string;
};

interface ModalBaseProps {
  isOpen: boolean;
  title: string;
  contents?: React.ReactNode;
  onClose?: () => void;
  className?: string;
  contentClassName?: string;
}

type ModalProps = ModalBaseProps & (SingleButtonProps | DoubleButtonProps);

const Modal = (props: ModalProps) => {
  const { isOpen, title, contents, onClose, className, contentClassName } = props;

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-gray-900/75" aria-hidden="true" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        className={cn("rounded-8 bg-gray-850 relative w-65.5 overflow-hidden", className)}>
        <div className={cn("flex flex-col items-center gap-1 px-9 py-5", contentClassName)}>
          <div className="flex flex-col items-center gap-1">
            <p className="body-3 text-center break-words text-white">{title}</p>
            {contents && (
              <div className="body-5 w-full text-center break-words whitespace-pre-line text-gray-500">
                {contents}
              </div>
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
                className={cn(
                  "body-2 flex flex-1 cursor-pointer items-center justify-center border-t-[0.4px] border-r-[0.4px] border-gray-700 px-10 py-2.75 text-white",
                  props.btnLClassName,
                )}>
                {props.btnLLabel}
              </button>
              <button
                type="button"
                onClick={props.onBtnRClick}
                className={cn(
                  "body-2 text-sea-blue-400 flex flex-1 cursor-pointer items-center justify-center border-t-[0.4px] border-gray-700 px-10 py-2.75",
                  props.btnRClassName,
                )}>
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
