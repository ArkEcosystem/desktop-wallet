import { Button } from "app/components/Button";
import { Divider } from "app/components/Divider";
import { FilterNetwork } from "app/components/FilterNetwork";
import { Icon } from "app/components/Icon";
import { Input } from "app/components/Input";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import { assets as availableCoins, categories as availableCategories } from "../../data";
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

	const [categories, setCategories] = useState(
		availableCategories.map((category: Option) => ({
			...category,
			isSelected: selectedCategories.includes(category.name),
		})),
	);
	const [coins, setCoins] = useState(
		availableCoins.map((coin: CoinOption) => ({
			...coin,
			isSelected: selectedCoins.includes(coin.coin.toLowerCase()),
		})),
	);

	const [searchQuery, setSearchQuery] = useState("");

	const handleCategoryChange = (name: string) => {
		let updatedCategories = [...categories];

		if (name === "All") {
			return setCategories(
				updatedCategories.map((category: Option) => ({
					...category,
					isSelected: category.name === "All",
				})),
			);
		}

		updatedCategories = updatedCategories.map((category: Option) => ({
			...category,
			isSelected: category.name === "All" ? false : category.isSelected,
		}));

		const selected = updatedCategories.filter((category: Option) => category.isSelected);

		if (selected.length === 1 && selected[0].name === name) return;

		setCategories(
			updatedCategories.map((category: Option) =>
				category.name === name
					? {
							...category,
							isSelected: !category.isSelected,
					  }
					: category,
			),
		);
	};

	const handleSelectCoin = (selectedCoin: CoinOption) => {
		const updatedCoins = coins.map((coin: CoinOption) => ({
			...coin,
			isSelected: coin.name === selectedCoin.name,
		}));
		setCoins(updatedCoins);
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
			(acc: string[], coin: CoinOption) => (coin.isSelected ? acc.concat(coin.coin.toLowerCase()) : acc),
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
			className="p-8 border-2 rounded-lg bg-theme-background border-theme-primary-contrast"
			data-testid="NewsOptions"
		>
			<div className="flex flex-col space-y-8">
				<div className="flex items-center justify-between px-2 py-4 rounded-md shadow-xl">
					<Input
						data-testid="NewsOptions__search"
						maxLength={32}
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
						{categories.map((category, index) => {
							const isSelected = () =>
								category.isSelected ||
								(category.name === "All" &&
									!categories.some((category: Option) => category.isSelected));

							return (
								<SelectCategory
									data-testid={`NewsOptions__category-${category.name}`}
									key={index}
									className="p-1"
									checked={isSelected()}
									onChange={() => handleCategoryChange(category.name)}
								>
									#{t(`NEWS.CATEGORIES.${category.name.toUpperCase()}`)}
								</SelectCategory>
							);
						})}
					</div>
				</div>

				<Divider dashed />

				<div className="flex flex-col space-y-3">
					<h5 className="font-semibold">{t("NEWS.NEWS_OPTIONS.FILTER_ASSETS")}</h5>
					<p className="text-sm text-theme-neutral">{t("NEWS.NEWS_OPTIONS.YOUR_CURRENT_SELECTIONS")}</p>

					<div className="pb-4">
						<FilterNetwork networks={coins} hideViewAll onChange={handleSelectCoin} />
					</div>

					<Button className="w-full" variant="plain" onClick={handleSubmit} data-testid="NewsOptions__submit">
						{t("NEWS.NEWS_OPTIONS.UPDATE_FILTER")}
					</Button>
				</div>
			</div>
		</div>
	);
};
