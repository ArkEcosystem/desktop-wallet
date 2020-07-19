import { Button } from "app/components/Button";
import { Form, FormField, FormLabel } from "app/components/Form";
import { Header } from "app/components/Header";
import { Input, InputPassword } from "app/components/Input";
import { Page, Section } from "app/components/Layout";
import { SelectNetwork } from "app/components/SelectNetwork";
import { StepIndicator } from "app/components/StepIndicator";
import { TabPanel, Tabs } from "app/components/Tabs";
import { Toggle } from "app/components/Toggle";
import { useEnvironment } from "app/contexts";
import { useActiveProfile, useAvailableNetworks } from "app/hooks/env";
import React, { useState } from "react";
import { useForm, useFormContext } from "react-hook-form";
import { useHistory } from "react-router-dom";

type Network = { coin: string; icon: string; name: string; network: string };

export const FirstStep = () => {
	const { getValues, register, setValue } = useFormContext();
	const currentNetwork = getValues("network");

	const networks = useAvailableNetworks()?.map((network: any) => ({
		name: `${network.ticker} - ${network.network}`,
		icon: `${network.coin.charAt(0).toUpperCase()}${network.coin.slice(1).toLowerCase()}`,
		coin: network.coin,
		network: network.network.toLowerCase(),
	}));

	React.useEffect(() => {
		register("network", { required: true });
	}, [register]);

	const handleSelect = (network: Network) => {
		setValue("network", network, true);
	};

	return (
		<section className="space-y-8" data-testid="ImportWallet__first-step">
			<div className="my-8">
				<Header
					title="Select a Cryptoasset"
					subtitle="Select a cryptoasset to import your existing wallet address"
				/>
			</div>
			<div className="space-y-2">
				<span className="text-sm font-medium text-theme-neutral-dark">Network</span>
				<SelectNetwork
					name={currentNetwork?.name}
					networks={networks}
					value={currentNetwork}
					onSelect={(network) => handleSelect(network)}
				/>
			</div>
		</section>
	);
};

export const SecondStep = () => {
	const { register } = useFormContext();
	const [isAddressOnly, setIsAddressOnly] = useState(false);

	const renderImportInput = () => {
		if (!isAddressOnly) {
			return (
				<FormField name="password">
					<FormLabel label="Your Password" />
					<InputPassword ref={register} data-testid="ImportWallet__password-input" />
				</FormField>
			);
		}

		return (
			// TODO: Change to InputAddress
			<FormField name="address">
				<FormLabel label="Address" />
				<Input ref={register} data-testid="ImportWallet__address-input" />
			</FormField>
		);
	};

	return (
		<section className="space-y-8" data-testid="ImportWallet__second-step">
			<div className="my-8">
				<Header
					title="Import Wallet"
					subtitle="Enter your wallet password in order to get full access to your money. Or you can choose an
					address for vieweing only."
				/>
			</div>
			<div className="flex flex-row items-center justify-between mt-8">
				<div>
					<p className="text-lg font-semibold text-theme-neutral-dark">Use the address only</p>
					<p className="text-sm text-theme-neutral">You can only view your wallet but not send money.</p>
				</div>
				<Toggle
					checked={isAddressOnly}
					onChange={() => setIsAddressOnly(!isAddressOnly)}
					data-testid="ImportWallet__address-toggle"
				/>
			</div>
			<div className="mt-8" data-testid="ImportWallet__fields">
				{renderImportInput()}
			</div>
		</section>
	);
};

export const ImportWallet = () => {
	const env = useEnvironment();
	const history = useHistory();
	const [activeTab, setActiveTab] = useState(1);
	const activeProfile = useActiveProfile();
	const form = useForm({ mode: "onChange" });
	const { formState } = form;

	const crumbs = [
		{
			route: `/profiles/${activeProfile?.id()}/dashboard`,
			label: "Go back to Portfolio",
		},
	];

	const handleBack = () => {
		setActiveTab(activeTab - 1);
	};

	const handleNext = () => {
		setActiveTab(activeTab + 1);
	};

	const submitForm = async ({ network, password }: any) => {
		const wallet = await activeProfile?.wallets().import(password, network.coin, network.network);
		await env?.persist();
		history.push(`/profiles/${activeProfile?.id()}/wallets/${wallet?.id()}`);
	};

	return (
		<Page crumbs={crumbs}>
			<Section className="flex-1">
				<Form
					className="max-w-xl mx-auto"
					context={form}
					onSubmit={submitForm}
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
										Continue
									</Button>
								)}

								{activeTab === 2 && (
									<>
										<Button
											variant="plain"
											onClick={handleBack}
											data-testid="ImportWallet__back-button"
										>
											Back
										</Button>
										<Button type="submit" data-testid="ImportWallet__submit-button">
											Go to Wallet
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
