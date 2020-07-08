import { Button } from "app/components/Button";
import { Divider } from "app/components/Divider";
import { FilterNetwork } from "app/components/FilterNetwork";
import { HeaderSearchBar } from "app/components/Header/HeaderSearchBar";
import React from "react";
import { useTranslation } from "react-i18next";

import { SelectCategory } from "./components/SelectCategory";

type Props = {
	categories?: any[];
	selectedAssets?: any[];
};

export const NewsOptions = ({ categories, selectedAssets }: Props) => {
	const { t } = useTranslation();

	return (
		<div className="p-8 border-2 rounded-lg border-theme-primary-contrast" data-testid="NewsOptions">
			<div className="flex flex-col space-y-10">
				<div className="flex justify-end">
					<HeaderSearchBar />
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
						<FilterNetwork networks={selectedAssets} />
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
