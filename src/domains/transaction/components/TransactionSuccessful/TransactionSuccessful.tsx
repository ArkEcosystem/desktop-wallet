import { Contracts } from "@arkecosystem/platform-sdk";
import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { images } from "app/assets/images";
import { Address } from "app/components/Address";
import { Avatar } from "app/components/Avatar";
import { Clipboard } from "app/components/Clipboard";
import { Icon } from "app/components/Icon";
import { Label } from "app/components/Label";
import { NetworkIcon } from "domains/network/components/NetworkIcon";
import { TransactionDetail } from "domains/transaction/components/TransactionDetail";
import React from "react";
import { useTranslation } from "react-i18next";

type TransactionSuccessfulProps = {
	children?: React.ReactNode;
	transaction?: Contracts.SignedTransactionData;
	senderWallet?: ReadWriteWallet;
};

const { TransactionSuccessfulBanner } = images.transaction.common;

export const TransactionSuccessful = ({ children, transaction, senderWallet }: TransactionSuccessfulProps) => {
	const { t } = useTranslation();

	return (
		<section data-testid="TransactionSuccessful" className="space-y-8">
			<div>
				<h1>{t("TRANSACTION.SUCCESS.TITLE")}</h1>

				<div className="w-full my-8">
					<TransactionSuccessfulBanner className="w-full" />
				</div>

				<p className="mb-2 text-theme-neutral-dark">{t("TRANSACTION.SUCCESS.DESCRIPTION")}</p>

				{senderWallet && (
					<>
						<TransactionDetail label={t("TRANSACTION.ID")} border={false}>
							<div className="flex items-center">
								<Address addressClass="text-theme-primary" address={transaction?.id()} maxChars={32} />
								<span className="flex ml-5">
									<Clipboard data={transaction?.id()}>
										<div className="text-theme-primary-300">
											<Icon name="Copy" />
										</div>
									</Clipboard>
								</span>
							</div>
						</TransactionDetail>

						<TransactionDetail
							label={t("TRANSACTION.NETWORK")}
							extra={
								<NetworkIcon
									size="lg"
									coin={senderWallet.network().coin()}
									network={senderWallet.network().id()}
								/>
							}
						>
							{senderWallet.network().name()}
						</TransactionDetail>

						<TransactionDetail extra={<Avatar size="lg" address={senderWallet.address()} />}>
							<div className="mb-2 text-sm font-semibold text-theme-neutral">
								<span className="mr-1">{t("TRANSACTION.SENDER")}</span>
								<Label color="warning">
									<span className="text-sm">{t("TRANSACTION.YOUR_ADDRESS")}</span>
								</Label>
							</div>
							<Address address={transaction?.sender()} walletName={senderWallet.alias()} />
						</TransactionDetail>
					</>
				)}

				{children}
			</div>
		</section>
	);
};
