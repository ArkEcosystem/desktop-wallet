import { boolean } from "@storybook/addon-knobs";
import React from "react";

import { TransactionDetailModal } from "./TransactionDetailModal";

export default { title: "Domains / Transaction / Components / TransactionDetailModal" };

export const Default = () => (
	<TransactionDetailModal isOpen={boolean("Is Open", true)} onClose={() => alert("closed")} />
);
