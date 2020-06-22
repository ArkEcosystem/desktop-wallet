import { Button } from "app/components/Button";
import { Icon } from "app/components/Icon";
import React from "react";
import { useTranslation } from "react-i18next";

type ArticleListItemProps = {
	title: string;
	path: string;
	description: string;
};

type FaqProps = {
	articles?: ArticleListItemProps[];
};

const ArticleListItem = ({ title, path, description }: ArticleListItemProps) => (
	<li className="border-b-1 border-dotted border-theme-neutral-300 last:border-b-0 cursor-pointer">
		<a
			title={title}
			href={path}
			className="flex py-6 -mx-2 px-2 w-full border-2 border-theme-background hover:bg-theme-primary-100"
		>
			<div>
				<div className="text-theme-neutral-800 pt-1">
					<Icon name="FilePassword" width={22} height={22} />
				</div>
			</div>
			<div>
				<div className="text-theme-neutral-800 ml-3 mb-2 font-bold">{title}</div>
				<div className="text-theme-neutral-600 ml-3 text-sm">{description}</div>
			</div>
		</a>
	</li>
);

export const Faq = ({ articles }: FaqProps) => {
	const { t } = useTranslation();
	return (
		<div className="-m-5 bg-theme-neutral-200">
			<div className="py-10 px-12 bg-white mb-10">
				<div className="flex">
					<div className="w-2/3">
						<h1>{t("SUPPORT.FAQ_PORTFOLIO_TITLE")}</h1>
						<p className="text-theme-neutral-600">{t("SUPPORT.FAQ_PORTFOLIO_SUBTITLE")}</p>
					</div>
					<div className="w-1/3 flex justify-end">
						<div className="text-theme-primary-200 my-auto cursor-pointer">
							<Icon name="Search" />
						</div>
						<div className="border-1 border-l h-8 border-theme-primary-100 mx-10 my-auto" />
						<div className="my-auto">
							<Button color="primary">{t("SUPPORT.CONTACT_US")}</Button>
						</div>
					</div>
				</div>
			</div>
			<div className="py-10 px-12 bg-white mb-10">
				<div className="flex flex-row">
					<div className="mr-10">
						<ul>
							{articles &&
								articles.map(({ title, path, description }: ArticleListItemProps, index: number) => (
									<ArticleListItem title={title} path={path} key={index} description={description} />
								))}
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
};

Faq.defaultProps = {
	articles: [],
};
