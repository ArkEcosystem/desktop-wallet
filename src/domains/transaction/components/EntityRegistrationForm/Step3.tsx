import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { Address } from "app/components/Address";
import { Avatar } from "app/components/Avatar";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import { Label } from "app/components/Label";
import { Link } from "app/components/Link";
import { TransactionDetail } from "app/components/TransactionDetail";
import { NetworkIcon } from "domains/network/components/NetworkIcon";
import { LinkList } from "domains/transaction/components/LinkList";
import { TotalAmountBox } from "domains/transaction/components/TotalAmountBox";
import React from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const ReviewStep = ({ wallet }: { wallet: ReadWriteWallet }) => {
	const { t } = useTranslation();
	const { getValues } = useFormContext();
	const { ipfsData, fee } = getValues({ nest: true });

	return (
		<div data-testid="BusinessRegistrationForm__step--third">
			<h1 className="mb-0">{t("TRANSACTION.PAGE_REGISTRATION.THIRD_STEP.TITLE")}</h1>
			<div className="text-theme-neutral-dark">{t("TRANSACTION.PAGE_REGISTRATION.THIRD_STEP.DESCRIPTION")}</div>
			<div className="mt-4">
				<TransactionDetail
					border={false}
					label={t("TRANSACTION.NETWORK")}
					extra={<NetworkIcon coin={wallet.coinId()} network={wallet.networkId()} />}
				>
					<div className="flex-auto font-semibold truncate text-theme-neutral-800 max-w-24">
						{wallet.network().name()}
					</div>
				</TransactionDetail>

				<TransactionDetail extra={<Avatar size="lg" address={wallet.address()} />} className="pt-4">
					<div className="mb-2 text-sm font-semibold text-theme-neutral">
						<span className="mr-1">{t("TRANSACTION.SENDER")}</span>
						<Label color="warning">
							<span className="text-sm">{t("TRANSACTION.YOUR_ADDRESS")}</span>
						</Label>
					</div>
					<Address address={wallet.address()} walletName={wallet.alias()} />
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
					Business Registration
				</TransactionDetail>

				{ipfsData?.meta?.displayName && (
					<TransactionDetail label={t("TRANSACTION.NAME")}>{ipfsData?.meta?.displayName}</TransactionDetail>
				)}

				{ipfsData?.meta?.description && (
					<TransactionDetail label={t("TRANSACTION.DESCRIPTION")}>
						{ipfsData.meta.description}
					</TransactionDetail>
				)}

				{ipfsData?.meta?.website && (
					<TransactionDetail label={t("TRANSACTION.WEBSITE")}>
						<Link to={ipfsData.meta.website} isExternal>
							{ipfsData.meta.website}
						</Link>
					</TransactionDetail>
				)}

				{ipfsData?.sourceControl && (
					<TransactionDetail className="mb-2">
						<LinkList
							title={t("TRANSACTION.REPOSITORIES.TITLE")}
							description={t("TRANSACTION.REPOSITORIES.DESCRIPTION")}
							links={ipfsData.sourceControl}
						/>
					</TransactionDetail>
				)}

				{ipfsData?.socialMedia && (
					<TransactionDetail className="mb-2">
						<LinkList
							title={t("TRANSACTION.SOCIAL_MEDIA.TITLE")}
							description={t("TRANSACTION.SOCIAL_MEDIA.DESCRIPTION")}
							links={ipfsData.socialMedia}
						/>
					</TransactionDetail>
				)}

				{(ipfsData?.images || ipfsData?.videos) && (
					<TransactionDetail className="mb-2">
						<LinkList
							title={t("TRANSACTION.PHOTO_VIDEO.TITLE")}
							description={t("TRANSACTION.PHOTO_VIDEO.DESCRIPTION")}
							links={[...(ipfsData.images || []), ...(ipfsData.videos || [])]}
						/>
					</TransactionDetail>
				)}

				<div>
					<TotalAmountBox amount={BigNumber.ZERO} fee={BigNumber.make(fee)} />
				</div>
			</div>
		</div>
	);
};
