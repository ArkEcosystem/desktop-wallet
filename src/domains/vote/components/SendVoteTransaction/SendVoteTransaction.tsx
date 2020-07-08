import { images } from "app/assets/images";
import { Address } from "app/components/Address";
import { Avatar } from "app/components/Avatar";
import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { Clipboard } from "app/components/Clipboard";
import { Form, FormField, FormLabel } from "app/components/Form";
import { Icon } from "app/components/Icon";
import { InputPassword, InputRange } from "app/components/Input";
import { Label } from "app/components/Label";
import { SelectionBar, SelectionBarOption, useSelectionState } from "app/components/SelectionBar";
import { StepIndicator } from "app/components/StepIndicator";
import { TabPanel, Tabs } from "app/components/Tabs";
import { TransactionDetail } from "app/components/TransactionDetail";
import { TotalAmountBox } from "domains/transaction/components/TotalAmountBox";
import React, { useEffect, useState } from "react";
import { useForm, useFormContext } from "react-hook-form";

import { VoteList } from "../VoteList";

const { TransactionSuccessfulBanner } = images.transaction.common;

const votes = [
	{
		address: "FJKDSALJFKASLJFKSDAJD333FKFKDSAJFKSAJFKLASJKDFJ",
		delegateName: "Delegate 1",
	},
	{
		address: "AhFJKDSALJFKASLJFKSDEAJ333FKFKDSAJFKSAJFKLASJKDFJ",
		delegateName: "Delegate 2",
	},
	{
		address: "FAhFJKDSALJFKASLJFKSFDAJ333FKFKDSAJFKSAJFKLASJKDFJ",
		delegateName: "Delegate 3",
	},
];

