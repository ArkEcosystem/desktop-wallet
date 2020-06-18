import { boolean } from "@storybook/addon-knobs";
import React from "react";

import { MultiPaymentDetail } from "./MultiPaymentDetail";

export default { title: "Transaction / Components / MultiPayment Detail" };

export const Default = () => <MultiPaymentDetail isOpen={boolean("Is Open", true)} onClose={() => alert("closed")} />;
