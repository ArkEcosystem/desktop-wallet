import { select, withKnobs } from "@storybook/addon-knobs";
import { Icon } from "app/components/Icon";
import React from "react";
import { Size } from "types";

import { Circle } from "./Circle";

export default {
	title: "App / Components / Circle",
	decorators: [withKnobs],
};

const sizeOptions: Record<string, Size | undefined> = {
	small: "sm",
	default: undefined,
	large: "lg",
	"extra large": "xl",
};

export const Blank = () => {
	const size = select("Size", sizeOptions, undefined);

	return (
		<div className="p-5">
			<div className="mb-5" />
			<Circle className="border-theme-neutral-200" size={size} />

			<div className="mb-5" />
			<Circle className="-mr-2 bg-theme-background border-theme-neutral-200" size={size} />
			<Circle className="-mr-2 bg-theme-background border-theme-neutral-200" size={size} />

			<div className="mb-5" />
			<Circle className="-mr-2 bg-theme-background border-theme-neutral-200" size={size} />
			<Circle className="-mr-2 bg-theme-background border-theme-neutral-200" size={size} />
			<Circle className="-mr-2 bg-theme-background border-theme-neutral-200" size={size} />
			<Circle className="-mr-2 bg-theme-background border-theme-neutral-200" size={size} />
		</div>
	);
};

export const Colored = () => {
	const size = select("Size", sizeOptions, undefined);
	return (
		<div className="p-5">
			<div className="mb-5" />
			<Circle size={size} />

			<div className="mb-5" />
			<Circle className="-mr-2 bg-theme-background border-theme-neutral-light" size={size} />
			<Circle className="-mr-2 bg-theme-background border-theme-success-light" size={size} />

			<div className="mb-5" />
			<Circle className="-mr-2 bg-theme-background border-theme-neutral-300" size={size} />
			<Circle className="-mr-2 bg-theme-background border-theme-warning" size={size} />
			<Circle className="-mr-2 bg-theme-background border-theme-success-300" size={size} />
			<Circle className="-mr-2 bg-theme-background border-theme-danger-300" size={size} />
		</div>
	);
};

export const Avatar = () => {
	const size = select("Size", sizeOptions, undefined);
	return (
		<div className="p-5">
			<div className="mb-5" />
			<Circle avatarId="test" size={size} />

			<div className="mb-5" />
			<Circle className="-mr-2 bg-theme-background border-theme-neutral-300" size={size} />
			<Circle avatarId="test" size={size} />

			<div className="mb-5" />
			<Circle avatarId="test" className="-mr-2 bg-theme-background" size={size} />
			<Circle className="-mr-2 bg-theme-background border-theme-neutral-300" size={size} />
			<Circle className="-mr-2 bg-theme-background border-theme-warning-contrast" size={size} />
			<Circle avatarId="test" size={size} />
		</div>
	);
};

export const WithIcon = () => {
	const size = select("Size", sizeOptions, undefined);
	return (
		<div className="p-5">
			<div className="mb-5" />
			<Circle className="-mr-2 bg-theme-background border-theme-neutral-600" size={size}>
				<Icon name="Upload" width={16} height={16} />
			</Circle>

			<div className="mb-5" />
			<Circle className="-mr-2 bg-theme-background border-theme-neutral-800" size={size}>
				<Icon name="ETH" width={16} height={16} />
			</Circle>
			<Circle avatarId="test" className="-mr-2 bg-theme-background" size={size} />

			<div className="mb-5" />
			<Circle avatarId="test" className="-mr-2 bg-theme-background" size={size} />
			<Circle className="-mr-2 bg-theme-background border-theme-danger-light" size={size}>
				<Icon name="ARK" />
			</Circle>

			<div className="mb-5" />
			<Circle avatarId="test" className="-mr-2 bg-theme-background" size={size} />
			<Circle className="-mr-2 bg-theme-background border-theme-neutral-800" size={size}>
				<Icon name="ETH" width={16} height={16} />
			</Circle>
			<Circle className="-mr-2 bg-theme-background border-theme-danger-light" size={size}>
				<Icon name="ARK" />
			</Circle>
		</div>
	);
};
