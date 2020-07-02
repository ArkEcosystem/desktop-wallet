import { boolean, select, withKnobs } from "@storybook/addon-knobs";
import { Icon } from "app/components/Icon";
import React from "react";
import { Size } from "types";

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

export const Default = () => {
	const color = select("Color", ["primary", "success", "danger", "warning"], "primary");
	const size = select("Size", sizeOptions, undefined);
	const disabled = boolean("Disabled", false);
	const variants: {
		[variant: string]: string;
	} = {
		solid: "Solid",
		plain: "Plain",
		outline: "Outline",
	};

	return (
		<div className="space-x-4">
			{Object.keys(variants).map((key: string) => (
				<Button
					key={key}
					variant={key as "solid" | "plain" | "outline" | undefined}
					color={color}
					size={size as Size}
					disabled={disabled}
				>
					{variants[key]}
				</Button>
			))}
		</div>
	);
};

export const WithIcon = () => {
	const color = select("Color", ["primary", "success", "danger", "warning"], "primary");
	const size = select("Size", sizeOptions, undefined);
	const disabled = boolean("Disabled", false);
	const variants: {
		[variant: string]: string;
	} = {
		solid: "Solid",
		plain: "Plain",
		outline: "Outline",
	};

	return (
		<div className="space-x-4">
			{Object.keys(variants).map((key) => (
				<Button
					key={key}
					variant={key as "solid" | "plain" | "outline" | undefined}
					color={color}
					size={size as Size}
					disabled={disabled}
				>
					<Icon name="Download" />
					<span>{variants[key]}</span>
				</Button>
			))}
		</div>
	);
};
