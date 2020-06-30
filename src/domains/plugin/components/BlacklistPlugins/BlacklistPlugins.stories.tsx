import { boolean } from "@storybook/addon-knobs";
import React from "react";

import { BlacklistPlugins } from "./BlacklistPlugins";

export default { title: "Domains / Plugin / Components / BlacklistPlugins" };

export const Default = () => <BlacklistPlugins isOpen={boolean("Is Open", true)} onClose={() => alert("closed")} />;
