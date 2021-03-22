import { Coins } from "@arkecosystem/platform-sdk";
import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { uniq } from "@arkecosystem/utils";
import { Button } from "app/components/Button";
import { Form } from "app/components/Form";
import { Page, Section } from "app/components/Layout";
import { StepIndicator } from "app/components/StepIndicator";
import { TabPanel, Tabs } from "app/components/Tabs";
import { useEnvironmentContext } from "app/contexts";
import { useQueryParams } from "app/hooks";
import { useActiveProfile } from "app/hooks/env";
import { toasts } from "app/services";
import { useDashboardConfig } from "domains/dashboard/pages";
import { EncryptPasswordStep } from "domains/wallet/components/EncryptPasswordStep";
import { useWalletImport, WalletGenerationInput } from "domains/wallet/hooks/use-wallet-import";
import { useWalletSync } from "domains/wallet/hooks/use-wallet-sync";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { LedgerTabs } from "./Ledger/LedgerTabs";
import { FirstStep } from "./Step1";
import { SecondStep } from "./Step2";
import { ThirdStep } from "./Step3";

export const ImportWallet = () => {
	const [activeTab, setActiveTab] = useState(1);
	const [walletData, setWalletData] = useState<ReadWriteWallet | null>(null);
	const [walletGenerationInput, setWalletGenerationInput] = useState<WalletGenerationInput>();

	const queryParams = useQueryParams();
	const isLedgerImport = !!queryParams.get("ledger");

	const history = useHistory();
	const { env, persist } = useEnvironmentContext();

	const activeProfile = useActiveProfile();
	const { selectedNetworkIds, setValue } = useDashboardConfig({ profile: activeProfile });

	const { t } = useTranslation();
	const { importWalletByType } = useWalletImport({ profile: activeProfile });
	const { syncAll } = useWalletSync({ profile: activeProfile, env });

	const form = useForm({ mode: "onChange", defaultValues: { type: "mnemonic" } });
	const { formState, register, watch, handleSubmit, unregister } = form;
	const { isSubmitting, isValid } = formState;
	const { value, encryptionPassword, confirmEncryptionPassword } = watch();

	const nameMaxLength = 42;

	useEffect(() => {
		register({ name: "type", type: "custom" });
	}, [register]);

	useEffect(() => {
		if (value !== undefined) {
			setWalletGenerationInput(value);
		}
	}, [value, setWalletGenerationInput]);

	const handleNext = () => {
		const type = form.getValues("type");

		if (activeTab === 2 && type !== "mnemonic") {
			return handleSkipAndSubmit();
		}

		setActiveTab(activeTab + 1);
	};

	const handleBack = () => {
		if (activeTab === 1) {
			return history.push(`/profiles/${activeProfile.id()}/dashboard`);
		}

		setActiveTab(activeTab - 1);
	};

	const importAndSaveWallet = async ({
		network,
		type,
		encryptedWif,
		password,
	}: {
		network: Coins.Network;
		type: string;
		encryptedWif: string;
		password?: string;
	}) => {
		try {
			const wallet = await importWalletByType({
				network,
				type,
				value: walletGenerationInput!,
				encryptedWif,
				password,
			});

			setValue("selectedNetworkIds", uniq([...selectedNetworkIds, wallet!.network().id()]));
			setWalletData(wallet!);

			await syncAll(wallet!);
			await persist();

			setActiveTab(4);
		} catch (e) {
			toasts.error(e.message);
		}
	};

	const handleSkipAndSubmit = () => {
		unregister(["encryptionPassword", "confirmEncryptionPassword"]);

		const { network, type, encryptedWif } = form.getValues();
		handleSubmit(() => importAndSaveWallet({ network, type, encryptedWif }))();
	};

	const handlePasswordSubmit = () => {
		const { network, type, encryptedWif } = form.getValues();
		handleSubmit(() => importAndSaveWallet({ network, type, encryptedWif, password: encryptionPassword }))();
	};

	const handleFinish = async () => {
		const name = form.getValues("name");

		if (name) {
			const formattedName = name.trim().substring(0, nameMaxLength);
			walletData?.setAlias(formattedName);
			await persist();
		}

		history.push(`/profiles/${activeProfile.id()}/wallets/${walletData?.id()}`);
	};

	return (
		<Page profile={activeProfile}>
			<Section className="flex-1">
				<Form
					className="mx-auto max-w-xl"
					context={form}
					onSubmit={importAndSaveWallet as any}
					data-testid="ImportWallet__form"
				>
					{isLedgerImport ? (
						<LedgerTabs />
					) : (
						<Tabs activeId={activeTab}>
							<StepIndicator size={4} activeIndex={activeTab} />

							<div className="mt-8">
								<TabPanel tabId={1}>
									<FirstStep profile={activeProfile} />
								</TabPanel>
								<TabPanel tabId={2}>
									<SecondStep profile={activeProfile} />
								</TabPanel>

								<TabPanel tabId={3}>
									<EncryptPasswordStep />
								</TabPanel>

								<TabPanel tabId={4}>
									<ThirdStep
										address={walletData?.address() as string}
										balance={walletData?.balance() as BigNumber}
										nameMaxLength={nameMaxLength}
										profile={activeProfile}
									/>
								</TabPanel>

								<div className="flex justify-between mt-10">
									<div>
										{activeTab === 3 && (
											<Button
												disabled={isSubmitting}
												onClick={handleSkipAndSubmit}
												data-testid="ImportWallet__skip-button"
											>
												{t("COMMON.SKIP")}
											</Button>
										)}
									</div>

									<div className="flex justify-end space-x-3">
										{activeTab < 4 && (
											<Button
												disabled={isSubmitting}
												variant="secondary"
												onClick={handleBack}
												data-testid="ImportWallet__back-button"
											>
												{t("COMMON.BACK")}
											</Button>
										)}

										{activeTab < 3 && (
											<Button
												disabled={!isValid || isSubmitting}
												isLoading={isSubmitting}
												onClick={handleNext}
												data-testid="ImportWallet__continue-button"
											>
												{t("COMMON.CONTINUE")}
											</Button>
										)}

										{activeTab === 3 && (
											<Button
												disabled={
													isSubmitting ||
													!isValid ||
													!encryptionPassword ||
													!confirmEncryptionPassword
												}
												isLoading={isSubmitting}
												onClick={handlePasswordSubmit}
												data-testid="ImportWallet__continue-button"
											>
												{t("COMMON.CONTINUE")}
											</Button>
										)}

										{activeTab === 4 && (
											<Button
												disabled={!isValid || isSubmitting}
												data-testid="ImportWallet__save-button"
												onClick={handleFinish}
											>
												{t("COMMON.SAVE_FINISH")}
											</Button>
										)}
									</div>
								</div>
							</div>
						</Tabs>
					)}
				</Form>
			</Section>
		</Page>
	);
};
