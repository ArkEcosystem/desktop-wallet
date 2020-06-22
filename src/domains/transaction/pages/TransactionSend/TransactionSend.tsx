import { images } from "app/assets/images";
import { Address } from "app/components/Address";
import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { Clipboard } from "app/components/Clipboard";
import { Form } from "app/components/Form";
import { Icon } from "app/components/Icon";
import { InputPassword } from "app/components/Input";
import { Label } from "app/components/Label";
import { Spinner } from "app/components/Spinner";
import { StepIndicator } from "app/components/StepIndicator";
import { TabPanel, Tabs } from "app/components/Tabs";
import { TransactionDetail } from "app/components/TransactionDetail";
import { SendTransactionForm } from "domains/transaction/components/SendTransactionForm";
import React from "react";
import { useForm } from "react-hook-form";

const { ConfirmTransactionLedgerBanner } = images.transaction.pages.transactionSend;

export const FirstStep = ({ onSubmit, formValues }: any) => {
	return (
		<section data-testid="TransactionSend__step--first" className="space-y-8">
			<div>
				<h1 className="mb-0">Send</h1>
				<p className="text-theme-neutral-dark">Enter details to send your money</p>
			</div>
			<SendTransactionForm {...formValues} onSubmit={onSubmit} />
		</section>
	);
};

export const SecondStep = () => (
	<section data-testid="TransactionSend__step--second" className="space-y-8">
		<div>
			<h1 className="mb-0">Transaction Review</h1>
			<p className="text-theme-neutral-dark">Check the information again before voting</p>
		</div>
		<div className="grid grid-flow-row gap-2">
			<TransactionDetail
				border={false}
				label="Network"
				extra={
					<div className="ml-1 text-theme-danger-500">
						<Circle className="bg-theme-background border-theme-danger-200" size="large">
							<Icon name="Ark" width={20} height={20} />
						</Circle>
					</div>
				}
			>
				<div className="flex-auto text-xl font-semibold truncate text-theme-neutral-800 max-w-24">
					ARK Ecosystem
				</div>
			</TransactionDetail>
			<TransactionDetail
				label="Account"
				extra={
					<div>
						<Circle avatarId="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" />
					</div>
				}
			>
				<Address address="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" walletName={"ROBank"} size="large" />
			</TransactionDetail>
			<TransactionDetail
				label=" "
				extra={
					<div>
						<Circle avatarId="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" />
					</div>
				}
			>
				<div className="mb-2 text-sm font-semibold text-theme-neutral-500">
					<span className="mr-1">Sender</span>
					<Label color="warning">Your address</Label>
				</div>
				<Address address="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" walletName={"ROBank"} size="large" />
			</TransactionDetail>
			<TransactionDetail
				label="Amount"
				extra={
					<div className="ml-1 text-theme-danger">
						<Circle className="bg-theme-background border-theme-danger-200" size="large">
							<Icon name="Sent" width={50} height={50} />
						</Circle>
					</div>
				}
			>
				1.00 ARK <span className="text-theme-neutral-400">25.00 USD</span>
			</TransactionDetail>
			<TransactionDetail
				label="Smartbridge"
				extra={
					<div className="mx-2">
						<Icon name="Smartbridge" width={32} height={32} />
					</div>
				}
			>
				Hello!
			</TransactionDetail>
			<TransactionDetail label="Transaction fee">0.09660435 ARK</TransactionDetail>
		</div>
	</section>
);

export const ThirdStep = ({ onSubmit }: any) => {
	const form = useForm();
	const { register } = form;

	return (
		<section data-testid="TransactionSend__step--third" className="space-y-8">
			<Form context={form} onSubmit={onSubmit}>
				<div>
					<h1 className="mb-0">Passphrase</h1>
					<p className="text-theme-neutral-dark">Confirm your password to continue</p>
					<div className="grid grid-flow-row gap-2">
						<TransactionDetail border={false} label="Your password">
							<InputPassword name="passphrase" ref={register({ required: true })} />
						</TransactionDetail>
					</div>
				</div>
			</Form>
		</section>
	);
};

