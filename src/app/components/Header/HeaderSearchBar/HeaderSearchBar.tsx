import { Icon } from "app/components/Icon";
import { Input } from "app/components/Input";
import { clickOutsideHandler, useDebounce } from "app/hooks";
import React, { useEffect, useRef, useState } from "react";
import { styled } from "twin.macro";

type HeaderSearchBarProps = {
	placeholder?: string;
	label?: string;
	children?: React.ReactNode;
	onSearch?: any;
	onReset?: () => void;
	extra?: React.ReactNode;
	debounceTimeout?: number;
};

const SearchBarInputWrapper = styled.div`
	min-width: 24rem;
`;

export const HeaderSearchBar = ({
	placeholder,
	children,
	label,
	onSearch,
	extra,
	onReset,
	debounceTimeout = 500,
}: HeaderSearchBarProps) => {
	const [searchbarVisible, setSearchbarVisible] = useState(false);
	const [query, setQuery] = useState("");

	const ref = useRef(null);
	useEffect(() => clickOutsideHandler(ref, () => setSearchbarVisible(false)), [ref]);

	const debouncedQuery = useDebounce(query, debounceTimeout);
	useEffect(() => onSearch?.(debouncedQuery), [onSearch, debouncedQuery]);

	const handleQueryReset = () => {
		setQuery("");
		onReset?.();
	};

	return (
		<div className="relative">
			{!searchbarVisible && (
				<button
					data-testid="header-search-bar__button"
					className="h-full my-auto font-semibold cursor-pointer text-theme-primary-light"
					onClick={() => setSearchbarVisible(true)}
				>
					{children ? (
						children
					) : (
						<div className="flex items-center space-x-3">
							<span>{label}</span>
							<Icon name="Search" width={20} height={20} />
						</div>
					)}
				</button>
			)}

			{searchbarVisible && (
				<SearchBarInputWrapper
					data-testid="header-search-bar__input"
					ref={ref}
					className="absolute flex items-center px-6 py-4 rounded-md shadow-xl bg-theme-background -bottom-4 -right-6"
				>
					{extra && (
						<div className="flex items-center">
							<div className="ml-2">{extra}</div>
							<div className="h-10 mr-8 border-l border-theme-neutral-300 dark:border-theme-neutral-800" />
						</div>
					)}

					<button data-testid="header-search-bar__reset" onClick={handleQueryReset}>
						<Icon className="text-theme-neutral" name="CrossSlim" width={12} height={12} />
					</button>

					<div className="flex-1 mx-4">
						<Input
							className="pt-2 border-none shadow-none HeaderSearchBar__input"
							placeholder={placeholder}
							value={query}
							onChange={(e) => setQuery((e.target as HTMLInputElement).value)}
						/>
					</div>

					<Icon className="text-theme-neutral" name="Search" width={20} height={20} />
				</SearchBarInputWrapper>
			)}
		</div>
	);
};

HeaderSearchBar.defaultProps = {
	placeholder: "Search...",
	label: "Search",
};
