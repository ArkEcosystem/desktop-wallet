import { boolean } from "@storybook/addon-knobs";
import React from "react";

import { TransferDetail } from "./TransferDetail";

export default { title: "Domains / Transaction / Components / TransferDetail" };

export const Default = () => <TransferDetail isOpen={boolean("Is Open", true)} onClose={() => alert("closed")} />;
