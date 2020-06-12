import React from "react";
import { VoteDetail } from "./";
import { boolean } from "@storybook/addon-knobs";

export default { title: "Transaction / Components / Vote Detail" };

export const Default = () => <VoteDetail isOpen={boolean("Is Open", true)} onClose={() => alert("closed")} />;
