import Tippy from "@tippyjs/react";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import Downshift from "downshift";
import React from "react";

type Network = {
	icon: string;
	name: string;
	className?: string;
};

type SelectAssetProps = {
	networks: Network[];
	placeholder?: string;
	name?: string;
	value?: string;
	onSelect?: (network: any) => void;
};

type InputValue = any;

const IconPlaceholder = ({ icon, className, name }: Network) => {
	if (!icon) return <Circle size="sm" noShadow className="border-theme-neutral-200" />;
	return (
		<Circle className={className} size="sm" data-testid={`select-asset__selected-${name}`}>
			<Icon name={icon} width={16} height={16} />
		</Circle>
	);
};

const TypeAhead = ({ input, matches }: any) => {
	const formatTypeHeadToMatchInputCase = (network: Network, input: InputValue) => {
		return [input, network?.name.slice(input.length)].join("");
	};

	const typeaheadFormatted = matches.length === 1 ? formatTypeHeadToMatchInputCase(matches[0], input) : "";

	return (
		<div className="relative z-10 w-full" data-testid={`select-network__typeahead-${typeaheadFormatted}`}>
			<div className="absolute left-0 font-semibold top-2 text-theme-neutral-400">{typeaheadFormatted}</div>
		</div>
	);
};

export const SelectAsset = ({ networks, placeholder, onSelect, name }: SelectAssetProps) => {
	const isMatch = (network: Network, input: InputValue) => {
		if (!input) return false;
		return network.name.toLowerCase().startsWith(input.toLowerCase());
	};

	const getMatches = (networks: Network[], input: InputValue) => {
		return networks.filter((network: Network) => isMatch(network, input));
	};

	const assetClassName = (network: Network, selectedAsset: Network, input: any) => {
		// Selected is me. Show me green
		if (selectedAsset && selectedAsset.name === network.name) {
			return "text-theme-success-500 border-theme-success-200";
		}
		// Selection is made but not me. Show me disabled
		if (selectedAsset && selectedAsset.name !== network.name) return "text-theme-neutral-400";

		// Initial state. Nothing entered, nothing selected
		if (!input) return network.className;

		// Input entered, matching with input. Show normal colors
		if (isMatch(network, input)) return network.className;

		// Disabled otherwise
		return "text-theme-neutral-400";
	};

	return (
		<Downshift itemToString={(i) => i?.name} onSelect={onSelect}>
			{({
				getLabelProps,
				getInputProps,
				getItemProps,
				getMenuProps,
				selectItem,
				inputValue,
				selectedItem,
				clearSelection,
			}) => (
				<div className="relative">
					<label {...getLabelProps()} />
					<div className="relative flex items-center w-full flex-inline">
						<div className="flex w-full border rounded transition-colors duration-200 shadow-sm bg-theme-background border-theme-neutral-300 hover:outline-none hover:border-theme-primary">
							<div className="px-4 py-2 flex-0 w-14">
								<IconPlaceholder {...selectedItem} />
							</div>
							<div className="relative flex-1 p-1 font-semibold text-theme-neutral-800">
								<TypeAhead input={inputValue} matches={getMatches(networks, inputValue)} />
								<input
									name={name}
									{...getInputProps({
										value: inputValue || "",
										placeholder,
										onKeyDown: (event: any) => {
											if (event.key === "Tab" || event.key === "Enter") {
												// Selected if exact match
												const matches = getMatches(networks, inputValue);
												if (matches.length === 1) {
													selectItem(matches[0]);
												}
												event.preventDefault();
												return;
											}

											// Clear selection when user is changing input,
											// and input does is not exact match with previously selected item
											if (selectedItem && selectedItem.name !== inputValue) {
												clearSelection();
											}
										},
									})}
									data-testid="select-asset__input"
									className="relative z-20 w-full h-full font-semibold bg-transparent outline-none"
								/>
							</div>
						</div>
					</div>
					{networks && networks.length > 0 && (
						<div data-testid="select-asset__items" className="select-asset__items" {...getMenuProps()}>
							{networks.map((network: Network, index: number) => {
								return (
									<div
										key={index}
										className="inline-block pt-6 mr-6 cursor-pointer"
										{...getItemProps({ item: network })}
									>
										<Tippy content={network.name}>
											<Circle
												className={assetClassName(network, selectedItem, inputValue)}
												size="xl"
											>
												<Icon name={network.icon} width={26} height={26} />
											</Circle>
										</Tippy>
									</div>
								);
							})}
						</div>
					)}
				</div>
			)}
		</Downshift>
	);
};

SelectAsset.defaultProps = {
	networks: [],
	placeholder: "Enter a network name",
};
