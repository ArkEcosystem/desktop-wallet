import { Contracts } from "@arkecosystem/platform-sdk";
import { EntityRegistrationData } from "@arkecosystem/platform-sdk-profiles";
import { Button } from "app/components/Button";
import { Form } from "app/components/Form";
import { Icon } from "app/components/Icon";
import { Page, Section } from "app/components/Layout";
import { Loader } from "app/components/Loader";
import { StepIndicator } from "app/components/StepIndicator";
import { TabPanel, Tabs } from "app/components/Tabs";
import { useEnvironmentContext } from "app/contexts";
import { useActiveProfile, useActiveWallet } from "app/hooks";
import { AuthenticationStep } from "domains/transaction/components/AuthenticationStep";
import { FormStep, ReviewStep, SummaryStep } from "domains/transaction/components/DelegateResignationSteps";
import { ErrorStep } from "domains/transaction/components/ErrorStep";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";

import {
	FormStep as EntityFormStep,
	ReviewStep as EntityReviewStep,
	SummaryStep as EntitySummaryStep,
} from "../../components/EntityResignationSteps";

export const SendEntityResignation = ({ formDefaultData }: any) => {
	const { t } = useTranslation();
	const history = useHistory();

	const form = useForm({ mode: "onChange", defaultValues: formDefaultData });

	const { formState, getValues, setError } = form;
	const { isValid, isSubmitting } = formState;

	const [activeTab, setActiveTab] = useState(1);
	const [isLoading, setIsLoading] = useState(true);

	const [transaction, setTransaction] = useState((null as unknown) as Contracts.SignedTransactionData);

	const { env } = useEnvironmentContext();

	const activeProfile = useActiveProfile();
	const activeWallet = useActiveWallet();

	const { transactionId } = useParams();
	const [state, setState] = useState<{ type?: string; entity?: EntityRegistrationData }>({});

	useEffect(() => {
		const fetchTransaction = async () => {
			setState({
				type: "entity",
				entity: (await activeWallet.findTransactionById(transactionId)) as EntityRegistrationData,
			});
		};

		if (transactionId) {
			fetchTransaction();
		} else {
			setState({ type: "delegate" });
		}
	}, [activeWallet, transactionId]);

	useEffect(() => {
		if (state.type) {
			setIsLoading(false);
		}
	}, [state]);

	const { entity, type } = state;

	const [fees, setFees] = useState<Contracts.TransactionFee>({
		static: "5",
		min: "0",
		avg: "1",
		max: "2",
	});

	const crumbs = [
		{
			route: `/profiles/${activeProfile.id()}/wallets/${activeWallet.id()}`,
			label: t("COMMON.BACK_TO_WALLET"),
		},
	];

	useEffect(() => {
		const transactionTypes: { [key: string]: string } = {
			entity: "entityResignation",
			delegate: "delegateResignation",
		};

		if (type) {
			setFees(env.fees().findByType(activeWallet.coinId(), activeWallet.networkId(), transactionTypes[type]));
		}
	}, [env, setFees, activeProfile, activeWallet, type]);

	const handleBack = () => {
		setActiveTab(activeTab - 1);
	};

	const handleNext = () => {
		setActiveTab(activeTab + 1);
	};

	const handleSubmit = async () => {
		const mnemonic = getValues("mnemonic");
		const secondMnemonic = getValues("secondMnemonic");
		const from = activeWallet.address();

		try {
			let signedTransactionId;

			if (entity && type === "entity") {
				signedTransactionId = await activeWallet.transaction().signEntityResignation({
					from: activeWallet.address(),
					data: {
						type: entity.entityType(),
						subType: entity.entitySubType(),
						registrationId: transactionId,
					},
					fee: fees.static,
					sign: {
						mnemonic,
						secondMnemonic,
					},
				});
			} else {
				signedTransactionId = await activeWallet.transaction().signDelegateResignation({
					from,
					fee: fees.static,
					sign: {
						mnemonic,
						secondMnemonic,
					},
				});
			}

			await activeWallet.transaction().broadcast(signedTransactionId);

			await env.persist();

			setTransaction(activeWallet.transaction().transaction(signedTransactionId));

			handleNext();
		} catch (error) {
			if (String(error).includes("Signatory should be"))
				return setError("mnemonic", { type: "manual", message: t("TRANSACTION.INVALID_MNEMONIC") });

			setActiveTab(5);
		}
	};

	const getStepComponent = () => {
		switch (type) {
			case "entity": {
				if (activeTab === 1) {
					return <EntityFormStep entity={entity} fees={fees} />;
				}

				if (activeTab === 2) {
					return <EntityReviewStep entity={entity} fees={fees} />;
				}

				if (activeTab === 4) {
					return <EntitySummaryStep entity={entity} fees={fees} transaction={transaction} />;
				}

				break;
			}

			case "delegate": {
				if (activeTab === 1) {
					return <FormStep fees={fees} senderWallet={activeWallet} />;
				}

				if (activeTab === 2) {
					return <ReviewStep fees={fees} senderWallet={activeWallet} />;
				}

				if (activeTab === 4) {
					return <SummaryStep fees={fees} senderWallet={activeWallet} transaction={transaction} />;
				}

				break;
			}

			default:
				// @TODO skeleton
				return <></>;
		}
	};

	return (
		<Page profile={activeProfile} crumbs={crumbs}>
			<Section className="flex-1">
				{isLoading && <Loader />}

				<div className={isLoading ? "hidden" : ""}>
					<Form className="max-w-xl mx-auto" context={form} onSubmit={handleSubmit}>
						<Tabs activeId={activeTab}>
							{fees && (
								<>
									<StepIndicator size={4} activeIndex={activeTab} />

									<div className="mt-8">
										<TabPanel tabId={1}>{getStepComponent()}</TabPanel>
										<TabPanel tabId={2}>{getStepComponent()}</TabPanel>
										<TabPanel tabId={3}>
											<AuthenticationStep wallet={activeWallet} />
										</TabPanel>
										<TabPanel tabId={4}>{getStepComponent()}</TabPanel>
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
													data-testid="SendEntityResignation__back-button"
													variant="plain"
													onClick={handleBack}
												>
													{t("COMMON.BACK")}
												</Button>
											)}

											{activeTab < 3 && (
												<Button
													data-testid="SendEntityResignation__continue-button"
													disabled={!isValid}
													onClick={handleNext}
												>
													{t("COMMON.CONTINUE")}
												</Button>
											)}

											{activeTab === 3 && (
												<Button
													type="submit"
													data-testid="SendEntityResignation__send-button"
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
														data-testid="SendEntityResignation__wallet-button"
														variant="plain"
														onClick={() => {
															history.push(`/profiles/${activeProfile.id()}/dashboard`);
														}}
													>
														{t("COMMON.BACK_TO_WALLET")}
													</Button>

													<Button
														data-testid="SendEntityResignation__download-button"
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
								</>
							)}
						</Tabs>
					</Form>
				</div>
			</Section>
		</Page>
	);
};

SendEntityResignation.defaultProps = {
	formDefaultData: {},
};
