import { Button } from "app/components/Button";
import { Header } from "app/components/Header";
import { Icon } from "app/components/Icon";
import { Page, Section } from "app/components/Layout";
import { useActiveProfile } from "app/hooks";
import { ContactForm } from "domains/help/components/ContactForm";
import { SocialButton } from "domains/help/components/SocialButton";
import React from "react";
import { useTranslation } from "react-i18next";

export const ContactUs = () => {
	const { t } = useTranslation();
	const activeProfile = useActiveProfile();

	const crumbs = [
		{
			route: `/profiles/${activeProfile.id()}/dashboard`,
			label: t("COMMON.GO_BACK_TO_PORTFOLIO"),
		},
	];

	return (
		<Page profile={activeProfile} crumbs={crumbs}>
			<Section>
				<Header title={t("HELP.PAGE_CONTACT_US.TITLE")} subtitle={t("HELP.PAGE_CONTACT_US.SUBTITLE")} />
			</Section>

			<Section className="flex-1">
				<div className="flex flex-col space-y-16 md:py-8 lg:flex-row lg:space-x-8 lg:space-y-0 xl:space-x-16">
					<div className="flex-1 space-y-8 border-theme-neutral-300 dark:border-theme-neutral-800 lg:border-r lg:pr-8 xl:pr-24">
						<div className="pb-8 border-b border-dashed border-theme-neutral-300 dark:border-theme-neutral-800">
							<h3 className="mb-1 text-3xl font-bold">{t("HELP.PAGE_CONTACT_US.SECTION_FIRST.TITLE")}</h3>
							<div className="mt-4 leading-7 text-justify text-theme-secondary-text">
								{t("HELP.PAGE_CONTACT_US.SECTION_FIRST.DESCRIPTION")}
							</div>
						</div>

						<div className="pb-8 border-b border-dashed border-theme-neutral-300 dark:border-theme-neutral-800">
							<h3 className="mb-1 text-3xl font-bold">
								{t("HELP.PAGE_CONTACT_US.SECTION_SECOND.TITLE")}
							</h3>
							<div className="mt-4 leading-7 text-justify text-theme-secondary-text">
								{t("HELP.PAGE_CONTACT_US.SECTION_SECOND.DESCRIPTION")}
							</div>
							<div className="flex flex-col mt-6 space-y-3 sm:flex-row sm:space-x-2 sm:space-y-0 sm:items-center">
								<Button variant="plain">
									{t("HELP.PAGE_CONTACT_US.SECTION_SECOND.DOCUMENTATION")}
								</Button>
								<span className="font-semibold leading-none text-center text-theme-secondary-text">
									or
								</span>
								<Button variant="plain" className="space-x-2">
									<Icon name="SlackFlat" width={20} height={20} />
									<span>{t("HELP.PAGE_CONTACT_US.SECTION_SECOND.SLACK")}</span>
								</Button>
								<Button variant="plain" className="space-x-2">
									<Icon name="DiscordFlat" width={20} height={20} />
									<span>{t("HELP.PAGE_CONTACT_US.SECTION_SECOND.DISCORD")}</span>
								</Button>
							</div>
						</div>

						<div className="space-y-3 text-theme-secondary-900">
							<div className="font-bold">{t("HELP.PAGE_CONTACT_US.SECTION_THIRD.TITLE")}</div>
							<div className="flex space-x-3">
								<SocialButton icon="Twitter" link="https://twitter.ark.io/" />
								<SocialButton icon="Facebook" link="https://facebook.ark.io/" />
								<SocialButton icon="Reddit" link="https://reddit.ark.io/" />
								<SocialButton icon="LinkedIn" link="https://www.linkedin.com/company/ark-ecosystem" />
							</div>
						</div>
					</div>
					<div className="flex flex-col flex-1 lg:px-5">
						<h3 className="mb-1 text-3xl font-bold">{t("HELP.PAGE_CONTACT_US.SECTION_FOURTH.TITLE")}</h3>
						<div className="mt-4 text-theme-secondary-text">
							{t("HELP.PAGE_CONTACT_US.SECTION_FOURTH.DESCRIPTION")}
						</div>
						<ContactForm />
					</div>
				</div>
			</Section>
		</Page>
	);
};
