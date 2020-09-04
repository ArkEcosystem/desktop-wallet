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

export const FourthStep = ({
	delegate,
	transaction,
	senderWallet,
}: {
	delegate: ReadOnlyWallet;
	transaction: Contracts.SignedTransactionData;
	senderWallet: ReadWriteWallet;
}) => {
	const { t } = useTranslation();

	return (
		<TransactionSuccessful transaction={transaction} senderWallet={senderWallet}>
			<TransactionDetail
				label={t("TRANSACTION.DELEGATE")}
				extra={<Avatar size="lg" address={delegate?.address()} />}
			>
				<Address address={delegate?.address()} walletName={delegate?.username()} />
			</TransactionDetail>

			<TransactionDetail label={t("TRANSACTION.TRANSACTION_FEE")}>0.09660435 ARK</TransactionDetail>

			<TransactionDetail
				label={t("TRANSACTION.TRANSACTION_TYPE")}
				className="pb-0"
				extra={
					<div className="ml-1 text-theme-neutral-900">
						<Circle className="border-theme-neutral-900 bg-theme-background" size="lg">
							<Icon name="Voted" />
						</Circle>
					</div>
				}
			>
				{t("TRANSACTION.TRANSACTION_TYPES.VOTE")}
			</TransactionDetail>
		</TransactionSuccessful>
	);
};
