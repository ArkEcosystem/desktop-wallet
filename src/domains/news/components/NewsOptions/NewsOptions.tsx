import { Button } from "app/components/Button";
import { Divider } from "app/components/Divider";
import { FilterNetwork } from "app/components/FilterNetwork";
import { Icon } from "app/components/Icon";
import { Input } from "app/components/Input";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import { SelectCategory } from "./components/SelectCategory";

type Props = {
	defaultCategories?: any[];
	selectedAssets: any[];
	onCategoryChange?: (categories: any) => void;
	onAssetChange?: (assets: any[], asset: any) => void;
	onSearch?: (search: string) => void;
	onSubmit?: (data: object) => void;
};

export const NewsOptions = ({
	defaultCategories,
	selectedAssets,
	onCategoryChange,
	onSearch,
	onAssetChange,
	onSubmit,
}: Props) => {
	const { t } = useTranslation();
	const [categories, setCategories] = useState(defaultCategories);
	const [assets, setAssets] = useState(selectedAssets);
	const [searchQuery, setSearchQuery] = useState("");

	const handleCategoryChange = (name: string, isSelected: boolean) => {
		const updatedCategories = categories?.map((categoryItem: any) =>
			name === categoryItem.name ? { name, isSelected } : categoryItem,
		);

		setCategories(updatedCategories);
		onCategoryChange?.(updatedCategories);
	};

	const handleSelectAsset = (selectedAsset: any) => {
		const updatedAssets = assets.map((asset) => ({
			...asset,
			isSelected: asset.name === selectedAsset.name,
		}));
		setAssets(updatedAssets);
		onAssetChange?.(updatedAssets, { ...selectedAsset, isSelected: true });
	};

	const handleSearchInput = (query: string) => {
		setSearchQuery(query);
		onSearch?.(query);
	};

	const handleSubmit = () => {
		onSubmit?.({
			categories,
			assets,
			searchQuery,
		});
	};

	return (
		<div
			className="p-8 border-2 rounded-lg bg-theme-background border-theme-primary-contrast"
			data-testid="NewsOptions"
		>
			<div className="flex flex-col space-y-8">
				<div className="flex items-center justify-between px-2 py-4 shadow-xl rounded-md">
					<Input
						data-testid="NewsOptions__search"
						onChange={(e) => handleSearchInput?.((e.target as HTMLInputElement).value)}
						className="border-none shadow-none NewsOptions__search"
						placeholder={t("NEWS.NEWS_OPTIONS.PLACEHOLDER")}
					/>
					<Icon className="mr-4 text-theme-neutral" name="Search" width={20} height={20} />
				</div>

				<Divider dashed />

				<div className="flex flex-col space-y-3">
					<h5 className="font-semibold">{t("COMMON.CATEGORY")}</h5>
					<p className="text-sm text-theme-neutral">{t("NEWS.NEWS_OPTIONS.SELECT_YOUR_CATEGORIES")}</p>

					<div className="flex flex-wrap -mx-1">
						{categories?.map((category, index) => (
							<SelectCategory
								data-testid={`NewsOptions__category-${t(
									`NEWS.CATEGORIES.${category.name.toUpperCase()}`,
								)}`}
								key={index}
								className="p-1"
								defaultChecked={category.isSelected}
								onChange={({ target }: any) => handleCategoryChange(category.name, target.checked)}
							>
								#{t(`NEWS.CATEGORIES.${category.name.toUpperCase()}`)}
							</SelectCategory>
						))}
					</div>
				</div>

				<Divider dashed />

				<div className="flex flex-col space-y-3">
					<h5 className="font-semibold">{t("NEWS.NEWS_OPTIONS.FILTER_ASSETS")}</h5>
					<p className="text-sm text-theme-neutral">{t("NEWS.NEWS_OPTIONS.YOUR_CURRENT_SELECTIONS")}</p>

					<div className="pb-4">
						<FilterNetwork networks={assets} hideViewAll onChange={handleSelectAsset} />
					</div>

					<Button className="w-full" variant="plain" onClick={handleSubmit} data-testid="NewsOptions__submit">
						{t("NEWS.NEWS_OPTIONS.UPDATE_FILTER")}
					</Button>
				</div>
			</div>
		</div>
	);
};

NewsOptions.defaultProps = {
	defaultCategories: [],
	selectedAssets: [],
};
