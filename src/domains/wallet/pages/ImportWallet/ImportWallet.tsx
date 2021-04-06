import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { uniq } from "@arkecosystem/utils";
import { Button } from "app/components/Button";
import { Form } from "app/components/Form";
import { Page, Section } from "app/components/Layout";
import { StepIndicator } from "app/components/StepIndicator";
import { TabPanel, Tabs } from "app/components/Tabs";
import { useEnvironmentContext } from "app/contexts";
import { useProfileUtils, useQueryParams } from "app/hooks";
import { useActiveProfile } from "app/hooks/env";
import { toasts } from "app/services";
import { useWalletConfig } from "domains/dashboard/hooks";
import { EncryptPasswordStep } from "domains/wallet/components/EncryptPasswordStep";
import { NetworkStep } from "domains/wallet/components/NetworkStep";
import { useWalletImport, WalletGenerationInput } from "domains/wallet/hooks/use-wallet-import";
import { useWalletSync } from "domains/wallet/hooks/use-wallet-sync";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { LedgerTabs } from "./Ledger/LedgerTabs";
import { SecondStep } from "./Step2";
import { ThirdStep } from "./Step3";

export const ImportWallet = () => {
	const [activeTab, setActiveTab] = useState(1);
	const [walletData, setWalletData] = useState<Contracts.IReadWriteWallet | null>(null);
	const [walletGenerationInput, setWalletGenerationInput] = useState<WalletGenerationInput>();

	const [isImporting, setIsImporting] = useState(false);
	const [isEncrypting, setIsEncrypting] = useState(false);

	const queryParams = useQueryParams();
	const isLedgerImport = !!queryParams.get("ledger");

	const history = useHistory();
	const { env, persist } = useEnvironmentContext();

	const activeProfile = useActiveProfile();
	const { saveProfile } = useProfileUtils(env);

	const { selectedNetworkIds, setValue } = useWalletConfig({ profile: activeProfile });

	const { t } = useTranslation();
	const { importWalletByType } = useWalletImport({ profile: activeProfile });
	const { syncAll } = useWalletSync({ profile: activeProfile, env });

	const form = useForm<any>({ mode: "onChange", defaultValues: { type: "mnemonic" } });
	const { getValues, formState, register, watch } = form;
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

	const handleNext = async () => {
		if (activeTab === 2) {
			setIsImporting(true);

			try {
				await importWallet();
				setActiveTab(activeTab + (getValues("type") === "mnemonic" ? 1 : 2));
			} catch (e) {
				toasts.error(e.message);
			} finally {
				setIsImporting(false);
			}
		} else if (activeTab === 3) {
			setIsEncrypting(true);

			await encryptMnemonic();
			setActiveTab(activeTab + 1);

			setIsEncrypting(false);
		} else {
			setActiveTab(activeTab + 1);
		}
	};

	const handleBack = () => {
		if (activeTab === 1) {
			return history.push(`/profiles/${activeProfile.id()}/dashboard`);
		}

		setActiveTab(activeTab - 1);
	};

	const importWallet = async () => {
		const { network, type, encryptedWif } = getValues();

		const wallet: any = await importWalletByType({
			network,
			type,
			value: walletGenerationInput!,
			encryptedWif,
		});

		setValue("selectedNetworkIds", uniq([...selectedNetworkIds, wallet.network().id()]));
		setWalletData(wallet);

		await syncAll(wallet);

		saveProfile(activeProfile);

		await persist();
	};

	const encryptMnemonic = async () => {
		await walletData!.setWif(walletGenerationInput!, getValues("encryptionPassword"));

		saveProfile(activeProfile);

		await persist();
	};

	const handleFinish = async () => {
		const name = getValues("name");

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
					className="max-w-xl mx-auto"
					context={form}
					onSubmit={handleFinish}
					data-testid="ImportWallet__form"
				>
					{isLedgerImport ? (
						<LedgerTabs />
					) : (
						<Tabs activeId={activeTab}>
							<StepIndicator size={4} activeIndex={activeTab} />

							<div className="mt-8">
								<TabPanel tabId={1}>
									<NetworkStep
										profile={activeProfile}
										title={t("WALLETS.PAGE_IMPORT_WALLET.NETWORK_STEP.TITLE")}
										subtitle={t("WALLETS.PAGE_IMPORT_WALLET.NETWORK_STEP.SUBTITLE")}
									/>
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
												onClick={() => setActiveTab(4)}
												data-testid="ImportWallet__skip-button"
											>
												{t("COMMON.SKIP")}
											</Button>
										)}
									</div>

									<div className="flex justify-end space-x-3">
										{activeTab < 3 && (
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
												disabled={!isValid || isImporting}
												isLoading={isImporting}
												onClick={handleNext}
												data-testid="ImportWallet__continue-button"
											>
												{t("COMMON.CONTINUE")}
											</Button>
										)}

										{activeTab === 3 && (
											<Button
												disabled={
													isEncrypting ||
													!isValid ||
													!encryptionPassword ||
													!confirmEncryptionPassword
												}
												isLoading={isEncrypting}
												onClick={handleNext}
												data-testid="ImportWallet__continue-button"
											>
												{t("COMMON.CONTINUE")}
											</Button>
										)}

										{activeTab === 4 && (
											<Button
												disabled={!isValid || isSubmitting}
												type="submit"
												data-testid="ImportWallet__save-button"
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
