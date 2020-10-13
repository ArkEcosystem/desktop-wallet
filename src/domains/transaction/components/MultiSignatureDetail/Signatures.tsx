import { Contracts } from "@arkecosystem/platform-sdk";
import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import Tippy from "@tippyjs/react";
import { Avatar } from "app/components/Avatar";
import { Badge } from "app/components/Badge";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const PendingBadge = () => {
	const { t } = useTranslation();
	return (
		<Tippy content={t("COMMON.AWAITING_SIGNATURE")}>
			<Badge className="bg-theme-danger-contrast text-theme-danger-400" icon="StatusClock" />
		</Tippy>
	);
};

const SignedBadge = () => {
	const { t } = useTranslation();
	return (
		<Tippy content={t("COMMON.SIGNED")}>
			<Badge className="bg-theme-success-200 text-theme-success-500" icon="Checkmark" />
		</Tippy>
	);
};

const ParticipantStatus = ({
	publicKey,
	transaction,
	wallet,
}: {
	publicKey: string;
	transaction: Contracts.SignedTransactionData;
	wallet: ReadWriteWallet;
}) => {
	const isPending = wallet.transaction().isAwaitingSignatureByPublicKey(transaction.id(), publicKey);
	const [address, setAddress] = useState("");

	useEffect(() => {
		const sync = async () => {
			const address = await wallet.coin().identity().address().fromPublicKey(publicKey);
			setAddress(address);
		};
		sync();
	}, [wallet, publicKey]);

	return (
		<div className="relative">
			<Tippy content={address}>
				<div>
					<Avatar address={publicKey} />
				</div>
			</Tippy>

			{isPending ? <PendingBadge /> : <SignedBadge />}
		</div>
	);
};

export const Signatures = ({
	wallet,
	transaction,
}: {
	wallet: ReadWriteWallet;
	transaction: Contracts.SignedTransactionData;
}) => {
	const { t } = useTranslation();
	const participants = transaction
		.get<{ publicKeys: string[]; min: number }>("multiSignature")
		.publicKeys.filter((pubKey) => pubKey !== wallet.publicKey());

	return (
		<div>
			<h3 className="mb-0">{t("TRANSACTION.SIGNATURES")}</h3>

			<div className="flex">
				<div>
					<div className="mb-2 text-sm font-semibold text-theme-neutral">{t("COMMON.YOU")}</div>

					<div className="pr-6 mr-2 border-r border-theme-neutral-300">
						<ParticipantStatus publicKey={wallet.publicKey()!} wallet={wallet} transaction={transaction} />
					</div>
				</div>

				<div>
					<div className="mb-2 ml-2 text-sm font-semibold text-theme-neutral">{t("COMMON.OTHER")}</div>
					<ul className="flex ml-2 space-x-4">
						{participants.map((publicKey) => (
							<ParticipantStatus
								key={publicKey}
								publicKey={publicKey}
								wallet={wallet}
								transaction={transaction}
							/>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
};
