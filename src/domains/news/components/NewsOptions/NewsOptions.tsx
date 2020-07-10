import { Button } from "app/components/Button";
import { Divider } from "app/components/Divider";
import { FilterNetwork } from "app/components/FilterNetwork";
import { Icon } from "app/components/Icon";
import { Input } from "app/components/Input";
import React from "react";
import { useTranslation } from "react-i18next";
import  { styled } from "twin.macro";

import { SelectCategory } from "./components/SelectCategory";

type Props = {
	categories?: any[];
	selectedAssets?: any[];
};

const InputWrapper = styled.div`
	input {
		padding: 11px 15px;
	}
`;

export const NewsOptions = ({ categories, selectedAssets }: Props) => {
	const { t } = useTranslation();

	return (
		<div
			className="p-8 border-2 rounded-lg bg-theme-background border-theme-primary-contrast"
			data-testid="NewsOptions"
		>
			<div className="flex flex-col space-y-10">
				<div className="flex items-center justify-between px-2 py-4 rounded-md shadow-xl">
					<InputWrapper>
						<Input className="border-none shadow-none" placeholder="Search" />
					</InputWrapper>
					<Icon className="mr-4 text-theme-neutral" name="Search" width={20} height={20} />
				</div>

				<Divider dashed />

				<div className="flex flex-col space-y-3">
					<h5 className="font-semibold">{t("COMMON.CATEGORY")}</h5>
					<p className="text-sm text-theme-neutral">{t("NEWS.SELECT_YOUR_CATEGORIES")}</p>

					<div className="flex flex-wrap -mx-1">
						{categories?.map((category, index) => (
							<SelectCategory key={index} className="p-1" defaultChecked={category.isSelected}>
								#{category.name}
							</SelectCategory>
						))}
					</div>
				</div>

				<Divider dashed />

				<div className="flex flex-col space-y-3">
					<h5 className="font-semibold">{t("NEWS.FILTER_ASSETS")}</h5>
					<p className="text-sm text-theme-neutral">{t("NEWS.YOUR_CURRENT_SELECTIONS")}</p>

					<div className="pb-4">
						<FilterNetwork networks={selectedAssets} hideViewAll />
					</div>

					<Button className="w-full" variant="plain">
						{t("NEWS.UPDATE_FILTER")}
					</Button>
				</div>
			</div>
		</div>
	);
};

NewsOptions.defaultProps = {
	categories: [],
	selectedAssets: [],
};
