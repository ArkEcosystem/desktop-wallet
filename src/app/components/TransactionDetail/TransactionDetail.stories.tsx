import React from "react";
import { TransactionDetail } from "./TransactionDetail";
import { withKnobs, text } from "@storybook/addon-knobs";

import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";

export default {
	title: "Basic / Transaction Detail",
	decorators: [withKnobs],
};

export const Default = () => (
	<TransactionDetail label={text("Label", "Label")}>{text("Content", "Content")}</TransactionDetail>
);

export const WithoutBorder = () => (
	<TransactionDetail label={text("Label", "Label")} border={false}>
		{text("Content", "Content")}
	</TransactionDetail>
);

export const WithExtra = () => (
	<TransactionDetail
		label={text("Label", "Label")}
		extra={
			<div>
				<Circle className="border-black -mr-2">
					<Icon name="Delegate" width={25} height={25} />
				</Circle>
				<Circle avatarId="test"></Circle>
			</div>
		}
	>
		{text("Content", "Content")}
	</TransactionDetail>
);

export const MultipleRows = () => (
	<div>
		<TransactionDetail label={text("Label", "Label")} border={false}>
			{text("Content", "Content")}
		</TransactionDetail>

		<TransactionDetail label={text("Label", "Label")} extra={<Icon name="Delegate" width={25} height={25} />}>
			{text("Content", "Content")}
		</TransactionDetail>

		<TransactionDetail label={text("Label", "Label")}>{text("Content", "Content")}</TransactionDetail>
	</div>
);
