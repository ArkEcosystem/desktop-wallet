import React, { useState } from "react";
import { useForm } from "react-hook-form";
// UI Elements
import { Button } from "app/components/Button";
import { CardControl } from "app/components/Card";
import { Form } from "app/components/Form";
import { Input } from "app/components/Input";
import { StepIndicator } from "app/components/StepIndicator";
import { SvgIcon } from "app/components/SvgIcon";
import { Tabs, TabPanel } from "app/components/Tabs";
import { Toggle } from "app/components/Toggle";

type Props = {
	networks: any;
};

type NetworkProps = {
	id: number;
	icon: string;
	name: string;
};

const ImportWallet = ({ networks }: Props) => {
	const [activeIndex, setActiveIndex] = useState(1);
	const [selected, setSelected] = useState(null);
	const [isAddressOnly, setIsAddressOnly] = useState(false);
	const { register, errors } = useForm();

	const renderImportInput = () => {
		const innerSlot = (
			<button className="text-theme-neutral-600">
				<SvgIcon name="qrcode" />
			</button>
		);

		if (!isAddressOnly) {
			return (
				<Input type="text" label="Your password" name="password" ref={register} error={errors["password"]} />
			);
		}

		return (
			<Input
				type="text"
				label="Address"
				name="address"
				innerSlot={innerSlot}
				ref={register}
				error={errors["address"]}
			/>
		);
	};

	const submitImportWallet = (data: any) => console.log(data);

	return (
		<Tabs initialId={1}>
			<TabPanel tabId={1} overrideActiveIndex={activeIndex}>
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
												checked={network.id === selected}
												onChange={() => setSelected(network.id)}
											>
												<div className="flex flex-row h-full items-center py-3">
													{network.icon && (
														<div className="rounded-full border border-theme-primary-contrast w-12 h-12 flex justify-center items-center mr-3">
															<SvgIcon name={network.icon} height={25} width={25} />
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
							<Button color="primary" variant="solid" onClick={() => setActiveIndex(2)}>
								Continue
							</Button>
						</div>
					</div>
				</div>
			</TabPanel>

			<TabPanel tabId={2} overrideActiveIndex={activeIndex}>
				<div className="flex justify-center w-full">
					<div className="w-2/4">
						<StepIndicator size={2} activeIndex={activeIndex} />
						<Form handleOnSubmit={submitImportWallet}>
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
									<Toggle checked={isAddressOnly} onChange={() => setIsAddressOnly(!isAddressOnly)} />
								</div>
								<div className="mt-8">{renderImportInput()}</div>
							</div>
							<div className="mt-10">
								<Button color="primary" variant="plain" onClick={() => setActiveIndex(1)}>
									Back
								</Button>
								<Button color="primary" variant="solid" className="ml-2" type="submit">
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
