import { Button } from "app/components/Button";
import { Icon } from "app/components/Icon";
import React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "twin.macro";

import { navStyles } from "./Article.styles";

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
	image?: string;
};

type FastNavProps = {
	sections?: SectionItem[];
};

const NavWrapper = styled.div`
	${navStyles}
`;

const FastNavigation = ({ sections }: FastNavProps) => {
	const activeClass = (index: number) => {
		return index === 0 ? "active" : "";
	};

	return (
		<NavWrapper className="sticky float-right w-32 top-2">
			<div className="pl-3 text-xs font-bold text-theme-neutral-400 border-l-1 border-theme-neutral-300">
				Fast navigation
			</div>
			<ul>
				{sections &&
					sections.map((section: SectionItem, index) => {
						return (
							<li
								className={`text-sm border-l-1 border-theme-neutral-300 text-theme-neutral-800 ${activeClass(
									index,
								)}`}
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
		</NavWrapper>
	);
};

export const Article = ({ title, category, categoryIcon, views, sections, image }: ArticleProps) => {
	const { t } = useTranslation();
	return (
		<div className="-m-5">
			<div className="px-12 py-10 mb-10 bg-white">
				<FastNavigation sections={sections} />

				<div className="max-w-xl mx-auto text-sm">
					<div className="flex mb-4">
						<div className="flex">
							<div className="my-auto mr-2">
								<Icon name={categoryIcon} />
							</div>
							<div className="font-bold font-sm text-theme-neutral-700">{category}</div>
						</div>
						{views && (
							<div className="flex ml-5">
								<div className="my-auto mr-2">
									<Icon name="EyeTag" width={18} height={18} />
								</div>
								<div className="font-bold font-sm text-theme-neutral-700">{views}</div>
							</div>
						)}
					</div>
					<h1 className="leading-tight">{title}</h1>
					{image && <img src={image} />}
					<div>
						{sections &&
							sections.map((section: SectionItem, index) => {
								return (
									<div className="mt-8" id={section.id} key={index}>
										<h3>{section.title}</h3>
										<p className="whitespace-pre-line text-theme-neutral-700 text-md">
											{section.body}
										</p>
									</div>
								);
							})}
					</div>
				</div>
			</div>
			<div className="px-12 py-10 bg-white border-t-1 border-theme-neutral-300">
				<div className="max-w-xl mx-auto">
					<div className="flex">
						<div className="w-3/4">
							<h3>{t("SUPPORT.FOOTER_HELP_TITLE")}</h3>
							<p className="text-theme-neutral-600">{t("SUPPORT.FOOTER_HELP_SUBTITLE")}</p>
						</div>
						<div className="flex justify-end w-1/4">
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
