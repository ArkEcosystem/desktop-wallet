import { Contracts } from "@arkecosystem/platform-sdk";
import { Button } from "app/components/Button";
import { Form } from "app/components/Form";
import { Page, Section } from "app/components/Layout";
import { StepIndicator } from "app/components/StepIndicator";
import { TabPanel, Tabs } from "app/components/Tabs";
import { useEnvironmentContext } from "app/contexts";
import { useActiveProfile, useActiveWallet, useValidation } from "app/hooks";
import { AuthenticationStep } from "domains/transaction/components/AuthenticationStep";
import { ErrorStep } from "domains/transaction/components/ErrorStep";
import { isMnemonicError } from "domains/transaction/utils";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { FormStep, ReviewStep, SummaryStep } from "./";

type SendResignationProps = {
	formDefaultData?: any;
};

export const SendDelegateResignation = ({ formDefaultData }: SendResignationProps) => {
	const { t } = useTranslation();
	const history = useHistory();

	const form = useForm({ mode: "onChange", defaultValues: formDefaultData });

	const { common } = useValidation();

	const { formState, getValues, register, setError, setValue } = form;
	const { isValid, isSubmitting } = formState;

	const [activeTab, setActiveTab] = useState(1);

	const [transaction, setTransaction] = useState((null as unknown) as Contracts.SignedTransactionData);

	const { env } = useEnvironmentContext();

	const activeProfile = useActiveProfile();
	const activeWallet = useActiveWallet();

	const crumbs = [
		{
			label: t("COMMON.PORTFOLIO"),
			route: `/profiles/${activeProfile.id()}/dashboard`,
		},
		{
			label: activeWallet.alias() || /* istanbul ignore next */ activeWallet.address(),
			route: `/profiles/${activeProfile.id()}/wallets/${activeWallet.id()}`,
		},
		{
			label: t("TRANSACTION.PAGE_RESIGN_REGISTRATION.FORM_STEP.DELEGATE.TITLE"),
		},
	];

	useEffect(() => {
		register("fees");
		register("fee", common.fee(activeWallet?.balance?.(), activeWallet?.network?.()));
	}, [activeWallet, common, getValues, register]);

	const handleBack = () => {
		if (activeTab === 1) {
			return history.push(`/profiles/${activeProfile.id()}/wallets/${activeWallet.id()}`);
		}

		setActiveTab(activeTab - 1);
	};

	const handleNext = () => {
		setActiveTab(activeTab + 1);
	};

	const handleSubmit = async () => {
		const { fee, mnemonic, secondMnemonic } = getValues();
		const from = activeWallet.address();

		try {
			const signedTransactionId = await activeWallet.transaction().signDelegateResignation({
				from,
				fee,
				sign: {
					mnemonic,
					secondMnemonic,
				},
			});

			await activeWallet.transaction().broadcast(signedTransactionId);

			await env.persist();

			setTransaction(activeWallet.transaction().transaction(signedTransactionId));

			handleNext();
		} catch (error) {
			if (isMnemonicError(error)) {
				setValue("mnemonic", "");
				return setError("mnemonic", { type: "manual", message: t("TRANSACTION.INVALID_MNEMONIC") });
			}

			setActiveTab(5);
		}
	};

	return (
		<Page profile={activeProfile} crumbs={crumbs}>
			<Section className="flex-1">
				<Form className="mx-auto max-w-xl" context={form} onSubmit={handleSubmit}>
					<Tabs activeId={activeTab}>
						<StepIndicator size={4} activeIndex={activeTab} />

						<div className="mt-8">
							<TabPanel tabId={1}>
								<FormStep senderWallet={activeWallet} />
							</TabPanel>

							<TabPanel tabId={2}>
								<ReviewStep senderWallet={activeWallet} />
							</TabPanel>

							<TabPanel tabId={3}>
								<AuthenticationStep wallet={activeWallet} />
							</TabPanel>

							<TabPanel tabId={4}>
								<SummaryStep senderWallet={activeWallet} transaction={transaction} />
							</TabPanel>

							<TabPanel tabId={5}>
								<ErrorStep
									onBack={() =>
										history.push(`/profiles/${activeProfile.id()}/wallets/${activeWallet.id()}`)
									}
									isRepeatDisabled={isSubmitting || !isValid}
									onRepeat={form.handleSubmit(handleSubmit)}
								/>
							</TabPanel>

							<div className="flex justify-end mt-10 space-x-3">
								{activeTab < 4 && (
									<Button
										disabled={isSubmitting}
										data-testid="SendDelegateResignation__back-button"
										variant="secondary"
										onClick={handleBack}
									>
										{t("COMMON.BACK")}
									</Button>
								)}

								{activeTab < 3 && (
									<Button
										data-testid="SendDelegateResignation__continue-button"
										disabled={!isValid}
										onClick={handleNext}
									>
										{t("COMMON.CONTINUE")}
									</Button>
								)}

								{activeTab === 3 && (
									<Button
										type="submit"
										data-testid="SendDelegateResignation__send-button"
										disabled={!isValid}
										className="space-x-2"
										isLoading={isSubmitting}
										icon="Send"
									>
										<span>{t("COMMON.SEND")}</span>
									</Button>
								)}

								{activeTab === 4 && (
									<Button
										data-testid="SendDelegateResignation__wallet-button"
										variant="secondary"
										onClick={() => {
											history.push(
												`/profiles/${activeProfile.id()}/wallets/${activeWallet.id()}`,
											);
										}}
									>
										{t("COMMON.BACK_TO_WALLET")}
									</Button>
								)}
							</div>
						</div>
					</Tabs>
				</Form>
			</Section>
		</Page>
	);
};

SendDelegateResignation.defaultProps = {
	formDefaultData: {},
};
