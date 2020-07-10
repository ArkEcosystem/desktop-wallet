import { Address } from "app/components/Address";
import { Alert } from "app/components/Alert";
import { Avatar } from "app/components/Avatar";
import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { Form, FormField, FormLabel } from "app/components/Form";
import { Icon } from "app/components/Icon";
import { InputPassword } from "app/components/Input";
import { Label } from "app/components/Label";
import { useSelectionState } from "app/components/SelectionBar";
import { StepIndicator } from "app/components/StepIndicator";
import { TabPanel, Tabs } from "app/components/Tabs";
import { TransactionDetail } from "app/components/TransactionDetail";
import { InputFee } from "domains/transaction/components/InputFee";
import { LedgerConfirmation } from "domains/transaction/components/LedgerConfirmation";
import { TotalAmountBox } from "domains/transaction/components/TotalAmountBox";
import { TransactionSuccessful } from "domains/transaction/components/TransactionSuccessful";
import React from "react";
import { useForm } from "react-hook-form";

type ResignRegistrationProps = {
	formDefaultData?: any;
	onDownload: any;
};

const FirstStep = ({ form }: { form: any }) => {
	// const { register } = form;
	const selectionBarState = useSelectionState(1);

	return (
		<div data-testid="ResignRegistration__first-step">
			<h1 className="mb-0">Delegate Resignation</h1>
			<div className="text-theme-neutral-dark">Resign your delegate for always.</div>

			<div className="mt-6">
				<Alert size="lg">
					Keep in mind that you cannot restore your delegate after the resignation has been registered on the
					blockchain.
				</Alert>
			</div>

			<div>
				<TransactionDetail
					extra={<Avatar size="lg" address="BAUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" />}
					border={false}
				>
					<div className="mb-2 text-sm font-semibold text-theme-neutral">
						<span className="mr-1">Account</span>
						<Label color="warning">
							<span className="text-sm">Your address</span>
						</Label>
					</div>
					<Address address="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" />
				</TransactionDetail>

				<TransactionDetail label="Delegate Name">Delegate 3</TransactionDetail>

				<TransactionDetail className="pt-6 pb-0">
					<FormField name="name" className="font-normal">
						<FormLabel>Fee ARK</FormLabel>
						<InputFee selectionBarState={selectionBarState} defaultValue={25} min={1} max={100} step={1} />
					</FormField>
				</TransactionDetail>
			</div>
		</div>
	);
};

const SecondStep = () => (
	<div data-testid="ResignRegistration__second-step">
		<div>
			<h1 className="mb-0">Transaction Review</h1>
			<p className="text-theme-neutral-dark">Check the information again before Resignation</p>
		</div>
		<div className="grid grid-flow-row gap-2 mt-4">
			<TransactionDetail
				border={false}
				label="Network"
				extra={
					<div className="ml-1 text-theme-danger">
						<Circle className="bg-theme-background border-theme-danger-light" size="lg">
							<Icon name="Ark" width={20} height={20} />
						</Circle>
					</div>
				}
			>
				<div className="flex-auto font-semibold truncate text-theme-neutral-800 max-w-24">ARK Ecosystem</div>
			</TransactionDetail>

			<TransactionDetail extra={<Avatar size="lg" address="BAUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" />}>
				<div className="mb-2 text-sm font-semibold text-theme-neutral">
					<span className="mr-1">Account</span>
					<Label color="warning">
						<span className="text-sm">Your address</span>
					</Label>
				</div>
				<Address address="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" />
			</TransactionDetail>

			<TransactionDetail label="Delegate Name">Delegate 3</TransactionDetail>

			<div className="my-4">
				<TotalAmountBox transactionAmount="0.00" transactionFee="0.09660435" />
			</div>
		</div>
	</div>
);

