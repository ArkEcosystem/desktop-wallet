import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { Header } from "app/components/Header";
import { TotalAmountBox } from "domains/transaction/components/TotalAmountBox";
import {
	TransactionDetail,
	TransactionNetwork,
	TransactionSender,
} from "domains/transaction/components/TransactionDetail";
import React from "react";
import { useTranslation } from "react-i18next";

import { EntityResignationStepProps } from "./EntityResignationSteps.models";

export const ReviewStep = ({ entity, fees }: EntityResignationStepProps) => {
	const { t } = useTranslation();

	const { data }: any = entity.data().asset();

	return (
		<section data-testid="SendEntityResignation__review-step" className="space-y-8">
			<Header
				title={t("TRANSACTION.PAGE_RESIGN_REGISTRATION.SECOND_STEP.TITLE")}
				subtitle={t("TRANSACTION.PAGE_RESIGN_REGISTRATION.SECOND_STEP.DESCRIPTION")}
			/>

			<div>
				<TransactionNetwork network={entity.wallet().network()} border={false} paddingPosition="bottom" />

				<TransactionSender
					address={entity.wallet().address()}
					wallet={entity.wallet()}
					labelExtra={t("TRANSACTION.YOUR_ADDRESS")}
				/>

				<TransactionDetail label={t("TRANSACTION.PAGE_RESIGN_REGISTRATION.ENTITY_NAME")}>
					{data.name}
				</TransactionDetail>

				<div className="mt-2">
					<TotalAmountBox fee={BigNumber.make(fees.static)} ticker={entity.wallet().currency()} />
				</div>
			</div>
		</section>
	);
};
