import { NetworkData, ReadWriteWallet, WalletSetting } from "@arkecosystem/platform-sdk-profiles";
import { Button } from "app/components/Button";
import { Form } from "app/components/Form";
import { Page, Section } from "app/components/Layout";
import { StepIndicator } from "app/components/StepIndicator";
import { TabPanel, Tabs } from "app/components/Tabs";
import { useEnvironmentContext } from "app/contexts";
import { useActiveProfile } from "app/hooks/env";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { FirstStep } from "./Step1";
import { SecondStep } from "./Step2";
import { ThirdStep } from "./Step3";

export const ImportWallet = () => {
	const [activeTab, setActiveTab] = useState(1);
	const [walletData, setWalletData] = useState<ReadWriteWallet | null>(null);

	const history = useHistory();
	const { env, persist } = useEnvironmentContext();

	const activeProfile = useActiveProfile();

	const { t } = useTranslation();

	const form = useForm({ mode: "onChange" });
	const { formState } = form;
	const nameMaxLength = 42;

	const crumbs = [
		{
			route: `/profiles/${activeProfile.id()}/dashboard`,
			label: t("COMMON.GO_BACK_TO_PORTFOLIO"),
		},
	];

	const handleBack = () => {
		setActiveTab(activeTab - 1);
	};

	const handleNext = () => {
		setActiveTab(activeTab + 1);
	};

	const handleSubmit = async ({
		network,
		passphrase,
		address,
		name,
	}: {
		network: NetworkData;
		passphrase: string;
		address: string;
		name: string;
	}) => {
		let wallet: ReadWriteWallet | undefined;

		if (!walletData) {
			const hasWalletsByCoinWithNetwork =
				activeProfile.wallets().findByCoinWithNetwork(network.coin(), network.id()).length > 0;

			if (passphrase) {
				wallet = await activeProfile.wallets().importByMnemonic(passphrase, network.coin(), network.id());
			} else {
				wallet = await activeProfile.wallets().importByAddress(address, network.coin(), network.id());
			}

			setWalletData(wallet);

			if (network.allowsVoting()) {
				if (hasWalletsByCoinWithNetwork) {
					await wallet.syncVotes();
				} else {
					await env.delegates().syncAll();
					await wallet.syncVotes();
				}
			}

			await persist();

			setActiveTab(activeTab + 1);
		} else {
			if (name) {
				const formattedName = name.substring(0, nameMaxLength);
				activeProfile.wallets().findById(walletData?.id()).settings().set(WalletSetting.Alias, formattedName);
				await persist();
			}

			history.push(`/profiles/${activeProfile.id()}/wallets/${walletData?.id()}`);
		}
	};

	return (
		<Page profile={activeProfile} crumbs={crumbs}>
			<Section className="flex-1">
				<Form
					className="max-w-xl mx-auto"
					context={form}
					onSubmit={handleSubmit as any}
					data-testid="ImportWallet__form"
				>
					<Tabs activeId={activeTab}>
						<StepIndicator size={3} activeIndex={activeTab} />

						<div className="mt-4">
							<TabPanel tabId={1}>
								<FirstStep />
							</TabPanel>
							<TabPanel tabId={2}>
								<SecondStep profile={activeProfile} />
							</TabPanel>
							<TabPanel tabId={3}>
								<ThirdStep address={walletData?.address() as string} nameMaxLength={nameMaxLength} />
							</TabPanel>

							<div className="flex justify-end mt-10 space-x-3">
								{activeTab < 3 && (
									<Button
										disabled={activeTab === 1 || formState.isSubmitting}
										variant="plain"
										onClick={handleBack}
										data-testid="ImportWallet__back-button"
									>
										{t("COMMON.BACK")}
									</Button>
								)}

								{activeTab === 1 && (
									<Button
										disabled={!formState.isValid}
										onClick={handleNext}
										data-testid="ImportWallet__continue-button"
									>
										{t("COMMON.CONTINUE")}
									</Button>
								)}

								{activeTab === 2 && (
									<Button
										disabled={!formState.isValid || formState.isSubmitting}
										type="submit"
										data-testid="ImportWallet__gotowallet-button"
									>
										{t("COMMON.GO_TO_WALLET")}
									</Button>
								)}

								{activeTab === 3 && (
									<Button
										disabled={formState.isSubmitting}
										type="submit"
										data-testid="ImportWallet__save-button"
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
