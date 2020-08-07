import { NetworkData, Wallet } from "@arkecosystem/platform-sdk-profiles";
import { Button } from "app/components/Button";
import { Form, FormField, FormHelperText, FormLabel } from "app/components/Form";
import { Header } from "app/components/Header";
import { InputAddress, InputPassword } from "app/components/Input";
import { Page, Section } from "app/components/Layout";
import { StepIndicator } from "app/components/StepIndicator";
import { TabPanel, Tabs } from "app/components/Tabs";
import { Toggle } from "app/components/Toggle";
import { useEnvironmentContext } from "app/contexts";
import { useActiveProfile } from "app/hooks/env";
import { SelectNetwork } from "domains/network/components/SelectNetwork";
import React, { useEffect, useMemo, useState } from "react";
import { useForm, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

export const FirstStep = () => {
	const { register, setValue } = useFormContext();
	const context = useEnvironmentContext();
	const networks = useMemo(() => context.env.availableNetworks(), [context]);

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
					<SelectNetwork id="ImportWallet__network" networks={networks} onSelect={handleSelect} />
				</FormField>
			</div>
		</section>
	);
};

export const SecondStep = () => {
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
					name="address"
					coin={network.coin()}
					network={network.id()}
					isRequired
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

export const ImportWallet = () => {
	const [activeTab, setActiveTab] = useState(1);

	const history = useHistory();
	const { persist } = useEnvironmentContext();

	const activeProfile = useActiveProfile();

	const { t } = useTranslation();

	const form = useForm({ mode: "onChange" });
	const { formState } = form;

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
	}: {
		network: NetworkData;
		passphrase: string;
		address: string;
	}) => {
		let wallet: Wallet | undefined;

		if (passphrase) {
			wallet = await activeProfile.wallets().importByMnemonic(passphrase, network.coin(), network.id());
		} else {
			wallet = await activeProfile.wallets().importByAddress(address, network.coin(), network.id());
		}

		await persist();

		history.push(`/profiles/${activeProfile.id()}/wallets/${wallet?.id()}`);
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
						<StepIndicator size={2} activeIndex={activeTab} />

						<div className="mt-4">
							<TabPanel tabId={1}>
								<FirstStep />
							</TabPanel>
							<TabPanel tabId={2}>
								<SecondStep />
							</TabPanel>

							<div className="flex justify-end mt-10 space-x-3">
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
									<>
										<Button
											variant="plain"
											onClick={handleBack}
											data-testid="ImportWallet__back-button"
										>
											{t("COMMON.BACK")}
										</Button>
										<Button
											disabled={!formState.isValid}
											type="submit"
											data-testid="ImportWallet__submit-button"
										>
											{t("COMMON.GO_TO_WALLET")}
										</Button>
									</>
								)}
							</div>
						</div>
					</Tabs>
				</Form>
			</Section>
		</Page>
	);
};
