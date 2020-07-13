import { Alert } from "app/components/Alert";
import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { Divider } from "app/components/Divider";
import { Form, FormField, FormLabel } from "app/components/Form";
import { Header } from "app/components/Header";
import { Icon } from "app/components/Icon";
import { Input } from "app/components/Input";
import { Page, Section } from "app/components/Layout";
import { SelectNetwork } from "app/components/SelectNetwork";
import { StepIndicator } from "app/components/StepIndicator";
import { TabPanel, Tabs } from "app/components/Tabs";
import { useActiveProfile } from "app/hooks/env";
import React from "react";
import { useForm, useFormContext } from "react-hook-form";

import { MnemonicList } from "../../components/MnemonicList";
import { MnemonicVerification } from "../../components/MnemonicVerification";

export const FirstStep = ({ networks }: { networks: Network[] }) => {
	const { register, setValue } = useFormContext();
	const [activeNetwork, setActiveNetwork] = React.useState<Network | undefined>(undefined);

	React.useEffect(() => {
		register("network", { required: true });
	}, [register]);

	const handleSelect = (network: Network) => {
		setActiveNetwork(network);
		setValue("network", network, true);
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
					name={activeNetwork as any}
					networks={networks}
					onSelect={(selected) => handleSelect(selected?.name)}
				/>
			</div>
		</section>
	);
};

export const SecondStep = ({
	mnemonic,
	onCopy,
	onDownload,
}: {
	mnemonic: string[];
	onCopy: () => void;
	onDownload: () => void;
}) => {
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
					<Button data-testid="CreateWallet__copy" onClick={onCopy} variant="plain">
						<Icon name="Copy" />
						<span>Copy</span>
					</Button>
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
						onClick={onDownload}
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

export const ThirdStep = ({ skipVerification, mnemonic }: { skipVerification: boolean; mnemonic: string[] }) => {
	const { register, unregister, setValue } = useFormContext();

	const handleComplete = React.useCallback(() => {
		setValue("verification", true, true);
	}, [setValue]);

	React.useEffect(() => {
		register({ name: "verification", type: "custom" }, { required: true });

		if (skipVerification) {
			handleComplete();
		}

		return () => unregister("verification");
	}, [register, unregister, skipVerification, handleComplete]);

	return (
		<section data-testid="CreateWallet__third-step">
			<div className="my-8">
				<Header title="Confirm your passphrase" subtitle="Confirm your password to continue" />
			</div>

			<MnemonicVerification
				mnemonic={mnemonic}
				wordPositions={[3, 6, 9]}
				optionsLimit={6}
				handleComplete={handleComplete}
			/>

			<Divider dashed />
		</section>
	);
};

export const FourthStep = () => {
	const { getValues, register } = useFormContext();
	const network: Network = getValues("network");

	return (
		<section data-testid="CreateWallet__fourth-step">
			<div className="my-8">
				<Header title="Completed" subtitle="Wallet creation is complete. Now you can use it." />
			</div>

			<ul>
				<li className="flex justify-between">
					<div>
						<p className="text-sm font-semibold text-theme-neutral-dark">Network</p>
						<p data-testid="CrateWallet__network-name" className="text-lg font-medium">
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
						<p className="text-lg font-medium">D6Z26L69gdk9qYmTv5uzk3uGepigtHY4ax</p>
					</div>
					<Circle />
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

type Network = { name: string; icon: string };

type Props = {
	networks: Network[];
	mnemonic: string[];
	onSubmit: (data: { network: string; name: string }) => void;
	onCopy: () => void;
	onDownload: () => void;
	skipMnemonicVerification?: boolean;
};

export const CreateWallet = ({ networks, mnemonic, onSubmit, onCopy, onDownload, skipMnemonicVerification }: Props) => {
	const [activeTab, setActiveTab] = React.useState(1);
	const activeProfile = useActiveProfile();

	const form = useForm({ mode: "onChange" });
	const { formState } = form;
	const { isValid } = formState;

	const handleBack = () => {
		setActiveTab(activeTab - 1);
	};

	const handleNext = () => {
		setActiveTab(activeTab + 1);
	};

	const crumbs = [
		{
			route: `/profiles/${activeProfile?.id()}/dashboard`,
			label: "Go back to Portfolio",
		},
	];

	return (
		<Page crumbs={crumbs}>
			<Section className="flex-1">
				<Form className="max-w-xl mx-auto" context={form} onSubmit={(data: any) => onSubmit(data)}>
					<Tabs activeId={activeTab}>
						<StepIndicator size={4} activeIndex={activeTab} />

						<div className="mt-4">
							<TabPanel tabId={1}>
								<FirstStep networks={networks} />
							</TabPanel>
							<TabPanel tabId={2}>
								<SecondStep onCopy={onCopy} onDownload={onDownload} mnemonic={mnemonic} />
							</TabPanel>
							<TabPanel tabId={3}>
								<ThirdStep skipVerification={!!skipMnemonicVerification} mnemonic={mnemonic} />
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
										disabled={!isValid}
										onClick={handleNext}
									>
										Continue
									</Button>
								)}

								{activeTab === 4 && (
									<Button type="submit" data-testid="CreateWallet__save-button">
										Save & Finish
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
