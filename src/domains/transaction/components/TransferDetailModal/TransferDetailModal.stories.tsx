import { boolean } from "@storybook/addon-knobs";
import React from "react";

import { TransferDetailModal } from "./TransferDetailModal";

export default { title: "Transaction / Components / Transfer Detail" };

export const Default = () => <TransferDetailModal isOpen={boolean("Is Open", true)} onClose={() => alert("closed")} />;
