import { NetworkData } from "@arkecosystem/platform-sdk-profiles";
import { NetworkIcon } from "domains/network/components/NetworkIcon";
import { CoinNetworkExtended } from "domains/network/data";
import { getNetworkExtendedData } from "domains/network/helpers";
import { useCombobox } from "downshift";
import React, { useEffect } from "react";

import { SelectNetworkInput } from "./SelectNetworkInput";

type Network = NetworkData & { extra?: CoinNetworkExtended };

type SelectNetworkProps = {
	selected?: NetworkData;
	networks: NetworkData[];
	placeholder?: string;
	name?: string;
	value?: string;
	id?: string;
	disabled?: boolean;
	onSelect?: (network?: NetworkData | null) => void;
};

export const itemToString = (item: Network | null) => item?.extra?.displayName || "";

export const SelectNetwork = ({
	networks,
	placeholder,
	onSelect,
	name,
	id,
	disabled,
	selected,
}: SelectNetworkProps) => {
	const [items] = React.useState(() =>
		networks.map((network) => {
			const extended = getNetworkExtendedData({ coin: network.coin(), network: network.id() });
			return Object.assign(network, { extra: extended });
		}),
	);

	const {
		isOpen,
		closeMenu,
		openMenu,
		getComboboxProps,
		getLabelProps,
		getInputProps,
		getItemProps,
		getMenuProps,
		selectItem,
		selectedItem,
		inputValue,
		reset,
	} = useCombobox<Network | null>({
		id,
		items,
		itemToString,
		onSelectedItemChange: ({ selectedItem }) => onSelect?.(selectedItem),
		onInputValueChange: ({ inputValue, selectedItem }) => {
			// Clear selection when user is changing input,
			// and input does not match previously selected item
			if (selectedItem && selectedItem.extra?.displayName !== inputValue) {
				reset();
			}
		},
	});

	useEffect(() => {
		selectItem(selected || null);
	}, [selectItem, selected]);

	const isMatch = React.useCallback(
		(network: Network) => {
			if (!inputValue) return false;
			return network.extra?.displayName?.toLowerCase().startsWith(inputValue.toLowerCase().trim());
		},
		[inputValue],
	);

	const inputMatches = React.useMemo(() => items.filter((network) => isMatch(network)), [items, isMatch]);

	const inputTypeAhead = React.useMemo(() => {
		if (inputMatches.length === 1) {
			return [inputValue, inputMatches[0].extra?.displayName?.slice(inputValue.length)].join("");
		}
	}, [inputMatches, inputValue]);

	const assetClassName = (network: Network) => {
		// Selected is me. Show me green
		if (selectedItem && selectedItem.extra?.displayName === network.extra?.displayName) {
			return "text-theme-success-500 border-theme-success-200";
		}
		// Selection is made but not me. Show me disabled
		if (selectedItem && selectedItem.extra?.displayName !== network.extra?.displayName)
			return "text-theme-neutral-light";

		// Initial state. Nothing entered, nothing selected
		if (!inputValue) return undefined;

		// Input entered, matching with input. Show normal colors
		if (isMatch(network)) return undefined;

		// Disabled otherwise
		return "text-theme-neutral-light";
	};

	return (
		<>
			<div data-testid="SelectNetwork" {...getComboboxProps()}>
				<label {...getLabelProps()} />
				<SelectNetworkInput
					network={selectedItem}
					suggestion={inputTypeAhead}
					disabled={disabled}
					{...getInputProps({
						name,
						placeholder,
						onFocus: openMenu,
						onBlur: () => {
							if (inputMatches.length > 0) {
								selectItem(inputMatches[0]);
								closeMenu();
							} else {
								reset();
							}
						},
						onKeyDown: (event: any) => {
							if (event.key === "Tab" || event.key === "Enter") {
								// Select first match
								if (inputMatches.length > 0) {
									selectItem(inputMatches[0]);
									closeMenu();
								}
								event.preventDefault();
								return;
							}
						},
					})}
				/>
			</div>
			<ul {...getMenuProps()} className={isOpen ? "grid grid-cols-6 gap-6 mt-6" : "hidden"}>
				{isOpen &&
					items.map((item, index) => (
						<li
							data-testid="SelectNetwork__NetworkIcon--container"
							key={index}
							className="inline-block cursor-pointer"
							{...getItemProps({
								item,
								index,
								disabled,
								onMouseDown: () => selectItem(item),
							})}
						>
							<NetworkIcon
								coin={item.coin()}
								network={item.id()}
								size="xl"
								iconSize={26}
								className={assetClassName(item)}
								noShadow
							/>
						</li>
					))}
			</ul>
		</>
	);
};

SelectNetwork.defaultProps = {
	networks: [],
	placeholder: "Enter a network name",
	disabled: false,
};
