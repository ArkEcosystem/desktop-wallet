import { Icon } from "app/components/Icon";
import { Input } from "app/components/Input";
import { clickOutsideHandler, useDebounce } from "app/hooks";
import React, { useEffect, useRef, useState } from "react";
import { styled } from "twin.macro";

type HeaderSearchBarProps = {
	offsetClassName?: string;
	placeholder?: string;
	label?: string;
	children?: React.ReactNode;
	onSearch?: (query: string) => void;
	onReset?: () => void;
	extra?: React.ReactNode;
	debounceTimeout?: number;
	defaultQuery?: string;
};

const SearchBarInputWrapper = styled.div`
	min-width: 28rem;
`;

export const HeaderSearchBar = ({
	offsetClassName,
	placeholder,
	children,
	label,
	onSearch,
	extra,
	onReset,
	defaultQuery = "",
	debounceTimeout = 500,
}: HeaderSearchBarProps) => {
	const [searchbarVisible, setSearchbarVisible] = useState(false);
	const [query, setQuery] = useState(defaultQuery);

	const ref = useRef(null);
	useEffect(() => clickOutsideHandler(ref, () => setSearchbarVisible(false)), [ref]);

	const debouncedQuery = useDebounce(query, debounceTimeout);
	useEffect(() => onSearch?.(debouncedQuery), [debouncedQuery]); // eslint-disable-line react-hooks/exhaustive-deps

	const handleQueryReset = () => {
		setQuery("");
		onReset?.();
	};

	return (
		<div className="relative">
			{!searchbarVisible && (
				<button
					data-testid="header-search-bar__button"
					className="my-auto h-full font-semibold cursor-pointer focus:outline-none"
					onClick={() => setSearchbarVisible(true)}
				>
					{children ? (
						children
					) : (
						<div className="flex items-center space-x-3">
							<span className="text-theme-primary-300 dark:text-theme-secondary-700">{label}</span>
							<Icon
								className="text-theme-primary-300 dark:text-theme-secondary-600"
								name="Search"
								width={18}
								height={18}
							/>
						</div>
					)}
				</button>
			)}

			{searchbarVisible && (
				<SearchBarInputWrapper
					data-testid="header-search-bar__input"
					ref={ref}
					className={`absolute z-20 flex items-center text-base px-10 py-6 rounded-md shadow-xl bg-theme-background -right-4 ${
						offsetClassName || "top-1/2 transform -translate-y-1/2"
					}`}
				>
					{extra && (
						<div className="flex items-center">
							<div>{extra}</div>
							<div className="mr-8 h-10 border-l border-theme-secondary-300 dark:border-theme-secondary-800" />
						</div>
					)}

					<button
						data-testid="header-search-bar__reset"
						className="focus:outline-none"
						onClick={handleQueryReset}
						type="button"
					>
						<Icon
							className="p-1 -ml-1 text-theme-secondary dark:text-theme-secondary-600 hover:text-theme-primary-600"
							name="CrossSlim"
							width={12}
							height={12}
						/>
					</button>

					<div className="flex-1">
						<Input
							className="pl-3 border-none shadow-none HeaderSearchBar__input"
							placeholder={placeholder}
							value={query}
							isFocused
							onChange={(e) => setQuery((e.target as HTMLInputElement).value)}
						/>
					</div>

					<Icon
						className="text-color-primary-300 dark:text-theme-secondary-600 "
						name="Search"
						width={18}
						height={18}
					/>
				</SearchBarInputWrapper>
			)}
		</div>
	);
};

HeaderSearchBar.defaultProps = {
	placeholder: "Search...",
	label: "Search",
};
