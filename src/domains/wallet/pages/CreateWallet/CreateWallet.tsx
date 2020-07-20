import { Environment, Profile, Wallet, WalletSetting } from "@arkecosystem/platform-sdk-profiles";
import { Alert } from "app/components/Alert";
import { Avatar } from "app/components/Avatar";
import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { Clipboard } from "app/components/Clipboard";
import { Divider } from "app/components/Divider";
import { Form, FormField, FormLabel } from "app/components/Form";
import { Header } from "app/components/Header";
import { Icon } from "app/components/Icon";
import { Input } from "app/components/Input";
import { Page, Section } from "app/components/Layout";
import { SelectNetwork } from "app/components/SelectNetwork";
import { StepIndicator } from "app/components/StepIndicator";
import { TabPanel, Tabs } from "app/components/Tabs";
import { useEnvironment } from "app/contexts";
import { useActiveProfile } from "app/hooks/env";
import React from "react";
import { useForm, useFormContext } from "react-hook-form";
import { useHistory } from "react-router-dom";

import { MnemonicList } from "../../components/MnemonicList";
import { MnemonicVerification } from "../../components/MnemonicVerification";

type Network = { coin: string; name: string; network: string; icon: string };

export const FirstStep = ({ env, profile }: { env: Environment; profile: Profile }) => {
	const { getValues, setValue } = useFormContext();
	const currentNetwork = getValues("network");

	const networks: Network[] = env.availableNetworks().map((network: any) => ({
		name: `${network.ticker()} - ${network.name()}`,
		icon: `${network.coin().charAt(0).toUpperCase()}${network.coin().slice(1).toLowerCase()}`,
		coin: network.coin(),
		network: network.name().toLowerCase(),
	}));

	const handleSelect = async (network: Network) => {
		const currentWallet = getValues("wallet");

		setValue("network", network, true);
		setValue("wallet", null, true);
		setValue("mnemonic", null, true);

		if (currentWallet) {
			profile.wallets().forget(currentWallet.id());
		}

		const { mnemonic, wallet } = await profile.wallets().generate(network.coin, network.network);
		setValue("wallet", wallet, true);
		setValue("mnemonic", mnemonic, true);
	};

	return (
		<section data-testid="CreateWallet__first-step" className="space-y-8">
			<div className="my-8">
				<Header
					title="Select a Cryptoasset"
					subtitle="Select a cryptoasset to create your new wallet address"
				/>
			</div>
			<div className="space-y-2">
				<span className="text-sm font-medium text-theme-neutral-dark">Network</span>
				<SelectNetwork
					name={currentNetwork?.name}
					networks={networks}
					onSelect={(network) => handleSelect(network)}
					value={currentNetwork}
				/>
			</div>
		</section>
	);
};

export const SecondStep = () => {
	const { getValues } = useFormContext();
	const mnemonic = getValues("mnemonic");

	return (
		<section data-testid="CreateWallet__second-step">
			<div className="my-8">
				<Header title="Your Passphrase" />
			</div>

			<div className="space-y-8">
				<Alert size="lg">
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt, optio ipsum, porro in dolore ex
					ab iste labore illo perferendis maiores. Ratione quo ipsa adipisci repellendus consectetur ipsam
					facere nostrum.
				</Alert>
				<MnemonicList mnemonic={mnemonic} />
				<div className="flex justify-end w-full">
					<Clipboard data={mnemonic}>
						<Button data-testid="CreateWallet__copy" variant="plain">
							<Icon name="Copy" />
							<span>Copy</span>
						</Button>
					</Clipboard>
				</div>
			</div>

			<Divider dashed />

			<div className="py-3">
				<div className="flex justify-between">
					<div>
						<h3 className="mb-1 text-theme-neutral-dark">Your password in the file</h3>
						<p className="text-theme-neutral">You can also download and store safely your passphrase.</p>
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
						<span>Download</span>
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

	const handleComplete = () => {
		setValue("verification", true, true);
	};

	React.useEffect(() => {
		register("verification", { required: true });
	}, [register]);

	return (
		<section data-testid="CreateWallet__third-step">
			<div className="my-8">
				<Header title="Confirm your passphrase" subtitle="Confirm your password to continue" />
			</div>

			<MnemonicVerification mnemonic={mnemonic} optionsLimit={6} handleComplete={handleComplete} />

			<Divider dashed />
		</section>
	);
};

export const FourthStep = () => {
	const { getValues, register } = useFormContext();
	const network: Network = getValues("network");
	const wallet: Wallet = getValues("wallet");

	return (
		<section data-testid="CreateWallet__fourth-step">
			<div className="my-8">
				<Header title="Completed" subtitle="Wallet creation is complete. Now you can use it." />
			</div>

			<ul>
				<li className="flex justify-between">
					<div>
						<p className="text-sm font-semibold text-theme-neutral-dark">Network</p>
						<p data-testid="CreateWallet__network-name" className="text-lg font-medium">
							{network.name}
						</p>
					</div>
					<Circle>
						<Icon name={network.icon} />
					</Circle>
				</li>
				<li>
					<Divider dashed />
				</li>
				<li className="flex justify-between">
					<div>
						<p className="text-sm font-semibold text-theme-neutral-dark">Address</p>
						<p data-testid="CreateWallet__wallet-address" className="text-lg font-medium">
							{wallet.address()}
						</p>
					</div>
					<Avatar address={wallet.address()} />
				</li>
			</ul>

			<Divider dashed />

			<FormField name="name">
				<FormLabel label="Wallet name (optional)" />
				<Input data-testid="CreateWallet__wallet-name" ref={register} />
			</FormField>
		</section>
	);
};

export const CreateWallet = () => {
	const env = useEnvironment();
	const history = useHistory();

	let hasSubmitted = false;
	const [activeTab, setActiveTab] = React.useState(1);
	const activeProfile = useActiveProfile();

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

		hasSubmitted = true;
	};

	React.useEffect(() => {
		if (hasSubmitted) {
			history.push(dashboardRoute);
		}

		return () => {
			if (hasSubmitted) {
				return;
			}

			const currentWallet = getValues("wallet");

			if (currentWallet) {
				activeProfile?.wallets().forget(currentWallet.id());
			}
		};
	}, [hasSubmitted]);

	const dashboardRoute = `/profiles/${activeProfile?.id()}/dashboard`;
	const crumbs = [
		{
			route: dashboardRoute,
			label: "Go back to Portfolio",
		},
	];

	const handleBack = () => {
		setActiveTab(activeTab - 1);
	};

	const handleNext = () => {
		setActiveTab(activeTab + 1);
	};

	return (
		<Page crumbs={crumbs}>
			<Section className="flex-1">
				<Form className="max-w-xl mx-auto" context={form} onSubmit={(data: any) => submitForm(data)}>
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
										Continue
									</Button>
								)}

								{activeTab === 4 && (
									<Button type="submit" data-testid="CreateWallet__save-button">
										Save &amp; Finish
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
