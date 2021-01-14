import { Dropdown } from "app/components/Dropdown";
import { FilterNetwork } from "app/components/FilterNetwork";
import React from "react";

type SearchBarFiltersProps = {
	networks?: any;
	onNetworkChange?: any;
	onViewAllNetworks?: any;
};

export const SearchBarFilters = ({ networks, onNetworkChange, onViewAllNetworks }: SearchBarFiltersProps) => (
	<div data-testid="SearchBarFilters" className="flex relative items-center pr-8 text-theme-primary-400">
		<Dropdown position="left" toggleIcon="Filters">
			<div className="py-8 px-11 w-128">
				<div className="mb-8">
					<div className="mb-3 font-semibold text-theme-secondary-text">Filter Cryptoasset</div>
					<div className="text-sm text-theme-secondary-500">Select the types of cryptoassets</div>
				</div>
				<FilterNetwork networks={networks} onChange={onNetworkChange} onViewAll={onViewAllNetworks} />
			</div>
		</Dropdown>
	</div>
);

SearchBarFilters.defaultProps = {
	networks: [],
};
