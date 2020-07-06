// UI Elements
import { Button } from "app/components/Button";
import { Form, FormField, FormLabel } from "app/components/Form";
import { Input, InputPassword } from "app/components/Input";
import { SelectAsset } from "app/components/SelectAsset";
import { StepIndicator } from "app/components/StepIndicator";
import { TabPanel, Tabs } from "app/components/Tabs";
import { Toggle } from "app/components/Toggle";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

type Props = {
	networks: any;
	onSubmit?: any;
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
		<div className="py-16">
			<Tabs activeId={activeIndex}>
				<TabPanel tabId={1}>
					<div className="flex justify-center w-full">
						<div className="w-3/5">
							<StepIndicator size={2} activeIndex={activeIndex} />
							<div>
								<div className="my-8">
									<h1 className="mb-0">Select a Cryptoasset</h1>
									<p className="text-medium text-theme-neutral-700">
										Select a cryptoasset to import your existing wallet address
									</p>
								</div>
								<SelectAsset
									name={selected as any}
									assets={networks}
									onSelect={(selected) => setSelected(selected.name)}
								/>
							</div>
							<div className="flex justify-end mt-10">
								<Button
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
						<div className="w-3/5">
							<StepIndicator size={2} activeIndex={activeIndex} />
							<Form id="import-wallet__form" context={form} onSubmit={onSubmit}>
								<div className="mt-8">
									<div className="_header">
										<h1 className="mb-0">Import Wallet</h1>
										<p className="text-medium text-theme-neutral-700">
											Enter your wallet password in order to get full access to your money. Or you
											can choose an address for vieweing only.
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
											data-testid="import-wallet__address-toggle"
										/>
									</div>
									<div className="mt-8" data-testid="import-wallet__password">
										{renderImportInput()}
									</div>
								</div>
								<div className="flex justify-end mt-10 space-x-3">
									<Button
										data-testid="import-wallet__prev-step--button"
										variant="plain"
										onClick={onPreviousBtnClick}
									>
										Back
									</Button>
									<Button form="import-wallet__form" type="submit">
										Go to Wallet
									</Button>
								</div>
							</Form>
						</div>
					</div>
				</TabPanel>
			</Tabs>
		</div>
	);
};

export { ImportWallet };
