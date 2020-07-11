import { SvgCollection } from "app/assets/svg";
import { Header } from "app/components/Header";
import { Page, Section } from "app/components/Layout";
import { Pagination } from "app/components/Pagination";
import { BlockfolioAd } from "domains/news/components/BlockfolioAd";
import { NewsCard } from "domains/news/components/NewsCard";
import { NewsOptions } from "domains/news/components/NewsOptions";
import React from "react";

type Props = {
	news?: any[];
	categories?: any[];
	assets?: any[];
};

export const News = ({ news, categories, assets }: Props) => {
	const crumbs = [
		{
			route: "portfolio",
			label: "Go back to Portfolio",
		},
	];

	return (
		<Page crumbs={crumbs}>
			<Section>
				<Header
					title="Blockchain News"
					subtitle={
						<div className="flex items-center space-x-2">
							<span className="font-semibold text-theme-neutral-dark">Powered by</span>
							<SvgCollection.Blockfolio width={100} height={27} />
						</div>
					}
				/>
			</Section>

			<Section hasBackground={false}>
				<div className="flex space-x-8">
					<div className="w-full grid gap-5">
						{news?.map((data, index) => (
							<NewsCard key={index} {...data} />
						))}

						<BlockfolioAd />

						<div className="flex justify-center w-full pt-10">
							<Pagination
								totalCount={12}
								itemsPerPage={4}
								onSelectPage={console.log}
								currentPage={1}
								size="md"
							/>
						</div>
					</div>
					<div className="max-w-xl">
						<NewsOptions categories={categories} selectedAssets={assets} />
					</div>
				</div>
			</Section>
		</Page>
	);
};

News.defaultProps = {
	news: [],
	categories: [],
	assets: [],
};
