import { Profile, ReadOnlyWallet, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { upperFirst } from "@arkecosystem/utils";
import { Address } from "app/components/Address";
import { Avatar } from "app/components/Avatar";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import { Label } from "app/components/Label";
import { TransactionDetail } from "app/components/TransactionDetail";
import { TotalAmountBox } from "domains/transaction/components/TotalAmountBox";
import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const SecondStep = ({
	delegate,
	profile,
	wallet,
}: {
	delegate: ReadOnlyWallet;
	profile: Profile;
	wallet: ReadWriteWallet;
}) => {
	const { t } = useTranslation();
	const { getValues, unregister } = useFormContext();

	const { fee, senderAddress } = getValues();
	const coinName = wallet.coinId();
	const network = `${coinName} ${wallet.network().name()}`;
	const walletName = profile.wallets().findByAddress(senderAddress)?.alias();

	useEffect(() => {
		unregister("mnemonic");
	}, [unregister]);

	return (
		<section data-testid="SendVote__step--second">
			<div>
				<h1 className="mb-0">{t("TRANSACTION.PAGE_VOTE.SECOND_STEP.TITLE")}</h1>
				<p className="text-theme-neutral-dark">{t("TRANSACTION.PAGE_VOTE.SECOND_STEP.DESCRIPTION")}</p>
			</div>

			<div className="grid grid-flow-row gap-2 mt-4">
				<TransactionDetail
					border={false}
					label={t("TRANSACTION.NETWORK")}
					extra={
						<div className="ml-1 text-theme-danger">
							<Circle className="bg-theme-background border-theme-danger-light" size="lg">
								{coinName && <Icon name={upperFirst(coinName.toLowerCase())} width={20} height={20} />}
							</Circle>
						</div>
					}
				>
					<div className="flex-auto font-semibold truncate text-md text-theme-neutral-800 max-w-24">
						{network}
					</div>
				</TransactionDetail>

				<TransactionDetail extra={<Avatar size="lg" address={senderAddress} />}>
					<div className="mb-2 text-sm font-semibold text-theme-neutral">
						<span className="mr-1">{t("TRANSACTION.SENDER")}</span>
						<Label color="warning">
							<span className="text-sm">{t("TRANSACTION.YOUR_ADDRESS")}</span>
						</Label>
					</div>
					<Address address={senderAddress} walletName={walletName} />
				</TransactionDetail>

				<TransactionDetail
					label={t("TRANSACTION.DELEGATE")}
					extra={<Avatar size="lg" address={delegate?.address()} />}
				>
					<Address address={delegate?.address()} walletName={delegate?.username()} />
				</TransactionDetail>

				<div className="my-4">
					<TotalAmountBox amount={BigNumber.ZERO} fee={BigNumber.make(fee)} />
				</div>
			</div>
		</section>
	);
};
