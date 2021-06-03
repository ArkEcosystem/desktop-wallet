import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { uniq } from "@arkecosystem/utils";
import { Button } from "app/components/Button";
import { Form } from "app/components/Form";
import { Page, Section } from "app/components/Layout";
import { StepIndicator } from "app/components/StepIndicator";
import { TabPanel, Tabs } from "app/components/Tabs";
import { useEnvironmentContext } from "app/contexts";
import { useActiveProfile } from "app/hooks";
import { useWalletConfig } from "domains/dashboard/hooks";
import { EncryptPasswordStep } from "domains/wallet/components/EncryptPasswordStep";
import { NetworkStep } from "domains/wallet/components/NetworkStep";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { ConfirmPassphraseStep } from "./ConfirmPassphraseStep";
import { SuccessStep } from "./SuccessStep";
import { WalletOverviewStep } from "./WalletOverviewStep";

export const CreateWallet = () => {
	const { persist } = useEnvironmentContext();
	const history = useHistory();
	const { t } = useTranslation();

	const [activeTab, setActiveTab] = useState(1);
	const [encryptionPassword, setEncryptionPassword] = useState<string>();
	const activeProfile = useActiveProfile();

	const nameMaxLength = 42;

	const { selectedNetworkIds, setValue: setConfiguration } = useWalletConfig({ profile: activeProfile });

	const form = useForm({ mode: "onChange" });
	const { getValues, formState, register, setValue } = form;
	const { isSubmitting, isValid } = formState;

	const [isGeneratingWallet, setIsGeneratingWallet] = useState(false);
	const [generationError, setGenerationError] = useState("");

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

				wallet = await activeProfile.walletFactory().fromMnemonic({
					coin,
					network,
					password: encryptionPassword,
					mnemonic,
				});

				activeProfile.wallets().push(wallet);
			} catch (error) {
				setGenerationError(t("WALLETS.PAGE_CREATE_WALLET.NETWORK_STEP.GENERATION_ERROR"));
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

		const locale = activeProfile.settings().get<string>(Contracts.ProfileSetting.Bip39Locale, "english");
		const { mnemonic, wallet } = await activeProfile.walletFactory().generate({
			coin: network.coin(),
			locale,
			network: network.id(),
		});

		activeProfile.wallets().push(wallet);

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

		if (newIndex === 2) {
			setGenerationError("");
			setIsGeneratingWallet(true);

			try {
				await generateWallet();
				setActiveTab(newIndex);
			} catch (error) {
				setGenerationError(t("WALLETS.PAGE_CREATE_WALLET.NETWORK_STEP.GENERATION_ERROR"));
			} finally {
				setIsGeneratingWallet(false);
			}
		} else {
			setActiveTab(newIndex);
		}
	};

	const handlePasswordSubmit = () => {
		setEncryptionPassword(form.getValues("encryptionPassword"));
		handleNext();
	};

	return (
		<Page profile={activeProfile}>
			<Section className="flex-1">
				<Form className="max-w-xl mx-auto" context={form} onSubmit={submitForm}>
					<Tabs activeId={activeTab}>
						<StepIndicator size={5} activeIndex={activeTab} />

						<div className="mt-8">
							<TabPanel tabId={1}>
								<NetworkStep
									profile={activeProfile}
									title={t("WALLETS.PAGE_CREATE_WALLET.NETWORK_STEP.TITLE")}
									subtitle={t("WALLETS.PAGE_CREATE_WALLET.NETWORK_STEP.SUBTITLE")}
									disabled={isGeneratingWallet}
									error={generationError}
								/>
							</TabPanel>
							<TabPanel tabId={2}>
								<WalletOverviewStep />
							</TabPanel>
							<TabPanel tabId={3}>
								<ConfirmPassphraseStep />
							</TabPanel>
							<TabPanel tabId={4}>
								<EncryptPasswordStep />
							</TabPanel>
							<TabPanel tabId={5}>
								<SuccessStep nameMaxLength={nameMaxLength} profile={activeProfile} />
							</TabPanel>

							<div className="flex justify-between mt-10">
								<div>
									{activeTab === 4 && (
										<Button data-testid="CreateWallet__skip-button" onClick={handleNext}>
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
											data-testid="CreateWallet__continue-button"
											disabled={
												!isValid ||
												isGeneratingWallet ||
												!form.watch("encryptionPassword") ||
												!form.watch("confirmEncryptionPassword")
											}
											isLoading={isGeneratingWallet}
											onClick={handlePasswordSubmit}
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
