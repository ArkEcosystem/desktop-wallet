import { Contracts } from "@arkecosystem/platform-sdk";
import { ReadOnlyWallet } from "@arkecosystem/platform-sdk-profiles";
import { Button } from "app/components/Button";
import { Form } from "app/components/Form";
import { Icon } from "app/components/Icon";
import { Page, Section } from "app/components/Layout";
import { Loader } from "app/components/Loader";
import { StepIndicator } from "app/components/StepIndicator";
import { TabPanel, Tabs } from "app/components/Tabs";
import { useEnvironmentContext } from "app/contexts";
import { useActiveProfile, useActiveWallet } from "app/hooks/env";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { FirstStep, FourthStep, SecondStep, ThirdStep } from "./";
import { ResignRegistrationProps } from "./ResignRegistration.models";

export const ResignRegistration = ({ formDefaultData, onDownload, passwordType }: ResignRegistrationProps) => {
	const [activeTab, setActiveTab] = useState(1);
	const [delegate, setDelegate] = useState<ReadOnlyWallet>();
	const [fee, setFee] = useState<Contracts.TransactionFee>();
	const [transaction, setTransaction] = useState((null as unknown) as Contracts.SignedTransactionData);

	const form = useForm({ mode: "onChange", defaultValues: formDefaultData });
	const { formState, getValues, setError } = form;
	const { isValid } = formState;

	const { env } = useEnvironmentContext();
	const activeProfile = useActiveProfile();
	const activeWallet = useActiveWallet();
	const { t } = useTranslation();
	const history = useHistory();

	const crumbs = [
		{
			route: `/profiles/${activeProfile.id()}/dashboard`,
			label: t("COMMON.GO_BACK_TO_PORTFOLIO"),
		},
	];

	useEffect(() => {
		setDelegate(
			env.delegates().findByAddress(activeWallet.coinId(), activeWallet.networkId(), activeWallet.address()),
		);
	}, [env, activeWallet]);

	useEffect(() => {
		const loadFees = async () => {
			try {
				const { delegateResignation } = await activeWallet.coin().fee().all(7);
				setFee(delegateResignation);
			} catch (error) {
				// TODO: Set default or throw exception?
			}
		};

		loadFees();
	}, [setFee, activeProfile, activeWallet]);

	const handleBack = () => {
		setActiveTab(activeTab - 1);
	};

	const handleNext = () => {
		setActiveTab(activeTab + 1);
	};

	const handleSubmit = async () => {
		const mnemonic = getValues("mnemonic");
		const from = activeWallet.address();

		try {
			const transactionId = await activeWallet.transaction().signDelegateResignation({
				from,
				fee: fee?.static,
				sign: {
					mnemonic,
				},
			});

			await activeWallet.transaction().broadcast(transactionId);
			await env.persist();

			setTransaction(activeWallet.transaction().transaction(transactionId));

			handleNext();
		} catch (error) {
			// TODO: Handle/Map various error messages
			setError("mnemonic", "manual", t("TRANSACTION.INVALID_MNEMONIC"));
		}
	};

	return (
		<Page profile={activeProfile} crumbs={crumbs}>
			<Section className="flex-1">
				<Form className="max-w-xl mx-auto" context={form} onSubmit={handleSubmit}>
					<Tabs activeId={activeTab}>
						{(!fee || !delegate) && <Loader />}
						{fee && delegate && (
							<div>
								<StepIndicator size={4} activeIndex={activeTab} />
								<div className="mt-8">
									<TabPanel tabId={1}>
										<FirstStep senderWallet={activeWallet} delegate={delegate} fee={fee} />
									</TabPanel>
									<TabPanel tabId={2}>
										<SecondStep senderWallet={activeWallet} delegate={delegate} fee={fee} />
									</TabPanel>
									<TabPanel tabId={3}>
										<ThirdStep form={form} passwordType={passwordType} />
									</TabPanel>
									<TabPanel tabId={4}>
										<FourthStep
											senderWallet={activeWallet}
											delegate={delegate}
											fee={fee}
											transaction={transaction}
										/>
									</TabPanel>

									<div className="flex justify-end mt-8 space-x-3">
										{activeTab < 4 && (
											<Button
												disabled={activeTab === 1}
												data-testid="ResignRegistration__back-button"
												variant="plain"
												onClick={handleBack}
											>
												{t("COMMON.BACK")}
											</Button>
										)}

										{activeTab < 3 && (
											<Button
												data-testid="ResignRegistration__continue-button"
												disabled={!isValid}
												onClick={handleNext}
											>
												{t("COMMON.CONTINUE")}
											</Button>
										)}

										{activeTab === 3 && (
											<Button
												type="submit"
												data-testid="ResignRegistration__send-button"
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
													data-testid="ResignRegistration__wallet-button"
													variant="plain"
													onClick={() => {
														history.push(`/profiles/${activeProfile.id()}/dashboard`);
													}}
												>
													{t("COMMON.BACK_TO_WALLET")}
												</Button>

												<Button
													data-testid="ResignRegistration__download-button"
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

ResignRegistration.defaultProps = {
	formDefaultData: {},
	passwordType: "mnemonic",
};
