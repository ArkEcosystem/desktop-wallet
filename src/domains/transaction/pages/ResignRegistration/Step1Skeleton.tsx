import { Address } from "app/components/Address";
import { Alert } from "app/components/Alert";
import { Avatar } from "app/components/Avatar";
import { FormField, FormLabel } from "app/components/Form";
import { Label } from "app/components/Label";
import { TransactionDetail } from "app/components/TransactionDetail";
import React from "react";
import { useTranslation } from "react-i18next";
import Skeleton from "react-loading-skeleton";

import { SkeletonProps } from "./ResignRegistration.models";

export const FirstStepSkeleton = ({ wallet }: SkeletonProps) => {
	const { t } = useTranslation();

	return (
		<div data-testid="ResignRegistration__skeleton">
			<h1 className="mb-0">{t("TRANSACTION.PAGE_RESIGN_REGISTRATION.FIRST_STEP.DELEGATE.TITLE")}</h1>
			<div className="text-theme-neutral-dark">
				{t("TRANSACTION.PAGE_RESIGN_REGISTRATION.FIRST_STEP.DELEGATE.DESCRIPTION")}
			</div>

			<div className="mt-6">
				<Alert size="lg">{t("TRANSACTION.PAGE_RESIGN_REGISTRATION.FIRST_STEP.DELEGATE.WARNING")}</Alert>
			</div>

			<div>
				<TransactionDetail extra={<Avatar size="lg" address={wallet.address()} />} border={false}>
					<div className="mb-2 text-sm font-semibold text-theme-neutral">
						<span className="mr-1">{t("TRANSACTION.SENDER")}</span>
						<Label color="warning">
							<span className="text-sm">{t("TRANSACTION.YOUR_ADDRESS")}</span>
						</Label>
					</div>
					<Address address={wallet.address()} walletName={wallet.alias()} />
				</TransactionDetail>

				<TransactionDetail label={t("TRANSACTION.DELEGATE_NAME")}>
					<Skeleton height={6} width={120} className="block" />
				</TransactionDetail>

				<TransactionDetail className="pt-6 pb-0">
					<FormField name="name" className="font-normal">
						<FormLabel>{t("TRANSACTION.TRANSACTION_FEE")}</FormLabel>
						<Skeleton height={48} width="78%" />
						<Skeleton height={48} width="20%" className="ml-2" />
					</FormField>
				</TransactionDetail>
			</div>
			<div className="flex justify-end mt-8 space-x-3">
				<Skeleton width={70} height={44} className="block" />
				<Skeleton width={70} height={44} className="block" />
			</div>
		</div>
	);
};
