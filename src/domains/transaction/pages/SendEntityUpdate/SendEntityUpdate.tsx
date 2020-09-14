import { TransactionData } from "@arkecosystem/platform-sdk-profiles";
import { SignedTransactionData } from "@arkecosystem/platform-sdk/dist/contracts";
import { Button } from "app/components/Button";
import { Form } from "app/components/Form";
import { Icon } from "app/components/Icon";
import { Page, Section } from "app/components/Layout";
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
import { fetchTxIpfsData } from "./utils";

type SendEntityUpdateProps = {
	formDefaultData?: any;
	onDownload: any;
};

export const SendEntityUpdate = ({ formDefaultData, onDownload }: SendEntityUpdateProps) => {
	const [activeTab, setActiveTab] = useState(1);
	const [activeTransaction, setActiveTransaction] = useState<TransactionData>();
	const [savedTransaction, setSavedTransaction] = useState<SignedTransactionData>();

	const form = useForm({ mode: "onChange", defaultValues: formDefaultData });
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
		].forEach(form.register);

		form.register("ipfsData.meta.displayName", sendEntityUpdate.name());
		form.register("ipfsData.meta.description", sendEntityUpdate.description());
		form.register("ipfsData.meta.website", sendEntityUpdate.website());
	}, []);

	useEffect(() => {
		const fetchTransaction = async () => {
			try {
				const tx = await activeWallet.client().transaction(transactionId);
				setActiveTransaction(tx as TransactionData);
			} catch (e) {
				toasts.error(`Unable to find transaction for [${transactionId}]`);
			}
		};

		fetchTransaction();
	}, [transactionId, activeWallet]);

	useEffect(() => {
		const fetchIpfs = async () => {
			if (!activeTransaction) return;

			try {
				const ipfsData: any = await fetchTxIpfsData(activeTransaction);
				form.setValue("ipfsData", ipfsData);
			} catch (e) {
				toasts.error(`Unable to find ipfs data for transaction [${transactionId}]`);
			}
		};

		fetchIpfs();
	}, [activeTransaction]);

	useEffect(() => {
		const fees = env.fees().findByType(activeWallet.coinId(), activeWallet.networkId(), "entityUpdate");
		form.setValue("fees", fees);
		form.setValue("fee", fees.avg);
	}, [env, activeWallet]);

	const handleBack = () => {
		setActiveTab(activeTab - 1);
	};

	const handleNext = async () => {
		const isValid = await form.triggerValidation();

		if (!isValid) {
			const errors: object = form.errors.ipfsData?.meta;
			const firstError = Object.values(errors)[0]?.ref;
			firstError?.scrollIntoView?.({ behavior: "smooth", block: "end" });
			return;
		}

		setActiveTab(activeTab + 1);
	};

	return (
		<Page profile={activeProfile} crumbs={crumbs}>
			<Section className="flex-1">
				<Form className="max-w-xl mx-auto" context={form} onSubmit={(data: any) => onDownload(data)}>
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
								<FourthStep />
							</TabPanel>

							<div className="flex justify-end mt-8 space-x-3">
								{activeTab < 3 && activeTab > 1 && (
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
										onClick={handleNext}
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
