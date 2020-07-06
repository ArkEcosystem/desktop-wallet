import { Button } from "app/components/Button";
import { Header } from "app/components/Header";
import { Icon } from "app/components/Icon";
import { NavigationBar } from "app/components/NavigationBar";
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
	<li className="border-b-1 border-theme-neutral-300 last:border-b-0 border-dotted cursor-pointer">
		<a
			title={title}
			href={path}
			className="border-3 border-theme-background hover:bg-theme-neutral-100 text-theme-neutral-800 hover:text-theme-primary-600 flex px-2 py-6 -mx-3 rounded-md"
		>
			<div>
				<div className="text-theme-neutral-800 pt-1">
					<Icon name="Article" width={16} height={16} />
				</div>
			</div>
			<div>
				<div className="text-theme-neutral-800 mb-2 ml-3 text-lg font-bold">{title}</div>
				<div className="text-theme-neutral-600 ml-3">{description}</div>
			</div>
		</a>
	</li>
);

export const Faq = ({ articles }: FaqProps) => {
	const { t } = useTranslation();
	return (
		<div>
			<NavigationBar currencyIcon="Ark" balance="34,253.75" userInitials="IO" />

			<div className="bg-theme-neutral-100">
				<div className="px-13 py-16 mb-5 bg-white">
					<Header
						title={t("HELP.PAGE_FAQ.PORTFOLIO.TITLE")}
						subtitle={t("HELP.PAGE_FAQ.PORTFOLIO.SUBTITLE")}
						extra={
							<div className="flex items-center justify-end space-x-8">
								<Icon
									name="Search"
									className="text-theme-primary-100 cursor-pointer"
									width={20}
									height={20}
								/>
								<div className="border-1 border-theme-primary-100 h-10 my-auto border-l" />
								<Button className="whitespace-no-wrap">{t("HELP.CONTACT_US")}</Button>
							</div>
						}
					/>
				</div>

				<div className="px-12 py-10 mb-10 bg-white">
					<div className="flex flex-row">
						<div className="mr-10">
							<ul>
								{articles &&
									articles.map(
										({ title, path, description }: ArticleListItemProps, index: number) => (
											<ArticleListItem
												title={title}
												path={path}
												key={index}
												description={description}
											/>
										),
									)}
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

Faq.defaultProps = {
	articles: [],
};
