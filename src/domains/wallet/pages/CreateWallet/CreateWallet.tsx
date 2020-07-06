import { Alert } from "app/components/Alert";
import { Button } from "app/components/Button";
import { CardControl } from "app/components/Card";
import { Circle } from "app/components/Circle";
import { Divider } from "app/components/Divider";
import { Form, FormField, FormLabel } from "app/components/Form";
import { Header } from "app/components/Header";
import { Icon } from "app/components/Icon";
import { Input } from "app/components/Input";
import { StepIndicator } from "app/components/StepIndicator";
import { TabPanel, Tabs } from "app/components/Tabs";
import React from "react";
import { useForm, useFormContext } from "react-hook-form";
import tw, { styled } from "twin.macro";

import { MnemonicList } from "../../components/MnemonicList";
import { MnemonicVerification } from "../../components/MnemonicVerification";

const NetworkItem = styled.div`
	[aria-checked="true"] & > .NetworkItemIcon {
		${tw`text-theme-success`}
	}
`;

export const FirstStep = ({ networks }: { networks: Network[] }) => {
	const { register, setValue } = useFormContext();
	const [activeNetwork, setActiveNetwork] = React.useState<Network | undefined>(undefined);

	React.useEffect(() => {
		register("network", { required: true });
	}, [register]);

	const handleChange = (network: Network) => {
		setActiveNetwork(network);
		setValue("network", network, true);
	};

	return (
		<section data-testid="CreateWallet__first-step" className="space-y-8">
			<div>
				<h1 className="mb-0">Select Network</h1>
				<p className="text-theme-neutral-dark">Lorem ipsum dolor sit amet consectetur adipisicing elit</p>
			</div>

			<div className="grid grid-flow-row gap-2">
				{networks.map((network) => (
					<CardControl
						type="radio"
						key={network.name}
						value={network.name}
						name="network"
						onChange={() => handleChange(network)}
						aria-checked={activeNetwork?.name === network.name}
					>
						<NetworkItem className="flex items-center py-2">
							<Circle
								className="NetworkItemIcon border-theme-neutral-300 transition-colors duration-100"
								noShadow
							>
								<Icon name={network.icon} />
							</Circle>
							<span className="text-theme-text ml-4">{network.name}</span>
						</NetworkItem>
					</CardControl>
				))}
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
			<Header title="Your Passphrase" />

			<div className="space-y-8">
				<Alert size="lg">
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt, optio ipsum, porro in dolore ex
					ab iste labore illo perferendis maiores. Ratione quo ipsa adipisci repellendus consectetur ipsam
					facere nostrum.
				</Alert>
				<MnemonicList mnemonic={mnemonic} />
				<Button data-testid="CreateWallet__copy" onClick={onCopy} variant="plain">
					<Icon name="Copy" />
					<span>Copy</span>
				</Button>
			</div>

			<Divider dashed />

			<div className="flex py-3">
				<div className="flex-1">
					<h3 className="text-theme-neutral-dark mb-1">Your password in the file</h3>
					<p className="text-theme-neutral">Lorem ipsum dolor, sit amet consectetur adipisicing elit.</p>
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
				<div className="ml-10">
					<Icon name="FilePassword" width={40} height={40} />
				</div>
			</div>

			<Divider dashed />
		</section>
	);
};

export const ThirdStep = ({ skipVerification, mnemonic }: { skipVerification: boolean; mnemonic: string[] }) => {
	const { register, unregister, setValue } = useFormContext();

	React.useEffect(() => {
		register({ name: "verification", type: "custom" }, { required: true });

		if (skipVerification) {
			handleComplete();
		}

		return () => unregister("verification");
	}, [register, unregister, skipVerification]);

	const handleComplete = () => {
		setValue("verification", true, true);
	};

	return (
		<section data-testid="CreateWallet__third-step">
			<h1 className="mb-0">Confirm your passphrase</h1>
			<p className="text-theme-neutral-dark mb-8">Lorem ipsum dolor sit amet consectetur adipisicing elit</p>

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
			<h1 className="mb-0">Completed</h1>
			<p className="text-theme-neutral-dark mb-8">Lorem ipsum dolor sit amet consectetur adipisicing elit</p>

			<ul>
				<li className="flex justify-between">
					<div>
						<p className="text-theme-neutral-dark text-sm font-semibold">Network</p>
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
						<p className="text-theme-neutral-dark text-sm font-semibold">Address</p>
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

	const form = useForm({ mode: "onChange" });
	const { formState } = form;
	const { isValid } = formState;

	const handleBack = () => {
		setActiveTab(activeTab - 1);
	};

	const handleNext = () => {
		setActiveTab(activeTab + 1);
	};

	return (
		<div>
			<div className="max-w-xl py-16 mx-auto">
				<Form context={form} onSubmit={(data: any) => onSubmit(data)}>
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

							<div className="flex justify-end mt-6 space-x-3">
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
			</div>
		</div>
	);
};
