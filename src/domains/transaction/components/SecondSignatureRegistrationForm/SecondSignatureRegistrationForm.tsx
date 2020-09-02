import { Contracts } from "@arkecosystem/platform-sdk";
import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { Alert } from "app/components/Alert";
import { Button } from "app/components/Button";
import { Clipboard } from "app/components/Clipboard";
import { Divider } from "app/components/Divider";
import { Header } from "app/components/Header";
import { Icon } from "app/components/Icon";
import { TabPanel, Tabs } from "app/components/Tabs";
import { RegistrationForm } from "domains/transaction/pages/Registration/Registration.models";
import { MnemonicList } from "domains/wallet/components/MnemonicList";
import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

const GenerationStep = () => <div />;

const BackupStep = () => {
	const { getValues, unregister } = useFormContext();
	const mnemonic = getValues("secondMnemonic");

	const { t } = useTranslation();

	useEffect(() => {
		unregister("verification");
	}, [unregister]);

	return (
		<section data-testid="SecondSignature__backup-step">
			<div className="my-8">
				<Header title={t("TRANSACTION.PAGE_SECOND_SIGNATURE.PASSPHRASE_STEP.TITLE")} />
			</div>

			<div className="space-y-8">
				<Alert size="lg">{t("TRANSACTION.PAGE_SECOND_SIGNATURE.PASSPHRASE_STEP.WARNING")}</Alert>
				<MnemonicList mnemonic={mnemonic} />
				<div className="flex justify-end w-full">
					<Clipboard data={mnemonic}>
						<Button data-testid="SecondSignature__copy" variant="plain">
							<Icon name="Copy" />
							<span>{t("COMMON.COPY")}</span>
						</Button>
					</Clipboard>
				</div>
			</div>

			<Divider dashed />

			<div className="py-3">
				<div className="flex justify-between">
					<div>
						<h3 className="mb-1 text-theme-neutral-dark">
							{t("TRANSACTION.PAGE_SECOND_SIGNATURE.PASSPHRASE_STEP.DOWNLOAD.TITLE")}
						</h3>
						<p className="text-theme-neutral">
							{t("TRANSACTION.PAGE_SECOND_SIGNATURE.PASSPHRASE_STEP.DOWNLOAD.DESCRIPTION")}
						</p>
					</div>
					<Icon name="FilePassword" width={40} height={40} />
				</div>
				<div className="flex justify-end w-full">
					<Button
						data-testid="SecondSignature__download"
						variant="plain"
						className="flex items-center mt-4 space-x-2"
					>
						<Icon name="Download" />
						<span>{t("COMMON.DOWNLOAD")}</span>
					</Button>
				</div>
			</div>

			<Divider dashed />
		</section>
	);
};

const ConfirmationStep = () => <div />;

const component = ({
	activeTab,
	feeOptions,
	wallet,
}: {
	activeTab: number;
	feeOptions: any;
	wallet: ReadWriteWallet;
}) => (
	<Tabs activeId={activeTab}>
		<TabPanel tabId={2}>
			<GenerationStep />
		</TabPanel>
		<TabPanel tabId={3}>
			<BackupStep />
		</TabPanel>
		<TabPanel tabId={4}>
			<ConfirmationStep />
		</TabPanel>
	</Tabs>
);

const transactionDetails = ({
	transaction,
	translations,
}: {
	transaction: Contracts.SignedTransactionData;
	translations: any;
}) => <div />;

component.displayName = "SecondSignatureRegistrationForm";
transactionDetails.displayName = "SecondSignatureRegistrationFormTransactionDetails";

export const SecondSignatureRegistrationForm: RegistrationForm = {
	tabSteps: 3,
	component,
	transactionDetails,
	formFields: ["secondMnemonic", "verification"],

	signTransaction: async ({ env, form, handleNext, profile, setTransaction, translations }: any) => {
		const { clearError, getValues, setError, setValue } = form;

		clearError("mnemonic");
		const { fee, mnemonic, senderAddress, secondMnemonic } = getValues();
		const senderWallet = profile.wallets().findByAddress(senderAddress);

		try {
			const transactionId = await senderWallet.transaction().signSecondSignature({
				fee,
				from: senderAddress,
				sign: {
					mnemonic,
				},
				data: {
					mnemonic: secondMnemonic,
				},
			});

			await senderWallet.transaction().broadcast(transactionId);

			await env.persist();

			setTransaction(senderWallet.transaction().transaction(transactionId));

			handleNext();
		} catch (error) {
			console.error("Could not create transaction: ", error);

			setValue("mnemonic", "");
			setError("mnemonic", "manual", translations("TRANSACTION.INVALID_MNEMONIC"));
		}
	},
};
