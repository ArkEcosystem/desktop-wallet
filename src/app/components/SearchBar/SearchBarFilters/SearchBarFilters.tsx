import { Dropdown } from "app/components/Dropdown";
import { FilterNetwork } from "app/components/FilterNetwork";
import React from "react";

type SearchBarFiltersProps = {
	networks?: any;
	onNetworkChange?: any;
	onViewAllNetworks?: any;
};

export const SearchBarFilters = ({ networks, onNetworkChange, onViewAllNetworks }: SearchBarFiltersProps) => {
	return (
		<div data-testid="SearchBarFilters" className="relative flex items-center pr-8 text-theme-primary-400">
			<Dropdown position="left" toggleIcon="Filters">
				<div className="py-8 w-128 px-11">
					<div className="mb-8">
						<div className="mb-3 font-semibold text-theme-neutral-dark">Filter Network</div>
						<div className="text-sm text-theme-neutral">Select the types of networks</div>
					</div>
					<FilterNetwork networks={networks} onChange={onNetworkChange} onViewAll={onViewAllNetworks} />
				</div>
			</Dropdown>
		</div>
	);
};

SearchBarFilters.defaultProps = {
	networks: [],
};
