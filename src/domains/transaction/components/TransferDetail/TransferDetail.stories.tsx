import { boolean } from "@storybook/addon-knobs";
import React from "react";

import { TransferDetail } from "./TransferDetail";

export default { title: "Transactions / Components / Transfer Detail" };

export const Default = () => <TransferDetail isOpen={boolean("Is Open", true)} onClose={() => alert("closed")} />;
