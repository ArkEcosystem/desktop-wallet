import { select, withKnobs } from "@storybook/addon-knobs";
import { Icon } from "app/components/Icon";
import React from "react";

import { Circle } from "./Circle";

export default {
	title: "Components / Circle",
	decorators: [withKnobs],
};

export const Blank = () => {
	const size = select("Size", ["small", "default"], "default");
	return (
		<div className="p-5">
			<div className="mb-5"></div>
			<Circle className="border-theme-neutral-200" size={size}></Circle>

			<div className="mb-5"></div>
			<Circle className="-mr-2 bg-theme-background border-theme-neutral-200" size={size}></Circle>
			<Circle className="-mr-2 bg-theme-background border-theme-neutral-200" size={size}></Circle>

			<div className="mb-5"></div>
			<Circle className="-mr-2 bg-theme-background border-theme-neutral-200" size={size}></Circle>
			<Circle className="-mr-2 bg-theme-background border-theme-neutral-200" size={size}></Circle>
			<Circle className="-mr-2 bg-theme-background border-theme-neutral-200" size={size}></Circle>
			<Circle className="-mr-2 bg-theme-background border-theme-neutral-200" size={size}></Circle>
		</div>
	);
};

export const Colored = () => {
	const size = select("Size", ["small", "default"], "default");
	return (
		<div className="p-5">
			<div className="mb-5"></div>
			<Circle size={size}></Circle>

			<div className="mb-5"></div>
			<Circle className="-mr-2 bg-theme-background border-theme-neutral-400" size={size}></Circle>
			<Circle className="-mr-2 bg-theme-background border-theme-success-light" size={size}></Circle>

			<div className="mb-5"></div>
			<Circle className="-mr-2 bg-theme-background border-theme-neutral-300" size={size}></Circle>
			<Circle className="-mr-2 bg-theme-background border-theme-warning" size={size}></Circle>
			<Circle className="-mr-2 bg-theme-background border-theme-success-300" size={size}></Circle>
			<Circle className="-mr-2 bg-theme-background border-theme-danger-300" size={size}></Circle>
		</div>
	);
};

export const Avatar = () => {
	const size = select("Size", ["small", "default"], "default");
	return (
		<div className="p-5">
			<div className="mb-5"></div>
			<Circle avatarId="test" size={size}></Circle>

			<div className="mb-5"></div>
			<Circle className="-mr-2 bg-theme-background border-theme-neutral-300" size={size}></Circle>
			<Circle avatarId="test" size={size}></Circle>

			<div className="mb-5"></div>
			<Circle avatarId="test" className="-mr-2 bg-theme-background" size={size}></Circle>
			<Circle className="-mr-2 bg-theme-background border-theme-neutral-300" size={size}></Circle>
			<Circle className="-mr-2 bg-theme-background border-theme-warning-100" size={size}></Circle>
			<Circle avatarId="test" size={size}></Circle>
		</div>
	);
};

export const WithIcon = () => {
	const size = select("Size", ["small", "default"], "default");
	return (
		<div className="p-5">
			<div className="mb-5"></div>
			<Circle className="-mr-2 bg-theme-background border-theme-neutral-600" size={size}>
				<Icon name="Upload" width={16} height={16} />
			</Circle>

			<div className="mb-5"></div>
			<Circle className="-mr-2 bg-theme-background border-theme-neutral-800" size={size}>
				<Icon name="Eth" width={16} height={16} />
			</Circle>
			<Circle avatarId="test" className="-mr-2 bg-theme-background" size={size}></Circle>

			<div className="mb-5"></div>
			<Circle avatarId="test" className="-mr-2 bg-theme-background" size={size}></Circle>
			<Circle className="-mr-2 bg-theme-background border-theme-danger-200" size={size}>
				<Icon name="Ark" />
			</Circle>

			<div className="mb-5"></div>
			<Circle avatarId="test" className="-mr-2 bg-theme-background" size={size}></Circle>
			<Circle className="-mr-2 bg-theme-background border-theme-neutral-800" size={size}>
				<Icon name="Eth" width={16} height={16} />
			</Circle>
			<Circle className="-mr-2 bg-theme-background border-theme-danger-200" size={size}>
				<Icon name="Ark" />
			</Circle>
		</div>
	);
};