export const FirstStep = () => {
	const { register } = useFormContext();
	const radioState = useSelectionState(1);

	useEffect(() => {
		register("fee", { required: true });
	}, [register]);

	return (
		<section className="space-y-2" data-testid="SendVoteTransaction__step--first">
			<div>
				<h1 className="mb-0">Vote Transaction</h1>
				<p className="text-theme-neutral-dark">Select a fee to continue</p>
			</div>
			<div className="grid grid-flow-row gap-2">
				<TransactionDetail
					border={false}
					label="Cryptoasset"
					extra={
						<div className="ml-1 text-theme-danger">
							<Circle className="bg-theme-background border-theme-danger-light" size="lg">
								<Icon name="Ark" width={20} height={20} />
							</Circle>
						</div>
					}
				>
					<div className="flex-auto font-semibold truncate text-md text-theme-neutral-800 max-w-24">
						ARK Ecosystem
					</div>
				</TransactionDetail>
				<TransactionDetail
					label={
						<div className="mb-2 font-semibold text-theme-neutral">
							<span className="mr-1 text-sm">Sender</span>
							<Label color="warning">
								<span className="text-sm">Your address</span>
							</Label>
						</div>
					}
					extra={<Avatar address="ABUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" />}
				>
					<Address address="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" walletName={"ROBank"} />
				</TransactionDetail>
				<TransactionDetail label="Votes">
					<VoteList votes={votes} />
				</TransactionDetail>
				<TransactionDetail label="Transaction Fee">
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
	<section className="space-y-2" data-testid="SendVoteTransaction__step--second">
		<div>
			<h1 className="mb-0">Transaction Review</h1>
			<p className="text-theme-neutral-dark">Review the transaction details</p>
		</div>
		<div className="grid grid-flow-row gap-2">
			<TransactionDetail
				border={false}
				label="Cryptoasset"
				extra={
					<div className="ml-1 text-theme-danger">
						<Circle className="bg-theme-background border-theme-danger-light" size="lg">
							<Icon name="Ark" width={20} height={20} />
						</Circle>
					</div>
				}
			>
				<div className="flex-auto font-semibold truncate text-md text-theme-neutral-800 max-w-24">
					ARK Ecosystem
				</div>
			</TransactionDetail>
			<TransactionDetail
				label={
					<div className="mb-2 font-semibold text-theme-neutral">
						<span className="mr-1 text-sm">Sender</span>
						<Label color="warning">
							<span className="text-sm">Your address</span>
						</Label>
					</div>
				}
				extra={<Avatar address="ABUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" />}
			>
				<Address address="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" walletName={"ROBank"} />
			</TransactionDetail>
			{votes &&
				votes.map((vote: any, index: number) => {
					return (
						<TransactionDetail label="Vote" extra={<Avatar address={vote.delegateName} />} key={index}>
							<Address address={vote.address} walletName={vote.delegateName} />
						</TransactionDetail>
					);
				})}
			<div className="mt-2 mb-6">
				<TotalAmountBox transactionAmount="400" transactionFee="0.09660435" />
			</div>
		</div>
	</section>
);

export const ThirdStep = () => {
	const { register } = useFormContext();

	useEffect(() => {
		register("passphrase", { required: true });
	}, [register]);

	return (
		<section data-testid="SendVoteTransaction__step--third" className="space-y-8">
			<div className="mb-8">
				<h1 className="mb-0">Authenticate</h1>
				<div className="text-theme-neutral-dark">
					Enter your twelve word mnemonic to authenticate the transaction.
				</div>

				<div className="mt-8">
					<FormField name="name">
						<FormLabel>Mnemonic</FormLabel>
						<InputPassword name="mnemonic" ref={register} />
					</FormField>

					<FormField name="name" className="mt-8">
						<FormLabel>2nd Mnemonic</FormLabel>
						<InputPassword name="secondMnemonic" ref={register} />
					</FormField>
				</div>
			</div>
		</section>
	);
};

export const FourthStep = () => (
	<section data-testid="SendVoteTransaction__step--fourth" className="space-y-8">
		<div>
			<h1 className="mb-0">Transaction Successful</h1>
			<div className="grid grid-flow-row gap-2">
				<div className="w-full my-10">
					<TransactionSuccessfulBanner className="w-full" />
				</div>
				<p className="mb-4 text-theme-neutral-dark">
					Your transaction was successfully sent. Please monitor the blockchain to ensure your transactions is
					confirmed and processed, The following is relevant information for your transaction.
				</p>
				<TransactionDetail border={false} label="ID">
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
					label="Cryptoasset"
					extra={
						<div className="ml-1 text-theme-danger">
							<Circle className="bg-theme-background border-theme-danger-light" size="lg">
								<Icon name="Ark" width={20} height={20} />
							</Circle>
						</div>
					}
				>
					<div className="flex-auto font-semibold truncate text-md text-theme-neutral-800 max-w-24">
						ARK Ecosystem
					</div>
				</TransactionDetail>
				<TransactionDetail
					label={
						<div className="mb-2 font-semibold text-theme-neutral">
							<span className="mr-1 text-sm">Account</span>
							<Label color="warning">
								<span className="text-sm">Your address</span>
							</Label>
						</div>
					}
					extra={<Avatar address="ABUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" />}
				>
					<Address address="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" walletName={"ROBank"} />
				</TransactionDetail>
				<TransactionDetail label="Votes">
					<VoteList votes={votes} />
				</TransactionDetail>
				<TransactionDetail
					label="Amount"
					extra={
						<div className="ml-1 text-theme-danger">
							<Circle className="bg-theme-background border-theme-danger-light" size="lg">
								<Icon name="Sent" width={50} height={50} />
							</Circle>
						</div>
					}
				>
					0.09660435 ARK
				</TransactionDetail>
				<TransactionDetail
					label="Transaction Type"
					extra={
						<div className="ml-1 text-theme-danger">
							<Circle className="border-black bg-theme-background" size="lg">
								<Icon name="Voted" className="text-black" />
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

type SendVoteTransactionProps = {
	onSubmit?: () => void;
};

export const SendVoteTransaction = ({ onSubmit }: SendVoteTransactionProps) => {
	const [activeTab, setActiveTab] = useState(1);
	const form = useForm({ mode: "onChange" });

	const handleBack = () => {
		setActiveTab(activeTab - 1);
	};

	const handleNext = () => {
		setActiveTab(activeTab + 1);
	};

	return (
		<div className="max-w-xl py-16 mx-auto">
			<Form context={form} onSubmit={onSubmit!}>
				<Tabs activeId={activeTab}>
					<StepIndicator size={4} activeIndex={activeTab} />

					<div className="mt-8">
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

						<div className="flex justify-end mt-2 space-x-3">
							{activeTab >= 1 && activeTab < 4 && (
								<>
									<Button
										disabled={activeTab === 1}
										data-testid="SendVoteTransaction__button--back"
										variant="plain"
										onClick={handleBack}
									>
										Back
									</Button>

									{activeTab === 3 ? (
										<Button data-testid="SendVoteTransaction__button--send" onClick={handleNext}>
											<Icon name="Send" width={20} height={20} className="text-white" />
											<span>Send</span>
										</Button>
									) : (
										<Button
											data-testid="SendVoteTransaction__button--continue"
											onClick={handleNext}
										>
											Continue
										</Button>
									)}
								</>
							)}

							{activeTab === 4 && (
								<>
									<Button
										data-testid="SendVoteTransaction__button--back-to-wallet"
										variant="plain"
										className={"block"}
									>
										Back to wallet
									</Button>
									<Button data-testid="SendVoteTransaction__button--download" variant="plain">
										<Icon name="Download" />
										<span>Download</span>
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
