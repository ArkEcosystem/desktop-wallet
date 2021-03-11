import { uniq } from "@arkecosystem/utils";
import { Button } from "app/components/Button";
import { Form } from "app/components/Form";
import { Page, Section } from "app/components/Layout";
import { StepIndicator } from "app/components/StepIndicator";
import { TabPanel, Tabs } from "app/components/Tabs";
import { useEnvironmentContext } from "app/contexts";
import { useActiveProfile } from "app/hooks";
import { useDashboardConfig } from "domains/dashboard/pages";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { FirstStep } from "./Step1";
import { SecondStep } from "./Step2";
import { ThirdStep } from "./Step3";
import { FourthStep } from "./Step4";

export const CreateWallet = () => {
	const { env, persist } = useEnvironmentContext();
	const history = useHistory();
	const { t } = useTranslation();

	const [activeTab, setActiveTab] = useState(1);
	const activeProfile = useActiveProfile();
	const nameMaxLength = 42;

	const { selectedNetworkIds, setValue: setConfiguration } = useDashboardConfig({ profile: activeProfile });

	const form = useForm({ mode: "onChange" });
	const { getValues, formState, register, setValue, watch } = form;
	const { isSubmitting, isValid } = formState;

	const isGeneratingWallet = watch("isGeneratingWallet");

	useEffect(() => {
		register("network", { required: true });
		register("wallet", { required: true });
		register("mnemonic", { required: true });
	}, [register]);

	const submitForm = async ({ name }: any) => {
		const wallet = getValues("wallet");

		if (name) {
			const formattedName = name.trim().substring(0, nameMaxLength);
			activeProfile.wallets().update(wallet.id(), { alias: formattedName });
		}

		setConfiguration("selectedNetworkIds", uniq([...selectedNetworkIds, wallet.network().id()]));

		await persist();

		setValue("wallet", null);

		history.push(`/profiles/${activeProfile.id()}/wallets/${wallet.id()}`);
	};

	useEffect(
		() => () => {
			const currentWallet = getValues("wallet");

			if (currentWallet) {
				activeProfile.wallets().forget(currentWallet.id());
			}
		},
		[activeProfile, getValues],
	);

	const handleBack = () => {
		if (activeTab === 1) {
			return history.push(`/profiles/${activeProfile.id()}/dashboard`);
		}

		setActiveTab(activeTab - 1);
	};

	const handleNext = () => {
		setActiveTab(activeTab + 1);
	};

	return (
		<Page profile={activeProfile}>
			<Section className="flex-1">
				<Form className="mx-auto max-w-xl" context={form} onSubmit={submitForm}>
					<Tabs activeId={activeTab}>
						<StepIndicator size={4} activeIndex={activeTab} />

						<div className="mt-8">
							<TabPanel tabId={1}>
								<FirstStep env={env} profile={activeProfile} />
							</TabPanel>
							<TabPanel tabId={2}>
								<SecondStep />
							</TabPanel>
							<TabPanel tabId={3}>
								<ThirdStep />
							</TabPanel>
							<TabPanel tabId={4}>
								<FourthStep nameMaxLength={nameMaxLength} profile={activeProfile} />
							</TabPanel>

							<div className="flex justify-end mt-10 space-x-3">
								<Button
									disabled={isSubmitting}
									data-testid="CreateWallet__back-button"
									variant="secondary"
									onClick={handleBack}
								>
									{t("COMMON.BACK")}
								</Button>

								{activeTab < 4 && (
									<Button
										data-testid="CreateWallet__continue-button"
										disabled={!isValid}
										isLoading={isGeneratingWallet}
										onClick={handleNext}
									>
										{t("COMMON.CONTINUE")}
									</Button>
								)}

								{activeTab === 4 && (
									<Button
										disabled={!isValid || isSubmitting}
										type="submit"
										data-testid="CreateWallet__save-button"
									>
										{t("COMMON.SAVE_FINISH")}
									</Button>
								)}
							</div>
						</div>
					</Tabs>
				</Form>
			</Section>
		</Page>
	);
};
