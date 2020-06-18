import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import React from "react";

import { SelectDropdown } from "./SelectDropdown";

export default {
	title: "Components / SelectDropdown",
};

export const Simple = () => {
	const options = [
		{
			label: "Option 1",
			value: "1",
		},
		{
			label: "Option 2",
			value: "2",
		},
		{
			label: "Option 3",
			value: "3",
		},
	];

	return (
		<div className="">
			<div className="mt-10 w-128">
				<SelectDropdown
					onSelect={() => console.log("selected")}
					option={(option: any) => {
						return (
							<div className="p-2 border-b border-theme-neutral-200 hover:bg-theme-neutral-100">
								{option.label}
							</div>
						);
					}}
					toggle={(selected: any) => {
						if (selected) {
							return (
								<div className="flex flex-inline items-center">
									<div>{selected.label}</div>
								</div>
							);
						}
						return (
							<div className="flex flex-inline items-center">
								<div className="text-theme-neutral-800 font-semibold">Select Option</div>
							</div>
						);
					}}
					options={options}
				></SelectDropdown>
			</div>
		</div>
	);
};
export const SelectNetwork = () => {
	const options = [
		{
			label: "Ark Ecosystem",
			value: "ark",
			icon: "Ark",
		},
		{
			label: "Bitcoin",
			value: "btc",
			icon: "Btc",
		},
		{
			label: "Ethereum",
			value: "eth",
			icon: "Eth",
		},
	];

	return (
		<div className="">
			<div className="mt-10 w-128">
				<SelectDropdown
					options={options}
					option={(option: any) => {
						return (
							<div className="p-6 border-b border-theme-neutral-200 hover:bg-theme-neutral-100">
								<div className="flex flex-inline items-center">
									<Circle size="small" noShadow>
										<Icon name={option.icon} width={18} height={18} />
									</Circle>
									<div className="text-theme-neutral-800 font-semibold ml-4">{option.label}</div>
								</div>
							</div>
						);
					}}
					toggle={(selected: any) => {
						if (selected) {
							return (
								<div className="flex flex-inline items-center">
									<Circle size="small" noShadow>
										<Icon name={selected.icon} width={18} height={18} />
									</Circle>
									<div className="text-theme-neutral-800 font-semibold ml-4">{selected.label}</div>
								</div>
							);
						}
						return (
							<div className="flex flex-inline items-center">
								<Circle size="small" noShadow></Circle>
								<div className="text-theme-neutral-800 font-semibold ml-4"></div>
							</div>
						);
					}}
				></SelectDropdown>
			</div>
		</div>
	);
};
