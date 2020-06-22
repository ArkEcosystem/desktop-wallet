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
	<li className="flex border-b-1 border-dotted border-theme-neutral-300 last:border-b-0 cursor-pointer">
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
			<div className="text-theme-neutral-800 ml-3">{title}</div>
		</a>
	</li>
);

const CategoryItem = ({ icon, title, subtitle, path }: CategoryItemProps) => (
	<a
		href={path}
		title={title}
		className="flex flex-row p-4 w-64 border-r-1 last:border-r-0 border-theme-neutral-200 cursor-pointer hover:shadow-xl bg-white"
	>
		<div className="my-auto w-1/3">
			<Circle className="border-theme-neutral-800" size="large">
				<div className="text-theme-neutral-800">
					<Icon name={icon} width={22} height={22} />
				</div>
			</Circle>
		</div>
		<div className="my-auto flex-auto">
			<div className="text-theme-neutral-800 font-bold">{title}</div>
			<div className="text-theme-neutral-500 text-sm">{subtitle}</div>
		</div>
	</a>
);

export const Main = ({ categories, helpfulArticles, popularArticles, newestArticles }: SupportProps) => {
	const { t } = useTranslation();
	return (
		<div className="-m-5 bg-theme-neutral-200">
			<div className="py-10 px-12 bg-white mb-10">
				<div className="flex">
					<div className="w-2/3">
						<h1>{t("SUPPORT.HELP_SUPPORT_TITLE")}</h1>
						<p className="text-theme-neutral-600">{t("SUPPORT.HELP_SUPPORT_SUBTITLE")}</p>
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
			<div className="py-10 px-12 bg-white mb-10">
				<div className="flex flex-row">
					<div className="mr-10 w-1/3">
						<h3>{t("SUPPORT.HELPFUL_CATEGORY_TITLE")}</h3>
						<ul>
							{helpfulArticles &&
								helpfulArticles.map(({ title, path }: ArticleListItemProps, index: number) => (
									<ArticleListItem title={title} path={path} key={index} />
								))}
						</ul>
					</div>
					<div className="mr-10 w-1/3">
						<h3>{t("SUPPORT.POPULAR_CATEGORY_TITLE")}</h3>
						<ul>
							{popularArticles &&
								popularArticles.map(({ title, path }: ArticleListItemProps, index: number) => (
									<ArticleListItem title={title} path={path} key={index} />
								))}
						</ul>
					</div>
					<div className="mr-10 w-1/3">
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
