import { Checkbox } from "app/components/Checkbox";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { FilterNetworkProps, Network, NetworkOptions, ToggleAllOption } from "./";

export const FilterNetwork = ({
	networks = [],
	className,
	onChange,
	onViewAll,
	hideViewAll,
	title,
}: FilterNetworkProps) => {
	const [networkList, setNetworkList] = useState(networks);
	const [showAll, setShowAll] = useState(false);
	const { t } = useTranslation();

	useEffect(() => setNetworkList(networks), [networks]);

	const handleClick = (network: Network, index: number) => {
		const list = networkList?.concat();

		network.isSelected = !network.isSelected;
		list.splice(index, 1, network);
		setNetworkList(list);

		onChange?.(network, list);
	};

	const handleToggleAll = () => {
		const shouldViewAll = !showAll;
		setShowAll(shouldViewAll);
		const allNetworksSelected = networks.map((network) => ({ ...network, isSelected: true }));
		if (shouldViewAll) {
			onViewAll?.();
			onChange?.(allNetworksSelected[0], allNetworksSelected);
		}
	};

	const handleSelectAll = (checked: any) => {
		const shouldSelectAll = checked && !networkList.every((n) => n.isSelected);
		const allSelected = networkList.concat().map((n) => ({ ...n, isSelected: shouldSelectAll }));
		onChange?.(allSelected[0], allSelected);
	};

	return (
		<div className={className} data-testid="FilterNetwork">
			{title && <div className="mb-3 text-sm font-bold text-theme-secondary-400">{title}</div>}

			<ToggleAllOption isSelected={showAll} isHidden={hideViewAll} onClick={handleToggleAll} />

			<NetworkOptions networks={networkList} onClick={handleClick} />

			{showAll && networkList.length > 1 && (
				<label className="mt-4 inline-flex items-center space-x-3 text-theme-secondary-text cursor-pointer">
					<Checkbox
						data-testid="FilterNetwork__select-all-checkbox"
						checked={networkList.every((n) => n.isSelected)}
						onChange={handleSelectAll}
					/>
					<span>{t("COMMON.SELECT_ALL")}</span>
				</label>
			)}
		</div>
	);
};

export const FilterNetworks = ({ networks = [], ...props }: FilterNetworkProps) => {
	const { t } = useTranslation();

	const { liveNetworks, testNetworks } = useMemo(
		() => ({
			liveNetworks: networks.filter((n) => n.isLive),
			testNetworks: networks.filter((n) => !n.isLive),
		}),
		[networks],
	);

	return (
		<div className="space-y-4">
			{liveNetworks.length > 0 && (
				<FilterNetwork
					{...props}
					title={t("COMMON.PUBLIC_NETWORKS")}
					networks={liveNetworks}
					onChange={(_, updated) => props.onChange?.(_, [...updated, ...testNetworks])}
				/>
			)}
			{props.useTestNetworks && testNetworks.length > 0 && (
				<FilterNetwork
					{...props}
					title={t("COMMON.DEVELOPMENT_NETWORKS")}
					networks={testNetworks}
					onChange={(_, updated) => props.onChange?.(_, [...updated, ...liveNetworks])}
				/>
			)}
		</div>
	);
};

FilterNetworks.defaultProps = {
	hideViewAll: true,
};
