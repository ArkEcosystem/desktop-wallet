import { Coins } from "@arkecosystem/platform-sdk";
import { NetworkData, Profile, Wallet, WalletSetting } from "@arkecosystem/platform-sdk-profiles";
import { Avatar } from "app/components/Avatar";
import { Button } from "app/components/Button";
import { Divider } from "app/components/Divider";
import { Form, FormField, FormHelperText, FormLabel } from "app/components/Form";
import { Header } from "app/components/Header";
import { Input, InputAddress, InputPassword } from "app/components/Input";
import { Page, Section } from "app/components/Layout";
import { StepIndicator } from "app/components/StepIndicator";
import { TabPanel, Tabs } from "app/components/Tabs";
import { Toggle } from "app/components/Toggle";
import { useEnvironmentContext } from "app/contexts";
import { useActiveProfile } from "app/hooks/env";
import { NetworkIcon } from "domains/network/components/NetworkIcon";
import { SelectNetwork } from "domains/network/components/SelectNetwork";
import { getNetworkExtendedData } from "domains/network/helpers";
import React, { useEffect, useMemo, useState } from "react";
import { useForm, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

export const FirstStep = () => {
	const { getValues, register, setValue } = useFormContext();
	const context = useEnvironmentContext();
	const networks = useMemo(() => context.env.availableNetworks(), [context]);

	const selectedNetwork: NetworkData = getValues("network");

	const { t } = useTranslation();

	useEffect(() => {
		register("network", { required: true });
	}, [register]);

	const handleSelect = (network?: NetworkData | null) => {
		setValue("network", network, true);
	};

	return (
		<section className="space-y-8" data-testid="ImportWallet__first-step">
			<div className="my-8">
				<Header
					title={t("WALLETS.PAGE_IMPORT_WALLET.NETWORK_STEP.TITLE")}
					subtitle={t("WALLETS.PAGE_IMPORT_WALLET.NETWORK_STEP.SUBTITLE")}
				/>
			</div>
			<div className="space-y-2">
				<FormField name="network" className="relative mt-1">
					<div className="mb-2">
						<FormLabel label={t("COMMON.NETWORK")} />
					</div>
					<SelectNetwork
						id="ImportWallet__network"
						networks={networks}
						selected={selectedNetwork}
						onSelect={handleSelect}
					/>
				</FormField>
			</div>
		</section>
	);
};

export const SecondStep = ({ profile }: { profile: Profile }) => {
	const { env } = useEnvironmentContext();
	const { getValues, register, unregister } = useFormContext();
	const [isAddressOnly, setIsAddressOnly] = useState(false);

	const network: NetworkData = getValues("network");

	const { t } = useTranslation();

	const renderImportInput = () => {
		if (!isAddressOnly) {
			return (
				<FormField name="passphrase">
					<FormLabel label={t("COMMON.YOUR_PASSPHRASE")} />
					<InputPassword
						ref={register({
							required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
								field: t("COMMON.YOUR_PASSPHRASE"),
							}).toString(),
							validate: async (passphrase) => {
								const instance: Coins.Coin = await env.coin(network.coin(), network.id());
								const address = await instance.identity().address().fromMnemonic(passphrase);

								return (
									!profile.wallets().findByAddress(address) ||
									t("COMMON.INPUT_PASSPHRASE.VALIDATION.ADDRESS_ALREADY_EXISTS", {
										address,
									}).toString()
								);
							},
						})}
						data-testid="ImportWallet__passphrase-input"
					/>
					<FormHelperText />
				</FormField>
			);
		}

		return (
			<FormField name="address">
				<FormLabel label={t("COMMON.ADDRESS")} />
				<InputAddress
					coin={network.coin()}
					network={network.id()}
					registerRef={register}
					additionalRules={{
						required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
							field: t("COMMON.ADDRESS"),
						}).toString(),
						validate: {
							duplicateAddress: (address) =>
								!profile.wallets().findByAddress(address) ||
								t("COMMON.INPUT_ADDRESS.VALIDATION.ADDRESS_ALREADY_EXISTS", { address }).toString(),
						},
					}}
					data-testid="ImportWallet__address-input"
				/>
				<FormHelperText />
			</FormField>
		);
	};

	return (
		<section className="space-y-8" data-testid="ImportWallet__second-step">
			<div className="my-8">
				<Header
					title={t("WALLETS.PAGE_IMPORT_WALLET.METHOD_STEP.TITLE")}
					subtitle={t("WALLETS.PAGE_IMPORT_WALLET.METHOD_STEP.SUBTITLE")}
				/>
			</div>
			<div className="flex flex-col mt-8">
				<div className="flex items-center justify-between">
					<div className="text-lg font-semibold text-theme-neutral-dark">
						{t("WALLETS.PAGE_IMPORT_WALLET.METHOD_STEP.ADDRESS_ONLY.TITLE")}
					</div>

					<Toggle
						name="isAddressOnly"
						checked={isAddressOnly}
						onChange={() => {
							unregister("passphrase");
							setIsAddressOnly(!isAddressOnly);
						}}
						data-testid="ImportWallet__address-toggle"
					/>
				</div>

				<div className="pr-12 mt-1 text-sm text-theme-neutral">
					{t("WALLETS.PAGE_IMPORT_WALLET.METHOD_STEP.ADDRESS_ONLY.DESCRIPTION")}
				</div>
			</div>
			<div className="mt-8" data-testid="ImportWallet__fields">
				{renderImportInput()}
			</div>
		</section>
	);
};

