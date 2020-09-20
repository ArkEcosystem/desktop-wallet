import { SignedTransactionData } from "@arkecosystem/platform-sdk/dist/contracts";
import { Button } from "app/components/Button";
import { Form } from "app/components/Form";
import { Icon } from "app/components/Icon";
import { Page, Section } from "app/components/Layout";
import { StepIndicator } from "app/components/StepIndicator";
import { TabPanel, Tabs } from "app/components/Tabs";
import { useEnvironmentContext } from "app/contexts";
import { useActiveProfile, useActiveWallet, useClipboard } from "app/hooks";
import { AuthenticationStep } from "domains/transaction/components/AuthenticationStep";
import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { Participant } from "./components/AddParticipant/AddParticipant";
import { FormStep } from "./FormStep";
import { ReviewStep } from "./ReviewStep";
import { SentStep } from "./SentStep";

export const SendMultiSignature = () => {
	const { t } = useTranslation();
	const history = useHistory();

	const { persist } = useEnvironmentContext();
	const activeProfile = useActiveProfile();
	const activeWallet = useActiveWallet();

	const [_, copy] = useClipboard({
		resetAfter: 1000,
	});

	const crumbs = [
		{
			route: `/profiles/${activeProfile.id()}/dashboard`,
			label: t("COMMON.GO_BACK_TO_PORTFOLIO"),
		},
	];
	const [activeTab, setActiveTab] = useState(1);
	const [transaction, setTransaction] = useState<SignedTransactionData>();

	const form = useForm({ mode: "onChange" });
	const { formState, getValues, watch, setValue, setError } = form;

	const senderAddress = watch("senderAddress");
	const senderWallet = useMemo(() => activeProfile.wallets().findByAddress(senderAddress), [
		activeProfile,
		senderAddress,
	]);

	const copyTransaction = () => {
		transaction && copy(transaction.id());
	};

	const handleBack = () => {
		setActiveTab(activeTab - 1);
	};

	const handleNext = () => {
		setActiveTab(activeTab + 1);
	};

	const submitForm = async () => {
		if (!senderWallet) {
			throw new Error();
		}

		const { fee, minParticipants, participants, mnemonic /** secondMnemonic **/ } = getValues();
		const publicKeys = (participants as Participant[]).map((item) => item.publicKey);

		try {
			const transactionId = await senderWallet.transaction().signMultiSignature({
				fee,
				from: senderWallet.address(),
				sign: {
					multiSignature: {
						publicKeys: [...publicKeys],
						min: minParticipants,
					},
				},
				data: {
					publicKeys: [...publicKeys],
					min: minParticipants,
					senderPublicKey: senderWallet.publicKey(),
				},
			});

			await senderWallet.transaction().addSignature(transactionId, mnemonic);
			await persist();

			setTransaction(senderWallet.transaction().transaction(transactionId));

			handleNext();
		} catch (error) {
			console.error("Could not create transaction: ", error);

			setValue("mnemonic", "");
			setError("mnemonic", { type: "manual", message: t("TRANSACTION.INVALID_MNEMONIC") });
		}
	};

	return (
		<Page profile={activeProfile} crumbs={crumbs}>
			<Section className="flex-1">
				<Form className="max-w-xl mx-auto" context={form} onSubmit={submitForm}>
					<Tabs activeId={activeTab}>
						<StepIndicator size={4} activeIndex={activeTab} />

						<div className="mt-8">
							<TabPanel tabId={1}>
								<FormStep activeWallet={activeWallet} profile={activeProfile} />
							</TabPanel>
							<TabPanel tabId={2}>
								<ReviewStep />
							</TabPanel>
							<TabPanel tabId={3}>
								<AuthenticationStep wallet={senderWallet!} />
							</TabPanel>
							<TabPanel tabId={4}>
								<SentStep />
							</TabPanel>

							<div className="flex justify-end mt-10 space-x-3">
								{activeTab < 4 && (
									<>
										<Button
											disabled={activeTab === 1}
											data-testid="SendMultiSignature__button--back"
											variant="plain"
											onClick={handleBack}
										>
											{t("COMMON.BACK")}
										</Button>

										{activeTab < 3 && (
											<Button
												data-testid="SendMultiSignature__button--continue"
												disabled={!formState.isValid}
												onClick={handleNext}
											>
												{t("COMMON.CONTINUE")}
											</Button>
										)}

										{activeTab === 3 && (
											<Button
												type="submit"
												data-testid="SendMultiSignature__button--submit"
												disabled={!formState.isValid}
											>
												{t("TRANSACTION.SIGN_CONTINUE")}
											</Button>
										)}
									</>
								)}

								{activeTab === 4 && (
									<>
										<Button
											data-testid="SendMultiSignature__button--back-to-wallet"
											variant="plain"
											className="block"
											onClick={() =>
												history.push(
													`/profiles/${activeProfile.id()}/wallets/${senderWallet!.id()}`,
												)
											}
										>
											{t("COMMON.BACK_TO_WALLET")}
										</Button>

										<Button
											onClick={copyTransaction}
											data-testid="SendMultiSignature__button--copy"
											variant="plain"
											className="space-x-2"
										>
											<Icon name="Copy" />
											<span>{t("COMMON.COPY_TRANSACTION_ID")}</span>
										</Button>
									</>
								)}
							</div>
						</div>
					</Tabs>
				</Form>
			</Section>
		</Page>
	);
};
