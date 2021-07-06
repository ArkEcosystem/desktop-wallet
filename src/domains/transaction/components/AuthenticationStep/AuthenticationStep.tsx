import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { FormField, FormLabel } from "app/components/Form";
import { Header } from "app/components/Header";
import { InputPassword } from "app/components/Input";
import { useValidation } from "app/hooks";
import { LedgerConfirmation } from "domains/transaction/components/LedgerConfirmation";
import { LedgerWaitingAppContent, LedgerWaitingDeviceContent } from "domains/wallet/components/Ledger";
import React from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface LedgerStates {
	ledgerIsAwaitingDevice?: boolean;
	ledgerIsAwaitingApp?: boolean;
}

const LedgerStateWrapper = ({
	ledgerIsAwaitingApp,
	ledgerIsAwaitingDevice,
	coinName,
	children,
}: { coinName: string; children: React.ReactNode } & LedgerStates) => {
	if (ledgerIsAwaitingDevice) {
		return <LedgerWaitingDeviceContent />;
	}

	if (ledgerIsAwaitingApp) {
		return <LedgerWaitingAppContent coinName={coinName} />;
	}

	return <>{children}</>;
};

export const AuthenticationStep = ({
	wallet,
	skipSecondSignature,
	ledgerDetails,
	ledgerIsAwaitingDevice,
	ledgerIsAwaitingApp,
}: {
	wallet: Contracts.IReadWriteWallet;
	skipSecondSignature?: boolean;
	ledgerDetails?: React.ReactNode;
} & LedgerStates) => {
	const { t } = useTranslation();
	const { errors, getValues, register } = useFormContext();
	const { authentication } = useValidation();

	if (wallet.isLedger()) {
		return (
			<div data-testid="AuthenticationStep" className="space-y-8">
				<LedgerStateWrapper
					ledgerIsAwaitingApp={ledgerIsAwaitingApp}
					ledgerIsAwaitingDevice={ledgerIsAwaitingDevice}
					coinName={wallet.network().coin()}
				>
					<>
						<Header title={t("TRANSACTION.LEDGER_CONFIRMATION.TITLE")} />

						<LedgerConfirmation>{ledgerDetails}</LedgerConfirmation>
					</>
				</LedgerStateWrapper>
			</div>
		);
	}

	const title = t("TRANSACTION.AUTHENTICATION_STEP.TITLE");

	const requireMnemonic = wallet.actsWithMnemonic() || wallet.actsWithAddress() || wallet.actsWithPublicKey();
	const requireEncryptionPassword =
		wallet.actsWithMnemonicWithEncryption() ||
		wallet.actsWithWifWithEncryption() ||
		wallet.actsWithSecretWithEncryption();

	const shouldRenderSecondMnemonicField = !skipSecondSignature && wallet.isSecondSignature();

	const renderSecondMnemonicField = () => {
		const mnemonicFieldName = requireEncryptionPassword ? "encryptionPassword" : "mnemonic";
		const mnemonicIsValid = !!getValues(mnemonicFieldName) && !errors[mnemonicFieldName];

		return (
			<FormField name="secondMnemonic">
				<FormLabel>{t("TRANSACTION.SECOND_MNEMONIC")}</FormLabel>
				<InputPassword
					data-testid="AuthenticationStep__second-mnemonic"
					disabled={!mnemonicIsValid}
					ref={register(authentication.secondMnemonic(wallet.coin(), wallet.secondPublicKey()!))}
				/>
			</FormField>
		);
	};

	return (
		<div data-testid="AuthenticationStep" className="space-y-6">
			{wallet.actsWithWif() && (
				<>
					<Header title={title} subtitle={t("TRANSACTION.AUTHENTICATION_STEP.DESCRIPTION_WIF")} />

					<FormField name="wif">
						<FormLabel>{t("COMMON.WIF")}</FormLabel>
						<InputPassword
							data-testid="AuthenticationStep__wif"
							ref={register(authentication.wif(wallet))}
						/>
					</FormField>
				</>
			)}

			{wallet.actsWithPrivateKey() && (
				<>
					<Header title={title} subtitle={t("TRANSACTION.AUTHENTICATION_STEP.DESCRIPTION_PRIVATE_KEY")} />

					<FormField name="privateKey">
						<FormLabel>{t("COMMON.PRIVATE_KEY")}</FormLabel>
						<InputPassword
							data-testid="AuthenticationStep__private-key"
							ref={register(authentication.privateKey(wallet))}
						/>
					</FormField>
				</>
			)}

			{wallet.actsWithSecret() && (
				<>
					<Header title={title} subtitle={t("TRANSACTION.AUTHENTICATION_STEP.DESCRIPTION_SECRET")} />

					<FormField name="secret">
						<FormLabel>{t("COMMON.secret")}</FormLabel>
						<InputPassword
							data-testid="AuthenticationStep__secret"
							ref={register(authentication.secret(wallet))}
						/>
					</FormField>
				</>
			)}

			{requireEncryptionPassword && (
				<>
					<Header
						title={title}
						subtitle={t("TRANSACTION.AUTHENTICATION_STEP.DESCRIPTION_ENCRYPTION_PASSWORD")}
					/>

					<FormField name="encryptionPassword">
						<FormLabel>{t("TRANSACTION.ENCRYPTION_PASSWORD")}</FormLabel>
						<InputPassword
							data-testid="AuthenticationStep__encryption-password"
							ref={register(authentication.encryptionPassword(wallet))}
						/>
					</FormField>
				</>
			)}

			{requireMnemonic && (
				<>
					<Header title={title} subtitle={t("TRANSACTION.AUTHENTICATION_STEP.DESCRIPTION_MNEMONIC")} />

					<FormField name="mnemonic">
						<FormLabel>{t("TRANSACTION.MNEMONIC")}</FormLabel>
						<InputPassword
							data-testid="AuthenticationStep__mnemonic"
							ref={register(authentication.mnemonic(wallet))}
						/>
					</FormField>
				</>
			)}

			{shouldRenderSecondMnemonicField && renderSecondMnemonicField()}
		</div>
	);
};

AuthenticationStep.defaultProps = {
	skipSecondSignature: false,
};
