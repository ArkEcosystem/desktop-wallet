import { StepIndicator } from "app/components/StepIndicator";
import { TabPanel, Tabs } from "app/components/Tabs";
import React, { useState } from "react";

export const FirstStep = () => (
	<section className="space-y-8" data-testid="VoteTransactionSend__step--first">
		<div>
			<h1 className="mb-0">Vote Transaction</h1>
			<p className="text-theme-neutral-dark">Select a fee to continue</p>
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
