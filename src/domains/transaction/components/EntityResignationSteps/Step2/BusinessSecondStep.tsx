import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { upperFirst } from "@arkecosystem/utils";
import { Address } from "app/components/Address";
import { Avatar } from "app/components/Avatar";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import { Label } from "app/components/Label";
import { TransactionDetail } from "app/components/TransactionDetail";
import { TotalAmountBox } from "domains/transaction/components/TotalAmountBox";
import React from "react";
import { useTranslation } from "react-i18next";

// import { StepProps } from "./SendEntityResignation.models";

export const BusinessSecondStep = ({ entity, fee }: any) => {
	const { t } = useTranslation();
	const coinName = entity.wallet().manifest().get("name");
	const network = `${coinName} ${entity.wallet().network().name()}`;
	const { data }: any = entity?.asset();

	return (
		<div data-testid="SendEntityResignation__second-step">
			<div>
				<h1 className="mb-0">{t("TRANSACTION.PAGE_RESIGN_REGISTRATION.SECOND_STEP.TITLE")}</h1>
				<p className="text-theme-neutral-dark">
					{t("TRANSACTION.PAGE_RESIGN_REGISTRATION.SECOND_STEP.DESCRIPTION")}
				</p>
			</div>
			<div className="mt-4 grid grid-flow-row gap-2">
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

				<TransactionDetail extra={<Avatar size="lg" address={entity.sender()} />}>
					<div className="mb-2 text-sm font-semibold text-theme-neutral">
						<span className="mr-1">{t("TRANSACTION.SENDER")}</span>
						<Label color="warning">
							<span className="text-sm">{t("TRANSACTION.YOUR_ADDRESS")}</span>
						</Label>
					</div>
					<Address address={entity.sender()} walletName={entity.wallet().alias()} />
				</TransactionDetail>

				<TransactionDetail label={t("TRANSACTION.PAGE_RESIGN_REGISTRATION.BUSINESS_NAME")}>
					{data?.name}
				</TransactionDetail>

				<div className="my-4">
					<TotalAmountBox amount={BigNumber.ZERO} fee={BigNumber.make(fee.static)} />
				</div>
			</div>
		</div>
	);
};
