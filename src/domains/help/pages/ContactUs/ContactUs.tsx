import { Header } from "app/components/Header";
import { Page, Section } from "app/components/Layout";
import { useActiveProfile } from "app/hooks";
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
				<div className="flex flex-col py-16 space-y-16 content-container md:py-24 lg:flex-row lg:space-x-8 lg:space-y-0 xl:space-x-16">
					<div className="flex-1 space-y-8 border-theme-secondary-300 lg:border-r lg:pr-8 xl:pr-24">
						<div className="pb-8 border-b border-dashed border-theme-secondary-300">
							<h3>Let Us Help!</h3>
							<div className="mt-4 leading-7">
								Whether you want to learn more about ARK, need help with your Blockchain, or just want
								to know how ARK technology could work for you, get in touch and a member of the team
								will follow up with you.{" "}
							</div>
						</div>

						<div className="pb-8 border-b border-dashed border-theme-secondary-300">
							<h3>Additional Support</h3>
							<div className="mt-4 leading-7">
								Need more help? Check out our documentation below or reach out to our team members on
								Slack and Discord.{" "}
							</div>
						</div>
					</div>
				</div>
			</Section>
		</Page>
	);
};
