import { boolean } from "@storybook/addon-knobs";
import React from "react";

import { VoteDetail } from "./VoteDetail";

export default { title: "Transactions / Components / Vote Detail" };

export const Default = () => <VoteDetail isOpen={boolean("Is Open", true)} onClose={() => alert("closed")} />;
