import { Button } from "app/components/Button";
import { Form } from "app/components/Form";
import { Icon } from "app/components/Icon";
import { Page, Section } from "app/components/Layout";
import { StepIndicator } from "app/components/StepIndicator";
import { TabPanel, Tabs } from "app/components/Tabs";
import { useActiveProfile } from "app/hooks/env";
import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { FirstStep } from "./Step1";
import { SecondStep } from "./Step2";
import { ThirdStep } from "./Step3";
import { FourthStep } from "./Step4";

type SendEntityUpdateProps = {
	formDefaultData?: any;
	onDownload: any;
};

export const SendEntityUpdate = ({ formDefaultData, onDownload }: SendEntityUpdateProps) => {
	const [activeTab, setActiveTab] = React.useState(1);

	const form = useForm({ mode: "onChange", defaultValues: formDefaultData });
	const { formState } = form;
	const { isValid } = formState;

	const activeProfile = useActiveProfile();

	const { t } = useTranslation();

	const handleBack = () => {
		setActiveTab(activeTab - 1);
	};

	const handleNext = () => {
		setActiveTab(activeTab + 1);
	};

	const crumbs = [
		{
			route: `/profiles/${activeProfile.id()}/dashboard`,
			label: t("COMMON.GO_BACK_TO_PORTFOLIO"),
		},
	];

	return (
		<Page profile={activeProfile} crumbs={crumbs}>
			<Section className="flex-1">
				<Form className="max-w-xl mx-auto" context={form} onSubmit={(data: any) => onDownload(data)}>
					<Tabs activeId={activeTab}>
						<StepIndicator size={6} activeIndex={activeTab} />

						<div className="mt-8">
							<TabPanel tabId={1}>
								<FirstStep form={form} />
							</TabPanel>
							<TabPanel tabId={2}>
								<SecondStep />
							</TabPanel>
							<TabPanel tabId={3}>
								<ThirdStep form={form} passwordType="mnemonic" />
							</TabPanel>
							<TabPanel tabId={4}>
								<ThirdStep form={form} passwordType="password" />
							</TabPanel>
							<TabPanel tabId={5}>
								<ThirdStep form={form} passwordType="ledger" />
							</TabPanel>
							<TabPanel tabId={6}>
								<FourthStep />
							</TabPanel>

							<div className="flex justify-end mt-8 space-x-3">
								{activeTab < 6 && (
									<Button
										disabled={activeTab === 1}
										data-testid="SendEntityUpdate__back-button"
										variant="plain"
										onClick={handleBack}
									>
										{t("COMMON.BACK")}
									</Button>
								)}

								{activeTab < 3 && (
									<Button
										data-testid="SendEntityUpdate__continue-button"
										disabled={!isValid}
										onClick={handleNext}
									>
										{t("COMMON.CONTINUE")}
									</Button>
								)}

								{activeTab >= 3 && activeTab < 6 && (
									<Button
										data-testid="SendEntityUpdate__send-button"
										disabled={!isValid}
										onClick={handleNext}
										className="space-x-2"
									>
										<Icon name="Send" width={20} height={20} />
										<span>{t("COMMON.SEND")}</span>
									</Button>
								)}

								{activeTab === 6 && (
									<div className="flex justify-end space-x-3">
										<Button data-testid="SendEntityUpdate__wallet-button" variant="plain">
											{t("COMMON.BACK_TO_WALLET")}
										</Button>

										<Button
											type="submit"
											data-testid="SendEntityUpdate__download-button"
											variant="plain"
											className="space-x-2"
										>
											<Icon name="Download" />
											<span>{t("COMMON.DOWNLOAD")}</span>
										</Button>
									</div>
								)}
							</div>
						</div>
					</Tabs>
				</Form>
			</Section>
		</Page>
	);
};

SendEntityUpdate.defaultProps = {
	formDefaultData: {},
};
