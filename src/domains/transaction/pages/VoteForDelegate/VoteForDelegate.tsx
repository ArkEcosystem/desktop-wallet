import { Address } from "app/components/Address";
import { Button } from "app/components/Button";
import { Form, FormField, FormLabel } from "app/components/Form";
import { StepIndicator } from "app/components/StepIndicator";
import { TabPanel, Tabs } from "app/components/Tabs";
import { TransactionDetail } from "app/components/TransactionDetail";
import React from "react";
import { useForm, useFormContext } from "react-hook-form";

export const FirstStep = () => {
	const { register, setValue } = useFormContext();
	// const [activeNetwork, setActiveNetwork] = React.useState<Network | undefined>(undefined);

	// React.useEffect(() => {
	// 	register("network", { required: true });
	// }, [register]);

	return (
		<section data-testid="VoteForDelegate__first-step" className="space-y-8">
			<div>
				<h1 className="mb-0">Vote for delegate</h1>
				<p className="text-theme-neutral-dark">Enter details to send your money</p>
			</div>
			<div className="grid grid-flow-row gap-2">
				<TransactionDetail label="Account" border={false}>
					<Address address="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" walletName={"ROBank"} size="large" />
				</TransactionDetail>
			</div>
		</section>
	);
};
export const SecondStep = () => {
	const { register, setValue } = useFormContext();
	// const [activeNetwork, setActiveNetwork] = React.useState<Network | undefined>(undefined);

	// React.useEffect(() => {
	// 	register("network", { required: true });
	// }, [register]);

	return (
		<section data-testid="VoteForDelegate__second-step" className="space-y-8">
			<div>
				<h1 className="mb-0">Transaction Review</h1>
				<p className="text-theme-neutral-dark">Lorem ipsum dolor sit amet consectetur adipisicing elit</p>
			</div>
		</section>
	);
};

export const ThirdStep = () => {
	const { register, setValue } = useFormContext();
	// const [activeNetwork, setActiveNetwork] = React.useState<Network | undefined>(undefined);

	// React.useEffect(() => {
	// 	register("network", { required: true });
	// }, [register]);

	return (
		<section data-testid="VoteForDelegate__third-step" className="space-y-8">
			<div>
				<h1 className="mb-0">Passphrase</h1>
				<p className="text-theme-neutral-dark">Confirm your password to continue</p>
			</div>
		</section>
	);
};

export const FourthStep = () => {
	const { register, setValue } = useFormContext();
	// const [activeNetwork, setActiveNetwork] = React.useState<Network | undefined>(undefined);

	// React.useEffect(() => {
	// 	register("network", { required: true });
	// }, [register]);

	return (
		<section data-testid="VoteForDelegate__fourth-step" className="space-y-8">
			<div>
				<h1 className="mb-0">Transaction Successfull</h1>
			</div>
		</section>
	);
};

export const VoteForDelegate = () => {
	const [activeTab, setActiveTab] = React.useState(1);

	const form = useForm({ mode: "onChange" });
	const { formState } = form;
	const { isValid } = formState;

	const handleBack = () => {
		setActiveTab(activeTab - 1);
	};

	const handleNext = () => {
		setActiveTab(activeTab + 1);
	};

	return (
		<div className="max-w-xl mx-auto">
			<Form context={form} onSubmit={(data: any) => onSubmit(data)}>
				<Tabs activeId={activeTab}>
					<StepIndicator size={4} activeIndex={activeTab} />

					<div className="mt-4">
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

						<div className="flex justify-end mt-6 space-x-2">
							<Button
								disabled={activeTab === 1}
								data-testid="CreateWallet__back-button"
								variant="plain"
								onClick={handleBack}
							>
								Back
							</Button>

							{activeTab < 4 && (
								<Button
									data-testid="CreateWallet__continue-button"
									variant="solid"
									disabled={!isValid}
									onClick={handleNext}
								>
									Continue
								</Button>
							)}

							{activeTab === 4 && (
								<Button
									data-testid="CreateWallet__save-button"
									type="submit"
									variant="solid"
									className={activeTab === 4 ? "block" : "hidden"}
								>
									Save & Finish
								</Button>
							)}
						</div>
					</div>
				</Tabs>
			</Form>
		</div>
	);
};
