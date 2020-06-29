import { Address } from "app/components/Address";
import { Circle } from "app/components/Circle";
import { Form } from "app/components/Form";
import { Icon } from "app/components/Icon";
import { InputRange } from "app/components/Input";
import { Label } from "app/components/Label";
import { SelectionBar, SelectionBarOption, useSelectionState } from "app/components/SelectionBar";
import { StepIndicator } from "app/components/StepIndicator";
import { TabPanel, Tabs } from "app/components/Tabs";
import { TransactionDetail } from "app/components/TransactionDetail";
import { Avatar } from "domains/wallet/components/Avatar";
import React, { useEffect, useState } from "react";
import { useForm, useFormContext } from "react-hook-form";

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
		<section className="space-y-8" data-testid="VoteTransactionSend__step--first">
			<div>
				<h1 className="mb-0">Vote Transaction</h1>
				<p className="text-theme-neutral-dark">Select a fee to continue</p>
			</div>
			<div className="grid grid-flow-row gap-2">
				<TransactionDetail
					border={false}
					label="Cryptoasset"
					extra={
						<div className="ml-1">
							<Circle className="bg-theme-background border-theme-danger-200" size="large">
								<Icon name="Ark" width={20} height={20} className="text-theme-danger-500" />
							</Circle>
						</div>
					}
				>
					<div className="flex-auto text-xl font-semibold truncate text-theme-neutral-800 max-w-24">
						ARK Ecosystem
					</div>
				</TransactionDetail>
				<TransactionDetail
					label=" "
					extra={
						<div>
							<Avatar address="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" />
						</div>
					}
				>
					<div className="mb-2 text-sm font-semibold text-theme-neutral-500">
						<span className="mr-1">Sender</span>
						<Label color="warning">Your address</Label>
					</div>
					<Address address="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" walletName={"ROBank"} size="large" />
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

type VoteTransactionSendProps = {
	onSubmit: () => void;
};

export const VoteTransactionSend = ({ onSubmit }: VoteTransactionSendProps) => {
	const [activeTab, setActiveTab] = useState(1);
	const form = useForm({ mode: "onChange" });

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
					</div>
				</Tabs>
			</Form>
		</div>
	);
};
