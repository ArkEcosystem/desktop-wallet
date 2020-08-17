import { Blockfolio, BlockfolioResponse, BlockfolioSignal } from "@arkecosystem/platform-sdk-news";
import { SvgCollection } from "app/assets/svg";
import { Header } from "app/components/Header";
import { Page, Section } from "app/components/Layout";
import { Pagination } from "app/components/Pagination";
import { useActiveProfile } from "app/hooks/env";
import { httpClient } from "app/services";
import { BlockfolioAd } from "domains/news/components/BlockfolioAd";
import { NewsCard, NewsCardSkeleton } from "domains/news/components/NewsCard";
import { NewsOptions } from "domains/news/components/NewsOptions";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { assets, categories as defaultCategories } from "../../data";

type Props = {
	defaultCategories?: any[];
	assets?: any[];
	selectedCoin?: string;
	pageItems?: number;
};

export const News = ({ defaultCategories = [], assets, selectedCoin, pageItems }: Props) => {
	const activeProfile = useActiveProfile();
	const [isLoading, setIsLoading] = useState(true);
	const [blockfolio] = useState(() => new Blockfolio(httpClient));

	const [categories, setCategories] = useState(defaultCategories);
	const [searchValue, setSearchValue] = useState("");

	const [news, setNews] = useState<BlockfolioSignal[]>([]);
	const [filteredNews, setFilteredNews] = useState<BlockfolioSignal[]>([]);

	const [coin] = useState(selectedCoin);
	const skeletonCards = new Array(pageItems).fill({});

	const { t } = useTranslation();

	const crumbs = [
		{
			route: `/profiles/${activeProfile.id()}/dashboard`,
			label: t("COMMON.GO_BACK_TO_PORTFOLIO"),
		},
	];

	useEffect(() => {
		const fetchNews = async () => {
			console.log("fetching news");
			setIsLoading(true);
			const blockfolioNews: BlockfolioResponse = await blockfolio.findByCoin(coin as string);

			setNews(blockfolioNews.data);
			console.log("blockfolionews", blockfolioNews);
			setIsLoading(false);
		};

		fetchNews();
	}, [blockfolio, coin]);

	useEffect(() => {
		const filterByCategories = (items: BlockfolioSignal[]) => {
			const selecteCategoryNames = categories.filter((c) => c.isSelected).map((c) => c.name);
			if (selecteCategoryNames.includes("All")) return items;

			return items.filter((item) => selecteCategoryNames.includes(item.category));
		};

		const filterBySearchInput = (input: string, items: BlockfolioSignal[]) => {
			const searchInput = input.trim().toLowerCase();
			return items.filter((item) => item.text.toLowerCase().match(searchInput));
		};

		const byCategory = filterByCategories(news);
		const bySearchInput = filterBySearchInput(searchValue, byCategory);

		setFilteredNews(bySearchInput);
	}, [news, searchValue, categories]);

	const handleSelectPage = (page: number) => {
		console.log("page", page);
	};

	return (
		<Page profile={activeProfile} crumbs={crumbs}>
			<Section>
				<Header
					title={t("NEWS.PAGE_NEWS.TITLE")}
					subtitle={
						<div className="flex items-center space-x-2">
							<span className="font-semibold text-theme-neutral-dark">
								{t("NEWS.PAGE_NEWS.POWERED_BY")}
							</span>
							<SvgCollection.Blockfolio width={100} height={27} />
						</div>
					}
				/>
			</Section>

			<Section hasBackground={false}>
				<div className="flex space-x-8">
					<div className="w-full grid gap-5">
						{isLoading && filteredNews.length === 0 && (
							<div className="space-y-6">
								{skeletonCards.map((_, key: number) => (
									<NewsCardSkeleton key={key} />
								))}
							</div>
						)}

						{filteredNews?.map((data, index) => (
							<NewsCard key={index} coin={coin} {...data} />
						))}

						<div className="mb-10">
							<BlockfolioAd />
						</div>

						<div className="flex justify-center w-full pt-10">
							<Pagination
								totalCount={12}
								itemsPerPage={4}
								onSelectPage={handleSelectPage}
								currentPage={1}
								size="md"
							/>
						</div>
					</div>
					<div className="max-w-xl">
						<NewsOptions
							defaultCategories={categories}
							selectedAssets={assets}
							onCategoryChange={setCategories}
							onSearch={setSearchValue}
						/>
					</div>
				</div>
			</Section>
		</Page>
	);
};

News.defaultProps = {
	defaultCategories,
	assets,
	selectedCoin: "ark",
	pageItems: 10,
};
