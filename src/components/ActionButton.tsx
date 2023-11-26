import React from 'react';

type Props = { text: string };

const ActionButton = ({ text }: Props) => {
  return (
    <a href="/">
      <button className="relative p-0 border-none outline-none rounded-sm cursor-pointer bg-transparent transition-shadow duration-150 focus:shadow-outline-white">
        <div className="absolute inset-0 grid grid-cols-1">
          <div className="background-1 row-start-1 col-start-1 rounded-sm animate-gradient-foreground-1 bg-gradient-to-r from-gradient-1-start to-gradient-1-end transform"></div>
          <div className="background-2 row-start-1 col-start-1 rounded-sm animate-gradient-foreground-2 bg-gradient-to-r from-gradient-2-start to-gradient-2-end transform"></div>
          <div className="background-3 row-start-1 col-start-1 rounded-sm animate-gradient-foreground-3 bg-gradient-to-r from-gradient-3-start to-gradient-3-end transform"></div>
        </div>

        <div className="font-bold z-10 relative flex justify-center items-center text-white bg-black m-[2px] rounded-sm p-[0.75rem_3rem] text-base transition-all duration-100 hover:bg-transparent hover:text-black">
          {text}
        </div>
      </button>
    </a>
  );
};

export default ActionButton;
