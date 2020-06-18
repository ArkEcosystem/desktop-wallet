import { Dropdown } from "app/components/Dropdown";
import { SelectNetwork } from "app/components/SelectNetwork";
import React from "react";

type SearchBarFiltersProps = {
  networks?: any;
  onNetworkChange?: any;
  onViewAllNetworks?: any;
};

export const SearchBarFilters = ({
  networks,
  onNetworkChange,
  onViewAllNetworks,
}: SearchBarFiltersProps) => {
  return (
    <div
      data-testid="SearchBarFilters"
      className="relative flex items-center pl-2 pr-6 my-1 border-r border-theme-neutral-200 text-theme-primary-400"
    >
      <Dropdown position="left" toggleIcon="Filters">
        <div className="py-8 w-128 px-11">
          <div className="mb-4">
            <div className="mb-1 text-sm text-theme-neutral-800">Filter Network</div>
            <div className="text-xs text-theme-neutral-500">Select the types of networks</div>
          </div>
          <SelectNetwork networks={networks} onChange={onNetworkChange} onViewAll={onViewAllNetworks} />
        </div>
      </Dropdown>
    </div>
  );
};

SearchBarFilters.defaultProps = {
  networks: [],
};
