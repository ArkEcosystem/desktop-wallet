import { Button } from "app/components/Button";
import { CardControl } from "app/components/Card/CardControl";
import { Divider } from "app/components/Divider";
import { FilterNetwork } from "app/components/FilterNetwork";
import { HeaderSearchBar } from "app/components/Header/HeaderSearchBar";
import React from "react";
import { useTranslation } from "react-i18next";

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

				<div>
					<h5 className="mb-2 font-semibold">{t("COMMON.CATEGORY")}</h5>
					<p className="text-sm text-theme-neutral">{t("NEWS.SELECT_YOUR_CATEGORIES")}</p>

					<div className="flex mt-4 space-x-2">
						{categories?.map((category, index) => (
							<CardControl key={index} className="-p-0" defaultChecked={category.isSelected}>
								<div className="flex flex-col items-center justify-between h-full">
									<span>#{category.name}</span>
								</div>
							</CardControl>
						))}
					</div>
				</div>

				<Divider dashed />

				<div>
					<h5 className="mb-2 font-semibold">{t("NEWS.FILTER_ASSETS")}</h5>
					<p className="text-sm text-theme-neutral">{t("NEWS.YOUR_CURRENT_SELECTIONS")}</p>

					<div className="mt-4 mb-8">
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