export const ThirdStep = ({ address, nameMaxLength }: { address: string; nameMaxLength: number }) => {
	const { getValues, register } = useFormContext();
	const network: NetworkData = getValues("network");
	const networkConfig = getNetworkExtendedData({ coin: network.coin(), network: network.id() });
	const { t } = useTranslation();

	return (
		<section data-testid="ImportWallet__third-step">
			<div className="my-8">
				<Header
					title={t("WALLETS.PAGE_IMPORT_WALLET.PROCESS_COMPLETED_STEP.TITLE")}
					subtitle={t("WALLETS.PAGE_IMPORT_WALLET.PROCESS_COMPLETED_STEP.SUBTITLE")}
				/>
			</div>

			<ul>
				<li className="flex justify-between">
					<div>
						<p className="text-sm font-semibold text-theme-neutral-dark">{t("COMMON.NETWORK")}</p>
						<p className="text-lg font-medium" data-testid="ImportWallet__network-name">
							{networkConfig?.displayName}
						</p>
					</div>
					<NetworkIcon coin={network.coin()} network={network.id()} />
				</li>
				<li>
					<Divider dashed />
				</li>
				<li className="flex justify-between">
					<div>
						<p className="text-sm font-semibold text-theme-neutral-dark">{t("COMMON.ADDRESS")}</p>
						<p className="text-lg font-medium" data-testid="ImportWallet__wallet-address">
							{address}
						</p>
					</div>
					<Avatar address={address} />
				</li>
			</ul>

			<Divider dashed />

			<FormField name="name">
				<FormLabel label={t("WALLETS.PAGE_IMPORT_WALLET.WALLET_NAME")} required={false} />
				<Input
					ref={register({
						maxLength: {
							value: nameMaxLength,
							message: t("WALLETS.PAGE_IMPORT_WALLET.VALIDATION.MAXLENGTH_ERROR", {
								maxLength: nameMaxLength,
							}),
						},
					})}
					data-testid="ImportWallet__name-input"
				/>
				<FormHelperText />
			</FormField>
		</section>
	);
};

export const ImportWallet = () => {
	const [activeTab, setActiveTab] = useState(1);
	const [walletData, setWalletData] = useState<Wallet | null>(null);

	const history = useHistory();
	const { persist } = useEnvironmentContext();

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
		let wallet: Wallet | undefined;

		if (!walletData) {
			if (passphrase) {
				wallet = await activeProfile.wallets().importByMnemonic(passphrase, network.coin(), network.id());
			} else {
				wallet = await activeProfile.wallets().importByAddress(address, network.coin(), network.id());
			}

			setWalletData(wallet);
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