const ThirdStep = ({ form, passwordType }: { form: any; passwordType: "mnemonic" | "password" | "ledger" }) => {
	const { register } = form;

	return (
		<div data-testid="ResignRegistration__third-step">
			{passwordType !== "ledger" && (
				<div>
					<h1 className="mb-0">Authenticate</h1>
					<div className="text-theme-neutral-dark">
						Enter your twelve word mnemonic to authenticate the transaction.
					</div>

					<div className="mt-8">
						<FormField name="name">
							<FormLabel>{passwordType === "mnemonic" ? "Mnemonic" : "Encryption Password"}</FormLabel>
							<InputPassword name={passwordType} ref={register} />
						</FormField>

						<FormField name="name" className="pb-4 mt-8">
							<FormLabel>2nd Mnemonic</FormLabel>
							<InputPassword name="secondMnemonic" ref={register} />
						</FormField>
					</div>
				</div>
			)}

			{passwordType === "ledger" && (
				<div>
					<h1>Confirm Your Transaction</h1>
					<LedgerConfirmation />
				</div>
			)}
		</div>
	);
};

export const FourthStep = () => (
	<TransactionSuccessful>
		<TransactionDetail
			label="Transaction Type"
			extra={
				<Circle className="border-black" size="lg">
					<Icon name="Business" width={20} height={20} />
				</Circle>
			}
		>
			Delegate Resignation
		</TransactionDetail>
		<TransactionDetail label="Delegate Name">Delegate 3</TransactionDetail>
		<TransactionDetail
			label="Amount"
			extra={
				<div className="ml-1 text-theme-danger">
					<Circle className="bg-theme-background border-theme-danger-light" size="lg">
						<Icon name="Sent" width={22} height={22} />
					</Circle>
				</div>
			}
		>
			1.09660435 ARK
		</TransactionDetail>
	</TransactionSuccessful>
);

export const ResignRegistration = ({ formDefaultData, onDownload }: ResignRegistrationProps) => {
	const form = useForm({ mode: "onChange", defaultValues: formDefaultData });
	const [activeTab, setActiveTab] = React.useState(1);
	const { formState } = form;
	const { isValid } = formState;

	const handleBack = () => {
		setActiveTab(activeTab - 1);
	};

	const handleNext = () => {
		setActiveTab(activeTab + 1);
	};

	return (
		<div data-testid="ResignRegistration" className="max-w-xl py-16 mx-auto">
			<Form context={form} onSubmit={(data: any) => onDownload(data)}>
				<Tabs activeId={activeTab}>
					<StepIndicator size={6} activeIndex={activeTab} />

					<div className="mt-8">
						<TabPanel tabId={1}>
							<FirstStep form={form} />
						</TabPanel>
						<TabPanel tabId={2}>
							<SecondStep />
						</TabPanel>
						<TabPanel tabId={3}>
							<ThirdStep form={form} passwordType="mnemonic" />
						</TabPanel>
						<TabPanel tabId={4}>
							<ThirdStep form={form} passwordType="password" />
						</TabPanel>
						<TabPanel tabId={5}>
							<ThirdStep form={form} passwordType="ledger" />
						</TabPanel>
						<TabPanel tabId={6}>
							<FourthStep />
						</TabPanel>

						<div className="flex justify-end mt-8 space-x-3">
							{activeTab < 6 && (
								<Button
									disabled={activeTab === 1}
									data-testid="ResignRegistration__back-button"
									variant="plain"
									onClick={handleBack}
								>
									Back
								</Button>
							)}

							{activeTab < 3 && (
								<Button
									data-testid="ResignRegistration__continue-button"
									disabled={!isValid}
									onClick={handleNext}
								>
									Continue
								</Button>
							)}

							{activeTab >= 3 && activeTab < 6 && (
								<Button
									data-testid="ResignRegistration__send-button"
									disabled={!isValid}
									onClick={handleNext}
								>
									<Icon name="Send" className="mr-2" width={20} height={20} />
									Send
								</Button>
							)}

							{activeTab === 6 && (
								<div className="flex justify-end space-x-3">
									<Button data-testid="ResignRegistration__wallet-button" variant="plain">
										Back to wallet
									</Button>

									<Button
										type="submit"
										data-testid="ResignRegistration__download-button"
										variant="plain"
									>
										<Icon name="Download" className="mr-2" />
										Download
									</Button>
								</div>
							)}
						</div>
					</div>
				</Tabs>
			</Form>
		</div>
	);
};

ResignRegistration.defaultProps = {
	formDefaultData: {},
};
