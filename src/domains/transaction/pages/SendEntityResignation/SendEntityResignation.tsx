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
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router-dom";

import { EntityFirstStep, EntityFourthStep, EntitySecondStep } from "../../components/EntityResignationSteps";
import { FirstStep, FourthStep, SecondStep } from "./";

export const SendEntityResignation = ({ formDefaultData, onDownload, passwordType }: any) => {
	const { t } = useTranslation();
	const history = useHistory();
	const location = useLocation();
	const form = useForm({ mode: "onChange", defaultValues: formDefaultData });
	const { formState, getValues, setError } = form;
	const { isValid } = formState;

	const [activeTab, setActiveTab] = useState(1);
	const [transaction, setTransaction] = useState((null as unknown) as Contracts.SignedTransactionData);

	const { env } = useEnvironmentContext();
	const activeProfile = useActiveProfile();
	const activeWallet = useActiveWallet();
	const { state } = location;
	const { type = "delegate" } = state || {};

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

		setFees(env.fees().findByType(activeWallet.coinId(), activeWallet.networkId(), transactionTypes[type]));
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
			let transactionId;

			if (type === "entity") {
				// Define entity
				const { entity } = state;
				const entityData = entity.data();
				const asset = entityData.asset();

				transactionId = await activeWallet.transaction().signEntityResignation({
					from: entity.sender(),
					data: {
						type: asset.type,
						subType: asset.subType,
						registrationId: entityData.id(),
					},
					fee: fees.static,
					sign: {
						mnemonic,
						secondMnemonic,
					},
				});
			} else {
				transactionId = await activeWallet.transaction().signDelegateResignation({
					from,
					fee: fees.static,
					sign: {
						mnemonic,
						secondMnemonic,
					},
				});
			}

			await activeWallet.transaction().broadcast(transactionId);
			await env.persist();

			setTransaction(activeWallet.transaction().transaction(transactionId));

			handleNext();
		} catch (error) {
			// TODO: Handle/Map various error messages
			console.log({ error });
			setError("mnemonic", "manual", t("TRANSACTION.INVALID_MNEMONIC"));
		}
	};

	const getStepComponent = () => {
		const { type = "delegate" } = state || {};

		switch (type) {
			case "entity": {
				const { entity } = state;

				if (activeTab === 1) return <EntityFirstStep entity={entity} fees={fees} />;
				if (activeTab === 2) return <EntitySecondStep entity={entity} fees={fees} />;
				if (activeTab === 4) return <EntityFourthStep entity={entity} fees={fees} transaction={transaction} />;
				break;
			}

			default:
				if (activeTab === 1) return <FirstStep fees={fees} senderWallet={activeWallet} />;
				if (activeTab === 2) return <SecondStep fees={fees} senderWallet={activeWallet} />;
				if (activeTab === 4)
					return <FourthStep fees={fees} senderWallet={activeWallet} transaction={transaction} />;
		}
	};

	return (
		<Page profile={activeProfile} crumbs={crumbs}>
			<Section className="flex-1">
				<Form className="max-w-xl mx-auto" context={form} onSubmit={handleSubmit}>
					<Tabs activeId={activeTab}>
						{fees && (
							<div>
								<StepIndicator size={4} activeIndex={activeTab} />
								<div className="mt-8">
									<TabPanel tabId={1}>{getStepComponent()}</TabPanel>
									<TabPanel tabId={2}>{getStepComponent()}</TabPanel>
									<TabPanel tabId={3}>
										<AuthenticationStep wallet={activeWallet} />
									</TabPanel>
									<TabPanel tabId={4}>{getStepComponent()}</TabPanel>

									<div className="flex justify-end mt-8 space-x-3">
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
													onClick={() => onDownload?.(transaction)}
												>
													<Icon name="Download" />
													<span>{t("COMMON.DOWNLOAD")}</span>
												</Button>
											</div>
										)}
									</div>
								</div>
							</div>
						)}
					</Tabs>
				</Form>
			</Section>
		</Page>
	);
};

SendEntityResignation.defaultProps = {
	formDefaultData: {},
};
