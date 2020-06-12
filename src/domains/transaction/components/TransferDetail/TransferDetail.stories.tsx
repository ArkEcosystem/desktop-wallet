import React from "react";
import { TransferDetail } from "./";
import { boolean } from "@storybook/addon-knobs";

export default { title: "Transaction / Components / Transfer Detail" };

export const Default = () => <TransferDetail isOpen={boolean("Is Open", true)} onClose={() => alert("closed")} />;
