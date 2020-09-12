import { TransactionData } from "@arkecosystem/platform-sdk-profiles";
import { Button } from "app/components/Button";
import { Form } from "app/components/Form";
import { Icon } from "app/components/Icon";
import { Page, Section } from "app/components/Layout";
import { StepIndicator } from "app/components/StepIndicator";
import { TabPanel, Tabs } from "app/components/Tabs";
import { useEnvironmentContext } from "app/contexts";
import { useActiveProfile, useActiveWallet } from "app/hooks/env";
import { toasts } from "app/services";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { FirstStep } from "./Step1";
import { SecondStep } from "./Step2";
import { ThirdStep } from "./Step3";
import { FourthStep } from "./Step4";
import { fetchTxIpfsData } from "./utils";

type SendEntityUpdateProps = {
	formDefaultData?: any;
	onDownload: any;
};

export const SendEntityUpdate = ({ formDefaultData, onDownload }: SendEntityUpdateProps) => {
	const [activeTab, setActiveTab] = useState(1);
	const [activeTransaction, setActiveTransaction] = useState<TransactionData>();

	const form = useForm({ mode: "onChange", defaultValues: formDefaultData });

	const { env } = useEnvironmentContext();
	const activeProfile = useActiveProfile();
	const activeWallet = useActiveWallet();

	const { t } = useTranslation();

	const handleBack = () => {
		setActiveTab(activeTab - 1);
	};

	const handleNext = async () => {
		const isValid = await form.triggerValidation();

		if (!isValid) {
			const firstError = Object.values(form.errors)[0];
			firstError?.ref?.scrollIntoView?.({ behavior: "smooth", block: "end" });
			return;
		}

		setActiveTab(activeTab + 1);
	};

	const crumbs = [
		{
			route: `/profiles/${activeProfile.id()}/dashboard`,
			label: t("COMMON.GO_BACK_TO_PORTFOLIO"),
		},
	];

	const { transactionId } = useParams();

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
		const fees = env.fees().findByType(activeWallet.coinId(), activeWallet.networkId(), "entityUpdate");
		form.setValue("fees", fees);
		form.setValue("fee", fees.avg);
	}, [env, activeWallet]);

	useEffect(() => {
		const fetchIpfs = async () => {
			if (!activeTransaction) return;

			try {
				const ipfsData: any = await fetchTxIpfsData(activeTransaction);

				form.setValue("name", ipfsData.meta.displayName);
				form.setValue("description", ipfsData.meta.description);
				form.setValue("website", ipfsData.meta.website);
				form.setValue("socialMedia", ipfsData.socialMedia || []);
				form.setValue("sourceControl", ipfsData.sourceControl || []);
				form.setValue("images", ipfsData.images || []);
				form.setValue("videos", ipfsData.videos || []);
			} catch (e) {
				toasts.error(`Unable to find ipfs data for transaction [${transactionId}]`);
			}
		};

		fetchIpfs();
	}, [activeTransaction]);

	return (
		<Page profile={activeProfile} crumbs={crumbs}>
			<Section className="flex-1">
				<Form className="max-w-xl mx-auto" context={form} onSubmit={(data: any) => onDownload(data)}>
					<Tabs activeId={activeTab}>
						<StepIndicator size={6} activeIndex={activeTab} />

						<div className="mt-8">
							<TabPanel tabId={1}>
								<FirstStep form={form} />
							</TabPanel>
							<TabPanel tabId={2}>
								<SecondStep />
							</TabPanel>
							<TabPanel tabId={3}>
								<ThirdStep form={form} passwordType="mnemonic" />
							</TabPanel>
							<TabPanel tabId={4}>
								<ThirdStep form={form} passwordType="password" />
							</TabPanel>
							<TabPanel tabId={5}>
								<ThirdStep form={form} passwordType="ledger" />
							</TabPanel>
							<TabPanel tabId={6}>
								<FourthStep />
							</TabPanel>

							<div className="flex justify-end mt-8 space-x-3">
								{activeTab < 6 && (
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

								{activeTab >= 3 && activeTab < 6 && (
									<Button
										data-testid="SendEntityUpdate__send-button"
										onClick={handleNext}
										className="space-x-2"
									>
										<Icon name="Send" width={20} height={20} />
										<span>{t("COMMON.SEND")}</span>
									</Button>
								)}

								{activeTab === 6 && (
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
		images: [],
		videos: [],
		sourceControl: [],
		socialMedia: [],
		fee: 0,
		fees: {
			static: "5",
			min: "0",
			avg: "1",
			max: "2",
		},
	},
};
