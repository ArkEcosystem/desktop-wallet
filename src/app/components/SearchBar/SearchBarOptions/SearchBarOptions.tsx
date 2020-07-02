import { SvgCollection } from "app/assets/svg";
import { Dropdown } from "app/components/Dropdown";
import React from "react";
import { useTranslation } from "react-i18next";

type SearchBarOptionsProps = {
	selectedOption?: any;
	options: any;
	onSelect: any;
};

export const SearchBarOptions = (props: SearchBarOptionsProps) => {
	const { t } = useTranslation();

	return (
		<div data-testid="SearchBarOptions" className="flex items-center pr-8 my-1">
			<Dropdown
				toggleContent={
					<span className="font-semibold cursor-pointer select-none">
						{props.selectedOption ? props.selectedOption.label : t("COMMON.TYPE")}
						<SvgCollection.ArrowDown className="inline-block w-2 ml-2 text-black" />
					</span>
				}
				options={props.options}
				onSelect={props.onSelect}
				position="left"
			/>
		</div>
	);
};
