import { text, withKnobs } from "@storybook/addon-knobs";
import { Avatar } from "app/components/Avatar";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import React from "react";

import { TransactionDetail } from "./TransactionDetail";

export default {
	title: "App / Components / TransactionDetail",
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
				<div className="flex">
					<Circle className="-mr-2 border-black">
						<Icon name="Delegate" width={25} height={25} />
					</Circle>
					<Avatar address="test" />
				</div>
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
