import { Address } from "app/components/Address";
import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { Clipboard } from "app/components/Clipboard";
import { Form } from "app/components/Form";
import { Icon } from "app/components/Icon";
import { Input, InputPassword, InputRange } from "app/components/Input";
import { SelectionBar, SelectionBarOption, useSelectionState } from "app/components/SelectionBar";
import { StepIndicator } from "app/components/StepIndicator";
import { TabPanel, Tabs } from "app/components/Tabs";
import { TransactionDetail } from "app/components/TransactionDetail";
import React, { useEffect } from "react";
import { useForm, useFormContext } from "react-hook-form";

export const FirstStep = () => {
	const { register } = useFormContext();
	const radioState = useSelectionState(1);

	useEffect(() => {
		register("amount", { required: true });
		register("fee", { required: true });
	}, [register]);

	return (
		<section data-testid="VoteForDelegate__step--first" className="space-y-8">
			<div>
				<h1 className="mb-0">Vote for delegate</h1>
				<p className="text-theme-neutral-dark">Enter details to send your money</p>
			</div>
			<div className="grid grid-flow-row gap-2">
				<TransactionDetail
					border={false}
					label="Account"
					extra={
						<div>
							<Circle avatarId="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK"></Circle>
						</div>
					}
				>
					<Address address="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" walletName={"ROBank"} size="large" />
				</TransactionDetail>
				<TransactionDetail
					label="Delegate"
					extra={
						<div>
							<Circle avatarId="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK"></Circle>
						</div>
					}
				>
					<Address address="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" walletName={"Delegate 3"} size="large" />
				</TransactionDetail>
				<TransactionDetail label="Amount ARK">
					<Input name="amount" />
				</TransactionDetail>
				<TransactionDetail border={false} label="Fee ARK">
					<div className="flex">
						<div className="w-3/5 mr-2">
							<InputRange defaultValue={25} min={1} max={100} step={1} />
						</div>
						<div className="ml-2">
							<SelectionBar>
								<SelectionBarOption value={1} {...radioState}>
									Last
								</SelectionBarOption>
								<SelectionBarOption value={2} {...radioState}>
									Min
								</SelectionBarOption>
								<SelectionBarOption value={3} {...radioState}>
									Average
								</SelectionBarOption>
							</SelectionBar>
						</div>
					</div>
				</TransactionDetail>
			</div>
		</section>
	);
};
export const SecondStep = () => (
	<section data-testid="VoteForDelegate__step--second" className="space-y-8">
		<div>
			<h1 className="mb-0">Transaction Review</h1>
			<p className="text-theme-neutral-dark">Check the information again before voting</p>
		</div>
		<div className="grid grid-flow-row gap-2">
			<TransactionDetail
				border={false}
				label="Network"
				extra={
					<div className="text-theme-danger-500 ml-1">
						<Circle className="bg-theme-background border-theme-danger-200" size="large">
							<Icon name="Ark" width={20} height={20} />
						</Circle>
					</div>
				}
			>
				<Address address="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" walletName={"ROBank"} size="large" />
			</TransactionDetail>
			<TransactionDetail
				label="Account"
				extra={
					<div>
						<Circle avatarId="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK"></Circle>
					</div>
				}
			>
				<Address address="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" walletName={"ROBank"} size="large" />
			</TransactionDetail>
			<TransactionDetail
				label="Delegate"
				extra={
					<div>
						<Circle avatarId="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK"></Circle>
					</div>
				}
			>
				<Address address="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" walletName={"ROBank"} size="large" />
			</TransactionDetail>
			<TransactionDetail
				label="Amount"
				extra={
					<div className="text-theme-danger ml-1">
						<Circle className="bg-theme-background border-theme-danger-200" size="large">
							<Icon name="Sent" width={50} height={50} />
						</Circle>
					</div>
				}
			>
				1.00 ARK <span className="text-theme-neutral-400">25.00 USD</span>
			</TransactionDetail>
			<TransactionDetail label="Transaction fee">0.09660435 ARK</TransactionDetail>
		</div>
	</section>
);

export const ThirdStep = () => {
	const { register } = useFormContext();

	useEffect(() => {
		register("passphrase", { required: true });
	}, [register]);

	return (
		<section data-testid="VoteForDelegate__step--third" className="space-y-8">
			<div>
				<h1 className="mb-0">Passphrase</h1>
				<p className="text-theme-neutral-dark">Confirm your password to continue</p>
				<div className="grid grid-flow-row gap-2">
					<TransactionDetail border={false} label="Your password">
						<InputPassword name="passphras" />
					</TransactionDetail>
				</div>
			</div>
		</section>
	);
};

export const FourthStep = () => (
	<section data-testid="VoteForDelegate__step--fourth" className="space-y-8">
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
						<div className="text-theme-primary-300 mb-1 ml-5">
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
						<div className="text-theme-primary-300 mb-1 ml-5">
							<Icon name="Copy" />
						</div>
					</div>
				</TransactionDetail>
				<TransactionDetail
					border={false}
					label="Network"
					extra={
						<div className="text-theme-danger-500 ml-1">
							<Circle className="bg-theme-background border-theme-danger-200" size="large">
								<Icon name="Ark" width={20} height={20} />
							</Circle>
						</div>
					}
				>
					<Address address="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" walletName={"ROBank"} size="large" />
				</TransactionDetail>
				<TransactionDetail
					label="Account"
					extra={
						<div>
							<Circle avatarId="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK"></Circle>
						</div>
					}
				>
					<Address address="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" walletName={"ROBank"} size="large" />
				</TransactionDetail>
				<TransactionDetail
					label="Delegate"
					extra={
						<div>
							<Circle avatarId="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK"></Circle>
						</div>
					}
				>
					<Address address="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" walletName={"Delegate 3"} size="large" />
				</TransactionDetail>
				<TransactionDetail
					label="Amount"
					extra={
						<div className="text-theme-danger ml-1">
							<Circle className="bg-theme-background border-theme-danger-200" size="large">
								<Icon name="Sent" width={50} height={50} />
							</Circle>
						</div>
					}
				>
					1.00 ARK
				</TransactionDetail>
				<TransactionDetail
					label="Transaction type"
					extra={
						<div className="text-theme-danger ml-1">
							<Circle className="bg-theme-background border-black" size="large">
								<Icon name="Voted" />
							</Circle>
						</div>
					}
				>
					Vote
				</TransactionDetail>
			</div>
		</div>
	</section>
);

type Props = {
	onCopy: () => void;
	onSubmit: () => void;
};

export const VoteForDelegate = ({ onCopy, onSubmit }: Props) => {
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
		<div className="max-w-xl mx-auto">
			<Form context={form} onSubmit={onSubmit}>
				<Tabs activeId={activeTab}>
					<StepIndicator size={4} activeIndex={activeTab} />

					<div className="mt-10">
						<TabPanel tabId={1}>
							<FirstStep />
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

						<div className="flex justify-start mt-6 space-x-2">
							{activeTab < 4 && (
								<>
									<Button
										disabled={activeTab === 1}
										data-testid="VoteForDelegate__button--back"
										variant="plain"
										size="large"
										onClick={handleBack}
									>
										Back
									</Button>
									<Button
										data-testid="VoteForDelegate__button--continue"
										variant="solid"
										size="large"
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
										data-testid="VoteForDelegate__button--back-to-wallet"
										variant="plain"
										className={"block"}
										size="large"
									>
										Back to wallet
									</Button>
									<Button
										onClick={onCopy}
										data-testid="VoteForDelegate__button--copy"
										variant="plain"
										size="large"
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
	);
};
