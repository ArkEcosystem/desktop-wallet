import { Blockfolio, BlockfolioResponse, BlockfolioSignal } from "@arkecosystem/platform-sdk-news";
import { SvgCollection } from "app/assets/svg";
import { EmptyResults } from "app/components/EmptyResults";
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
	defaultAssets: any[];
	selectedCoin?: string;
	itemsPerPage?: number;
};

export const News = ({ defaultCategories, defaultAssets, selectedCoin, itemsPerPage }: Props) => {
	const activeProfile = useActiveProfile();
	const [isLoading, setIsLoading] = useState(true);
	const [blockfolio] = useState(() => new Blockfolio(httpClient));

	const [totalCount, setTotalCount] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);

	const [{ categories, searchQuery, assets }, setFilters] = useState({
		searchQuery: "",
		categories: defaultCategories,
		assets: defaultAssets,
	});

	const [news, setNews] = useState<BlockfolioSignal[]>([]);

	const [coin, setCoin] = useState(selectedCoin);
	const skeletonCards = new Array(8).fill({});

	const { t } = useTranslation();

	const crumbs = [
		{
			route: `/profiles/${activeProfile.id()}/dashboard`,
			label: t("COMMON.GO_BACK_TO_PORTFOLIO"),
		},
	];

	useEffect(() => window.scrollTo({ top: 0, behavior: "smooth" }), [currentPage, coin]);

	useEffect(() => {
		const fetchNews = async () => {
			setIsLoading(true);
			setNews([]);

			const selectedAsset = assets.find((asset: any) => asset.isSelected);
			const selectedCoinName = selectedAsset.coin.toLowerCase();

			const selectedCategory = categories?.find((category) => category.isSelected);
			const category = selectedCategory.name;

			const query = {
				page: currentPage,
				...(category !== "All" && { category }),
				...(searchQuery !== "" && { query: searchQuery }),
			};

			const { data, meta }: BlockfolioResponse = await blockfolio.findByCoin(selectedCoinName, query);

			setCoin(selectedCoinName);
			setNews(data);
			setIsLoading(false);
			setTotalCount(meta.total);
		};

		fetchNews();
	}, [blockfolio, currentPage, categories, searchQuery, assets]);

	const handleSelectPage = (page: number) => {
		setCurrentPage(page);
	};

	const handleFilterSubmit = (data: any) => {
		setCurrentPage(1);
		setFilters(data);
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
				<div className="container flex space-x-8">
					<div className="flex-none w-4/6">
						{!isLoading && news.length === 0 && (
							<EmptyResults
								className="border-2 rounded-lg border-theme-primary-contrast"
								title={t("COMMON.EMPTY_RESULTS.TITLE")}
								subtitle={t("COMMON.EMPTY_RESULTS.SUBTITLE")}
							/>
						)}

						{isLoading && (
							<div className="space-y-6">
								{skeletonCards.map((_, key: number) => (
									<NewsCardSkeleton key={key} />
								))}
							</div>
						)}

						{!isLoading && (
							<div className="space-y-6">
								{news?.map((data, index) => (
									<NewsCard key={index} coin={coin} {...data} />
								))}
							</div>
						)}

						{!isLoading && news.length > 0 && (
							<>
								<div className="my-10">
									<BlockfolioAd />
								</div>

								<div className="flex justify-center w-full">
									<Pagination
										totalCount={totalCount}
										itemsPerPage={itemsPerPage}
										onSelectPage={handleSelectPage}
										currentPage={currentPage}
									/>
								</div>
							</>
						)}
					</div>
					<div className="flex-none w-2/6">
						<NewsOptions
							defaultCategories={defaultCategories}
							selectedAssets={assets}
							onSubmit={handleFilterSubmit}
						/>
					</div>
				</div>
			</Section>
		</Page>
	);
};

News.defaultProps = {
	defaultCategories,
	defaultAssets: assets,
	selectedCoin: "ark",
	itemsPerPage: 15,
};
