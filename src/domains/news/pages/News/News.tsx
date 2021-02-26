import { Blockfolio, BlockfolioResponse, BlockfolioSignal } from "@arkecosystem/platform-sdk-news";
import { ProfileSetting } from "@arkecosystem/platform-sdk-profiles";
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
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { AVAILABLE_CATEGORIES } from "../../data";

type NewsFilters = {
	categories: string[];
	coins: string[];
	searchQuery?: string;
};

type Props = {
	itemsPerPage?: number;
};

export const News = ({ itemsPerPage }: Props) => {
	const activeProfile = useActiveProfile();
	const { persist } = useEnvironmentContext();

	const [isLoading, setIsLoading] = useState(true);
	const [blockfolio] = useState(() => new Blockfolio(httpClient));

	const [totalCount, setTotalCount] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);

	const [{ categories, coins, searchQuery }, setFilters] = useState<NewsFilters>(
		activeProfile.settings().get(ProfileSetting.NewsFilters) || { categories: [], coins: ["ARK"] },
	);

	const [news, setNews] = useState<BlockfolioSignal[]>([]);

	const skeletonCards = new Array(8).fill({});

	const { t } = useTranslation();

	useEffect(() => window.scrollTo({ top: 0, behavior: "smooth" }), [currentPage, coins]);

	useEffect(() => {
		const fetchNews = async () => {
			setIsLoading(true);
			setNews([]);

			const query = {
				coins,
				page: currentPage,
				...(categories.length && categories.length !== AVAILABLE_CATEGORIES.length && { categories }),
				...(searchQuery && { query: searchQuery }),
			};

			const { data, meta }: BlockfolioResponse = await blockfolio.findByCoin(query);

			setNews(data);
			setIsLoading(false);
			setTotalCount(meta.total);
		};

		fetchNews();
	}, [blockfolio, currentPage, categories, coins, searchQuery]);

	useEffect(() => {
		const updateSettings = async () => {
			activeProfile.settings().set(ProfileSetting.NewsFilters, { categories, coins });
			await persist();
		};

		updateSettings();
	}, [activeProfile, categories, coins, persist]);

	const handleSelectPage = (page: number) => {
		setCurrentPage(page);
	};

	const handleFilterSubmit = (data: any) => {
		setCurrentPage(1);
		setFilters(data);
	};

	return (
		<Page profile={activeProfile}>
			<Section>
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

			<div className="bg-theme-secondary-background">
				<Section hasBackground={false}>
					<div className="container flex space-x-8">
						<div className="flex-none w-4/6">
							{!isLoading && news.length === 0 && (
								<EmptyResults
									className="rounded-lg border-2 border-theme-primary-100 dark:border-theme-secondary-800"
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
										<NewsCard key={index} {...data} />
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
								selectedCategories={categories}
								selectedCoins={coins}
								onSubmit={handleFilterSubmit}
							/>
						</div>
					</div>
				</Section>
			</div>
		</Page>
	);
};

News.defaultProps = {
	itemsPerPage: 15,
};
