import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import React from "react";

import { Badge } from "./Badge";

export default {
	title: "Components / Badge",
};

export const Default = () => {
	return (
		<div>
			<div className="w-64 text--xs">Parent must have relative class</div>
			<div className="w-64 text--xs">Colors, positions, size of badge controled by tailwind classes.</div>
			<div className="my-10">
				<Circle className="relative border-theme-neutral-200">
					<Badge className="border-theme-neutral-200 -bottom-2 -right-2" />
				</Circle>
			</div>
			<div className="text-sm color--neutral-600" />
			<div className="mt-3 mb-10">
				<Circle className="relative mr-3 border-theme-neutral-200">
					<Badge className="border-theme-neutral-200 -bottom-2 -right-2" />
				</Circle>
				<Circle className="relative mr-3 border-theme-neutral-200">
					<Badge className="border-theme-neutral-200 -right-2 -top-2" />
				</Circle>
				<Circle className="relative mr-3 border-theme-neutral-200">
					<Badge className=" border-theme-neutral-200 -bottom-2 -left-2" />
				</Circle>
				<Circle className="relative mr-3 border-theme-neutral-200">
					<Badge className="border-theme-neutral-200 -left-2 -top-2" />
				</Circle>
				<Circle className="relative mr-3 border-theme-neutral-200">
					<Badge className="border-theme-neutral-200 -right-4 top-2" />
				</Circle>
			</div>
		</div>
	);
};

export const Colored = () => {
	return (
		<div>
			<div className="mb-10">
				<Circle className="relative border-theme-neutral-200">
					<Badge className="border-theme-neutral-200 -bottom-2 -right-2" />
				</Circle>
			</div>

			<div className="mt-3 mb-10">
				<Circle className="relative text-white border-theme-success-500">
					<Badge className="bg-theme-success-500 -top-1 -right-4" />
				</Circle>
				<Circle className="relative ml-5 text-white border-theme-warning-500">
					<Badge className="bg-theme-warning-500 -bottom-1 -right-4" />
				</Circle>
				<Circle className="relative text-white border-theme-primary-500 ml-7">
					<Badge className="border-theme-primary-500 -top-1 -left-4" />
				</Circle>
				<Circle className="relative ml-5 text-white border-theme-danger-400">
					<Badge className="border-theme-danger-400 top-2 -right-4" />
				</Circle>
			</div>
		</div>
	);
};

export const WithIcon = () => {
	return (
		<div>
			<div className="mt-3 mb-10">
				<Circle className="relative border-theme-success-500 text-theme-success-500">
					<Icon name="Ark" />
					<Badge
						className="-bottom-1 -right-4 bg-theme-success-500 text-theme-success-contrast"
						icon="Checkmark"
					/>
				</Circle>
				<Circle className="relative ml-5 border-theme-success-500 text-theme-success-500">
					<Icon name="Eth" />
					<Badge
						className="bg-theme-success-500 -bottom-1 -right-4 text-theme-success-contrast"
						icon="Checkmark"
					/>
				</Circle>
				<Circle className="relative ml-5 border-theme-success-500 text-theme-success-500">
					<Icon name="Btc" />
					<Badge
						className="bg-theme-success-500 -bottom-1 -right-4 text-theme-success-contrast"
						icon="Checkmark"
					/>
				</Circle>
				<Circle className="relative ml-5 border-theme-neutral-200">
					<div className="italic text-md text-theme-neutral-200">D</div>
					<Badge className="border-theme-neutral-200 -bottom-1 -right-4" />
				</Circle>
				<Circle className="relative ml-5 border-theme-neutral-200">
					<div className="italic text-md text-theme-neutral-200">D</div>
					<Badge className="border-theme-neutral-200 -bottom-1 -right-4" />
				</Circle>
				<Circle className="relative ml-5 border-theme-primary-100">
					<div className="text-xs text-theme-primary-500">All</div>
					<Badge
						className="border-theme-primary-100 -bottom-1 -right-4 text-theme-primary-500"
						icon="ChevronDown"
					/>
				</Circle>
			</div>
		</div>
	);
};
