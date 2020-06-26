import { Icon } from "app/components/Icon";
import { Input } from "app/components/Input";
import { clickOutsideHandler, useDebounce } from "app/hooks";
import React, { useEffect, useRef, useState } from "react";

type HeaderSearchBarProps = {
	children?: React.ReactNode;
	onSearch?: any;
};

export const HeaderSearchBar = ({ children, onSearch }: HeaderSearchBarProps) => {
	const [searchbarVisible, setSearchbarVisible] = useState(false);
	const [query, setQuery] = useState("");

	const debouncedQuery = useDebounce(query, 500);

	const ref = useRef(null);

	useEffect(() => clickOutsideHandler(ref, () => setSearchbarVisible(false)), [ref]);

	useEffect(() => {
		if (debouncedQuery) {
			onSearch(debouncedQuery);
		}
	}, [debouncedQuery]);

	const resetQuery = () => {
		setQuery("");
	};

	return (
		<>
			{!searchbarVisible && (
				<button
					data-testid="header-search-bar__button"
					className="my-auto font-semibold cursor-pointer text-theme-primary-200"
					onClick={() => setSearchbarVisible(true)}
				>
					{children ? (
						children
					) : (
						<div className="flex items-center space-x-3">
							<span>Search</span>
							<Icon name="Search" width={20} height={20} />
						</div>
					)}
				</button>
			)}

			{searchbarVisible && (
				<div
					data-testid="header-search-bar__input"
					ref={ref}
					className="flex items-center w-full px-6 py-4 bg-white shadow-xl rounded-md"
				>
					<button data-testid="header-search-bar__reset" onClick={resetQuery}>
						<Icon className="text-theme-neutral-500" name="CrossSlim" width={12} height={12} />
					</button>

					<div className="flex-1 mx-4">
						<Input
							className="border-none shadow-none"
							placeholder="Search..."
							value={query}
							onChange={(e) => setQuery((e.target as HTMLInputElement).value)}
						/>
					</div>

					<Icon className="text-theme-neutral-500" name="Search" width={20} height={20} />
				</div>
			)}
		</>
	);
};
