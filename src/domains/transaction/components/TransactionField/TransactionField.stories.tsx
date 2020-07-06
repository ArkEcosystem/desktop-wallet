import { text, withKnobs } from "@storybook/addon-knobs";
import { Icon } from "app/components/Icon";
import React from "react";

import { TransactionField } from "./TransactionField";

export default {
	title: "App / Components / TransactionField",
	decorators: [withKnobs],
};

export const Default = () => (
	<TransactionField label={text("Label", "Label")}>{text("Content", "Content")}</TransactionField>
);

export const MultipleRows = () => (
	<div>
		<TransactionField label={text("Label", "Label")} border={false}>
			{text("Content", "Content")}
		</TransactionField>

		<TransactionField label={text("Label", "Label")} extra={<Icon name="Delegate" width={25} height={25} />}>
			{text("Content", "Content")}
		</TransactionField>

		<TransactionField label={text("Label", "Label")}>{text("Content", "Content")}</TransactionField>
	</div>
);
