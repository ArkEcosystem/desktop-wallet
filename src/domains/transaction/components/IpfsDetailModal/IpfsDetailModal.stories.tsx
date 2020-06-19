import { boolean } from "@storybook/addon-knobs";
import React from "react";

import { IpfsDetailModal } from "./IpfsDetailModal";

export default { title: "Transaction / Components / IPFS Detail" };

export const Default = () => <IpfsDetailModal isOpen={boolean("Is Open", true)} onClose={() => alert("closed")} />;
