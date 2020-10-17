import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import Tippy from "@tippyjs/react";
import { Avatar } from "app/components/Avatar";
import { Badge } from "app/components/Badge";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const WaitingBadge = () => {
	const { t } = useTranslation();
	return (
		<Tippy content={t("COMMON.AWAITING_SIGNATURE")}>
			<Badge
				data-testid="Signatures__waiting-badge"
				className="bg-theme-danger-contrast text-theme-danger-400"
				icon="StatusClock"
			/>
		</Tippy>
	);
};

const SignedBadge = () => {
	const { t } = useTranslation();
	return (
		<Tippy content={t("COMMON.SIGNED")}>
			<Badge
				data-testid="Signatures__signed-badge"
				className="bg-theme-success-200 text-theme-success-500"
				icon="Checkmark"
			/>
		</Tippy>
	);
};

const ParticipantStatus = ({
	transactionId,
	publicKey,
	wallet,
}: {
	transactionId: string;
	publicKey: string;
	wallet: ReadWriteWallet;
}) => {
	const isAwaitingSignature = wallet.transaction().isAwaitingSignatureByPublicKey(transactionId, publicKey);
	const [address, setAddress] = useState("");

	useEffect(() => {
		const fetchData = async () => {
			const address = await wallet.coin().identity().address().fromPublicKey(publicKey);
			setAddress(address);
		};
		fetchData();
	}, [wallet, publicKey]);

	return (
		<li className="relative">
			<Tippy content={address}>
				<div>
					<Avatar address={publicKey} />
				</div>
			</Tippy>

			{isAwaitingSignature ? <WaitingBadge /> : <SignedBadge />}
		</li>
	);
};

export const Signatures = ({
	transactionId,
	wallet,
	publicKeys,
}: {
	transactionId: string;
	wallet: ReadWriteWallet;
	publicKeys: string[];
}) => {
	const { t } = useTranslation();

	return (
		<div data-testid="Signatures">
			<h3 className="mb-0">{t("TRANSACTION.SIGNATURES")}</h3>

			<div className="flex">
				<div>
					<div className="mb-2 text-sm font-semibold text-theme-neutral">{t("COMMON.YOU")}</div>

					<div className="pr-4 mr-2 border-r border-theme-neutral-300 dark:border-theme-neutral-800">
						<ParticipantStatus
							transactionId={transactionId}
							publicKey={wallet.publicKey()!}
							wallet={wallet}
						/>
					</div>
				</div>

				<div>
					<div className="mb-2 ml-2 text-sm font-semibold text-theme-neutral">{t("COMMON.OTHER")}</div>
					<ul className="flex ml-2 space-x-4">
						{publicKeys.map((publicKey) => (
							<ParticipantStatus
								key={publicKey}
								transactionId={transactionId}
								publicKey={publicKey}
								wallet={wallet}
							/>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
};
