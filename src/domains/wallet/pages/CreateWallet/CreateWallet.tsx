import { Environment, NetworkData, Profile, Wallet, WalletSetting } from "@arkecosystem/platform-sdk-profiles";
import { Alert } from "app/components/Alert";
import { Avatar } from "app/components/Avatar";
import { Button } from "app/components/Button";
import { Clipboard } from "app/components/Clipboard";
import { Divider } from "app/components/Divider";
import { Form, FormField, FormLabel } from "app/components/Form";
import { Header } from "app/components/Header";
import { Icon } from "app/components/Icon";
import { Input } from "app/components/Input";
import { Page, Section } from "app/components/Layout";
import { StepIndicator } from "app/components/StepIndicator";
import { TabPanel, Tabs } from "app/components/Tabs";
import { useEnvironment } from "app/contexts";
import { useActiveProfile } from "app/hooks/env";
import { NetworkIcon } from "domains/network/components/NetworkIcon";
import { SelectNetwork } from "domains/network/components/SelectNetwork";
import { getNetworkExtendedData } from "domains/network/helpers";
import React from "react";
import { useForm, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { MnemonicList } from "../../components/MnemonicList";
import { MnemonicVerification } from "../../components/MnemonicVerification";

export const FirstStep = ({ env, profile }: { env: Environment; profile: Profile }) => {
	const { getValues, setValue } = useFormContext();
	const networks = React.useMemo(() => env.availableNetworks(), [env]);

	const { t } = useTranslation();

	const handleSelect = async (network?: NetworkData) => {
		const currentWallet = getValues("wallet");

		setValue("network", network, true);
		setValue("wallet", null, true);
		setValue("mnemonic", null, true);

		if (currentWallet) {
			profile.wallets().forget(currentWallet.id());
		}

		if (!network) {
			return;
		}

		const { mnemonic, wallet } = await profile.wallets().generate(network.coin(), network.id());
		setValue("wallet", wallet, true);
		setValue("mnemonic", mnemonic, true);
	};

	return (
		<section data-testid="CreateWallet__first-step" className="space-y-8">
			<div className="my-8">
				<Header
					title={t("WALLETS.PAGE_CREATE_WALLET.NETWORK_STEP.TITLE")}
					subtitle={t("WALLETS.PAGE_CREATE_WALLET.NETWORK_STEP.SUBTITLE")}
				/>
			</div>
			<div className="space-y-2">
				<FormField name="network" className="relative mt-1">
					<div className="mb-2">
						<FormLabel label={t("COMMON.NETWORK")} />
					</div>
					<SelectNetwork id="CreateWallet__network" networks={networks} onSelect={handleSelect} />
				</FormField>
			</div>
		</section>
	);
};

export const SecondStep = () => {
	const { getValues, unregister } = useFormContext();
	const mnemonic = getValues("mnemonic");

	const { t } = useTranslation();

	React.useEffect(() => {
		unregister("verification");
	}, [unregister]);

	return (
		<section data-testid="CreateWallet__second-step">
			<div className="my-8">
				<Header title={t("WALLETS.PAGE_CREATE_WALLET.PASSPHRASE_STEP.TITLE")} />
			</div>

			<div className="space-y-8">
				<Alert size="lg">{t("WALLETS.PAGE_CREATE_WALLET.PASSPHRASE_STEP.WARNING")}</Alert>
				<MnemonicList mnemonic={mnemonic} />
				<div className="flex justify-end w-full">
					<Clipboard data={mnemonic}>
						<Button data-testid="CreateWallet__copy" variant="plain">
							<Icon name="Copy" />
							<span>{t("COMMON.COPY")}</span>
						</Button>
					</Clipboard>
				</div>
			</div>

			<Divider dashed />

			<div className="py-3">
				<div className="flex justify-between">
					<div>
						<h3 className="mb-1 text-theme-neutral-dark">
							{t("WALLETS.PAGE_CREATE_WALLET.PASSPHRASE_STEP.DOWNLOAD.TITLE")}
						</h3>
						<p className="text-theme-neutral">
							{t("WALLETS.PAGE_CREATE_WALLET.PASSPHRASE_STEP.DOWNLOAD.DESCRIPTION")}
						</p>
					</div>
					<Icon name="FilePassword" width={40} height={40} />
				</div>
				<div className="flex justify-end w-full">
					<Button
						data-testid="CreateWallet__download"
						variant="plain"
						className="flex items-center mt-4 space-x-2"
					>
						<Icon name="Download" />
						<span>{t("COMMON.DOWNLOAD")}</span>
					</Button>
				</div>
			</div>

			<Divider dashed />
		</section>
	);
};

export const ThirdStep = () => {
	const { getValues, register, setValue } = useFormContext();
	const mnemonic = getValues("mnemonic");
	const isVerified: boolean = getValues("verification");

	const { t } = useTranslation();

	const handleComplete = () => {
		setValue("verification", true, true);
	};

	React.useEffect(() => {
		if (!isVerified) {
			register("verification", { required: true });
		}
	}, [isVerified, register]);

	return (
		<section data-testid="CreateWallet__third-step">
			<div className="my-8">
				<Header
					title={t("WALLETS.PAGE_CREATE_WALLET.PASSPHRASE_CONFIRMATION_STEP.TITLE")}
					subtitle={t("WALLETS.PAGE_CREATE_WALLET.PASSPHRASE_CONFIRMATION_STEP.SUBTITLE")}
				/>
			</div>

			<MnemonicVerification
				mnemonic={mnemonic}
				optionsLimit={6}
				handleComplete={handleComplete}
				isCompleted={isVerified}
			/>

			<Divider dashed />
		</section>
	);
};

export const FourthStep = () => {
	const { getValues, register } = useFormContext();
	const network: NetworkData = getValues("network");
	const wallet: Wallet = getValues("wallet");
	const networkConfig = getNetworkExtendedData({ coin: network.coin(), network: network.name() });

	const { t } = useTranslation();

	return (
		<section data-testid="CreateWallet__fourth-step">
			<div className="my-8">
				<Header
					title={t("WALLETS.PAGE_CREATE_WALLET.PROCESS_COMPLETED_STEP.TITLE")}
					subtitle={t("WALLETS.PAGE_CREATE_WALLET.PROCESS_COMPLETED_STEP.SUBTITLE")}
				/>
			</div>

			<ul>
				<li className="flex justify-between">
					<div>
						<p className="text-sm font-semibold text-theme-neutral-dark">{t("COMMON.NETWORK")}</p>
						<p data-testid="CreateWallet__network-name" className="text-lg font-medium">
							{networkConfig?.displayName}
						</p>
					</div>
					<NetworkIcon coin={network.coin()} network={network.name()} />
				</li>
				<li>
					<Divider dashed />
				</li>
				<li className="flex justify-between">
					<div>
						<p className="text-sm font-semibold text-theme-neutral-dark">{t("COMMON.ADDRESS")}</p>
						<p data-testid="CreateWallet__wallet-address" className="text-lg font-medium">
							{wallet.address()}
						</p>
					</div>
					<Avatar address={wallet.address()} />
				</li>
			</ul>

			<Divider dashed />

			<FormField name="name">
				<FormLabel label={t("WALLETS.PAGE_CREATE_WALLET.WALLET_NAME")} />
				<Input data-testid="CreateWallet__wallet-name" ref={register} />
			</FormField>
		</section>
	);
};

export const CreateWallet = () => {
	const env = useEnvironment();
	const history = useHistory();
	const { t } = useTranslation();

	const [activeTab, setActiveTab] = React.useState(1);
	const [hasSubmitted, setHasSubmitted] = React.useState(false);
	const activeProfile = useActiveProfile();
	const dashboardRoute = `/profiles/${activeProfile?.id()}/dashboard`;

	const crumbs = [
		{
			route: dashboardRoute,
			label: "Go back to Portfolio",
		},
	];

	const form = useForm({ mode: "onChange" });
	const { getValues, formState, register } = form;

	React.useEffect(() => {
		register("network", { required: true });
		register("wallet", { required: true });
		register("mnemonic", { required: true });
	}, [register]);

	const submitForm = async ({ name }: any) => {
		activeProfile?.wallets().findById(getValues("wallet").id()).settings().set(WalletSetting.Alias, name);

		await env?.persist();

		setHasSubmitted(true);
	};

	React.useEffect(() => {
		if (hasSubmitted) {
			history.push(dashboardRoute);
		}

		// TODO: Figure out a way without setTimeout
		return () => {
			setTimeout(() => {
				if (hasSubmitted) {
					return;
				}

				const currentWallet = getValues("wallet");

				if (currentWallet) {
					activeProfile?.wallets().forget(currentWallet.id());
				}
			}, 100);
		};
	}, [activeProfile, dashboardRoute, getValues, hasSubmitted, history]);

	const handleBack = () => {
		setActiveTab(activeTab - 1);
	};

	const handleNext = () => {
		setActiveTab(activeTab + 1);
	};

	return (
		<Page crumbs={crumbs}>
			<Section className="flex-1">
				<Form className="max-w-xl mx-auto" context={form} onSubmit={submitForm}>
					<Tabs activeId={activeTab}>
						<StepIndicator size={4} activeIndex={activeTab} />

						<div className="mt-4">
							<TabPanel tabId={1}>
								<FirstStep env={env!} profile={activeProfile!} />
							</TabPanel>
							<TabPanel tabId={2}>
								<SecondStep />
							</TabPanel>
							<TabPanel tabId={3}>
								<ThirdStep />
							</TabPanel>
							<TabPanel tabId={4}>
								<FourthStep />
							</TabPanel>

							<div className="flex justify-end mt-10 space-x-3">
								<Button
									disabled={activeTab === 1}
									data-testid="CreateWallet__back-button"
									variant="plain"
									onClick={handleBack}
								>
									Back
								</Button>

								{activeTab < 4 && (
									<Button
										data-testid="CreateWallet__continue-button"
										disabled={!formState.isValid}
										onClick={handleNext}
									>
										{t("COMMON.CONTINUE")}
									</Button>
								)}

								{activeTab === 4 && (
									<Button type="submit" data-testid="CreateWallet__save-button">
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
