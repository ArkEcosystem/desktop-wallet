import { Checkbox } from "app/components/Checkbox";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { FilterNetworkProps, Network, NetworkOptions, ToggleAllOption } from "./";

export const FilterNetwork = ({
	networks = [],
	onChange,
	onViewAll,
	hideViewAll,
	title,
	className,
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
		if (shouldViewAll) onViewAll?.();
	};

	const handleSelectAll = (checked: any) => {
		const shouldSelectAll = checked && !networkList.every((n) => n.isSelected);
		const allSelected = networkList.concat().map((n) => ({ ...n, isSelected: shouldSelectAll }));
		onChange?.(allSelected[0], allSelected);
	};

	return (
		<div className={className} data-testid="FilterNetwork">
			{title && <div className="mb-2 font-bold text-sm text-theme-neutral-400">{title}</div>}

			<ToggleAllOption isSelected={showAll} isHidden={hideViewAll} onClick={handleToggleAll} />
			<NetworkOptions networks={networkList} onClick={handleClick} />

			{showAll && networkList.length > 1 && (
				<div className="mt-4 text-theme-secondary-text cursor-pointer">
					<label>
						<Checkbox
							data-testid="FilterNetwork__select-all-checkbox"
							className="mr-2"
							checked={networkList.every((n) => n.isSelected)}
							onChange={handleSelectAll}
						/>
						{t("COMMON.SELECT_ALL")}
					</label>
				</div>
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
		<div>
			<FilterNetwork
				{...props}
				title={t("COMMON.PUBLIC_NETWORK")}
				networks={liveNetworks}
				onChange={(_, updated) => props.onChange?.(_, [...updated, ...testNetworks])}
			/>
			{props.useTestNetworks && (
				<FilterNetwork
					{...props}
					title={t("COMMON.DEVELOPMENT_NETWORK")}
					className="mt-6"
					networks={testNetworks}
					onChange={(_, updated) => props.onChange?.(_, [...updated, ...liveNetworks])}
				/>
			)}
		</div>
	);
};

FilterNetworks.defaultProps = {
	hideViewAll: false,
};
