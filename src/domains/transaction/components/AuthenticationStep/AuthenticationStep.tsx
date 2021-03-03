import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { FormField, FormLabel } from "app/components/Form";
import { Header } from "app/components/Header";
import { InputPassword } from "app/components/Input";
import { useValidation } from "app/hooks";
import { LedgerConfirmation } from "domains/transaction/components/LedgerConfirmation";
import { LedgerWaitingAppContent, LedgerWaitingDeviceContent } from "domains/wallet/components/Ledger";
import React from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

type LedgerStates = {
	ledgerIsAwaitingDevice?: boolean;
	ledgerIsAwaitingApp?: boolean;
};

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
	wallet: ReadWriteWallet;
	skipSecondSignature?: boolean;
	ledgerDetails?: React.ReactNode;
} & LedgerStates) => {
	const { t } = useTranslation();
	const { register } = useFormContext();

	const isLedger = wallet.isLedger();
	const { authentication } = useValidation();

	if (isLedger) {
		return (
			<div data-testid="AuthenticationStep" className="space-y-8">
				<LedgerStateWrapper
					ledgerIsAwaitingApp={ledgerIsAwaitingApp}
					ledgerIsAwaitingDevice={ledgerIsAwaitingDevice}
					coinName={wallet.network().coin()}
				>
					<Header
						title={t("TRANSACTION.LEDGER_CONFIRMATION.TITLE")}
						subtitle={t("TRANSACTION.AUTHENTICATION_STEP.DESCRIPTION")}
					/>

					<LedgerConfirmation>{ledgerDetails}</LedgerConfirmation>
				</LedgerStateWrapper>
			</div>
		);
	}

	return (
		<div data-testid="AuthenticationStep" className="space-y-8">
			<Header
				title={t("TRANSACTION.AUTHENTICATION_STEP.TITLE")}
				subtitle={t("TRANSACTION.AUTHENTICATION_STEP.DESCRIPTION")}
			/>

			<FormField name="mnemonic">
				<FormLabel>{t("TRANSACTION.MNEMONIC")}</FormLabel>
				<InputPassword
					data-testid="AuthenticationStep__mnemonic"
					ref={register(authentication.mnemonic(wallet.coin(), wallet.address()))}
				/>
			</FormField>

			{wallet.isSecondSignature() && !skipSecondSignature && (
				<FormField name="secondMnemonic">
					<FormLabel>{t("TRANSACTION.SECOND_MNEMONIC")}</FormLabel>
					<InputPassword
						data-testid="AuthenticationStep__second-mnemonic"
						ref={register(authentication.secondMnemonic(wallet.coin(), wallet.secondPublicKey()!))}
					/>
				</FormField>
			)}
		</div>
	);
};

AuthenticationStep.defaultProps = {
	skipSecondSignature: false,
};
