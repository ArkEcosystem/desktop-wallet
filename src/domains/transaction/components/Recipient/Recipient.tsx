// UI Elements
import { Circle } from "app/components/Circle";
import { Label } from "app/components/Label";
import React from "react";

type RecipientProps = {
	address: string;
	amount: string;
	border?: boolean;
	className?: string;
};

export const Recipient = (props: RecipientProps) => (
	<div
		className={`flex justify-between items-center py-4 ${
			!props.border || "border-t border-dashed border-theme-neutral-300"
		} ${props.className}`}
	>
		<div>
			<Circle avatarId="test" size="small"></Circle>

			<span className="ml-4">{props.address}</span>
		</div>

		<Label color="danger">{props.amount}</Label>
	</div>
);

Recipient.defaultProps = {
	className: "",
	border: true,
};
