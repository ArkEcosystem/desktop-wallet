import React from "react";
import { Badge } from "./Badge";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";

export default {
	title: "Components / Badge",
};

export const Default = () => {
	return (
		<div>
			<div className="text--xs w-64">Parent must have relative class</div>
			<div className="text--xs w-64">Colors, positions, size of badge controled by tailwind classes.</div>
			<div className="my-10">
				<Circle className="border-theme-neutral-200 relative">
					<Badge className="border-theme-neutral-200 -bottom-2 -right-2"></Badge>
				</Circle>
			</div>
			<div className="color--neutral-600 text-sm"></div>
			<div className="mt-3 mb-10">
				<Circle className="border-theme-neutral-200 relative mr-3">
					<Badge className="border-theme-neutral-200 -bottom-2 -right-2"></Badge>
				</Circle>
				<Circle className="border-theme-neutral-200 relative mr-3">
					<Badge className="border-theme-neutral-200 -right-2 -top-2"></Badge>
				</Circle>
				<Circle className="border-theme-neutral-200 relative mr-3">
					<Badge className=" border-theme-neutral-200  -bottom-2 -left-2"></Badge>
				</Circle>
				<Circle className="border-theme-neutral-200 relative mr-3">
					<Badge className="border-theme-neutral-200 -left-2 -top-2"></Badge>
				</Circle>
				<Circle className="border-theme-neutral-200 relative mr-3">
					<Badge className="border-theme-neutral-200 -right-4 top-2"></Badge>
				</Circle>
			</div>
		</div>
	);
};

export const Colored = () => {
	return (
		<div>
			<div className="mb-10">
				<Circle className="border-theme-neutral-200 relative">
					<Badge className="border-theme-neutral-200 -bottom-2 -right-2"></Badge>
				</Circle>
			</div>

			<div className="mt-3 mb-10">
				<Circle className="relative border-theme-success-500 text-white">
					<Badge className="bg-theme-success-500 -top-1 -right-4"></Badge>
				</Circle>
				<Circle className="relative border-theme-warning-500 ml-5 text-white">
					<Badge className="bg-theme-warning-500 -bottom-1 -right-4"></Badge>
				</Circle>
				<Circle className="relative border-theme-primary-500 ml-7 text-white">
					<Badge className="border-theme-primary-500 -top-1 -left-4"></Badge>
				</Circle>
				<Circle className="relative border-theme-danger-400 ml-5 text-white">
					<Badge className="border-theme-danger-400 top-2 -right-4"></Badge>
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
					<Icon name="Ark"></Icon>
					<Badge
						className="-bottom-1 -right-4 bg-theme-success-500 text-theme-success-contrast"
						icon="Checkmark"
					></Badge>
				</Circle>
				<Circle className="relative border-theme-success-500 text-theme-success-500 ml-5">
					<Icon name="Eth"></Icon>
					<Badge
						className="bg-theme-success-500 -bottom-1 -right-4 text-theme-success-contrast"
						icon="Checkmark"
					></Badge>
				</Circle>
				<Circle className="relative border-theme-success-500 text-theme-success-500 ml-5">
					<Icon name="Btc"></Icon>
					<Badge
						className="bg-theme-success-500 -bottom-1 -right-4 text-theme-success-contrast"
						icon="Checkmark"
					></Badge>
				</Circle>
				<Circle className="relative border-theme-neutral-200 ml-5">
					<div className="text-md text-theme-neutral-200 italic">D</div>
					<Badge className="border-theme-neutral-200 -bottom-1 -right-4"></Badge>
				</Circle>
				<Circle className="relative border-theme-neutral-200 ml-5">
					<div className="text-md text-theme-neutral-200 italic">D</div>
					<Badge className="border-theme-neutral-200 -bottom-1 -right-4"></Badge>
				</Circle>
				<Circle className="relative border-theme-primary-100 ml-5">
					<div className="text-xs text-theme-primary-500">All</div>
					<Badge
						className="border-theme-primary-100 -bottom-1 -right-4 text-theme-primary-500"
						icon="ChevronDown"
					></Badge>
				</Circle>
			</div>
		</div>
	);
};
