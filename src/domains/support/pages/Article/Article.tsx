import { Button } from "app/components/Button";
import { Icon } from "app/components/Icon";
import React from "react";
import { useTranslation } from "react-i18next";

type SectionItem = {
	title: string;
	body: string;
	id: string;
};

type ArticleProps = {
	title: string;
	category: string;
	categoryIcon: string;
	views?: string;
	sections?: SectionItem[];
};

type FastNavProps = {
	sections?: SectionItem[];
};

const FastNavigation = ({ sections }: FastNavProps) => {
	return (
		<div className="sticky float-right top-2 w-32">
			<div className="font-bold text-xs text-theme-neutral-400 pl-3 border-l-1 border-theme-neutral-300">
				Fast navigation
			</div>
			<ul>
				{sections &&
					sections.map((section: SectionItem, index) => {
						return (
							<li
								className="text-sm border-l-1 border-theme-neutral-300 text-theme-neutral-700"
								key={index}
							>
								<a
									className="block px-3 py-2 whitespace-no-wrap"
									href={`#${section.id}`}
									title={section.title}
								>
									{section.title}
								</a>
							</li>
						);
					})}
			</ul>
		</div>
	);
};

export const Article = ({ title, category, categoryIcon, views, sections }: ArticleProps) => {
	const { t } = useTranslation();
	return (
		<div className="-m-5">
			<div className="py-10 px-12 bg-white mb-10">
				<FastNavigation sections={sections} />

				<div className="max-w-xl mx-auto text-sm">
					<div className="flex mb-4">
						<div className="flex">
							<div className="my-auto mr-1">
								<Icon name={categoryIcon} />
							</div>
							<div className="font-bold font-sm text-theme-neutral-700">{category}</div>
						</div>
						{views && (
							<div className="flex ml-4">
								<div className="my-auto mr-1">
									<Icon name="Eye" />
								</div>
								<div className="font-bold font-sm text-theme-neutral-700">{views}</div>
							</div>
						)}
					</div>
					<h1 className="leading-tight">{title}</h1>
					<div>
						{sections &&
							sections.map((section: SectionItem, index) => {
								return (
									<div className="mt-8" id={section.id} key={index}>
										<h3>{section.title}</h3>
										<p className="text-theme-neutral-700 text-md whitespace-pre-line">
											{section.body}
										</p>
									</div>
								);
							})}
					</div>
				</div>
			</div>
			<div className="py-10 px-12 bg-white border-t-1 border-theme-neutral-300">
				<div className="max-w-xl mx-auto">
					<div className="flex">
						<div className="w-3/4">
							<h3>{t("SUPPORT.FOOTER_HELP_TITLE")}</h3>
							<p className="text-theme-neutral-600">{t("SUPPORT.FOOTER_HELP_SUBTITLE")}</p>
						</div>
						<div className="w-1/4 flex justify-end">
							<div className="my-auto">
								<Button color="primary">{t("SUPPORT.CONTACT_US")}</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
