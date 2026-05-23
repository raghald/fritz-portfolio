"use client";

import { IoClose } from "react-icons/io5";

type Props = {
  onClick: () => void;
  ariaLabel: string;
  /** Czy przycisk ma okrągłe tło na hover (true w success state, false w głównym). */
  rounded?: boolean;
};

export default function CloseButton({ onClick, ariaLabel, rounded = false }: Props) {
  const padding =
    "p-2.5 sm:p-2 min-w-[44px] min-h-[44px] inline-flex items-center justify-center";
  const roundedClass = rounded ? "rounded-full" : "";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={[
        "hover:bg-gray-100 active:bg-gray-200",
        "hover:scale-110 active:scale-95",
        "transition-all duration-200",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-black",
        padding,
        roundedClass,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <IoClose className="text-black w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
    </button>
  );
}
