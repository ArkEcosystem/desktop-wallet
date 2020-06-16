import { SvgCollection } from "app/assets/svg";
import { Button } from "app/components/Button";
import { Dropdown } from "app/components/Dropdown";
import { Input } from "app/components/Input";
import React from "react";
import { useTranslation } from "react-i18next";

type SearchBarProps = {
	selectedOption?: any;
	options?: any;
	placeholder?: string;
	className?: string;
	onTypeSelect: any;
};

export const SearchBar = (props: SearchBarProps) => {
	const { t } = useTranslation();

	return (
		<div data-testid="SearchBar" className={`bg-theme-neutral-200 px-16 pt-8 pb-10 ${props.className}`}>
			<div className="flex px-6 py-4 bg-white rounded shadow-xl">
				{props.options && props.options.length && (
					<div className="flex items-center pl-2 pr-6 my-1 border-r border-theme-neutral-200">
						<Dropdown
							toggleContent={
								props.selectedOption ? (
									props.selectedOption.label
								) : (
									<span className="font-semibold cursor-pointer select-none">
										{t("COMMON.TYPE")}{" "}
										<SvgCollection.ArrowDown className="inline-block w-2 ml-1 text-black" />
									</span>
								)
							}
							options={props.options}
							onSelect={props.onTypeSelect}
							position="left"
						/>
					</div>
				)}

				<div className="flex-1 mr-4">
					<Input
						className="border-none shadow-none"
						placeholder={props.placeholder || t("SEARCH.PLACEHOLDER")}
					/>
				</div>

				<Button color="primary" variant="solid" size="small" className="my-1">
					<span className="px-2 text-sm">{t("SEARCH.FIND_IT")}</span>
				</Button>
			</div>
		</div>
	);
};
