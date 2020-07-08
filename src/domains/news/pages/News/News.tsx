import { Breadcrumbs } from "app/components/Breadcrumbs";
import { Header } from "app/components/Header";
import { Pagination } from "app/components/Pagination";
import { NewsCard } from "domains/news/components/NewsCard";
import React, { useState } from "react";

type Props = {
	news?: any[];
};

export const News = ({ news }: Props) => {
	const [currentPage, setCurrentPage] = useState(1);
	const crumbs = [
		{
			route: "portfolio",
			label: "Go back to Portfolio",
		},
	];

	return (
		<div data-testid="News" className="flex flex-col min-h-screen -m-5 bg-theme-neutral-100">
			<Breadcrumbs crumbs={crumbs} className="py-5 pl-10 font-semibold" />

			<div className="flex flex-col flex-1 space-y-5">
				<div className="px-10 py-16 bg-theme-background">
					<Header title="Blockchain News" subtitle="Powered by" />
				</div>

				<div className="p-10 grid gap-4">
					{news?.map((data, index) => (
						<NewsCard key={index} {...data} />
					))}

					<div className="flex justify-center w-full">
						<Pagination
							totalCount={12}
							itemsPerPage={4}
							onSelectPage={setCurrentPage}
							currentPage={currentPage}
							size="md"
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

News.defaultProps = {
	news: [],
};
