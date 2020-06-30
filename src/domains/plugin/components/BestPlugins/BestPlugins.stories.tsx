import { boolean } from "@storybook/addon-knobs";
import React from "react";

import { BestPlugins } from "./BestPlugins";

export default { title: "Domains / Plugin / Components / BestPlugins" };

export const Default = () => <BestPlugins isOpen={boolean("Is Open", true)} onClose={() => alert("closed")} />;
