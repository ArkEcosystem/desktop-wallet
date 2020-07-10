import { SvgCollection } from "app/assets/svg";
import { Breadcrumbs } from "app/components/Breadcrumbs";
import { Pagination } from "app/components/Pagination";
import { useActiveProfile } from "app/hooks/env";
import { BlockfolioAd } from "domains/news/components/BlockfolioAd";
import { NewsCard } from "domains/news/components/NewsCard";
import { NewsOptions } from "domains/news/components/NewsOptions";
import React from "react";

import { assets, categories, news } from "../../data";

type Props = {
	news?: any[];
	categories?: any[];
	assets?: any[];
};

export const News = ({ news, categories, assets }: Props) => {
	const activeProfile = useActiveProfile();

	const crumbs = [
		{
			route: `/profiles/${activeProfile?.id()}/dashboard`,
			label: "Go back to Portfolio",
		},
	];

	return (
		<>
			<Breadcrumbs crumbs={crumbs} />
			<section data-testid="News" className="flex flex-col min-h-screen py-16 mx-10">
				<div className="flex flex-col flex-1 space-y-5">
					<div className="px-10 py-16 bg-theme-background">
						<h1 className="mb-0 md:text-4xl">Blockchain News</h1>
						<div className="flex items-center space-x-2">
							<span className="font-semibold text-theme-neutral-dark">Powered by</span>
							<SvgCollection.Blockfolio width={100} height={27} />
						</div>
					</div>

					<div className="flex p-10 space-x-10">
						<div className="w-full grid gap-4">
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
				</div>
			</section>
		</>
	);
};

News.defaultProps = {
	news,
	categories,
	assets,
};
