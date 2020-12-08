import { boolean, select, withKnobs } from "@storybook/addon-knobs";
import { Icon } from "app/components/Icon";
import React from "react";
import { ButtonVariant, Size } from "types";

import { Button } from "./Button";

export default {
	title: "App / Components / Button",
	decorators: [withKnobs],
};

const sizeOptions: Record<string, Size | undefined> = {
	small: "sm",
	default: undefined,
	large: "lg",
	icon: "icon",
};

const variants: ButtonVariant[] = ["primary", "secondary", "danger", "transparent"];

export const Default = () => {
	const size = select("Size", sizeOptions, undefined);
	const disabled = boolean("Disabled", false);

	return (
		<div className="space-x-4">
			{variants.map((variant: ButtonVariant) => (
				<Button key={variant} variant={variant} size={size} disabled={disabled}>
					<span className="capitalize">{variant}</span>
				</Button>
			))}
		</div>
	);
};

export const WithIcon = () => {
	const size = select("Size", sizeOptions, undefined);
	const disabled = boolean("Disabled", false);

	return (
		<div className="space-x-4 capitalize">
			{variants.map((variant: ButtonVariant) => (
				<Button key={variant} variant={variant} size={size} disabled={disabled}>
					<Icon name="Download" />
					<span className="capitalize">{variant}</span>
				</Button>
			))}
		</div>
	);
};
