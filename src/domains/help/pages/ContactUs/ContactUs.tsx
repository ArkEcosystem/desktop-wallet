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
		</Page>
	);
};
