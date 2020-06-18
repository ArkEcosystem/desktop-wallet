import { boolean } from "@storybook/addon-knobs";
import React from "react";

import { SelectDelegateModal } from "./";

export default { title: "Transaction / Components / Select Delegate Modal" };

export const Default = () => <SelectDelegateModal isOpen={boolean("Is Open", true)} onClose={() => alert("closed")} />;

export const Multiple = () => (
	<SelectDelegateModal allowMultiple={true} isOpen={boolean("Is Open", true)} onClose={() => alert("closed")} />
);
