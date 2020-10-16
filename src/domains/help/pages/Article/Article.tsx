import { Button } from "app/components/Button";
import { Icon } from "app/components/Icon";
import { Page, Section } from "app/components/Layout";
import { useActiveProfile } from "app/hooks";
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
	const activeClass = (index: number) => (index === 0 ? "active" : "");

	return (
		<NavWrapper className="sticky float-right w-40 top-2">
			<div className="pl-3 text-xs font-bold text-theme-neutral-light border-l-1 border-theme-neutral-300">
				Fast navigation
			</div>
			<ul>
				{sections &&
					sections.map((section: SectionItem, index) => (
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
					))}
			</ul>
		</NavWrapper>
	);
};

export const Article = ({ title, category, categoryIcon, views, sections, image }: ArticleProps) => {
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
				<FastNavigation sections={sections} />

				<div className="max-w-2xl mx-auto">
					<div className="flex mb-4 text-sm">
						<div className="flex">
							<div className="my-auto mr-2">
								<Icon name={categoryIcon} />
							</div>
							<div className="font-bold font-sm text-theme-neutral-dark">{category}</div>
						</div>
						{views && (
							<div className="flex ml-5">
								<div className="my-auto mr-2">
									<Icon name="EyeTag" width={18} height={18} />
								</div>
								<div className="font-bold font-sm text-theme-neutral-dark">{views}</div>
							</div>
						)}
					</div>
					<h1 className="leading-tight">{title}</h1>
					{image && <img alt={title} src={image} />}
					{sections &&
						sections.map((section: SectionItem, index) => (
							<div className="mt-8" id={section.id} key={index}>
								<h3 className="text-lg">{section.title}</h3>
								<p className="whitespace-pre-line text-theme-neutral-dark">{section.body}</p>
							</div>
						))}
				</div>

				<div className="pt-16 mt-16 border-t-1 border-theme-neutral-300">
					<div className="max-w-2xl mx-auto">
						<div className="flex">
							<div className="w-3/4">
								<h3>{t("HELP.PAGE_ARTICLE.FOOTER.TITLE")}</h3>
								<p className="text-theme-neutral-600">{t("HELP.PAGE_ARTICLE.FOOTER.SUBTITLE")}</p>
							</div>
							<div className="flex justify-end w-1/4">
								<div className="my-auto">
									<Button color="primary">{t("HELP.CONTACT_US")}</Button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</Section>
		</Page>
	);
};
