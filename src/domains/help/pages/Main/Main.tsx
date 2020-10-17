import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { Header } from "app/components/Header";
import { Icon } from "app/components/Icon";
import { Page, Section } from "app/components/Layout";
import { useActiveProfile } from "app/hooks";
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
	<li className="border-dotted cursor-pointer border-b-1 border-theme-neutral-300 dark:border-theme-neutral-800 last:border-b-0">
		<a
			title={title}
			href={path}
			className="flex px-2 py-4 -mx-3 rounded-md border-3 border-theme-background hover:bg-theme-neutral-contrast text-theme-neutral-800 hover:text-theme-primary"
		>
			<div>
				<div className="pt-1 text-theme-neutral-800">
					<Icon name="Article" width={16} height={16} />
				</div>
			</div>
			<div className="ml-3">{title}</div>
		</a>
	</li>
);

const CategoryItem = ({ icon, title, subtitle, path }: CategoryItemProps) => (
	<a href={path} title={title} className="flex flex-1 cursor-pointer">
		<div className="flex flex-row w-full p-8 mx-2 ml-2 bg-white rounded-md hover:shadow-xl">
			<Circle className="mr-3 border-theme-neutral-800" size="xl">
				<div className="text-theme-neutral-800">
					<Icon name={icon} width={20} height={20} />
				</div>
			</Circle>

			<div className="flex-auto my-auto">
				<div className="font-bold text-theme-neutral-800">{title}</div>
				<div className="text-sm text-theme-neutral">{subtitle}</div>
			</div>
		</div>
	</a>
);

export const Main = ({ categories, helpfulArticles, popularArticles, newestArticles }: SupportProps) => {
	const activeProfile = useActiveProfile();

	const { t } = useTranslation();

	return (
		<Page profile={activeProfile}>
			<Section>
				<Header
					title={t("HELP.PAGE_SUPPORT.TITLE")}
					subtitle={t("HELP.PAGE_SUPPORT.SUBTITLE")}
					extra={<Button>{t("HELP.CONTACT_US")}</Button>}
				/>
			</Section>

			<Section>
				<div className="flex flex-row -mx-2 divide-x divide-theme-neutral-200">
					{categories &&
						categories.map((category: CategoryItemProps, index: number) => (
							<CategoryItem
								title={category.title}
								subtitle={category.subtitle}
								icon={category.icon}
								key={index}
							/>
						))}
				</div>
			</Section>

			<Section>
				<div className="flex flex-row space-x-10">
					<div className="w-1/3">
						<h2>{t("HELP.PAGE_SUPPORT.CATEGORIES.HELPFUL")}</h2>
						<ul>
							{helpfulArticles &&
								helpfulArticles.map(({ title, path }: ArticleListItemProps, index: number) => (
									<ArticleListItem title={title} path={path} key={index} />
								))}
						</ul>
					</div>
					<div className="w-1/3">
						<h2>{t("HELP.PAGE_SUPPORT.CATEGORIES.POPULAR")}</h2>
						<ul>
							{popularArticles &&
								popularArticles.map(({ title, path }: ArticleListItemProps, index: number) => (
									<ArticleListItem title={title} path={path} key={index} />
								))}
						</ul>
					</div>
					<div className="w-1/3">
						<h2>{t("HELP.PAGE_SUPPORT.CATEGORIES.NEWEST")}</h2>
						<ul>
							{newestArticles &&
								newestArticles.map(({ title, path }: ArticleListItemProps, index: number) => (
									<ArticleListItem title={title} path={path} key={index} />
								))}
						</ul>
					</div>
				</div>
			</Section>
		</Page>
	);
};
