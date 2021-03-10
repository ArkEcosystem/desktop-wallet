import { Page, Section } from "app/components/Layout";
import { StepIndicator } from "app/components/StepIndicator";
import { TabPanel, Tabs } from "app/components/Tabs";
import { SelectFileStep } from "domains/profile/pages/ImportProfile/SelectFileStep";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

export const ImportProfile = () => {
	const { t } = useTranslation();
	const [activeTab] = useState(1);
	const history = useHistory();

	return (
		<Page navbarVariant="logo-only" title={t("COMMON.DESKTOP_WALLET")}>
			<Section className="flex flex-col flex-1 justify-center">
				<div className="mx-auto max-w-xl">
					<StepIndicator size={4} activeIndex={activeTab} />

					<Tabs activeId={activeTab}>
						<TabPanel tabId={1}>
							<SelectFileStep onBack={() => history.push("/")} />
						</TabPanel>
					</Tabs>
				</div>
			</Section>
		</Page>
	);
};
