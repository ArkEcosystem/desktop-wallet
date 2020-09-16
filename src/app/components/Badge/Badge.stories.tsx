import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import React from "react";

import { Badge } from "./Badge";

export default {
	title: "App / Components / Badge",
};

export const Default = () => (
	<div>
		<div className="w-64 text--xs">Parent must have relative class</div>
		<div className="w-64 text--xs">Colors, positions, size of badge controled by tailwind classes.</div>

		<div className="mt-5 mb-10 space-x-5">
			<Circle className="relative border-theme-neutral-200">
				<Badge className="border-theme-neutral-200" position="top" />
			</Circle>
			<Circle className="relative border-theme-neutral-200">
				<Badge className="border-theme-neutral-200" position="top-right" />
			</Circle>
			<Circle className="relative border-theme-neutral-200">
				<Badge className=" border-theme-neutral-200" position="right" />
			</Circle>
			<Circle className="relative border-theme-neutral-200">
				<Badge className="border-theme-neutral-200" position="bottom-right" />
			</Circle>
			<Circle className="relative border-theme-neutral-200">
				<Badge className="border-theme-neutral-200" position="bottom" />
			</Circle>
			<Circle className="relative border-theme-neutral-200">
				<Badge className=" border-theme-neutral-200" position="bottom-left" />
			</Circle>
			<Circle className="relative border-theme-neutral-200">
				<Badge className="border-theme-neutral-200" position="left" />
			</Circle>
			<Circle className="relative border-theme-neutral-200">
				<Badge className="border-theme-neutral-200" position="top-left" />
			</Circle>
		</div>
	</div>
);

export const Colored = () => (
	<div className="mt-3 mb-10 space-x-5 text-base">
		<Circle className="relative text-white border-theme-success-500">
			<Badge className="bg-theme-success-500" position="top" />
		</Circle>
		<Circle className="relative text-white border-theme-warning-500">
			<Badge className="bg-theme-warning-500" position="top-right" />
		</Circle>
		<Circle className="relative text-white border-theme-primary-500 ml-7">
			<Badge className="border-theme-primary-500" position="right" />
		</Circle>
		<Circle className="relative text-white border-theme-danger-400">
			<Badge className="border-theme-danger-400" position="bottom-right" />
		</Circle>
		<Circle className="relative text-white border-theme-success-500">
			<Badge className="bg-theme-success-500" position="bottom" />
		</Circle>
		<Circle className="relative text-white border-theme-warning-500">
			<Badge className="bg-theme-warning-500" position="bottom-left" />
		</Circle>
		<Circle className="relative text-white border-theme-primary-500 ml-7">
			<Badge className="border-theme-primary-500" position="left" />
		</Circle>
		<Circle className="relative text-white border-theme-danger-400">
			<Badge className="border-theme-danger-400" position="top-left" />
		</Circle>
	</div>
);

export const WithIcon = () => (
	<div>
		<div className="mt-3 mb-10">
			<Circle className="relative border-theme-success-500 text-theme-success-500">
				<Icon name="ARK" />
				<Badge className="bg-theme-success-500 text-theme-success-contrast" icon="Checkmark" />
			</Circle>
			<Circle className="relative ml-5 border-theme-success-500 text-theme-success-500">
				<Icon name="Ethereum" />
				<Badge className="bg-theme-success-500 text-theme-success-contrast" icon="Checkmark" />
			</Circle>
			<Circle className="relative ml-5 border-theme-success-500 text-theme-success-500">
				<Icon name="Bitcoin" />
				<Badge className="bg-theme-success-500 text-theme-success-contrast" icon="Checkmark" />
			</Circle>
			<Circle className="relative ml-5 border-theme-neutral-200 text-theme-neutral-200">
				<Icon name="Lisk" />
				<Badge className="border-theme-neutral-200" />
			</Circle>
			<Circle className="relative ml-5 border-theme-neutral-200 text-theme-neutral-200">
				<Icon name="Ripple" />
				<Badge className="border-theme-neutral-200" />
			</Circle>
			<Circle className="relative ml-5 border-theme-primary-contrast">
				<div className="text-xs text-theme-primary-500">All</div>
				<Badge
					className="border-theme-primary-contrast text-theme-primary-500"
					icon="ChevronDown"
					iconWidth={10}
					iconHeight={10}
				/>
			</Circle>
		</div>
	</div>
);
