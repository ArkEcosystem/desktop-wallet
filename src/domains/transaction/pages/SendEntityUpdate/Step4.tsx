import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { Address } from "app/components/Address";
import { Avatar } from "app/components/Avatar";
import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { Form, FormField, FormLabel } from "app/components/Form";
import { Icon } from "app/components/Icon";
import { Input, InputPassword } from "app/components/Input";
import { Label } from "app/components/Label";
import { Page, Section } from "app/components/Layout";
import { StepIndicator } from "app/components/StepIndicator";
import { TabPanel, Tabs } from "app/components/Tabs";
import { TextArea } from "app/components/TextArea";
import { TransactionDetail } from "app/components/TransactionDetail";
import { useActiveProfile } from "app/hooks/env";
import { InputFee } from "domains/transaction/components/InputFee";
import { LedgerConfirmation } from "domains/transaction/components/LedgerConfirmation";
import { LinkCollection } from "domains/transaction/components/LinkCollection";
import { LinkList } from "domains/transaction/components/LinkList";
import { TotalAmountBox } from "domains/transaction/components/TotalAmountBox";
import { TransactionSuccessful } from "domains/transaction/components/TransactionSuccessful";
import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const FourthStep = () => {
	const { t } = useTranslation();

	return (
		<TransactionSuccessful>
			<TransactionDetail
				label={t("TRANSACTION.TRANSACTION_TYPE")}
				extra={
					<Circle className="border-black" size="lg">
						<Icon name="Business" width={20} height={20} />
					</Circle>
				}
			>
				Update Business
			</TransactionDetail>
			<TransactionDetail label={t("TRANSACTION.NAME")}>ROBank Eco</TransactionDetail>
			<TransactionDetail label={t("TRANSACTION.DESCRIPTION")}>Not a trustworthy bank</TransactionDetail>
			<TransactionDetail label={t("TRANSACTION.WEBSITE")}>
				<a href="http://robank.com" target="_blank" rel="noopener noreferrer" className="link">
					http://robank.com
				</a>
			</TransactionDetail>
			<TransactionDetail
				label={t("TRANSACTION.AMOUNT")}
				extra={
					<div className="ml-1 text-theme-danger">
						<Circle className="bg-theme-background border-theme-danger-light" size="lg">
							<Icon name="Sent" width={22} height={22} />
						</Circle>
					</div>
				}
			>
				1.09660435 ARK
			</TransactionDetail>
		</TransactionSuccessful>
	);
};
