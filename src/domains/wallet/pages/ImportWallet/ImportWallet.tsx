import { Button } from "app/components/Button";
import { Form, FormField, FormLabel } from "app/components/Form";
import { Input, InputPassword } from "app/components/Input";
import { Page, Section } from "app/components/Layout";
import { SelectNetwork } from "app/components/SelectNetwork";
import { StepIndicator } from "app/components/StepIndicator";
import { TabPanel, Tabs } from "app/components/Tabs";
import { Toggle } from "app/components/Toggle";
import { useActiveProfile } from "app/hooks/env";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

type Network = { name: string; icon: string };

type Props = {
	networks: Network[];
	onSubmit?: any;
};

const ImportWallet = ({ networks, onSubmit }: Props) => {
	const [activeTab, setActiveTab] = useState(1);
	const [selectedNetwork, setSelectedNetwork] = useState<Network | undefined>(undefined);
	const [isAddressOnly, setIsAddressOnly] = useState(false);
	const activeProfile = useActiveProfile();
	const form = useForm({ mode: "onChange" });
	const { formState, register, setValue } = form;
	const { isValid } = formState;

	useEffect(() => {
		register("network", { required: true });
	}, [register]);

	const crumbs = [
		{
			route: `/profiles/${activeProfile?.id()}/dashboard`,
			label: "Go back to Portfolio",
		},
	];

	const handleSelectedNetwork = (network: Network) => {
		setSelectedNetwork(network);
		setValue("network", network, true);
	};

	const renderImportInput = () => {
		if (!isAddressOnly) {
			return (
				<FormField name="password">
					<FormLabel label="Your Password" />
					<InputPassword data-testid="ImportWallet__password-input" ref={register} />
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
		<Page crumbs={crumbs}>
			<Section className="flex-1">
				<Form className="max-w-xl mx-auto" context={form} onSubmit={onSubmit} data-testid="ImportWallet__form">
					<Tabs activeId={activeTab}>
						<TabPanel tabId={1}>
							<div className="flex justify-center w-full">
								<div className="w-full">
									<StepIndicator size={2} activeIndex={activeTab} />
									<div>
										<div className="my-8">
											<h1 className="mb-0">Select a Cryptoasset</h1>
											<p className="text-medium text-theme-neutral-700">
												Select a cryptoasset to import your existing wallet address
											</p>
										</div>
										<div className="space-y-2">
											<span className="text-sm font-medium text-theme-neutral-dark">Network</span>
											<SelectNetwork
												name={selectedNetwork as any}
												networks={networks}
												onSelect={(selected) => handleSelectedNetwork(selected?.name)}
											/>
										</div>
									</div>
									<div className="flex justify-end mt-10">
										<Button
											disabled={!isValid}
											onClick={() => setActiveTab(2)}
											data-testid="ImportWallet__next-step--button"
										>
											Continue
										</Button>
									</div>
								</div>
							</div>
						</TabPanel>

						<TabPanel tabId={2}>
							<div className="flex justify-center w-full">
								<div className="w-full">
									<StepIndicator size={2} activeIndex={activeTab} />
									<div className="mt-8">
										<div className="_header">
											<h1 className="mb-0">Import Wallet</h1>
											<p className="text-medium text-theme-neutral-700">
												Enter your wallet password in order to get full access to your money. Or
												you can choose an address for vieweing only.
											</p>
										</div>
										<div className="flex flex-row items-center justify-between mt-8">
											<div>
												<p className="text-lg font-semibold text-theme-neutral-dark">
													Use the address only
												</p>
												<p className="text-sm text-theme-neutral">
													You can only view your wallet but not send money.
												</p>
											</div>
											<Toggle
												checked={isAddressOnly}
												onChange={() => setIsAddressOnly(!isAddressOnly)}
												data-testid="ImportWallet__address-toggle"
											/>
										</div>
										<div className="mt-8" data-testid="ImportWallet__password">
											{renderImportInput()}
										</div>
									</div>
									<div className="flex justify-end mt-10 space-x-3">
										<Button
											variant="plain"
											onClick={() => setActiveTab(1)}
											data-testid="ImportWallet__prev-step--button"
										>
											Back
										</Button>
										<Button form="ImportWallet__form" type="submit">
											Go to Wallet
										</Button>
									</div>
								</div>
							</div>
						</TabPanel>
					</Tabs>
				</Form>
			</Section>
		</Page>
	);
};

export { ImportWallet };
