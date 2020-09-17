import { Contracts } from "@arkecosystem/platform-sdk";
import { Button } from "app/components/Button";
import { Form } from "app/components/Form";
import { Icon } from "app/components/Icon";
import { Page, Section } from "app/components/Layout";
import { StepIndicator } from "app/components/StepIndicator";
import { TabPanel, Tabs } from "app/components/Tabs";
import { useEnvironmentContext } from "app/contexts";
import { useActiveProfile, useActiveWallet } from "app/hooks/env";
import { AuthenticationStep } from "domains/transaction/components/AuthenticationStep";
import { TransactionSentStep as ThirdStep } from "domains/transaction/components/EntityRegistrationForm/TransactionSentStep";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { SendEntityRegistrationForm } from "./SendEntityRegistration.models";
import { FirstStep } from "./Step1";

type SendEntityRegistrationProps = {
	formDefaultValues?: any;
};

export const SendEntityRegistration = ({ formDefaultValues }: SendEntityRegistrationProps) => {
	const { t } = useTranslation();
	const history = useHistory();

	const [activeTab, setActiveTab] = React.useState(1);
	const [transaction, setTransaction] = useState((null as unknown) as Contracts.SignedTransactionData);
	const [registrationForm, setRegistrationForm] = React.useState<SendEntityRegistrationForm>();

	const { env } = useEnvironmentContext();
	const activeProfile = useActiveProfile();
	const activeWallet = useActiveWallet();
	const networks = useMemo(() => env.availableNetworks(), [env]);

	const form = useForm({ mode: "onChange", defaultValues: formDefaultValues });
	const { formState, getValues, register, setValue, unregister } = form;
	const { registrationType, senderAddress } = getValues();

	const stepCount = registrationForm ? registrationForm.tabSteps + 3 : 1;

	useEffect(() => {
		register("fee");
		register("fees");

		register("network", { required: true });
		register("registrationType", { required: true });
		register("senderAddress", { required: true });
	}, [register]);

	useEffect(() => {
		if (!activeWallet?.address?.()) return;

		setValue("senderAddress", activeWallet.address(), { shouldValidate: true, shouldDirty: true });

		for (const network of networks) {
			if (network.coin() === activeWallet.coinId() && network.id() === activeWallet.networkId()) {
				setValue("network", network, { shouldValidate: true, shouldDirty: true });

				break;
			}
		}
	}, [activeWallet, networks, setValue]);

	useEffect(() => {
		// TODO: shouldn't be necessary once SelectAddress returns wallets instead
		const senderWallet = activeProfile.wallets().findByAddress(senderAddress);

		if (senderWallet) {
			const transactionFees = env.fees().all(senderWallet.coinId(), senderWallet.networkId());

			const fees = Object.entries(transactionFees).reduce((mapping, [transactionType, fees]) => {
				mapping[transactionType] = fees;

				return mapping;
			}, {} as Record<string, any>);

			setValue("fees", fees);
		}
	}, [env, setValue, activeProfile, senderAddress]);

	const submitForm = () =>
		registrationForm!.signTransaction({
			env,
			form,
			handleNext,
			profile: activeProfile,
			setTransaction,
			translations: t,
			type: registrationType.type,
		});

	const handleBack = () => {
		setActiveTab(activeTab - 1);

		if (activeTab - 1 === 1) {
			for (const field of registrationForm!.formFields) {
				unregister(field);
			}
		}
	};

	const handleNext = () => {
		setActiveTab(activeTab + 1);
	};

	const crumbs = [
		{
			route: `/wallets/${activeProfile.id()}/dashboard`,
			label: t("COMMON.GO_BACK_TO_PORTFOLIO"),
		},
	];

	const feesByType = (type: string) => getValues("fees")[type];

	return (
		<Page profile={activeProfile} crumbs={crumbs}>
			<Section className="flex-1">
				<Form
					data-testid="Registration__form"
					className="max-w-xl mx-auto"
					context={form}
					onSubmit={submitForm}
				>
					<Tabs activeId={activeTab}>
						<StepIndicator size={stepCount} activeIndex={activeTab} />

						<div className="mt-8">
							<TabPanel tabId={1}>
								<FirstStep
									networks={networks}
									profile={activeProfile}
									wallet={activeWallet}
									setRegistrationForm={setRegistrationForm}
									fees={getValues("fees")}
								/>
							</TabPanel>

							{activeTab > 1 && registrationForm && (
								<registrationForm.component
									activeTab={activeTab}
									fees={feesByType(registrationType.value)}
									wallet={activeWallet}
								/>
							)}

							{registrationForm && form.getValues("fee") && (
								<>
									<TabPanel tabId={stepCount - 1}>
										<AuthenticationStep wallet={activeWallet} />
									</TabPanel>
									<TabPanel tabId={stepCount}>
										<ThirdStep transaction={transaction} senderWallet={activeWallet} />
									</TabPanel>
								</>
							)}

							<div className="flex justify-end mt-8 space-x-3">
								{activeTab < stepCount && (
									<Button
										disabled={activeTab === 1}
										data-testid="Registration__back-button"
										variant="plain"
										onClick={handleBack}
									>
										{t("COMMON.BACK")}
									</Button>
								)}

								{activeTab < stepCount - 1 && (
									<Button
										data-testid="Registration__continue-button"
										disabled={!formState.isValid}
										onClick={handleNext}
									>
										{t("COMMON.CONTINUE")}
									</Button>
								)}

								{registrationForm && activeTab === stepCount - 1 && (
									<Button
										type="submit"
										data-testid="Registration__send-button"
										disabled={!formState.isValid}
										className="space-x-2"
									>
										<Icon name="Send" width={20} height={20} />
										<span>{t("COMMON.SEND")}</span>
									</Button>
								)}

								{registrationForm && activeTab === stepCount && (
									<div className="flex justify-end space-x-3">
										<Button
											data-testid="Registration__button--back-to-wallet"
											variant="plain"
											onClick={() =>
												history.push(
													`/profiles/${activeProfile.id()}/wallets/${activeWallet.id()}`,
												)
											}
										>
											{t("COMMON.BACK_TO_WALLET")}
										</Button>

										<Button
											data-testid="Registration__download-button"
											variant="plain"
											className="space-x-2"
										>
											<Icon name="Download" />
											<span>{t("COMMON.DOWNLOAD")}</span>
										</Button>
									</div>
								)}
							</div>
						</div>
					</Tabs>
				</Form>
			</Section>
		</Page>
	);
};

SendEntityRegistration.defaultProps = {
	formDefaultValues: {
		fees: {
			static: "5",
			min: "0",
			avg: "1",
			max: "2",
		},
		fee: "0",
		ipfsData: {
			meta: {
				displayName: undefined,
				description: undefined,
				website: undefined,
			},
			images: [],
			videos: [],
			sourceControl: [],
			socialMedia: [],
		},
	},
};
