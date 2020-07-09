import { Address } from "app/components/Address";
import { Avatar } from "app/components/Avatar";
import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { Form } from "app/components/Form";
import { Icon } from "app/components/Icon";
import { InputPassword } from "app/components/Input";
import { Label } from "app/components/Label";
import { StepIndicator } from "app/components/StepIndicator";
import { TabPanel, Tabs } from "app/components/Tabs";
import { TransactionDetail } from "app/components/TransactionDetail";
import { LedgerConfirmation } from "domains/transaction/components/LedgerConfirmation";
import { RecipientList } from "domains/transaction/components/RecipientList";
import { SendTransactionForm } from "domains/transaction/components/SendTransactionForm";
import { TotalAmountBox } from "domains/transaction/components/TotalAmountBox";
import { TransactionSuccessful } from "domains/transaction/components/TransactionSuccessful";
import React from "react";
import { useForm } from "react-hook-form";

const recipients = [
	{
		address: "FJKDSALJFKASLJFKSDAJD333FKFKDSAJFKSAJFKLASJKDFJ",
		walletName: "Recipient 1",
		amount: "100",
		assetSymbol: "ARK",
	},
	{
		address: "AhFJKDSALJFKASLJFKSDEAJ333FKFKDSAJFKSAJFKLASJKDFJ",
		walletName: "Recipient 2",
		isMultisig: true,
		amount: "100",
		assetSymbol: "ARK",
	},
	{
		address: "FAhFJKDSALJFKASLJFKSFDAJ333FKFKDSAJFKSAJFKLASJKDFJ",
		walletName: "Recipient 3",
		isInArkNetwork: true,
		amount: "100",
		assetSymbol: "ARK",
	},
	{
		address: "FAhFJKDSALJFKASLJFKSFDAJ333FKFKDSAJFKSAJFKLASJKDFJ",
		walletName: "Recipient 4",
		isInArkNetwork: true,
		amount: "100",
		assetSymbol: "ARK",
	},
];

export const FirstStep = ({ onSubmit, formValues }: any) => {
	return (
		<section data-testid="TransactionSend__step--first">
			<div>
				<h1 className="mb-0">Send</h1>
				<p className="text-theme-neutral-dark">Enter details to send your money</p>
			</div>
			<div className="mt-8">
				<SendTransactionForm {...formValues} onSubmit={onSubmit} />
			</div>
		</section>
	);
};

export const SecondStep = () => (
	<section data-testid="TransactionSend__step--second">
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
				<div className="flex-auto font-semibold truncate text-md text-theme-neutral-800 max-w-24">
					ARK Ecosystem
				</div>
			</TransactionDetail>
			<TransactionDetail extra={<Avatar size="lg" address="ABUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" />}>
				<div className="mb-2 font-semibold text-theme-neutral-500">
					<span className="mr-1 text-sm">Sender</span>
					<Label color="warning">
						<span className="text-sm">Your address</span>
					</Label>
				</div>
				<Address address="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" walletName={"ROBank"} />
			</TransactionDetail>
			<TransactionDetail label="Recipients" className="py-6">
				<RecipientList recipients={recipients} assetSymbol="ARK" isEditable={false} />
			</TransactionDetail>
			<TransactionDetail
				label="Smartbridge"
				className="pt-6"
				extra={
					<div className="mx-2">
						<Icon name="Smartbridge" width={32} height={32} />
					</div>
				}
			>
				Hello!
			</TransactionDetail>
			<div className="mt-2">
				<TotalAmountBox transactionAmount="400" transactionFee="0.09660435" />
			</div>
		</div>
	</section>
);

export const ThirdStep = ({ onSubmit }: any) => {
	const form = useForm();
	const { register } = form;

	return (
		<section data-testid="TransactionSend__step--third">
			<Form context={form} onSubmit={onSubmit}>
				<div>
					<h1 className="mb-0">Passphrase</h1>
					<p className="text-theme-neutral-dark">Confirm your password to continue</p>
					<div className="grid grid-flow-row">
						<TransactionDetail border={false} label="Your password" className="pt-8 pb-0">
							<InputPassword name="passphrase" ref={register({ required: true })} />
						</TransactionDetail>
					</div>
				</div>
			</Form>
		</section>
	);
};

export const FourthStep = () => (
	<section data-testid="TransactionSend__step--fourth">
		<div>
			<h1 className="mb-0">Confirm Your Transaction</h1>
			<LedgerConfirmation />
		</div>
	</section>
);

export const FifthStep = () => (
	<TransactionSuccessful>
		<TransactionDetail label="IPFS Hash">
			<div className="mt-4 mr-1 font-semibold truncate text-theme-neutral-800 text-md">
				JFKDJFKSDJFKDSJFKJKJFKDSJFKLJAKFJAKLJFKALSJFKLASJF
			</div>
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
	formValues: any;
};

export const TransactionSend = ({ onCopy, formValues }: Props) => {
	const [activeTab, setActiveTab] = React.useState(1);

	const handleBack = () => {
		setActiveTab(activeTab - 1);
	};

	const handleNext = () => {
		setActiveTab(activeTab + 1);
	};

	return (
		<div className="max-w-xl py-16 mx-auto">
			<Tabs activeId={activeTab}>
				<StepIndicator size={5} activeIndex={activeTab} />

				<div className="mt-8">
					<TabPanel tabId={1}>
						<FirstStep onSubmit={handleNext} formValues={formValues} />
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
					<TabPanel tabId={5}>
						<FifthStep />
					</TabPanel>

					<div className="flex justify-end mt-8 space-x-3">
						{activeTab > 1 && activeTab < 5 && (
							<>
								<Button
									disabled={activeTab === 1}
									data-testid="TransactionSend__button--back"
									variant="plain"
									onClick={handleBack}
								>
									Back
								</Button>
								<Button
									data-testid="TransactionSend__button--continue"
									// disabled={!isValid}
									onClick={handleNext}
								>
									Continue
								</Button>
							</>
						)}

						{activeTab === 5 && (
							<>
								<Button
									data-testid="TransactionSend__button--back-to-wallet"
									variant="plain"
									className={"block"}
								>
									Back to wallet
								</Button>
								<Button onClick={onCopy} data-testid="TransactionSend__button--copy" variant="plain">
									<Icon name="Copy" />
									<span>Copy</span>
								</Button>
							</>
						)}
					</div>
				</div>
			</Tabs>
		</div>
	);
};
