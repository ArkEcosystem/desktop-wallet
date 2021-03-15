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

	const queryParams = useQueryParams();
	const isLedgerImport = !!queryParams.get("ledger");

	const history = useHistory();
	const { env, persist } = useEnvironmentContext();

	const activeProfile = useActiveProfile();
	const { selectedNetworkIds, setValue } = useDashboardConfig({ profile: activeProfile });

	const { t } = useTranslation();

	const form = useForm({ mode: "onChange", defaultValues: { type: "mnemonic" } });
	const { formState, register } = form;
	const { isSubmitting, isValid } = formState;

	const nameMaxLength = 42;

	useEffect(() => {
		register({ name: "type", type: "custom" });
	}, [register]);

	const handleBack = () => {
		if (activeTab === 1) {
			return history.push(`/profiles/${activeProfile.id()}/dashboard`);
		}

		setActiveTab(activeTab - 1);
	};

	const handleNext = () => {
		setActiveTab(activeTab + 1);
	};

	const syncNewWallet = async (network: Coins.Network, wallet: ReadWriteWallet) => {
		const votes = async () => {
			if (network.allowsVoting()) {
				try {
					env.delegates().all(network.coin(), network.id());
				} catch {
					// Sync network delegates for the first time
					await env.delegates().sync(network.coin(), network.id());
				}
				await wallet.syncVotes();
			}
		};

		const fees = async () => {
			try {
				env.fees().all(network.coin(), network.id());
			} catch {
				// Sync network fees for the first time
				await env.fees().sync(network.coin(), network.id());
			}
		};

		const rates = () => env.exchangeRates().syncAll(activeProfile, wallet.currency());

		await Promise.allSettled([votes(), rates(), fees()]);
		await persist();
	};

	const handleSubmit = async ({
		network,
		type,
		value,
		name,
		encryptedWif,
	}: {
		network: Coins.Network;
		type: string;
		value: string;
		name: string;
		encryptedWif: string;
	}) => {
		let wallet: ReadWriteWallet | undefined;

		if (!walletData) {
			try {
				if (type === "mnemonic") {
					wallet = await activeProfile.wallets().importByMnemonic(value, network.coin(), network.id());
				} else if (type === "address") {
					wallet = await activeProfile.wallets().importByAddress(value, network.coin(), network.id());
				} else if (type === "privateKey") {
					wallet = await activeProfile.wallets().importByPrivateKey(network.coin(), network.id(), value);
				} else if (type === "wif") {
					wallet = await activeProfile
						.wallets()
						.importByWIF({ coin: network.coin(), network: network.id(), wif: value });
				} else if (type === "encryptedWif") {
					try {
						// `setTimeout` being used here to avoid blocking the thread
						// as the decryption is a expensive calculation
						wallet = await new Promise((resolve, reject) => {
							setTimeout(
								() =>
									activeProfile
										.wallets()
										.importByWIFWithEncryption({
											coin: network.coin(),
											network: network.id(),
											wif: encryptedWif,
											password: value,
										})
										.then(resolve, reject),
								0,
							);
						});
					} catch (e) {
						/* istanbul ignore else */
						if (e.code === "ERR_ASSERTION") {
							throw new Error(t("WALLETS.PAGE_IMPORT_WALLET.VALIDATION.DECRYPT_WIF_ASSERTION"));
						}
						throw e;
					}
				}

				setValue("selectedNetworkIds", uniq([...selectedNetworkIds, wallet!.network().id()]));
				setWalletData(wallet!);
				await persist();

				await syncNewWallet(network, wallet!);

				setActiveTab(activeTab + 1);
			} catch (e) {
				toasts.error(e.message);
			}
		} else {
			if (name) {
				const formattedName = name.trim().substring(0, nameMaxLength);
				activeProfile.wallets().update(walletData?.id(), { alias: formattedName });
				await persist();
			}

			history.push(`/profiles/${activeProfile.id()}/wallets/${walletData?.id()}`);
		}
	};

	return (
		<Page profile={activeProfile}>
			<Section className="flex-1">
				<Form
					className="mx-auto max-w-xl"
					context={form}
					onSubmit={handleSubmit as any}
					data-testid="ImportWallet__form"
				>
					{isLedgerImport ? (
						<LedgerTabs />
					) : (
						<Tabs activeId={activeTab}>
							<StepIndicator size={3} activeIndex={activeTab} />

							<div className="mt-8">
								<TabPanel tabId={1}>
									<FirstStep profile={activeProfile} />
								</TabPanel>
								<TabPanel tabId={2}>
									<SecondStep profile={activeProfile} />
								</TabPanel>
								<TabPanel tabId={3}>
									<ThirdStep
										address={walletData?.address() as string}
										balance={walletData?.balance() as BigNumber}
										nameMaxLength={nameMaxLength}
										profile={activeProfile}
									/>
								</TabPanel>

								<div className="flex justify-end mt-10 space-x-3">
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

									{activeTab === 1 && (
										<Button
											disabled={!isValid}
											onClick={handleNext}
											data-testid="ImportWallet__continue-button"
										>
											{t("COMMON.CONTINUE")}
										</Button>
									)}

									{activeTab === 2 && (
										<Button
											disabled={isSubmitting || !isValid}
											type="submit"
											isLoading={isSubmitting}
											data-testid="ImportWallet__continue-button"
										>
											{t("COMMON.CONTINUE")}
										</Button>
									)}

									{activeTab === 3 && (
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
						</Tabs>
					)}
				</Form>
			</Section>
		</Page>
	);
};
