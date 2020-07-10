import { Button } from "app/components/Button";
import { Header } from "app/components/Header";
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
			className="flex px-2 py-6 -mx-3 border-3 border-theme-background hover:bg-theme-neutral-contrast text-theme-neutral-800 hover:text-theme-primary rounded-md"
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
	const { t } = useTranslation();
	return (
		<div>
			<div className="bg-theme-neutral-contrast">
				<div className="py-16 mb-5 bg-white px-13">
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
								<div className="h-10 my-auto border-l border-1 border-theme-primary-contrast" />
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
