import { boolean } from "@storybook/addon-knobs";
import React from "react";

import { IpfsDetail } from "./IpfsDetail";

export default { title: "Transaction / Components / IPFS Detail" };

export const Default = () => <IpfsDetail isOpen={boolean("Is Open", true)} onClose={() => alert("closed")} />;
