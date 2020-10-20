import { ExtendedTransactionData, MultiSignatureData } from "@arkecosystem/platform-sdk-profiles";
import { Address } from "app/components/Address";
import { Modal } from "app/components/Modal";
import {
	TransactionConfirmations,
	TransactionDetail,
	TransactionExplorerLink,
	TransactionFee,
	TransactionSender,
	TransactionTimestamp,
} from "domains/transaction/components/TransactionDetail";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

type MultisignatureRegistrationDetailProps = {
	isOpen: boolean;
	transaction: ExtendedTransactionData;
	onClose?: () => void;
};

export const MultiSignatureRegistrationDetail = ({
	isOpen,
	transaction,
	onClose,
}: MultisignatureRegistrationDetailProps) => {
	const { t } = useTranslation();

	const wallet = transaction.wallet();
	const [participants, setParticipants] = useState<string[]>([]);
	const [generatedAddress, setGeneratedAddress] = useState<string | undefined>(undefined);

	useEffect(() => {
		const fetchData = async () => {
			const addresses: string[] = [];
			for (const publicKey of (transaction as MultiSignatureData).publicKeys()) {
				addresses.push(await wallet.coin().identity().address().fromPublicKey(publicKey));
			}

			const address = await wallet
				.coin()
				.identity()
				.address()
				.fromMultiSignature(
					(transaction as MultiSignatureData).min(),
					(transaction as MultiSignatureData).publicKeys(),
				);

			setGeneratedAddress(address);
			setParticipants(addresses);
		};

		fetchData();
	}, [wallet, transaction]);

	return (
		<Modal title={t("TRANSACTION.MODAL_MULTISIGNATURE_DETAIL.STEP_1.TITLE")} isOpen={isOpen} onClose={onClose}>
			<TransactionSender address={transaction.sender()} alias={wallet.alias()} border={false} />

			<TransactionFee currency={wallet.currency()} value={transaction.fee()} />

			<TransactionTimestamp timestamp={transaction.timestamp()!} />

			<TransactionConfirmations
				isConfirmed={transaction.isConfirmed()}
				confirmations={transaction.confirmations()}
			/>

			<TransactionDetail label={t("TRANSACTION.MULTISIGNATURE.PARTICIPANTS")}>
				<div className="flex flex-col space-y-2">
					{participants.map((address) => (
						<Address key={address} address={address} maxChars={0} />
					))}
				</div>
			</TransactionDetail>

			<TransactionDetail label={t("TRANSACTION.MULTISIGNATURE.MIN_SIGNATURES")}>
				{(transaction as MultiSignatureData).min()} / {(transaction as MultiSignatureData).publicKeys().length}
			</TransactionDetail>

			<TransactionDetail label={t("TRANSACTION.MULTISIGNATURE.GENERATED_ADDRESS")}>
				{generatedAddress}
			</TransactionDetail>

			<TransactionExplorerLink id={transaction.id()} link={transaction.explorerLink()} />

			{transaction.blockId() && (
				<TransactionExplorerLink
					id={transaction.blockId()!}
					link={transaction.explorerLinkForBlock()!}
					variant="block"
				/>
			)}
		</Modal>
	);
};

MultiSignatureRegistrationDetail.defaultProps = {
	isOpen: false,
};

MultiSignatureRegistrationDetail.displayName = "MultiSignatureRegistrationDetail";
