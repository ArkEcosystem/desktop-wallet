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
import { useActiveProfile, useActiveWallet } from "app/hooks/env";
import { useValidation } from "app/hooks/validations";
import { toasts } from "app/services";
import { AuthenticationStep as ThirdStep } from "domains/transaction/components/AuthenticationStep";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { ReviewStep as SecondStep } from "../../components/EntityRegistrationForm/Step3";
import { FirstStep } from "./Step1";
import { FourthStep } from "./Step4";
import { fetchTxIpfsData, sendEntityUpdateTransaction } from "./utils";

type SendEntityUpdateProps = {
	formDefaultData?: any;
	onDownload: any;
};

export const SendEntityUpdate = ({ formDefaultData, onDownload }: SendEntityUpdateProps) => {
	const [activeTab, setActiveTab] = useState(1);
	const [activeTransaction, setActiveTransaction] = useState<TransactionData>();
	const [savedTransaction, setSavedTransaction] = useState<SignedTransactionData>();
	const [isLoading, setIsLoading] = useState(true);

	const form = useForm({ mode: "onChange", defaultValues: formDefaultData });
	const { setValue, triggerValidation, getValues, register } = form;
	const { sendEntityUpdate } = useValidation();

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
		[
			"fee",
			"fees",
			"ipfsData.sourceControl",
			"ipfsData.socialMedia",
			"ipfsData.videos",
			"ipfsData.images",
			"registrationId",
		].forEach(register);

		register("ipfsData.meta.displayName", sendEntityUpdate.name());
		register("ipfsData.meta.description", sendEntityUpdate.description());
		register("ipfsData.meta.website", sendEntityUpdate.website());
	}, [register, sendEntityUpdate]);

	useEffect(() => {
		const fetchTransaction = async () => {
			try {
				const tx = await activeWallet.client().transaction(transactionId);
				setActiveTransaction(tx as TransactionData);
				setValue("registrationId", tx.id());
			} catch (e) {
				toasts.error(`Unable to find transaction for [${transactionId}]`);
			}
		};

		fetchTransaction();
	}, [transactionId, activeWallet, setValue]);

	useEffect(() => {
		const fetchIpfs = async () => {
			if (!activeTransaction) return;

			try {
				const ipfsData: any = await fetchTxIpfsData(activeTransaction);
				setValue("ipfsData", ipfsData);
			} catch (e) {
				toasts.error(`Unable to find ipfs data for transaction [${transactionId}]`);
			}
		};

		fetchIpfs();
	}, [activeTransaction, setValue]);

	useEffect(() => {
		const fees = env.fees().findByType(activeWallet.coinId(), activeWallet.networkId(), "entityUpdate");

		setValue("fees", fees);
		setValue("fee", fees.avg);
	}, [env, activeWallet, setValue]);

	const handleNext = async () => {
		const isValid = await triggerValidation();

		window.scrollTo({ top: 0, behavior: "smooth" });

		if (!isValid) return;

		setActiveTab(activeTab + 1);
	};

	const handleBack = () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
		setActiveTab(activeTab - 1);
	};

	const handleSubmit = async () => {
		const isValid = await triggerValidation("mnemonic");
		if (!isValid) return;

		const loadingToastId = toasts.info("Sending transaction...");

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
					<Form className="max-w-xl mx-auto" context={form} onSubmit={(data: any) => onDownload?.(data)}>
						<Tabs activeId={activeTab}>
							<StepIndicator size={4} activeIndex={activeTab} />

							<div className="mt-8">
								<TabPanel tabId={1}>
									<FirstStep />
								</TabPanel>
								<TabPanel tabId={2}>
									<SecondStep wallet={activeWallet} />
								</TabPanel>
								<TabPanel tabId={3}>
									<ThirdStep wallet={activeWallet} />
								</TabPanel>
								<TabPanel tabId={4}>
									{savedTransaction && (
										<FourthStep
											transaction={savedTransaction}
											senderWallet={activeWallet}
											ipfsData={getValues("ipfsData")}
										/>
									)}
								</TabPanel>

								<div className="flex justify-end mt-8 space-x-3">
									{activeTab < 4 && activeTab > 1 && (
										<Button
											disabled={activeTab === 1}
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
											onClick={handleSubmit}
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
	formDefaultData: {
		fees: {
			static: "5",
			min: "0",
			avg: "1",
			max: "2",
		},
		fee: 0,
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
