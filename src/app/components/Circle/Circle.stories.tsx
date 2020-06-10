import React from "react";
import { Circle } from "./Circle";
import { Icon } from "app/components/Icon";
import { withKnobs, select } from "@storybook/addon-knobs";

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
			<Circle className="border-theme-neutral-200 -mr-2" size={size}></Circle>
			<Circle className="border-theme-neutral-200 -mr-2" size={size}></Circle>

			<div className="mb-5"></div>
			<Circle className="border-theme-neutral-200 -mr-2" size={size}></Circle>
			<Circle className="border-theme-neutral-200 -mr-2" size={size}></Circle>
			<Circle className="border-theme-neutral-200 -mr-2" size={size}></Circle>
			<Circle className="border-theme-neutral-200 -mr-2" size={size}></Circle>
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
			<Circle className="border-theme-neutral-400 -mr-2" size={size}></Circle>
			<Circle className="border-theme-success-light -mr-2" size={size}></Circle>

			<div className="mb-5"></div>
			<Circle className="border-theme-neutral-300 -mr-2" size={size}></Circle>
			<Circle className="border-theme-warning -mr-2" size={size}></Circle>
			<Circle className="border-theme-success-300 -mr-2" size={size}></Circle>
			<Circle className="border-theme-danger-300 -mr-2" size={size}></Circle>
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
			<Circle className="border-theme-neutral-300 -mr-2" size={size}></Circle>
			<Circle avatarId="test" size={size}></Circle>

			<div className="mb-5"></div>
			<Circle avatarId="test" className="-mr-2" size={size}></Circle>
			<Circle className="border-theme-neutral-300 -mr-2" size={size}></Circle>
			<Circle className="border-theme-warning-100 -mr-2" size={size}></Circle>
			<Circle avatarId="test" size={size}></Circle>
		</div>
	);
};

export const WithIcon = () => {
	const size = select("Size", ["small", "default"], "default");
	return (
		<div className="p-5">
			<div className="mb-5"></div>
			<Circle className="border-theme-neutral-600 -mr-2" size={size}>
				<Icon name="Upload" width={16} height={16} />
			</Circle>

			<div className="mb-5"></div>
			<Circle className="border-theme-neutral-800 -mr-2" size={size}>
				<Icon name="Eth" width={16} height={16} />
			</Circle>
			<Circle avatarId="test" className="-mr-2" size={size}></Circle>

			<div className="mb-5"></div>
			<Circle avatarId="test" className="-mr-2" size={size}></Circle>
			<Circle className="border-theme-danger-200 -mr-2" size={size}>
				<Icon name="Ark" />
			</Circle>

			<div className="mb-5"></div>
			<Circle avatarId="test" className="-mr-2" size={size}></Circle>
			<Circle className="border-theme-neutral-800 -mr-2" size={size}>
				<Icon name="Eth" width={16} height={16} />
			</Circle>
			<Circle className="border-theme-danger-200 -mr-2" size={size}>
				<Icon name="Ark" />
			</Circle>
		</div>
	);
};
