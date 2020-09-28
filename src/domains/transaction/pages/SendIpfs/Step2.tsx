import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { Address } from "app/components/Address";
import { Avatar } from "app/components/Avatar";
import { Circle } from "app/components/Circle";
import { Header } from "app/components/Header";
import { Icon } from "app/components/Icon";
import { Label } from "app/components/Label";
import { TransactionDetail } from "app/components/TransactionDetail";
import { NetworkIcon } from "domains/network/components/NetworkIcon";
import { TotalAmountBox } from "domains/transaction/components/TotalAmountBox";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const SecondStep = ({ wallet }: { wallet: ReadWriteWallet }) => {
	const { t } = useTranslation();
	const { getValues, unregister, watch } = useFormContext();

	// getValues does not get the value of `defaultValues` on first render
	const [watched] = useState(() => watch());
	const fee = getValues("fee") || watched.fee;
	const hash = getValues("hash") || watched.hash;

	useEffect(() => {
		unregister("mnemonic");
	}, [unregister]);

	return (
		<section data-testid="SendIpfs__step--second" className="space-y-8">
			<Header
				title={t("TRANSACTION.PAGE_IPFS.SECOND_STEP.TITLE")}
				subtitle={t("TRANSACTION.PAGE_IPFS.SECOND_STEP.DESCRIPTION")}
			/>

			<div>
				<TransactionDetail
					border={false}
					label={t("TRANSACTION.NETWORK")}
					extra={<NetworkIcon size="lg" coin={wallet.network().coin()} network={wallet.network().id()} />}
					className="pt-0"
				>
					{wallet.network().name()}
				</TransactionDetail>

				<TransactionDetail extra={<Avatar size="lg" address={wallet.address()} />}>
					<div className="flex-1 space-y-2">
						<div className="text-theme-neutral">
							<span className="mr-1 text-sm">{t("TRANSACTION.SENDER")}</span>
							<Label color="warning">
								<span className="text-sm">{t("TRANSACTION.YOUR_ADDRESS")}</span>
							</Label>
						</div>
						<Address address={wallet.address()} walletName={wallet.alias()} />
					</div>
				</TransactionDetail>

				<TransactionDetail
					label={t("TRANSACTION.IPFS_HASH")}
					extra={
						<Circle className="border-theme-text" size="lg">
							<Icon name="Ipfs" width={23} height={23} />
						</Circle>
					}
				>
					{hash}
				</TransactionDetail>

				<div className="mt-2">
					<TotalAmountBox fee={BigNumber.make(fee)} ticker={wallet.currency()} />
				</div>
			</div>
		</section>
	);
};
