import { uniq } from "@arkecosystem/utils";
import { Button } from "app/components/Button";
import { Form } from "app/components/Form";
import { Page, Section } from "app/components/Layout";
import { StepIndicator } from "app/components/StepIndicator";
import { TabPanel, Tabs } from "app/components/Tabs";
import { useEnvironmentContext } from "app/contexts";
import { useActiveProfile } from "app/hooks";
import { useDashboardConfig } from "domains/dashboard/pages";
import { EncryptPasswordStep } from "domains/wallet/components/EncryptPasswordStep";
import React, { useCallback, useEffect, useState } from "react";
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
	const [encryptionPassword, setEncryptionPassword] = useState<string>();
	const activeProfile = useActiveProfile();
	const nameMaxLength = 42;

	const { selectedNetworkIds, setValue: setConfiguration } = useDashboardConfig({ profile: activeProfile });

	const form = useForm({ mode: "onChange" });
	const { getValues, formState, register, setValue } = form;
	const { isSubmitting, isValid } = formState;

	const [isGeneratingWallet, setIsGeneratingWallet] = useState(false);
	const [showError, setShowError] = useState(false);

	useEffect(() => {
		register("network", { required: true });
		register("wallet");
		register("mnemonic");
	}, [register]);

	const submitForm = async ({ name }: any) => {
		let wallet = getValues("wallet");

		if (encryptionPassword) {
			try {
				const mnemonic = getValues("mnemonic");
				const coin = wallet.network().coin();
				const network = wallet.network().id();

				forgetTemporaryWallet();

				wallet = await activeProfile
					.wallets()
					.importByMnemonicWithEncryption(mnemonic, coin, network, encryptionPassword);
			} catch (error) {
				setShowError(true);
			}
		}

		if (name) {
			const formattedName = name.trim().substring(0, nameMaxLength);
			activeProfile.wallets().update(wallet.id(), { alias: formattedName });
		}

		setConfiguration("selectedNetworkIds", uniq([...selectedNetworkIds, wallet.network().id()]));

		await persist();

		setValue("wallet", null);

		history.push(`/profiles/${activeProfile.id()}/wallets/${wallet.id()}`);
	};

	const forgetTemporaryWallet = useCallback(() => {
		const currentWallet = getValues("wallet");

		if (currentWallet) {
			activeProfile.wallets().forget(currentWallet.id());
		}
	}, [activeProfile, getValues]);

	const generateWallet = async () => {
		const network = getValues("network");

		const { mnemonic, wallet } = await activeProfile.wallets().generate(network.coin(), network.id());

		setValue("wallet", wallet, { shouldValidate: true, shouldDirty: true });
		setValue("mnemonic", mnemonic, { shouldValidate: true, shouldDirty: true });
	};

	useEffect(() => forgetTemporaryWallet, [forgetTemporaryWallet]);

	const handleBack = () => {
		if (activeTab === 1) {
			return history.push(`/profiles/${activeProfile.id()}/dashboard`);
		}

		if (activeTab === 2) {
			forgetTemporaryWallet();
		}

		if (activeTab === 4 || activeTab === 5) {
			setEncryptionPassword(undefined);
		}

		setActiveTab(activeTab - 1);
	};

	const handleNext = async () => {
		const newIndex = activeTab + 1;

		if (newIndex === 5) {
			const isUsingEncryption = await form.trigger(["encryptionPassword", "confirmEncryptionPassword"]);
			if (isUsingEncryption) {
				setEncryptionPassword(form.getValues("encryptionPassword"));
			}
		}

		if (newIndex === 2) {
			setShowError(false);
			setIsGeneratingWallet(true);

			try {
				await generateWallet();
				setActiveTab(newIndex);
			} catch {
				setShowError(true);
			} finally {
				setIsGeneratingWallet(false);
			}
		} else {
			setActiveTab(newIndex);
		}
	};

	return (
		<Page profile={activeProfile}>
			<Section className="flex-1">
				<Form className="mx-auto max-w-xl" context={form} onSubmit={submitForm}>
					<Tabs activeId={activeTab}>
						<StepIndicator size={5} activeIndex={activeTab} />

						<div className="mt-8">
							<TabPanel tabId={1}>
								<FirstStep
									env={env}
									profile={activeProfile}
									isLoading={isGeneratingWallet}
									showError={showError}
								/>
							</TabPanel>
							<TabPanel tabId={2}>
								<SecondStep />
							</TabPanel>
							<TabPanel tabId={3}>
								<ThirdStep />
							</TabPanel>
							<TabPanel tabId={4}>
								<EncryptPasswordStep />
							</TabPanel>
							<TabPanel tabId={5}>
								<FourthStep nameMaxLength={nameMaxLength} profile={activeProfile} />
							</TabPanel>

							<div className="flex justify-between mt-10">
								<div>
									{activeTab === 4 && (
										<Button data-testid="CreateWallet__continue-button" onClick={handleNext}>
											{t("COMMON.SKIP")}
										</Button>
									)}
								</div>

								<div className="flex justify-end space-x-3">
									<Button
										disabled={isSubmitting}
										data-testid="CreateWallet__back-button"
										variant="secondary"
										onClick={handleBack}
									>
										{t("COMMON.BACK")}
									</Button>

									{activeTab < 5 && (
										<Button
											data-testid="CreateWallet__continue-button"
											disabled={!isValid}
											isLoading={isGeneratingWallet}
											onClick={handleNext}
										>
											{t("COMMON.CONTINUE")}
										</Button>
									)}

									{activeTab === 5 && (
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
						</div>
					</Tabs>
				</Form>
			</Section>
		</Page>
	);
};
