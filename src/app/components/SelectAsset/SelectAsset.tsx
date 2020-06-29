import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import Downshift from "downshift";
import React from "react";

type Asset = {
	icon: string;
	name: string;
	className?: string;
};

type SelectAssetProps = {
	assets: Asset[];
	placeholder?: string;
	name?: string;
	value?: string;
	onSelect?: () => void;
};

type InputValue = any;

const AssetIconPlaceholder = ({ icon, className, name }: Asset) => {
	if (!icon) return <Circle size="small" noShadow className="border-theme-neutral-200" />;
	return (
		<Circle className={className} size="small" data-testid={`select-asset__selected-${name}`}>
			<Icon name={icon} width={16} height={16} />
		</Circle>
	);
};

const TypeAhead = ({ input, matches }: any) => {
	const formatTypeHeadToMatchInputCase = (asset: Asset, input: InputValue) => {
		return [input, asset?.name.slice(input.length)].join("");
	};

	const typeaheadFormatted = matches.length === 1 ? formatTypeHeadToMatchInputCase(matches[0], input) : "";

	return (
		<div className="relative z-10 w-full" data-testid={`select-network__typeahead-${typeaheadFormatted}`}>
			<div className="absolute left-0 font-semibold top-2 text-theme-neutral-400">{typeaheadFormatted}</div>
		</div>
	);
};

export const SelectAsset = ({ assets, placeholder, onSelect, name }: SelectAssetProps) => {
	const isMatch = (asset: Asset, input: InputValue) => {
		if (!input) return false;
		return asset.name.toLowerCase().startsWith(input.toLowerCase());
	};

	const getMatches = (assets: Asset[], input: InputValue) => {
		return assets.filter((asset: Asset) => isMatch(asset, input));
	};

	const assetClassName = (asset: Asset, selectedAsset: Asset, input: any) => {
		// Selected is me. Show me green
		if (selectedAsset && selectedAsset.name === asset.name) {
			return "text-theme-success-500 border-theme-success-200";
		}
		// Selection is made but not me. Show me disabled
		if (selectedAsset && selectedAsset.name !== asset.name) return "text-theme-neutral-400";

		// Initial state. Nothing entered, nothing selected
		if (!input) return asset.className;

		// Input entered, matching with input. Show normal colors
		if (isMatch(asset, input)) return asset.className;

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
						<div className="flex w-full border rounded shadow-sm bg-theme-background border-theme-neutral-300 transition-colors duration-200 hover:outline-none hover:border-theme-primary">
							<div className="px-4 py-2 flex-0 w-14">
								<AssetIconPlaceholder {...selectedItem} />
							</div>
							<div className="relative flex-1 p-1 font-semibold text-theme-neutral-800">
								<TypeAhead input={inputValue} matches={getMatches(assets, inputValue)} />
								<input
									name={name}
									{...getInputProps({
										value: inputValue || "",
										placeholder,
										onKeyDown: (event: any) => {
											if (event.key === "Tab" || event.key === "Enter") {
												// Selected if exact match
												const matches = getMatches(assets, inputValue);
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
					{assets && assets.length > 0 && (
						<div data-testid="select-asset__items" className="pt-6" {...getMenuProps()}>
							{assets.map((asset: Asset, index: number) => {
								return (
									<div
										title={asset.name}
										className="inline-block mr-4 cursor-pointer"
										key={index}
										{...getItemProps({ item: asset })}
									>
										<Circle
											className={assetClassName(asset, selectedItem, inputValue)}
											size="large"
										>
											<Icon name={asset.icon} width={18} height={18} />
										</Circle>
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
	assets: [],
	placeholder: "Enter a network name",
};
