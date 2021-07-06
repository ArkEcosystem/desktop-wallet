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
import { getDefaultAlias } from "domains/wallet/utils/get-default-alias";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { assertNetwork, assertString, assertWallet } from "utils/assertions";

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

	const submitForm = async ({ mnemonic, name, network, wallet }: any) => {
		let finalWallet = wallet;

		assertNetwork(network);
		assertWallet(finalWallet);
		assertString(mnemonic);
		assertString(name);

		if (encryptionPassword) {
			try {
				finalWallet = await activeProfile.walletFactory().fromMnemonicWithBIP39({
					coin: network.coin(),
					mnemonic,
					network: network.id(),
					password: encryptionPassword,
				});
			} catch {
				setGenerationError(t("WALLETS.PAGE_CREATE_WALLET.NETWORK_STEP.GENERATION_ERROR"));
			}
		}

		activeProfile.wallets().push(finalWallet);

		if (name.trim() !== finalWallet.alias()) {
			activeProfile.wallets().update(finalWallet.id(), { alias: name.trim() });
		}

		setConfiguration("selectedNetworkIds", uniq([...selectedNetworkIds, network.id()]));

		await persist();

		setValue("wallet", undefined);

		history.push(`/profiles/${activeProfile.id()}/wallets/${finalWallet.id()}`);
	};

	const generateWallet = async () => {
		const network = getValues("network");
		assertNetwork(network);

		const locale = activeProfile.settings().get<string>(Contracts.ProfileSetting.Bip39Locale, "english");
		const { mnemonic, wallet } = await activeProfile.walletFactory().generate({
			coin: network.coin(),
			locale,
			network: network.id(),
			wordCount: network.wordCount(),
		});

		wallet.mutator().alias(
			getDefaultAlias({
				profile: activeProfile,
				ticker: network.ticker(),
			}),
		);

		setValue("wallet", wallet, { shouldDirty: true, shouldValidate: true });
		setValue("mnemonic", mnemonic, { shouldDirty: true, shouldValidate: true });
	};

	const handleBack = () => {
		if (activeTab === 1) {
			return history.push(`/profiles/${activeProfile.id()}/dashboard`);
		}

		if (activeTab === 4 || activeTab === 5) {
			setEncryptionPassword(undefined);
		}

		const network = getValues("network");
		assertNetwork(network);

		if (activeTab === 5 && !network.importMethods()?.bip39?.canBeEncrypted) {
			setActiveTab(activeTab - 2);
		} else {
			setActiveTab(activeTab - 1);
		}
	};

	const handleNext = async () => {
		const newIndex = activeTab + 1;

		if (newIndex === 2) {
			setGenerationError("");
			setIsGeneratingWallet(true);

			try {
				await generateWallet();
				setActiveTab(newIndex);
			} catch {
				setGenerationError(t("WALLETS.PAGE_CREATE_WALLET.NETWORK_STEP.GENERATION_ERROR"));
			} finally {
				setIsGeneratingWallet(false);
			}
		} else {
			const network = getValues("network");
			assertNetwork(network);

			if (newIndex === 4 && !network.importMethods()?.bip39?.canBeEncrypted) {
				setActiveTab(newIndex + 1);
			} else {
				setActiveTab(newIndex);
			}
		}
	};

	const handlePasswordSubmit = () => {
		setEncryptionPassword(form.getValues("encryptionPassword"));
		handleNext();
	};

	return (
		<Page profile={activeProfile}>
			<Section className="flex-1">
				<Form className="mx-auto max-w-xl" context={form} onSubmit={submitForm}>
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
								<SuccessStep profile={activeProfile} />
							</TabPanel>

							<div className="flex justify-between mt-8">
								<div>
									{activeTab === 4 && (
										<Button data-testid="CreateWallet__skip-button" onClick={handleNext}>
											{t("COMMON.SKIP")}
										</Button>
									)}
								</div>

								<div className="flex justify-end space-x-3">
									{activeTab < 5 && (
										<Button
											disabled={isSubmitting}
											data-testid="CreateWallet__back-button"
											variant="secondary"
											onClick={handleBack}
										>
											{t("COMMON.BACK")}
										</Button>
									)}

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
