import { boolean } from "@storybook/addon-knobs";
import React from "react";

import { AddBlacklistPlugin } from "./AddBlacklistPlugin";

export default { title: "Domains / Plugin / Components / AddBlacklistPlugin" };

export const Default = () => <AddBlacklistPlugin isOpen={boolean("Is Open", true)} onClose={() => alert("closed")} />;
