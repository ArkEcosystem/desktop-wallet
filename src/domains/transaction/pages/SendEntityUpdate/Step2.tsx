import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { Address } from "app/components/Address";
import { Avatar } from "app/components/Avatar";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import { Label } from "app/components/Label";
import { TransactionDetail } from "app/components/TransactionDetail";
import { LinkList } from "domains/transaction/components/LinkList";
import { TotalAmountBox } from "domains/transaction/components/TotalAmountBox";
import React from "react";
import { useTranslation } from "react-i18next";

export const SecondStep = () => {
	const { t } = useTranslation();

	const links = [
		{
			displayName: "GitHub",
			value: "http://github.com/robank",
			type: "github",
		},
		{
			displayName: "GitLab",
			value: "http://gitlab.com/robank",
			type: "gitlab",
		},
		{
			displayName: "BitBucket",
			value: "http://bitbucket.com/robank",
			type: "bitbucket",
		},
		{
			displayName: "NPM",
			value: "http://npmjs.com/robank",
			type: "npm",
		},
	];

	return (
		<div data-testid="SendEntityUpdate__second-step">
			<div>
				<h1 className="mb-0">{t("TRANSACTION.PAGE_UPDATE_REGISTRATION.SECOND_STEP.TITLE")}</h1>
				<p className="text-theme-neutral-dark">
					{t("TRANSACTION.PAGE_UPDATE_REGISTRATION.SECOND_STEP.DESCRIPTION")}
				</p>
			</div>
			<div className="grid grid-flow-row mt-4">
				<TransactionDetail
					border={false}
					label={t("TRANSACTION.NETWORK")}
					extra={
						<div className="ml-1 text-theme-danger">
							<Circle className="bg-theme-background border-theme-danger-light" size="lg">
								<Icon name="ARK" width={20} height={20} />
							</Circle>
						</div>
					}
				>
					<div className="flex-auto font-semibold truncate text-theme-neutral-800 max-w-24">
						ARK Ecosystem
					</div>
				</TransactionDetail>

				<TransactionDetail
					extra={<Avatar size="lg" address="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" />}
					className="pt-4"
				>
					<div className="mb-2 text-sm font-semibold text-theme-neutral">
						<span className="mr-1">{t("TRANSACTION.SENDER")}</span>
						<Label color="warning">
							<span className="text-sm">{t("TRANSACTION.YOUR_ADDRESS")}</span>
						</Label>
					</div>
					<Address address="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" walletName={"ROBank"} />
				</TransactionDetail>

				<TransactionDetail
					label={t("TRANSACTION.TYPE")}
					extra={
						<div>
							<Circle className="border-black bg-theme-background" size="lg">
								<Icon name="Business" width={20} height={20} />
							</Circle>
						</div>
					}
				>
					{t("TRANSACTION.TRANSACTION_TYPES.BUSINESS_UPDATE")}
				</TransactionDetail>

				<TransactionDetail label={t("TRANSACTION.NAME")}>ROBank Eco</TransactionDetail>

				<TransactionDetail label={t("TRANSACTION.DESCRIPTION")}>Not a trustworthy bank</TransactionDetail>

				<TransactionDetail label={t("TRANSACTION.WEBSITE")}>
					<a href="https://ark.io" target="_blank" rel="noopener noreferrer" className="link">
						https://ark.io
					</a>
				</TransactionDetail>

				<TransactionDetail className="pb-8">
					<LinkList
						title={t("TRANSACTION.REPOSITORIES.TITLE")}
						description={t("TRANSACTION.REPOSITORIES.DESCRIPTION")}
						links={links}
					/>
				</TransactionDetail>

				<div className="my-4">
					<TotalAmountBox amount={BigNumber.ZERO} fee={BigNumber.ZERO} />
				</div>
			</div>
		</div>
	);
};
