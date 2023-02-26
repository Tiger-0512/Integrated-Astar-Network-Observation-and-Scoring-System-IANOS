// import { Popover } from "@headlessui/react";
import type { FC } from "react";

import ConnectMetamaskButton from "@/components/button/ConnectMetamaskButton";

const Header: FC = () => {
  return (
    <div className="bg-black text-white h-32">
      <div className="mx-auto max-w-7xl h-full">
        {/* <div className="bg-gradient-to-r from-[#C6279B] via-[#694CCE] to-[#02E3FF] pb-0.5 h-20">*/}
        <div className="bg-black h-full w-full flex flex-row justify-between items-center px-10">
          <div className="flex lg:w-0 lg:flex-1 items-center">
            <img className="h-12 w-auto mr-8" src="/images/ianos.png" alt="" />
            <div className="font-medium text-3xl">On-chain Identity Scoring System</div>
          </div>
          <ConnectMetamaskButton />
        </div>
        {/* </div> */}
      </div>
    </div>
  );
};
export default Header;
