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
	<li className="border-dotted cursor-pointer border-b-1 border-theme-neutral-300 last:border-b-0">
		<a
			title={title}
			href={path}
			className="flex px-2 py-6 -mx-3 rounded-md border-3 border-theme-background hover:bg-theme-neutral-100 text-theme-neutral-800 hover:text-theme-primary-600"
		>
			<div>
				<div className="pt-1 text-theme-neutral-800">
					<Icon name="Article" width={16} height={16} />
				</div>
			</div>
			<div>
				<div className="mb-2 ml-3 font-bold text-theme-neutral-800">{title}</div>
				<div className="ml-3 text-sm text-theme-neutral-600">{description}</div>
			</div>
		</a>
	</li>
);

export const Faq = ({ articles }: FaqProps) => {
	const { t } = useTranslation();
	return (
		<div className="bg-theme-neutral-100">
			<div className="mb-5 bg-white p-13">
				<div className="flex">
					<div className="w-2/3">
						<h1>{t("SUPPORT.FAQ_PORTFOLIO_TITLE")}</h1>
						<p className="text-theme-neutral-600">{t("SUPPORT.FAQ_PORTFOLIO_SUBTITLE")}</p>
					</div>
					<div className="flex justify-end w-1/3">
						<div className="my-auto cursor-pointer text-theme-primary-200">
							<Icon name="Search" />
						</div>
						<div className="h-8 mx-10 my-auto border-l border-1 border-theme-primary-100" />
						<div className="my-auto">
							<Button color="primary">{t("SUPPORT.CONTACT_US")}</Button>
						</div>
					</div>
				</div>
			</div>
			<div className="px-12 py-10 mb-10 bg-white">
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
