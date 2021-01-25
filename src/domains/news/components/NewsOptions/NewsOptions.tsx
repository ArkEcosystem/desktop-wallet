import { Button } from "app/components/Button";
import { Divider } from "app/components/Divider";
import { FilterNetwork } from "app/components/FilterNetwork";
import { Icon } from "app/components/Icon";
import { Input } from "app/components/Input";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { assets as availableCoins, AVAILABLE_CATEGORIES } from "../../data";
import { SelectCategory } from "./components/SelectCategory";

type Option = {
	name: string;
	isSelected: boolean;
};

type CoinOption = {
	coin: string;
} & Option;

type NewsOptionsProps = {
	selectedCategories: string[];
	selectedCoins: string[];
	onSearch?: (search: string) => void;
	onSubmit: (data: object) => void;
};

export const NewsOptions = ({ selectedCategories, selectedCoins, onSearch, onSubmit }: NewsOptionsProps) => {
	const { t } = useTranslation();

	const [categories, setCategories] = useState<Option[]>(
		AVAILABLE_CATEGORIES.map((name: string) => ({
			name,
			isSelected: !selectedCategories.length || selectedCategories.includes(name),
		})),
	);

	const [coins, setCoins] = useState(
		availableCoins.map((coin: CoinOption) => ({
			...coin,
			isSelected: selectedCoins.includes(coin.coin),
		})),
	);

	const hasCoinsSelected = Object.values(coins).some((coin) => coin.isSelected);
	const [searchQuery, setSearchQuery] = useState("");

	const showSelectAllCategories = useMemo(() => categories.some((option: Option) => !option.isSelected), [
		categories,
	]);

	const handleSelectCategory = (name: string) => {
		const selected = categories.filter((category: Option) => category.isSelected);

		if (selected.length === 1 && selected[0].name === name) {
			return;
		}

		setCategories(
			categories.map((category: Option) =>
				category.name === name
					? {
							...category,
							isSelected: !category.isSelected,
					  }
					: category,
			),
		);
	};

	const handleSelectAllCategories = () => {
		setCategories(
			categories.map((category: Option) => ({
				...category,
				isSelected: true,
			})),
		);
	};

	const handleSearchInput = (searchQuery: string) => {
		const query = searchQuery.substr(0, 32);
		setSearchQuery(query);
		onSearch?.(query);
	};

	const handleSubmit = () => {
		const categoryNames = categories.reduce(
			(acc: string[], category: Option) =>
				category.name !== "All" && category.isSelected ? acc.concat(category.name) : acc,
			[],
		);

		const coinNames = coins.reduce(
			(acc: string[], coin: CoinOption) => (coin.isSelected ? acc.concat(coin.coin) : acc),
			[],
		);

		onSubmit({
			categories: categoryNames,
			coins: coinNames,
			searchQuery,
		});
	};

	return (
		<div
			className="p-8 rounded-lg border-2 bg-theme-background border-theme-primary-100 dark:border-theme-secondary-800"
			data-testid="NewsOptions"
		>
			<div className="flex flex-col space-y-8">
				<div className="flex justify-between items-center py-4 px-2 rounded-md shadow-xl">
					<Input
						data-testid="NewsOptions__search"
						className="border-none shadow-none NewsOptions__search"
						maxLength={32}
						placeholder={t("NEWS.NEWS_OPTIONS.PLACEHOLDER")}
						onChange={(event) => handleSearchInput?.((event.target as HTMLInputElement).value)}
						onKeyDown={(event) => {
							if (event.key === "Enter") {
								handleSubmit();
							}
						}}
					/>
					<Icon
						className="mr-4 text-theme-primary-300 dark:text-theme-secondary-600"
						name="Search"
						width={18}
						height={18}
					/>
				</div>

				<Divider dashed />

				<div className="flex flex-col space-y-3">
					<div className="flex justify-between items-center">
						<h5 className="font-semibold">{t("COMMON.CATEGORY")}</h5>
						{showSelectAllCategories && (
							<button
								onClick={handleSelectAllCategories}
								className="text-xs font-semibold focus:outline-none text-theme-secondary-800"
							>
								{t("COMMON.SELECT_ALL")}
							</button>
						)}
					</div>

					<p className="text-sm text-theme-secondary-500">{t("NEWS.NEWS_OPTIONS.SELECT_YOUR_CATEGORIES")}</p>

					<div className="flex flex-wrap -mx-1">
						{categories.map((category, index) => (
							<SelectCategory
								data-testid={`NewsOptions__category-${category.name}`}
								key={index}
								className="p-1"
								checked={category.isSelected}
								onChange={() => handleSelectCategory(category.name)}
							>
								#{t(`NEWS.CATEGORIES.${category.name.toUpperCase()}`)}
							</SelectCategory>
						))}
					</div>
				</div>

				<Divider dashed />

				<div className="flex flex-col space-y-3">
					<h5 className="font-semibold">{t("NEWS.NEWS_OPTIONS.FILTER_ASSETS")}</h5>
					<p className="text-sm text-theme-secondary-500">{t("NEWS.NEWS_OPTIONS.YOUR_CURRENT_SELECTIONS")}</p>

					<div className="pb-4">
						<FilterNetwork networks={coins} hideViewAll onChange={(_, networks) => setCoins(networks)} />
					</div>

					<Button
						disabled={!hasCoinsSelected}
						className="w-full"
						variant="secondary"
						onClick={handleSubmit}
						data-testid="NewsOptions__submit"
					>
						{t("NEWS.NEWS_OPTIONS.UPDATE_FILTER")}
					</Button>
				</div>
			</div>
		</div>
	);
};
