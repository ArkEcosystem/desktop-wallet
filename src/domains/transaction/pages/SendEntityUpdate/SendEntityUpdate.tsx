import { TransactionData } from "@arkecosystem/platform-sdk-profiles";
import { SignedTransactionData } from "@arkecosystem/platform-sdk/dist/contracts";
import { Button } from "app/components/Button";
import { Form } from "app/components/Form";
import { Icon } from "app/components/Icon";
import { Page, Section } from "app/components/Layout";
import { Loader } from "app/components/Loader";
import { StepIndicator } from "app/components/StepIndicator";
import { TabPanel, Tabs } from "app/components/Tabs";
import { useEnvironmentContext } from "app/contexts";
import { useActiveProfile, useActiveWallet, useValidation } from "app/hooks";
import { toasts } from "app/services";
import { AuthenticationStep as ThirdStep } from "domains/transaction/components/AuthenticationStep";
import {
	FormStep as FirstStep,
	ReviewStep as SecondStep,
	SummaryStep as FourthStep,
} from "domains/transaction/components/EntityRegistrationForm";
import { TransactionSuccessful } from "domains/transaction/components/TransactionSuccessful";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { fetchTxIpfsData, sendEntityUpdateTransaction } from "./utils";

type SendEntityUpdateProps = {
	formDefaultValues?: any;
};

