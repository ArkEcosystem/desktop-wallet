import { Contracts } from "@arkecosystem/platform-sdk";
import { BIP39 } from "@arkecosystem/platform-sdk-crypto";
import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { Address } from "app/components/Address";
import { Alert } from "app/components/Alert";
import { Avatar } from "app/components/Avatar";
import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { Clipboard } from "app/components/Clipboard";
import { Divider } from "app/components/Divider";
import { FormField, FormLabel } from "app/components/Form";
import { Header } from "app/components/Header";
import { Icon } from "app/components/Icon";
import { Label } from "app/components/Label";
import { TabPanel, Tabs } from "app/components/Tabs";
import { TransactionDetail } from "app/components/TransactionDetail";
import { NetworkIcon } from "domains/network/components/NetworkIcon";
import { InputFee } from "domains/transaction/components/InputFee";
import { RegistrationForm } from "domains/transaction/pages/Registration/Registration.models";
import { MnemonicList } from "domains/wallet/components/MnemonicList";
import { MnemonicVerification } from "domains/wallet/components/MnemonicVerification";
import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { TotalAmountBox } from "../TotalAmountBox";

const GenerationStep = ({ feeOptions, wallet }: any) => {
	const { t } = useTranslation();
	const { getValues, setValue, register } = useFormContext();

	const fee = getValues("fee") || null;

	useEffect(() => {
		register("secondMnemonic");
	}, [register]);

	useEffect(() => {
		const newMnemonic = BIP39.generate();
		setValue("secondMnemonic", newMnemonic);
	}, [setValue]);

	return (
		<section data-testid="SecondSignatureRegistrationForm__generation-step">
			<div className="my-8">
				<Header
					title={t("TRANSACTION.PAGE_SECOND_SIGNATURE.GENERATION_STEP.TITLE")}
					subtitle={t("TRANSACTION.PAGE_SECOND_SIGNATURE.GENERATION_STEP.DESCRIPTION")}
				/>
			</div>

			<div className="mt-4">
				<Alert>{t("TRANSACTION.PAGE_SECOND_SIGNATURE.GENERATION_STEP.WARNING")}</Alert>

				<TransactionDetail
					className="mt-2"
					extra={<Avatar size="lg" address={wallet.address()} />}
					borderPosition="bottom"
				>
					<div className="mb-2 font-semibold text-theme-neutral">
						<span className="mr-1 text-sm">{t("TRANSACTION.SENDER")}</span>
						<Label color="warning">
							<span className="text-sm">{t("TRANSACTION.YOUR_ADDRESS")}</span>
						</Label>
					</div>
					<Address address={wallet.address()} walletName={wallet.alias()} />
				</TransactionDetail>

				<FormField name="fee" className="mt-8">
					<FormLabel label={t("TRANSACTION.TRANSACTION_FEE")} />
					<InputFee
						{...feeOptions}
						defaultValue={fee || 0}
						value={fee || 0}
						step={0.01}
						onChange={(value: any) => setValue("fee", value, true)}
					/>
				</FormField>
			</div>
		</section>
	);
};

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

const VerificationStep = () => {
	const { getValues, register, setValue } = useFormContext();
	const mnemonic = getValues("secondMnemonic");
	const isVerified: boolean = getValues("verification");

	const { t } = useTranslation();

	const handleComplete = () => {
		setValue("verification", true, true);
	};

	useEffect(() => {
		if (!isVerified) {
			register("verification", { required: true });
		}
	}, [isVerified, register]);

	return (
		<section data-testid="SecondSignature__confirmation-step">
			<div className="my-8">
				<Header
					title={t("TRANSACTION.PAGE_SECOND_SIGNATURE.PASSPHRASE_CONFIRMATION_STEP.TITLE")}
					subtitle={t("TRANSACTION.PAGE_SECOND_SIGNATURE.PASSPHRASE_CONFIRMATION_STEP.SUBTITLE")}
				/>
			</div>

			<MnemonicVerification
				mnemonic={mnemonic}
				optionsLimit={6}
				handleComplete={handleComplete}
				isCompleted={isVerified}
			/>

			<Divider dashed />
		</section>
	);
};

const ReviewStep = ({ wallet }: { wallet: ReadWriteWallet }) => {
	const { t } = useTranslation();
	const { getValues, unregister } = useFormContext();
	const { fee } = getValues();

	useEffect(() => {
		unregister("mnemonic");
	}, [unregister]);

	return (
		<section data-testid="SecondSignature__review-step">
			<h1 className="mb-0">{t("TRANSACTION.PAGE_SECOND_SIGNATURE.REVIEW_STEP.TITLE")}</h1>
			<div className="text-theme-neutral-dark">
				{t("TRANSACTION.PAGE_SECOND_SIGNATURE.REVIEW_STEP.DESCRIPTION")}
			</div>

			<div className="mt-4 grid grid-flow-row gap-2">
				<TransactionDetail
					border={false}
					label={t("TRANSACTION.NETWORK")}
					extra={<NetworkIcon coin={wallet.coinId()} network={wallet.networkId()} />}
				>
					<div className="flex-auto font-semibold truncate text-md text-theme-neutral-800 max-w-24">
						{wallet.network().name()}
					</div>
				</TransactionDetail>

				<TransactionDetail extra={<Avatar size="lg" address={wallet.address()} />}>
					<div className="mb-2 font-semibold text-theme-neutral">
						<span className="mr-1 text-sm">{t("TRANSACTION.SENDER")}</span>
						<Label color="warning">
							<span className="text-sm">{t("TRANSACTION.YOUR_ADDRESS")}</span>
						</Label>
					</div>
					<Address address={wallet.address()} walletName={wallet.alias()} />
				</TransactionDetail>

				<TransactionDetail
					label={t("TRANSACTION.TYPE")}
					extra={
						<div>
							<Circle className="border-black bg-theme-background" size="lg">
								<Icon name="Key" width={20} height={20} />
							</Circle>
						</div>
					}
				>
					{t("TRANSACTION.PAGE_SECOND_SIGNATURE.REVIEW_STEP.TYPE")}
				</TransactionDetail>

				<div className="mt-2">
					<TotalAmountBox amount={BigNumber.ZERO} fee={BigNumber.make(fee)} />
				</div>
			</div>
		</section>
	);
};

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
			<GenerationStep wallet={wallet} feeOptions={feeOptions} />
		</TabPanel>
		<TabPanel tabId={3}>
			<BackupStep />
		</TabPanel>
		<TabPanel tabId={4}>
			<VerificationStep />
		</TabPanel>
		<TabPanel tabId={5}>
			<ReviewStep wallet={wallet} />
		</TabPanel>
	</Tabs>
);

const transactionDetails = ({ translations }: { transaction: Contracts.SignedTransactionData; translations: any }) => (
	<TransactionDetail
		label={translations("TRANSACTION.TYPE")}
		extra={
			<div>
				<Circle className="border-black bg-theme-background" size="lg">
					<Icon name="Key" width={20} height={20} />
				</Circle>
			</div>
		}
	>
		{translations("TRANSACTION.PAGE_SECOND_SIGNATURE.REVIEW_STEP.TYPE")}
	</TransactionDetail>
);

component.displayName = "SecondSignatureRegistrationForm";
transactionDetails.displayName = "SecondSignatureRegistrationFormTransactionDetails";

export const SecondSignatureRegistrationForm: RegistrationForm = {
	tabSteps: 4,
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
