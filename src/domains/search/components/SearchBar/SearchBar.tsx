import { SvgCollection } from "app/assets/svg";
import { Button } from "app/components/Button";
import { Input } from "app/components/Input";
import React from "react";
import { useTranslation } from "react-i18next";

type SearchBarProps = {
	placeholder?: string;
	className?: string;
	children?: React.ReactNode;
};

export const SearchBar = (props: SearchBarProps) => {
	const { t } = useTranslation();

	return (
		<div data-testid="SearchBar" className={`bg-theme-neutral-100 px-12 pt-8 pb-10 ${props.className}`}>
			<div className="flex px-6 py-4 bg-white rounded shadow-xl">
				{props.children ? props.children : <SvgCollection.Search className="w-4 text-theme-neutral-300" />}

				<div className="flex-1 mr-4">
					<Input
						className="border-none shadow-none"
						placeholder={props.placeholder || t("SEARCH.PLACEHOLDER")}
					/>
				</div>

				<Button size="small" className="my-1">
					<span className="px-2 text-sm">{t("SEARCH.FIND_IT")}</span>
				</Button>
			</div>
		</div>
	);
};
