import { Button } from "app/components/Button";
import { Icon } from "app/components/Icon";
import { Input } from "app/components/Input";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

type SearchBarProps = {
	placeholder?: string;
	className?: string;
	children?: React.ReactNode;
	onSearch?: any;
};

export const SearchBar = ({ placeholder, className, children, onSearch }: SearchBarProps) => {
	const [query, setQuery] = useState("");

	const { t } = useTranslation();

	return (
		<div data-testid="SearchBar" className={`bg-theme-neutral-contrast px-12 pt-8 pb-8 ${className}`}>
			<div className="flex items-center px-10 py-6 bg-white rounded shadow-xl">
				{children ? children : <Icon name="Search" className="w-4 mr-8 text-theme-neutral-300" />}

				<div className="flex-1 pl-4 mr-4 border-l border-theme-neutral-200">
					<Input
						className="border-none shadow-none"
						placeholder={placeholder || t("COMMON.SEARCH.PLACEHOLDER")}
						onChange={(e) => setQuery((e.target as HTMLInputElement).value)}
					/>
				</div>

				<Button data-testid="SearchBar__button" onClick={() => onSearch(query)} className="my-1">
					<span className="px-2 text-sm">{t("COMMON.SEARCH.FIND_IT")}</span>
				</Button>
			</div>
		</div>
	);
};
