import { Contracts } from "@arkecosystem/platform-sdk";
import { Profile, ReadOnlyWallet, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { upperFirst } from "@arkecosystem/utils";
import { Address } from "app/components/Address";
import { Avatar } from "app/components/Avatar";
import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { Form, FormField, FormHelperText, FormLabel } from "app/components/Form";
import { Icon } from "app/components/Icon";
import { InputPassword } from "app/components/Input";
import { Label } from "app/components/Label";
import { Page, Section } from "app/components/Layout";
import { StepIndicator } from "app/components/StepIndicator";
import { TabPanel, Tabs } from "app/components/Tabs";
import { TransactionDetail } from "app/components/TransactionDetail";
import { useEnvironmentContext } from "app/contexts";
import { useActiveProfile, useActiveWallet } from "app/hooks/env";
import { InputFee } from "domains/transaction/components/InputFee";
import { TotalAmountBox } from "domains/transaction/components/TotalAmountBox";
import { TransactionSuccessful } from "domains/transaction/components/TransactionSuccessful";
import React, { useEffect, useMemo, useState } from "react";
import { useForm, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

export const FirstStep = ({
	delegate,
	profile,
	wallet,
}: {
	delegate: ReadOnlyWallet;
	profile: Profile;
	wallet: ReadWriteWallet;
}) => {
	const { env } = useEnvironmentContext();
	const { t } = useTranslation();
	const { getValues, setValue } = useFormContext();

	const [feeOptions, setFeeOptions] = useState({
		last: undefined,
		min: (0 * 1e8).toFixed(0),
		max: (100 * 1e8).toFixed(0),
		average: (14 * 1e8).toFixed(0),
	});

	const senderAddress = getValues("senderAddress");
	const fee = getValues("fee") || null;
	const coinName = wallet.coinId();
	const network = `${coinName} ${wallet.network().name()}`;
	const walletName = profile.wallets().findByAddress(senderAddress)?.alias();

	useEffect(() => {
		const senderWallet = profile.wallets().findByAddress(senderAddress);

		if (senderWallet) {
			const transactionFees = env.fees().findByType(senderWallet.coinId(), senderWallet.networkId(), "vote");

			setFeeOptions({
				last: undefined,
				min: transactionFees.min,
				max: transactionFees.max,
				average: transactionFees.avg,
			});

			setValue("fee", transactionFees.avg, true);
		}
	}, [env, setFeeOptions, setValue, profile, senderAddress]);

	return (
		<section data-testid="SendVote__step--first">
			<h1 className="mb-0">{t("TRANSACTION.PAGE_VOTE.FIRST_STEP.TITLE")}</h1>
			<div className="text-theme-neutral-dark">{t("TRANSACTION.PAGE_VOTE.FIRST_STEP.DESCRIPTION")}</div>

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
					<Address address={delegate ? delegate?.address() : ""} walletName={delegate?.username()} />
				</TransactionDetail>

				<TransactionDetail className="pt-6 pb-0">
					<FormField name="fee">
						<FormLabel label={t("TRANSACTION.TRANSACTION_FEE")} />
						<InputFee
							{...feeOptions}
							defaultValue={fee || 0}
							value={fee || 0}
							step={0.01}
							onChange={(value: any) => setValue("fee", value, true)}
						/>
					</FormField>
				</TransactionDetail>
			</div>
		</section>
	);
};
