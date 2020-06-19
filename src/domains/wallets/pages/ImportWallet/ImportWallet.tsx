// UI Elements
import { Button } from "app/components/Button";
import { CardControl } from "app/components/Card";
import { Form, FormField, FormLabel } from "app/components/Form";
import { Icon } from "app/components/Icon";
import { Input, InputPassword } from "app/components/Input";
import { StepIndicator } from "app/components/StepIndicator";
import { TabPanel, Tabs } from "app/components/Tabs";
import { Toggle } from "app/components/Toggle";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

type Props = {
	networks: any;
	onSubmit?: any;
};

type NetworkProps = {
	id: number;
	icon: string;
	name: string;
};

const ImportWallet = ({ networks, onSubmit }: Props) => {
	const [activeIndex, setActiveIndex] = useState(1);
	const [selected, setSelected] = useState(null);
	const [isAddressOnly, setIsAddressOnly] = useState(false);
	const form = useForm();
	const { register } = form;

	const onPreviousBtnClick = (event: any) => {
		// Prevent btn click event propagation to form submittion
		event.preventDefault();
		setActiveIndex(1);
	};

	const renderImportInput = () => {
		if (!isAddressOnly) {
			return (
				<FormField name="password">
					<FormLabel label="Your Password" />
					<InputPassword data-testid="import-wallet__password-input" ref={register} />
				</FormField>
			);
		}

		return (
			// TODO: Change to InputAddress
			<FormField name="address">
				<FormLabel label="Address" />
				<Input data-testid="import-wallet__address-input" ref={register} />
			</FormField>
		);
	};

	return (
		<Tabs activeId={activeIndex}>
			<TabPanel tabId={1}>
				<div className="flex justify-center w-full">
					<div className="w-2/4">
						<StepIndicator size={2} activeIndex={activeIndex} />
						<div className="mt-10">
							<div>
								<p className="text-4xl font-bold">Network for import</p>
								<p className="text-medium">Select the network where you want to import your wallet</p>
							</div>
							{networks && (
								<div className="mt-5">
									{networks.map((network: any) => (
										<div className="mb-3" key={network.id}>
											<CardControl
												name={network.name}
												checked={network.id === selected}
												onChange={() => setSelected(network.id)}
											>
												<div className="flex flex-row items-center h-full py-3">
													{network.icon && (
														<div className="flex items-center justify-center w-12 h-12 mr-3 border rounded-full border-theme-primary-contrast">
															<Icon name={network.icon} height={25} width={25} />
														</div>
													)}
													<span>{network.name}</span>
												</div>
											</CardControl>
										</div>
									))}
								</div>
							)}
						</div>
						<div className="mt-10">
							<Button
								color="primary"
								variant="solid"
								onClick={() => setActiveIndex(2)}
								data-testid="import-wallet__next-step--button"
							>
								Continue
							</Button>
						</div>
					</div>
				</div>
			</TabPanel>

			<TabPanel tabId={2}>
				<div className="flex justify-center w-full">
					<div className="w-2/4">
						<StepIndicator size={2} activeIndex={activeIndex} />
						<Form id="import-wallet__form" context={form} onSubmit={onSubmit}>
							<div className="mt-10 ">
								<div className="_header">
									<p className="text-4xl font-bold">Import Wallet</p>
									<p className="text-medium">
										Enter your wallet password in order to get full access to your money. Or you can
										choose an address for vieweing only.
									</p>
								</div>
								<div className="flex flex-row items-center justify-between mt-8">
									<div>
										<p className="text-xl font-bold">Use the address only</p>
										<p className="text-sm">You can only view your wallet but not send money.</p>
									</div>
									<Toggle
										checked={isAddressOnly}
										onChange={() => setIsAddressOnly(!isAddressOnly)}
										data-testid="import-wallet__address-toggle"
									/>
								</div>
								<div className="mt-8" data-testid="import-wallet__password">
									{renderImportInput()}
								</div>
							</div>
							<div className="mt-10 space-x-3">
								<Button
									data-testid="import-wallet__prev-step--button"
									color="primary"
									variant="plain"
									onClick={onPreviousBtnClick}
								>
									Back
								</Button>
								<Button form="import-wallet__form" color="primary" variant="solid" type="submit">
									Go to Wallet
								</Button>
							</div>
						</Form>
					</div>
				</div>
			</TabPanel>
		</Tabs>
	);
};

export { ImportWallet };
