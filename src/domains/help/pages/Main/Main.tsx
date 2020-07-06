import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { Header } from "app/components/Header";
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
	<li className="border-b-1 border-theme-neutral-300 last:border-b-0 border-dotted cursor-pointer">
		<a
			title={title}
			href={path}
			className="border-3 border-theme-background hover:bg-theme-neutral-100 text-theme-neutral-800 hover:text-theme-primary-600 flex px-2 py-4 -mx-3 rounded-md"
		>
			<div>
				<div className="text-theme-neutral-800 pt-1">
					<Icon name="Article" width={16} height={16} />
				</div>
			</div>
			<div className="ml-3">{title}</div>
		</a>
	</li>
);

const CategoryItem = ({ icon, title, subtitle, path }: CategoryItemProps) => (
	<a
		href={path}
		title={title}
		className="border-r-1 last:border-r-0 border-theme-neutral-200 flex flex-row w-64 cursor-pointer"
	>
		<div className="px-7 hover:shadow-xl flex flex-row w-full p-5 mx-2 bg-white rounded-md">
			<div className="w-2/5 my-auto">
				<Circle className="border-theme-neutral-800" size="lg">
					<div className="text-theme-neutral-800">
						<Icon name={icon} width={20} height={20} />
					</div>
				</Circle>
			</div>
			<div className="flex-auto my-auto">
				<div className="text-theme-neutral-800 font-bold">{title}</div>
				<div className="text-theme-neutral-500 text-sm">{subtitle}</div>
			</div>
		</div>
	</a>
);

export const Main = ({ categories, helpfulArticles, popularArticles, newestArticles }: SupportProps) => {
	const { t } = useTranslation();
	return (
		<div>
			<div className="bg-theme-neutral-100">
				<div className="px-13 py-16 mb-5 bg-white">
					<Header
						title={t("HELP.PAGE_SUPPORT.TITLE")}
						subtitle={t("HELP.PAGE_SUPPORT.SUBTITLE")}
						extra={<Button color="primary">{t("HELP.CONTACT_US")}</Button>}
					/>
				</div>

				<div className="p-13 mb-5 bg-white">
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
				<div className="px-14 py-10 mb-10 bg-white">
					<div className="flex flex-row">
						<div className="w-1/3 mr-10">
							<h2>{t("HELP.PAGE_SUPPORT.CATEGORIES.HELPFUL")}</h2>
							<ul>
								{helpfulArticles &&
									helpfulArticles.map(({ title, path }: ArticleListItemProps, index: number) => (
										<ArticleListItem title={title} path={path} key={index} />
									))}
							</ul>
						</div>
						<div className="w-1/3 mr-10">
							<h2>{t("HELP.PAGE_SUPPORT.CATEGORIES.POPULAR")}</h2>
							<ul>
								{popularArticles &&
									popularArticles.map(({ title, path }: ArticleListItemProps, index: number) => (
										<ArticleListItem title={title} path={path} key={index} />
									))}
							</ul>
						</div>
						<div className="w-1/3 mr-10">
							<h2>{t("HELP.PAGE_SUPPORT.CATEGORIES.NEWEST")}</h2>
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
		</div>
	);
};
