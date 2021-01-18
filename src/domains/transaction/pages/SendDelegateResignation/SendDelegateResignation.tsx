import { Contracts } from "@arkecosystem/platform-sdk";
import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { Button } from "app/components/Button";
import { Form } from "app/components/Form";
import { Icon } from "app/components/Icon";
import { Page, Section } from "app/components/Layout";
import { StepIndicator } from "app/components/StepIndicator";
import { TabPanel, Tabs } from "app/components/Tabs";
import { useEnvironmentContext } from "app/contexts";
import { useActiveProfile, useActiveWallet, useFees } from "app/hooks";
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

	const { formState, getValues, register, setError, setValue, watch } = form;
	const { isValid, isSubmitting } = formState;

	const [activeTab, setActiveTab] = useState(1);

	const [transaction, setTransaction] = useState((null as unknown) as Contracts.SignedTransactionData);

	const { env } = useEnvironmentContext();

	const activeProfile = useActiveProfile();
	const activeWallet = useActiveWallet();
	const { findByType } = useFees();

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
			label: t("TRANSACTION.PAGE_RESIGN_REGISTRATION.FIRST_STEP.DELEGATE.TITLE"),
		},
	];

	const fees = watch("fees");

	useEffect(() => {
		register("fee");
		register("fees");
	}, [register]);

	useEffect(() => {
		const setTransactionFees = async (wallet: ReadWriteWallet) => {
			const fees = await findByType(wallet.coinId(), wallet.networkId(), "delegateResignation");

			setValue("fees", fees);
			setValue("fee", fees?.avg);
		};

		setTransactionFees(activeWallet);
	}, [setValue, activeWallet, findByType]);

	const handleBack = () => {
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
						{fees && (
							<>
								<StepIndicator size={4} activeIndex={activeTab} />

								<div className="mt-8">
									<TabPanel tabId={1}>
										<FormStep fees={fees} senderWallet={activeWallet} />
									</TabPanel>

									<TabPanel tabId={2}>
										<ReviewStep fees={fees} senderWallet={activeWallet} />
									</TabPanel>

									<TabPanel tabId={3}>
										<AuthenticationStep wallet={activeWallet} />
									</TabPanel>

									<TabPanel tabId={4}>
										<SummaryStep
											fees={fees}
											senderWallet={activeWallet}
											transaction={transaction}
										/>
									</TabPanel>

									<TabPanel tabId={5}>
										<ErrorStep
											onBack={() =>
												history.push(
													`/profiles/${activeProfile.id()}/wallets/${activeWallet.id()}`,
												)
											}
											isRepeatDisabled={isSubmitting || !isValid}
											onRepeat={form.handleSubmit(handleSubmit)}
										/>
									</TabPanel>

									<div className="flex justify-end mt-10 space-x-3">
										{activeTab < 4 && (
											<Button
												disabled={activeTab === 1}
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
											>
												<Icon name="Send" width={20} height={20} />
												<span>{t("COMMON.SEND")}</span>
											</Button>
										)}

										{activeTab === 4 && (
											<div className="flex justify-end space-x-3">
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

												<Button
													data-testid="SendDelegateResignation__download-button"
													variant="secondary"
													className="space-x-2"
												>
													<Icon name="Download" />
													<span>{t("COMMON.DOWNLOAD")}</span>
												</Button>
											</div>
										)}
									</div>
								</div>
							</>
						)}
					</Tabs>
				</Form>
			</Section>
		</Page>
	);
};

SendDelegateResignation.defaultProps = {
	formDefaultData: {},
};
