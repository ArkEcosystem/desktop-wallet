import { boolean } from "@storybook/addon-knobs";
import React from "react";

import { AddExchange } from "./AddExchange";

export default { title: "Exchange / Components / Add Exchange" };

export const Default = () => <AddExchange isOpen={boolean("Is Open", true)} onClose={() => alert("closed")} />;
