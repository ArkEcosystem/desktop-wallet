import { Address } from "app/components/Address";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import { Label } from "app/components/Label";
import { StepIndicator } from "app/components/StepIndicator";
import { TabPanel, Tabs } from "app/components/Tabs";
import { TransactionDetail } from "app/components/TransactionDetail";
import { Avatar } from "domains/wallet/components/Avatar";
import React, { useState } from "react";

export const FirstStep = () => (
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
		</div>
	</section>
);

export const VoteTransactionSend = () => {
	const [activeTab, setActiveTab] = useState(1);

	const handleBack = () => {
		setActiveTab(activeTab - 1);
	};

	const handleNext = () => {
		setActiveTab(activeTab + 1);
	};

	return (
		<div className="max-w-xl mx-auto">
			<Tabs activeId={activeTab}>
				<StepIndicator size={4} activeIndex={activeTab} />

				<div className="mt-10">
					<TabPanel tabId={1}>
						<FirstStep />
					</TabPanel>
				</div>
			</Tabs>
		</div>
	);
};
