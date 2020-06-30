import { boolean } from "@storybook/addon-knobs";
import React from "react";

import { VoteDetail } from "./VoteDetail";

export default { title: "Domains / Transaction / Components / VoteDetail" };

export const Default = () => <VoteDetail isOpen={boolean("Is Open", true)} onClose={() => alert("closed")} />;
