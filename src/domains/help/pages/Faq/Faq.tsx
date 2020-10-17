import { Button } from "app/components/Button";
import { Header } from "app/components/Header";
import { Icon } from "app/components/Icon";
import { Page, Section } from "app/components/Layout";
import { useActiveProfile } from "app/hooks";
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
	<li className="border-dotted cursor-pointer border-b-1 border-theme-neutral-300 dark:border-theme-neutral-800 last:border-b-0">
		<a
			title={title}
			href={path}
			className="flex px-2 py-6 -mx-3 rounded-md border-3 border-theme-background hover:bg-theme-neutral-contrast text-theme-neutral-800 hover:text-theme-primary"
		>
			<div>
				<div className="pt-1 text-theme-neutral-800">
					<Icon name="Article" width={16} height={16} />
				</div>
			</div>
			<div>
				<div className="mb-2 ml-3 text-lg font-bold text-theme-neutral-800">{title}</div>
				<div className="ml-3 text-theme-neutral-600">{description}</div>
			</div>
		</a>
	</li>
);

export const Faq = ({ articles }: FaqProps) => {
	const activeProfile = useActiveProfile();

	const { t } = useTranslation();

	const crumbs = [
		{
			route: `/profiles/${activeProfile.id()}/support`,
			label: t("HELP.GO_BACK_TO_HELP_SUPPORT"),
		},
	];

	return (
		<Page profile={activeProfile} crumbs={crumbs}>
			<Section>
				<Header
					title={t("HELP.PAGE_FAQ.PORTFOLIO.TITLE")}
					subtitle={t("HELP.PAGE_FAQ.PORTFOLIO.SUBTITLE")}
					extra={
						<div className="flex items-center justify-end space-x-8">
							<Icon
								name="Search"
								className="cursor-pointer text-theme-primary-contrast"
								width={20}
								height={20}
							/>
							<div className="h-10 my-auto border-l border-theme-primary-contrast" />
							<Button className="whitespace-no-wrap">{t("HELP.CONTACT_US")}</Button>
						</div>
					}
				/>
			</Section>

			<Section className="flex-1">
				<div className="mr-10">
					<ul>
						{articles &&
							articles.map(({ title, path, description }: ArticleListItemProps, index: number) => (
								<ArticleListItem title={title} path={path} key={index} description={description} />
							))}
					</ul>
				</div>
			</Section>
		</Page>
	);
};

Faq.defaultProps = {
	articles: [],
};
