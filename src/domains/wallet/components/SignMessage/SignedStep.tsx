import { Contracts } from "@arkecosystem/platform-sdk";
import { Contracts as ProfileContracts } from "@arkecosystem/platform-sdk-profiles";
import { Address } from "app/components/Address";
import { Avatar } from "app/components/Avatar";
import { Header } from "app/components/Header";
import { TextArea } from "app/components/TextArea";
import { TransactionDetail } from "domains/transaction/components/TransactionDetail";
import React, { useRef } from "react";
import { useTranslation } from "react-i18next";

export const SignedStep = ({
	signedMessage,
	wallet,
}: {
	signedMessage: Contracts.SignedMessage;
	wallet: ProfileContracts.IReadWriteWallet;
}) => {
	const { t } = useTranslation();

	const messageRef = useRef();
	const walletAlias = wallet.alias();

	return (
		<section>
			<Header title={t("WALLETS.MODAL_SIGN_MESSAGE.SIGNED_STEP.TITLE")} />

			<TransactionDetail
				border={false}
				label={t("WALLETS.SIGNATORY")}
				extra={<Avatar size="lg" address={wallet.address()} />}
			>
				<Address walletName={walletAlias} address={wallet.address()} maxChars={!walletAlias ? 0 : 24} />
			</TransactionDetail>

			<TransactionDetail label={t("COMMON.MESSAGE")} className="text-lg break-all">
				{signedMessage.message}
			</TransactionDetail>

			<TransactionDetail label={t("COMMON.SIGNATURE")} paddingPosition="top">
				<TextArea
					className="mt-2 py-4"
					name="signature"
					wrap="hard"
					ref={messageRef}
					defaultValue={JSON.stringify(signedMessage)}
				/>
			</TransactionDetail>
		</section>
	);
};
