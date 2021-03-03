import { Coins } from "@arkecosystem/platform-sdk";
import { NetworkOption } from "domains/network/components/NetworkOption";
import { CoinNetworkExtended } from "domains/network/data";
import { getNetworkExtendedData } from "domains/network/helpers";
import { useCombobox } from "downshift";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { SelectNetworkInput } from "./SelectNetworkInput";

type Network = Coins.Network & { extra?: CoinNetworkExtended };

type SelectNetworkProps = {
	selected?: Coins.Network;
	networks: Coins.Network[];
	placeholder?: string;
	name?: string;
	value?: string;
	id?: string;
	disabled?: boolean;
	onSelect?: (network?: Coins.Network | null) => void;
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
	const { t } = useTranslation();
	const [items, setItems] = useState<Network[]>([]);

	const extendedItems = useMemo(
		() =>
			networks.map((network) => {
				const extended = getNetworkExtendedData({ coin: network.coin(), network: network.id() });
				return Object.assign(network, { extra: extended });
			}),
		[networks],
	);

	useEffect(() => {
		setItems(extendedItems);
	}, [networks, extendedItems]);

	const isMatch = (inputValue: string, network: Network) =>
		inputValue && network.extra?.displayName?.toLowerCase().startsWith(inputValue.toLowerCase());

	const {
		closeMenu,
		openMenu,
		getComboboxProps,
		getLabelProps,
		getInputProps,
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
	}, [selectItem, selected, disabled]);

	const toggleSelection = (item: Network) => {
		if (item.id() === selectedItem?.id()) {
			setTimeout(() => {
				reset();
				openMenu();
			}, 0);
			return;
		}
		selectItem(item);
		closeMenu();
	};

	const publicNetworks = items.filter((network) => network.isLive());
	const developmentNetworks = items.filter((network) => !network.isLive());

	const inputTypeAhead = React.useMemo(() => {
		const matches = items.filter((network: Network) => isMatch(inputValue, network));
		if (inputValue && matches.length > 0) {
			return [inputValue, matches[0].extra?.displayName?.slice(inputValue.length)].join("");
		}
	}, [items, inputValue]);

	const optionClassName = (network: Network) => {
		// Selected is me. Show me green
		if (selectedItem && selectedItem.extra?.displayName === network.extra?.displayName) {
			return "border-theme-success-400 bg-theme-success-100 text-theme-secondary-600";
		}

		// Selection is made but not me. Show me disabled
		/* istanbul ignore next */
		if (selectedItem && selectedItem.extra?.displayName !== network.extra?.displayName) {
			return "text-theme-secondary-300";
		}

		// Initial state. Nothing entered, nothing selected
		if (!inputValue) {
			return undefined;
		}

		// Input entered, matching with input. Show normal colors
		if (isMatch(inputValue, network)) {
			return undefined;
		}

		// Disabled otherwise
		return "text-theme-secondary-300";
	};

	return (
		<div>
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
							const firstMatch = items.find((network: Network) => isMatch(inputValue, network));
							if (inputValue && firstMatch) {
								selectItem(firstMatch);
							} else {
								reset();
							}
						},
						onKeyDown: (event: any) => {
							if (event.key === "Tab" || event.key === "Enter") {
								// Select first match
								const firstMatch = items.find((network: Network) => isMatch(inputValue, network));
								if (inputValue && firstMatch) {
									selectItem(firstMatch);
									if (event.key === "Enter") {
										closeMenu();
									}
								}
								event.preventDefault();
								return;
							}
						},
					})}
				/>
			</div>

			{publicNetworks.length > 0 && (
				<div className="mt-8">
					{developmentNetworks.length > 0 && (
						<div className="font-bold text-sm text-theme-secondary-400 mb-4">
							{t("COMMON.PUBLIC_NETWORK").toUpperCase()}
						</div>
					)}

					<ul {...getMenuProps()} className="grid grid-cols-6 gap-3">
						{publicNetworks.map((network: Network, index: number) => (
							<NetworkOption
								key={index}
								network={network}
								// disabled={disabled}
								iconClassName={optionClassName(network)}
								onClick={() => toggleSelection(network)}
							/>
						))}
					</ul>
				</div>
			)}

			{developmentNetworks.length > 0 && (
				<div className="mt-8">
					{publicNetworks.length > 0 && (
						<div className="font-bold text-sm text-theme-secondary-400 mb-4">
							{t("COMMON.DEVELOPMENT_NETWORK").toUpperCase()}
						</div>
					)}

					<ul {...getMenuProps()} className="grid grid-cols-6 gap-3">
						{developmentNetworks.map((network: Network, index: number) => (
							<NetworkOption
								key={index}
								network={network}
								// disabled={disabled}
								iconClassName={optionClassName(network)}
								onClick={() => toggleSelection(network)}
							/>
						))}
					</ul>
				</div>
			)}
		</div>
	);
};

SelectNetwork.defaultProps = {
	networks: [],
	placeholder: "Enter a cryptoasset name",
	disabled: false,
};
