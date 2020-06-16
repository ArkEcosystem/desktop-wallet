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
			<div className="flex bg-white rounded shadow-xl px-6 py-4">
				{props.options && props.options.length && (
					<div className="flex items-center border-r border-theme-neutral-200 my-1 pr-6 pl-2">
						<Dropdown
							toggleContent={
								props.selectedOption ? (
									props.selectedOption.label
								) : (
									<span className="font-semibold cursor-pointer select-none">
										{t("COMMON.TYPE")}{" "}
										<SvgCollection.ArrowDown className="inline-block text-black w-2 ml-1" />
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
					<span className="text-sm px-2">{t("SEARCH.FIND_IT")}</span>
				</Button>
			</div>
		</div>
	);
};
