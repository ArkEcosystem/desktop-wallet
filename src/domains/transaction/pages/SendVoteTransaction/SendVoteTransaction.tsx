import { Address } from "app/components/Address";
import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { Form } from "app/components/Form";
import { Icon } from "app/components/Icon";
import { InputPassword, InputRange } from "app/components/Input";
import { SelectionBar, SelectionBarOption, useSelectionState } from "app/components/SelectionBar";
import { StepIndicator } from "app/components/StepIndicator";
import { TabPanel, Tabs } from "app/components/Tabs";
import { TransactionDetail } from "app/components/TransactionDetail";
import { TransactionSuccessful } from "domains/transaction/components/TransactionSuccessful";
import React, { useEffect } from "react";
import { useForm, useFormContext } from "react-hook-form";

export const FirstStep = () => {
	const { register } = useFormContext();
	const radioState = useSelectionState(1);

	useEffect(() => {
		register("fee", { required: true });
	}, [register]);

	return (
		<section data-testid="SendVoteTransaction__step--first">
			<div>
				<h1 className="mb-0">Vote for delegate</h1>
				<p className="text-theme-neutral-dark">Enter details to send your money</p>
			</div>
			<div className="mt-4 grid grid-flow-row gap-2">
				<TransactionDetail
					border={false}
					label="Account"
					extra={
						<div>
							<Circle avatarId="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" />
						</div>
					}
				>
					<Address address="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" walletName={"ROBank"} />
				</TransactionDetail>
				<TransactionDetail
					label="Delegate"
					extra={
						<div>
							<Circle avatarId="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" />
						</div>
					}
				>
					<Address address="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" walletName={"Delegate 3"} />
				</TransactionDetail>
				<TransactionDetail border={false} label="Fee ARK" className="pb-0">
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
	<section data-testid="SendVoteTransaction__step--second">
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
						<Circle className="bg-theme-background border-theme-danger-200">
							<Icon name="Ark" width={20} height={20} />
						</Circle>
					</div>
				}
			>
				<Address address="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" walletName={"ROBank"} />
			</TransactionDetail>
			<TransactionDetail
				label="Account"
				extra={
					<div>
						<Circle avatarId="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" />
					</div>
				}
			>
				<Address address="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" walletName={"ROBank"} />
			</TransactionDetail>
			<TransactionDetail
				label="Delegate"
				extra={
					<div>
						<Circle avatarId="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" />
					</div>
				}
			>
				<Address address="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" walletName={"ROBank"} />
			</TransactionDetail>
			<TransactionDetail label="Transaction fee" className="pb-0">
				0.09660435 ARK
			</TransactionDetail>
		</div>
	</section>
);

export const ThirdStep = () => {
	const { register } = useFormContext();

	useEffect(() => {
		register("passphrase", { required: true });
	}, [register]);

	return (
		<section data-testid="SendVoteTransaction__step--third">
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
		<TransactionDetail
			label="Delegate"
			extra={
				<div>
					<Circle avatarId="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" />
				</div>
			}
		>
			<Address address="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" walletName={"Delegate 3"} />
		</TransactionDetail>
		<TransactionDetail label="Transaction fee">0.09660435 ARK</TransactionDetail>
		<TransactionDetail
			label="Transaction type"
			className="pb-0"
			extra={
				<div className="ml-1 text-theme-neutral-900">
					<Circle className="border-theme-neutral-900 bg-theme-background" size="large">
						<Icon name="Voted" />
					</Circle>
				</div>
			}
		>
			Vote
		</TransactionDetail>
	</TransactionSuccessful>
);

type Props = {
	onCopy: () => void;
	onSubmit: () => void;
};

export const SendVoteTransaction = ({ onCopy, onSubmit }: Props) => {
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

						<div className="flex justify-end mt-8 space-x-3">
							{activeTab < 4 && (
								<>
									<Button
										disabled={activeTab === 1}
										data-testid="SendVoteTransaction__button--back"
										variant="plain"
										onClick={handleBack}
									>
										Back
									</Button>
									<Button
										data-testid="SendVoteTransaction__button--continue"
										// disabled={!isValid}
										onClick={handleNext}
									>
										Continue
									</Button>
								</>
							)}

							{activeTab === 4 && (
								<>
									<Button data-testid="SendVoteTransaction__button--back-to-wallet" variant="plain">
										Back to wallet
									</Button>
									<Button
										onClick={onCopy}
										data-testid="SendVoteTransaction__button--copy"
										variant="plain"
									>
										<Icon name="Copy" />
										<span>Copy</span>
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
