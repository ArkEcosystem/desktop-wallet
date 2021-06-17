import { Blockfolio, BlockfolioResponse, BlockfolioSignal } from "@arkecosystem/platform-sdk-news";
import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { SvgCollection } from "app/assets/svg";
import { EmptyResults } from "app/components/EmptyResults";
import { Header } from "app/components/Header";
import { Page, Section } from "app/components/Layout";
import { Pagination } from "app/components/Pagination";
import { useEnvironmentContext } from "app/contexts";
import { useActiveProfile } from "app/hooks";
import { httpClient } from "app/services";
import { BlockfolioAd } from "domains/news/components/BlockfolioAd";
import { NewsCard, NewsCardSkeleton } from "domains/news/components/NewsCard";
import { NewsOptions } from "domains/news/components/NewsOptions";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { AVAILABLE_CATEGORIES } from "../../data";

interface NewsFilters {
	categories: string[];
	coins: string[];
	searchQuery?: string;
}

interface Properties {
	itemsPerPage?: number;
}

export const News = ({ itemsPerPage }: Properties) => {
	const activeProfile = useActiveProfile();
	const { persist } = useEnvironmentContext();

	const [isLoading, setIsLoading] = useState(true);
	const [blockfolio] = useState(() => new Blockfolio(httpClient));

	const [totalCount, setTotalCount] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);

	const [{ categories, coins, searchQuery }, setFilters] = useState<NewsFilters>(
		activeProfile.settings().get(Contracts.ProfileSetting.NewsFilters) || { categories: [], coins: ["ARK"] },
	);

	const [news, setNews] = useState<BlockfolioSignal[]>([]);

	const skeletonCards = Array.from({ length: 8 }).fill({});

	const { t } = useTranslation();

	useEffect(() => window.scrollTo({ top: 0, behavior: "smooth" }), [currentPage, coins]);

	useEffect(() => {
		const fetchNews = async () => {
			setIsLoading(true);
			setNews([]);

			if (coins.length > 0) {
				const query = {
					coins,
					page: currentPage,
					...(categories.length && categories.length !== AVAILABLE_CATEGORIES.length && { categories }),
					...(searchQuery && { query: searchQuery }),
				};

				const { data, meta }: BlockfolioResponse = await blockfolio.findByCoin(query);

				setNews(data);
				setTotalCount(meta.total);
			}

			setIsLoading(false);
		};

		fetchNews();
	}, [blockfolio, currentPage, categories, coins, searchQuery]);

	useEffect(() => {
		const updateSettings = async () => {
			activeProfile.settings().set(Contracts.ProfileSetting.NewsFilters, { categories, coins });
			await persist();
		};

		updateSettings();
	}, [activeProfile, categories, coins, persist]);

	const handleSelectPage = (page: number) => {
		setCurrentPage(page);
	};

	const handleFilterSubmit = useCallback((data: any) => {
		setCurrentPage(1);
		setFilters(data);
	}, []);

	return (
		<Page profile={activeProfile} isBackDisabled={true}>
			<Section backgroundClassName="bg-theme-background">
				<Header
					title={t("NEWS.PAGE_NEWS.TITLE")}
					subtitle={
						<div className="flex items-center space-x-2">
							<span className="font-semibold text-theme-secondary-text">
								{t("NEWS.PAGE_NEWS.POWERED_BY")}
							</span>
							<SvgCollection.Blockfolio width={100} height={27} />
						</div>
					}
				/>
			</Section>

			<Section className="flex-1" backgroundClassName="bg-theme-secondary-background">
				<div className="container flex space-x-5 xl:space-x-8">
					<div className="flex-none w-2/3">
						{isLoading && (
							<div className="space-y-5">
								{skeletonCards.map((_, key: number) => (
									<NewsCardSkeleton key={key} />
								))}
							</div>
						)}

						{!isLoading && news.length === 0 && (
							<EmptyResults
								className="rounded-lg border-2 border-theme-primary-100 dark:border-theme-secondary-800"
								title={t("COMMON.EMPTY_RESULTS.TITLE")}
								subtitle={t("COMMON.EMPTY_RESULTS.SUBTITLE")}
							/>
						)}

						{!isLoading && news.length > 0 && (
							<>
								<div className="space-y-5">
									{news?.map((data, index) => (
										<NewsCard key={index} {...data} />
									))}

									<BlockfolioAd />
								</div>

								<div className="flex justify-center mt-10 w-full">
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
					<div className="relative w-1/3">
						<NewsOptions
							selectedCategories={categories}
							selectedCoins={coins}
							onSubmit={handleFilterSubmit}
						/>
					</div>
				</div>
			</Section>
		</Page>
	);
};

News.defaultProps = {
	itemsPerPage: 15,
};
