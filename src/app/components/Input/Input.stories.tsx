import React from "react";
import { Input } from "./Input";
import { SvgIcon } from "../SvgIcon";

export default {
	title: "Components / Input",
};

export const Text = () => (
	<div className="p-4">
		<Input label="Input" type="text" error="" />
	</div>
);

export const TextWithError = () => (
	<div className="p-4">
		<Input label="Input" type="text" error="This field is required" />
	</div>
);

export const TextWithIcon = () => {
	const innerSlot = (
		<button className="text-theme-neutral-600 w-full">
			<SvgIcon name="qrcode" />
		</button>
	);

	return (
		<div className="p-4">
			<Input label="Input" type="text" error="" innerSlot={innerSlot} />
		</div>
	);
};