export const FourthStep = () => (
	<section data-testid="TransactionSend__step--fourth" className="space-y-8">
		<div>
			<h1 className="mb-0">Confirm Your Transaction</h1>
			<div className="grid grid-flow-row gap-2">
				<ConfirmTransactionLedgerBanner className="my-8" />
				<p className="text-theme-neutral-dark">
					Please review and verify the information on your Ledger device. Choose Accept to complete your
					transaction.
				</p>
				<div className="inline-flex items-center mt-5 space-x-4">
					<Spinner color="primary" size="default" />
					<span className="font-semibold text-black">Waiting for confirmation...</span>
				</div>
			</div>
		</div>
	</section>
);

export const FifthStep = () => (
	<section data-testid="TransactionSend__step--fifth" className="space-y-8">
		<div>
			<h1 className="mb-0">Transaction Successful</h1>
			<div className="grid grid-flow-row gap-2">
				<div className="w-full mt-10">
					<Icon name="TransactionSuccessful" width="100%" height={200} />
				</div>
				<p className="text-theme-neutral-dark">
					Your transaction was successfully sent. Please monitor the blockchain to ensure your transactions is
					confirmed and processed, The following is relevant information for your transaction.
				</p>
				<TransactionDetail label="ID">
					<div className="flex items-center">
						<Clipboard>
							<Address
								addressClass="text-theme-primary"
								address="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWKAUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK"
								maxChars={32}
							/>
						</Clipboard>
						<div className="mb-1 ml-5 text-theme-primary-300">
							<Icon name="Copy" />
						</div>
					</div>
				</TransactionDetail>
				<TransactionDetail label="Block ID">
					<div className="flex items-center">
						<Clipboard>
							<Address
								addressClass="text-theme-primary"
								address="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWKAUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK"
								maxChars={32}
							/>
						</Clipboard>
						<div className="mb-1 ml-5 text-theme-primary-300">
							<Icon name="Copy" />
						</div>
					</div>
				</TransactionDetail>
				<TransactionDetail
					border={false}
					label="Network"
					extra={
						<div className="ml-1 text-theme-danger-500">
							<Circle className="bg-theme-background border-theme-danger-200" size="large">
								<Icon name="Ark" width={20} height={20} />
							</Circle>
						</div>
					}
				>
					<Address address="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" walletName={"ROBank"} size="large" />
				</TransactionDetail>
				<TransactionDetail
					label=" "
					extra={
						<div>
							<Circle avatarId="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" />
						</div>
					}
				>
					<div className="mb-2 text-sm font-semibold text-theme-neutral-500">
						<span className="mr-1">Sender</span>
						<Label color="warning">Your address</Label>
					</div>
					<Address address="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" walletName={"ROBank"} size="large" />
				</TransactionDetail>
				<TransactionDetail label="IPFS Hash">
					<div className="mt-4 mr-1 font-semibold truncate text-theme-neutral-800 text-md">
						JFKDJFKSDJFKDSJFKJKJFKDSJFKLJAKFJAKLJFKALSJFKLASJF
					</div>
				</TransactionDetail>
				<TransactionDetail
					label="Amount"
					extra={
						<div className="ml-1 text-theme-danger">
							<Circle className="bg-theme-background border-theme-danger-200" size="large">
								<Icon name="Sent" width={50} height={50} />
							</Circle>
						</div>
					}
				>
					1.00 ARK
				</TransactionDetail>
			</div>
		</div>
	</section>
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
		<div className="max-w-xl mx-auto">
			<Tabs activeId={activeTab}>
				<StepIndicator size={5} activeIndex={activeTab} />

				<div className="mt-10">
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

					<div className="flex justify-end mt-6 space-x-3">
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