export const SendEntityUpdate = ({ formDefaultValues }: SendEntityUpdateProps) => {
	const [activeTab, setActiveTab] = useState(1);
	const [activeTransaction, setActiveTransaction] = useState<TransactionData>();
	const [savedTransaction, setSavedTransaction] = useState<SignedTransactionData>();
	const [isLoading, setIsLoading] = useState(true);

	const form = useForm({ mode: "onChange", defaultValues: formDefaultValues, shouldUnregister: false });
	const { setValue, trigger, register, formState } = form;
	const { entityRegistration } = useValidation();

	const { env } = useEnvironmentContext();
	const activeProfile = useActiveProfile();
	const activeWallet = useActiveWallet();

	const { t } = useTranslation();

	const crumbs = [
		{
			route: `/profiles/${activeProfile.id()}/dashboard`,
			label: t("COMMON.GO_BACK_TO_PORTFOLIO"),
		},
	];

	const { transactionId } = useParams();

	useEffect(() => {
		register("fee");
		register("fees");

		register("ipfsData.sourceControl");
		register("ipfsData.socialMedia");
		register("ipfsData.videos");
		register("ipfsData.images");
		register("registrationId");

		register("ipfsData.meta.displayName", entityRegistration.displayName());
		register("ipfsData.meta.description", entityRegistration.description());
		register("ipfsData.meta.website", entityRegistration.website());
	}, [register, entityRegistration]);

	useEffect(() => {
		const fetchTransaction = async () => {
			try {
				const tx = await activeWallet.client().transaction(transactionId);

				setActiveTransaction(tx as TransactionData);
				setValue("registrationId", tx.id());

				const data = tx.asset().data as { name: string };
				setValue("entityName", data?.name);
			} catch (e) {
				toasts.error(t("TRANSACTION.NOT_FOUND", { transactionId }));
			}
		};

		fetchTransaction();
	}, [transactionId, activeWallet, setValue, t]);

	useEffect(() => {
		const fetchIpfs = async () => {
			if (!activeTransaction) return;

			try {
				const ipfsData: any = await fetchTxIpfsData(activeTransaction);
				setValue("ipfsData.meta.displayName", ipfsData?.meta?.displayName);
				setValue("ipfsData.meta.description", ipfsData?.meta?.description);
				setValue("ipfsData.meta.website", ipfsData?.meta?.website);

				setValue("ipfsData.sourceControl", ipfsData?.sourceControl || []);
				setValue("ipfsData.socialMedia", ipfsData?.socialMedia || []);
				setValue("ipfsData.videos", ipfsData?.videos || []);
				setValue("ipfsData.images", ipfsData?.images || []);

				setIsLoading(false);
			} catch (e) {
				toasts.error(t("TRANSACTION.IPFS_NOT_FOUND", { transactionId: activeTransaction.id() }));
				setIsLoading(false);
			}
		};

		fetchIpfs();
	}, [activeTransaction, setValue, t]);

	useEffect(() => {
		const fees = env.fees().findByType(activeWallet.coinId(), activeWallet.networkId(), "entityUpdate");

		setValue("fees", fees);
		setValue("fee", fees.avg);
	}, [env, activeWallet, setValue]);

	const handleNext = async () => {
		const isValid = await trigger();

		window.scrollTo({ top: 0, behavior: "smooth" });

		if (!isValid) return;

		setActiveTab(activeTab + 1);
	};

	const handleBack = () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
		setActiveTab(activeTab - 1);
	};

	const handleSubmit = async () => {
		const loadingToastId = toasts.info(t("TRANSACTION.BROADCASTING"));

		try {
			const transaction = await sendEntityUpdateTransaction({ form, senderWallet: activeWallet, env });
			toasts.dismiss(loadingToastId);

			setSavedTransaction(transaction);
			setActiveTab(activeTab + 1);
		} catch (e) {
			toasts.dismiss(loadingToastId);
			toasts.error(String(e), { autoClose: 20000 });
		}
	};

	return (
		<Page profile={activeProfile} crumbs={crumbs}>
			<Section className="flex-1">
				{isLoading && <Loader />}

				{!isLoading && (
					<Form className="max-w-xl mx-auto" context={form} onSubmit={handleSubmit}>
						<Tabs activeId={activeTab}>
							<StepIndicator size={4} activeIndex={activeTab} />

							<div className="mt-8">
								<TabPanel tabId={1}>
									<FirstStep
										showEntityNameField={false}
										title={t("TRANSACTION.PAGE_UPDATE_REGISTRATION.FIRST_STEP.BUSINESS.TITLE")}
										description={t(
											"TRANSACTION.PAGE_UPDATE_REGISTRATION.FIRST_STEP.BUSINESS.DESCRIPTION",
										)}
									/>
								</TabPanel>
								<TabPanel tabId={2}>
									<SecondStep senderWallet={activeWallet} />
								</TabPanel>
								<TabPanel tabId={3}>
									<ThirdStep wallet={activeWallet} />
								</TabPanel>
								<TabPanel tabId={4}>
									{savedTransaction && (
										<TransactionSuccessful senderWallet={activeWallet}>
											<FourthStep transaction={savedTransaction} wallet={activeWallet} />
										</TransactionSuccessful>
									)}
								</TabPanel>

								<div className="flex justify-end mt-8 space-x-3">
									{activeTab < 4 && activeTab > 1 && (
										<Button
											disabled={activeTab === 1 || formState.isSubmitting}
											data-testid="SendEntityUpdate__back-button"
											variant="plain"
											onClick={handleBack}
										>
											{t("COMMON.BACK")}
										</Button>
									)}

									{activeTab < 3 && (
										<Button data-testid="SendEntityUpdate__continue-button" onClick={handleNext}>
											{t("COMMON.CONTINUE")}
										</Button>
									)}

									{activeTab === 3 && (
										<Button
											data-testid="SendEntityUpdate__send-button"
											disabled={formState.isSubmitting}
											type="submit"
											className="space-x-2"
										>
											<Icon name="Send" width={20} height={20} />
											<span>{t("COMMON.SEND")}</span>
										</Button>
									)}

									{activeTab === 4 && (
										<div className="flex justify-end space-x-3">
											<Button data-testid="SendEntityUpdate__wallet-button" variant="plain">
												{t("COMMON.BACK_TO_WALLET")}
											</Button>

											<Button
												type="submit"
												data-testid="SendEntityUpdate__download-button"
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
				)}
			</Section>
		</Page>
	);
};
SendEntityUpdate.defaultProps = {
	formDefaultValues: {
		fees: {
			static: "5",
			min: "0",
			avg: "1",
			max: "2",
		},
		fee: "5",
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
