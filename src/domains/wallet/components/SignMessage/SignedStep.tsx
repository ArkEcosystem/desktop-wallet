import { SignedMessage } from "@arkecosystem/platform-sdk/dist/contracts";
import { Address } from "app/components/Address";
import { Avatar } from "app/components/Avatar";
import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { Clipboard } from "app/components/Clipboard";
import { Header } from "app/components/Header";
import { Icon } from "app/components/Icon";
import { TextArea } from "app/components/TextArea";
import { TransactionDetail } from "domains/transaction/components/TransactionDetail";
import React, { useRef } from "react";
import { useTranslation } from "react-i18next";

export const SignedStep = ({ signedMessage }: { signedMessage: SignedMessage }) => {
	const messageRef = useRef();
	const { t } = useTranslation();

	const payload = JSON.stringify(signedMessage);

	return (
		<>
			<Header title={t("WALLETS.MODAL_SIGN_MESSAGE.SUCCESS_TITLE")} />

			<TransactionDetail
				border={false}
				label={t("WALLETS.SIGNATORY")}
				extra={
					<div className="flex items-center">
						<Circle className="-mr-2 border-black">
							<Icon name="Delegate" width={25} height={25} />
						</Circle>
						<Avatar address={signedMessage.signatory} />
					</div>
				}
			>
				<Address address={signedMessage.signatory} />
			</TransactionDetail>

			<TransactionDetail border label={t("COMMON.MESSAGE")} className="text-lg break-all">
				{signedMessage.message}
			</TransactionDetail>

			<TransactionDetail border label={t("COMMON.SIGNATURE")}>
				<TextArea
					className="mt-2 rounded-lg"
					name="signature"
					wrap="hard"
					ref={messageRef}
					defaultValue={JSON.stringify(signedMessage)}
				/>
			</TransactionDetail>

			<div className="flex justify-end pb-5 mt-3">
				<Clipboard data={payload}>
					<Button variant="secondary" data-testid="SignMessage__copy-button">
						<Icon name="Copy" />
						<span>{t("WALLETS.MODAL_SIGN_MESSAGE.COPY_SIGNATURE")}</span>
					</Button>
				</Clipboard>
			</div>
		</>
	);
};
