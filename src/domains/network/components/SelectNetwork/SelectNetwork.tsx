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
			reset();
			openMenu();
			return;
		}
		selectItem(item);
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
		if (selectedItem) {
			// `network` is the selected item
			if (selectedItem.extra?.displayName === network.extra?.displayName) {
				return "border-theme-success-500 dark:border-theme-success-600 bg-theme-success-100 dark:bg-theme-success-900 text-theme-secondary-600 dark:text-theme-secondary-200";
			}

			return undefined;
		}

		// no input or input matches `network`
		if (!inputValue || isMatch(inputValue, network)) {
			return undefined;
		}

		// input does not match `network`
		return "text-theme-secondary-500 dark:text-theme-secondary-800 border-theme-primary-100 dark:border-theme-secondary-800";
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
						onKeyDown: (event: any) => {
							if (event.key === "Tab" || event.key === "Enter") {
								const firstMatch = items.find((network: Network) => isMatch(inputValue, network));
								if (inputValue && firstMatch) {
									selectItem(firstMatch);
								}

								event.preventDefault();
								return;
							}
						},
					})}
				/>
			</div>

			<div className={publicNetworks.length > 0 ? "mt-6" : ""}>
				{publicNetworks.length > 0 && developmentNetworks.length > 0 && (
					<div className="font-bold text-sm text-theme-secondary-400 dark:text-theme-secondary-700 mb-3">
						{t("COMMON.PUBLIC_NETWORKS").toUpperCase()}
					</div>
				)}

				<ul {...getMenuProps()} className="grid grid-cols-6 gap-3">
					{publicNetworks.map((network: Network, index: number) => (
						<NetworkOption
							key={index}
							network={network}
							iconClassName={optionClassName(network)}
							onClick={() => toggleSelection(network)}
						/>
					))}
				</ul>
			</div>

			{developmentNetworks.length > 0 && (
				<div className="mt-6">
					{publicNetworks.length > 0 && (
						<div className="font-bold text-sm text-theme-secondary-400 dark:text-theme-secondary-700 mb-3">
							{t("COMMON.DEVELOPMENT_NETWORKS").toUpperCase()}
						</div>
					)}

					<ul {...getMenuProps()} className="grid grid-cols-6 gap-3">
						{developmentNetworks.map((network: Network, index: number) => (
							<NetworkOption
								key={index}
								network={network}
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
