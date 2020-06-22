import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import React from "react";
import { useTranslation } from "react-i18next";

type ArticleListItemProps = {
	title: string;
	path: string;
};

type CategoryItemProps = {
	title?: string;
	subtitle?: string;
	path?: string;
	icon: string;
};

type SupportProps = {
	categories?: CategoryItemProps[];
	helpfulArticles?: ArticleListItemProps[];
	newestArticles?: ArticleListItemProps[];
	popularArticles?: ArticleListItemProps[];
};

const ArticleListItem = ({ title, path }: ArticleListItemProps) => (
	<li className="flex border-dotted cursor-pointer border-b-1 border-theme-neutral-300 last:border-b-0">
		<a
			title={title}
			href={path}
			className="flex w-full px-2 py-6 -mx-2 border-2 border-theme-background hover:bg-theme-primary-100"
		>
			<div>
				<div className="pt-1 text-theme-neutral-800">
					<Icon name="Article" width={16} height={16} />
				</div>
			</div>
			<div className="ml-3 text-theme-neutral-800">{title}</div>
		</a>
	</li>
);

const CategoryItem = ({ icon, title, subtitle, path }: CategoryItemProps) => (
	<a
		href={path}
		title={title}
		className="flex flex-row w-64 p-4 bg-white cursor-pointer border-r-1 last:border-r-0 border-theme-neutral-200 hover:shadow-xl"
	>
		<div className="w-1/3 my-auto">
			<Circle className="border-theme-neutral-800" size="large">
				<div className="text-theme-neutral-800">
					<Icon name={icon} width={20} height={20} />
				</div>
			</Circle>
		</div>
		<div className="flex-auto my-auto">
			<div className="font-bold text-theme-neutral-800">{title}</div>
			<div className="text-sm text-theme-neutral-500">{subtitle}</div>
		</div>
	</a>
);

export const Main = ({ categories, helpfulArticles, popularArticles, newestArticles }: SupportProps) => {
	const { t } = useTranslation();
	return (
		<div className="-m-5 bg-theme-neutral-200">
			<div className="px-12 py-10 mb-10 bg-white">
				<div className="flex">
					<div className="w-2/3">
						<h1>{t("SUPPORT.HELP_SUPPORT_TITLE")}</h1>
						<p className="text-theme-neutral-600">{t("SUPPORT.HELP_SUPPORT_SUBTITLE")}</p>
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
					{categories &&
						categories.map((category: CategoryItemProps, index: number) => {
							return (
								<CategoryItem
									title={category.title}
									subtitle={category.subtitle}
									icon={category.icon}
									key={index}
								/>
							);
						})}
				</div>
			</div>
			<div className="px-12 py-10 mb-10 bg-white">
				<div className="flex flex-row">
					<div className="w-1/3 mr-10">
						<h3>{t("SUPPORT.HELPFUL_CATEGORY_TITLE")}</h3>
						<ul>
							{helpfulArticles &&
								helpfulArticles.map(({ title, path }: ArticleListItemProps, index: number) => (
									<ArticleListItem title={title} path={path} key={index} />
								))}
						</ul>
					</div>
					<div className="w-1/3 mr-10">
						<h3>{t("SUPPORT.POPULAR_CATEGORY_TITLE")}</h3>
						<ul>
							{popularArticles &&
								popularArticles.map(({ title, path }: ArticleListItemProps, index: number) => (
									<ArticleListItem title={title} path={path} key={index} />
								))}
						</ul>
					</div>
					<div className="w-1/3 mr-10">
						<h3>{t("SUPPORT.NEWEST_CATEGORY_TITLE")}</h3>
						<ul>
							{newestArticles &&
								newestArticles.map(({ title, path }: ArticleListItemProps, index: number) => (
									<ArticleListItem title={title} path={path} key={index} />
								))}
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
};
