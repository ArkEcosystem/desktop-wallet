import { Address } from "app/components/Address";
import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { Form } from "app/components/Form";
import { Icon } from "app/components/Icon";
import { Input, InputPassword } from "app/components/Input";
import { SelectAsset } from "app/components/SelectAsset";
import { useSelectionState } from "app/components/SelectionBar";
import { StepIndicator } from "app/components/StepIndicator";
import { TabPanel, Tabs } from "app/components/Tabs";
import { TransactionDetail } from "app/components/TransactionDetail";
import { InputFee } from "domains/transaction/components/InputFee";
import { TotalAmountBox } from "domains/transaction/components/TotalAmountBox";
import { TransactionSuccessful } from "domains/transaction/components/TransactionSuccessful";
import React, { useEffect } from "react";
import { useForm, useFormContext } from "react-hook-form";

export const FirstStep = ({ assets = [] }: any) => {
	const { register } = useFormContext();
	const selectionBarState = useSelectionState(1);

	useEffect(() => {
		register("hash", { required: true });
		register("fee", { required: true });
	}, [register]);

	return (
		<section data-testid="SendIPFSTransaction__step--first">
			<div>
				<h1 className="mb-0">IPFS</h1>
				<p className="text-theme-neutral-dark">Store an IPFS hasn on the network</p>
			</div>
			<div className="mt-4 grid grid-flow-row gap-2">
				<TransactionDetail border={false} label="Network">
					<SelectAsset assets={assets} />
				</TransactionDetail>
				<TransactionDetail border={false} label="Sender">
					<div className="relative flex items-center">
						<Input type="text" disabled />
						<div className="absolute flex items-center ml-3">
							<Circle avatarId="test" size="sm" noShadow className="mr-3" />
							<Address address="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" walletName="ROBank" />
						</div>
					</div>
				</TransactionDetail>
				<TransactionDetail border={false} label="Hash">
					<Input name="hash" />
				</TransactionDetail>
				<TransactionDetail border={false} label="Fee ARK" className="pb-0">
					<InputFee selectionBarState={selectionBarState} defaultValue={25} min={1} max={100} step={1} />
				</TransactionDetail>
			</div>
		</section>
	);
};

export const SecondStep = () => (
	<section data-testid="SendIPFSTransaction__step--second">
		<div>
			<h1 className="mb-0">Transaction Review</h1>
			<p className="text-theme-neutral-dark">Check the information again before voting</p>
		</div>
		<div className="mt-4 grid grid-flow-row gap-2">
			<TransactionDetail
				border={false}
				label="Network"
				extra={
					<div className="ml-1 text-theme-danger-500">
						<Circle className="bg-theme-background border-theme-danger-200" size="lg">
							<Icon name="Ark" width={20} height={20} />
						</Circle>
					</div>
				}
			>
				<span>ARK Ecosystem</span>
			</TransactionDetail>
			<TransactionDetail
				label="Sender"
				extra={
					<div>
						<Circle avatarId="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" />
					</div>
				}
			>
				<Address address="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" walletName={"ROBank"} />
			</TransactionDetail>
			<TransactionDetail
				label="Hash"
				extra={
					<div className="ml-1">
						<Circle className="border-black bg-theme-background" size="lg">
							<Icon name="Ipfs" width={23} height={23} />
						</Circle>
					</div>
				}
			>
				<span className="font-semibold">QmceNpwJqQm7vXUivbQeeQYeGr1ivT1VDRPaWK9Pf</span>
			</TransactionDetail>
			<TotalAmountBox transactionAmount="1.00" transactionFee="0.09660435" />
		</div>
	</section>
);

export const ThirdStep = () => {
	const { register } = useFormContext();

	useEffect(() => {
		register("passphrase", { required: true });
	}, [register]);

	return (
		<section data-testid="SendIPFSTransaction__step--third" className="space-y-8">
			<div>
				<h1 className="mb-0">Passphrase</h1>
				<p className="text-theme-neutral-dark">Confirm your password to continue</p>
				<div className="mt-4 grid grid-flow-row gap-2">
					<TransactionDetail border={false} label="Your password" className="pb-0">
						<InputPassword name="passphras" />
					</TransactionDetail>
				</div>
			</div>
		</section>
	);
};

export const FourthStep = () => (
	<TransactionSuccessful>
		<TransactionDetail label="IPFS Hash">
			<span className="font-semibold">QmceNpwJqQm7vXUivbQeeQYeGr1ivT1VDRPaWK9Pf</span>
		</TransactionDetail>
		<TransactionDetail
			label="Amount"
			className="pb-0"
			extra={
				<div className="ml-1 text-theme-danger">
					<Circle className="bg-theme-background border-theme-danger-200" size="lg">
						<Icon name="Sent" width={50} height={50} />
					</Circle>
				</div>
			}
		>
			1.00 ARK
		</TransactionDetail>
	</TransactionSuccessful>
);

type Props = {
	onCopy?: () => void;
	onSubmit?: any;
	assets?: any[];
};

export const SendIPFSTransaction = ({ onCopy, onSubmit, assets }: Props) => {
	const [activeTab, setActiveTab] = React.useState(1);

	const form = useForm({ mode: "onChange" });
	// const { formState } = form;
	// const { isValid } = formState;

	const handleBack = () => {
		setActiveTab(activeTab - 1);
	};

	const handleNext = () => {
		setActiveTab(activeTab + 1);
	};

	return (
		<div>
			<div className="max-w-xl py-16 mx-auto">
				<Form context={form} onSubmit={onSubmit}>
					<Tabs activeId={activeTab}>
						<StepIndicator size={4} activeIndex={activeTab} />

						<div className="mt-8">
							<TabPanel tabId={1}>
								<FirstStep assets={assets} />
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

							<div className="flex justify-end mt-8 space-x-2">
								{activeTab < 4 && (
									<>
										<Button
											disabled={activeTab === 1}
											data-testid="SendIPFSTransaction__button--back"
											variant="plain"
											onClick={handleBack}
										>
											Back
										</Button>
										<Button
											data-testid="SendIPFSTransaction__button--continue"
											variant="solid"
											// disabled={!isValid}
											onClick={handleNext}
										>
											Continue
										</Button>
									</>
								)}

								{activeTab === 4 && (
									<>
										<Button
											data-testid="SendIPFSTransaction__button--back-to-wallet"
											variant="plain"
											className={"block"}
										>
											Back to wallet
										</Button>
										<Button
											onClick={onCopy}
											data-testid="SendIPFSTransaction__button--copy"
											variant="plain"
										>
											<div className="flex items-center justify-between px-1">
												<Icon name="Copy" />
												<span className="ml-2">Copy</span>
											</div>
										</Button>
									</>
								)}
							</div>
						</div>
					</Tabs>
				</Form>
			</div>
		</div>
	);
};
