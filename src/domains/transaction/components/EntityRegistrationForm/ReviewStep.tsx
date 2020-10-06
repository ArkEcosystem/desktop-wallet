import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { Address } from "app/components/Address";
import { Avatar } from "app/components/Avatar";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import { Label } from "app/components/Label";
import { Link } from "app/components/Link";
import { NetworkIcon } from "domains/network/components/NetworkIcon";
import { LinkList, ProviderEntityLink } from "domains/transaction/components/LinkList";
import { TotalAmountBox } from "domains/transaction/components/TotalAmountBox";
import { TransactionDetail } from "domains/transaction/components/TransactionDetail";
import { EntityProvider } from "domains/transaction/entity/providers";
import { evaluateFee } from "domains/transaction/utils";
import React, { useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { EntityLink } from "../LinkCollection/LinkCollection.models";

const entityProvider = new EntityProvider();

export const ReviewStep = ({ wallet }: { wallet: ReadWriteWallet }) => {
	const { t } = useTranslation();

	const { getValues, watch } = useFormContext();
	const { fee } = getValues();

	// getValues does not get the value of `defaultValues` on first render
	const [defaultIpfsData] = useState(() => watch("ipfsData"));
	const ipfsData = getValues("ipfsData") || defaultIpfsData;

	const formatLinks = (links: EntityLink[]) =>
		links.map((link) => {
			const provider = entityProvider.findById(link.type);
			return { displayName: provider!.displayName, ...link };
		});

	const mediaLinks = useMemo(() => {
		const images = ipfsData.images || [];
		const videos = ipfsData.videos || [];

		return [...images, ...videos]
			.map((link: EntityLink) => {
				const provider = entityProvider.findByDomain(link.value);
				if (!provider) {
					return undefined;
				}
				return { displayName: provider.displayName, ...link };
			})
			.filter(Boolean);
	}, [ipfsData]);

	return (
		<div data-testid="ReviewStep">
			<h1 className="mb-0">{t("TRANSACTION.PAGE_REGISTRATION.THIRD_STEP.TITLE")}</h1>
			<div className="text-theme-neutral-dark">{t("TRANSACTION.PAGE_REGISTRATION.THIRD_STEP.DESCRIPTION")}</div>
			<div className="mt-4">
				<TransactionDetail
					border={false}
					label={t("TRANSACTION.CRYPTOASSET")}
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
					{t("TRANSACTION.TRANSACTION_TYPES.BUSINESS_REGISTRATION")}
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
							links={formatLinks(ipfsData.sourceControl)}
						/>
					</TransactionDetail>
				)}

				{ipfsData?.socialMedia && (
					<TransactionDetail className="mb-2">
						<LinkList
							title={t("TRANSACTION.SOCIAL_MEDIA.TITLE")}
							description={t("TRANSACTION.SOCIAL_MEDIA.DESCRIPTION")}
							links={formatLinks(ipfsData.socialMedia)}
						/>
					</TransactionDetail>
				)}

				{mediaLinks.length > 0 && (
					<TransactionDetail className="mb-2">
						<LinkList
							title={t("TRANSACTION.PHOTO_VIDEO.TITLE")}
							description={t("TRANSACTION.PHOTO_VIDEO.DESCRIPTION")}
							links={mediaLinks as ProviderEntityLink[]}
						/>
					</TransactionDetail>
				)}

				<div>
					<TotalAmountBox fee={evaluateFee(fee)} ticker={wallet.currency()} />
				</div>
			</div>
		</div>
	);
};
