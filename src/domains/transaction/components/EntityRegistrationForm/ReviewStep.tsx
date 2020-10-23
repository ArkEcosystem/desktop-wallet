import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { Circle } from "app/components/Circle";
import { Header } from "app/components/Header";
import { Icon } from "app/components/Icon";
import { Link } from "app/components/Link";
import { LinkList, ProviderEntityLink } from "domains/transaction/components/LinkList";
import { TotalAmountBox } from "domains/transaction/components/TotalAmountBox";
import {
	TransactionDetail,
	TransactionNetwork,
	TransactionSender,
} from "domains/transaction/components/TransactionDetail";
import { EntityProvider } from "domains/transaction/entity/providers";
import { evaluateFee } from "domains/transaction/utils";
import React, { useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { EntityLink } from "../LinkCollection/LinkCollection.models";

const entityProvider = new EntityProvider();

export const ReviewStep = ({ senderWallet }: { senderWallet: ReadWriteWallet }) => {
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
		<section data-testid="ReviewStep" className="space-y-8">
			<Header
				title={t("TRANSACTION.PAGE_REGISTRATION.THIRD_STEP.TITLE")}
				subtitle={t("TRANSACTION.PAGE_REGISTRATION.THIRD_STEP.DESCRIPTION")}
			/>

			<div>
				<TransactionNetwork network={senderWallet.network()} border={false} paddingPosition="bottom" />

				<TransactionSender
					address={senderWallet.address()}
					wallet={senderWallet}
					labelExtra={t("TRANSACTION.YOUR_ADDRESS")}
				/>

				{/* @TODO add TransactionType / TransactionEntityType component */}

				<TransactionDetail
					label={t("TRANSACTION.TRANSACTION_TYPE")}
					extra={
						<Circle className="border-theme-text" size="lg">
							<Icon name="Business" width={20} height={20} />
						</Circle>
					}
				>
					{t("TRANSACTION.TRANSACTION_TYPES.BUSINESS_ENTITY_REGISTRATION")}
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

				{ipfsData?.sourceControl?.length > 0 && (
					<TransactionDetail>
						<LinkList
							title={t("TRANSACTION.REPOSITORIES.TITLE")}
							description={t("TRANSACTION.REPOSITORIES.DESCRIPTION")}
							links={formatLinks(ipfsData.sourceControl)}
						/>
					</TransactionDetail>
				)}

				{ipfsData?.socialMedia?.length > 0 && (
					<TransactionDetail>
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

				<div className="mt-2">
					<TotalAmountBox fee={evaluateFee(fee)} ticker={senderWallet.currency()} />
				</div>
			</div>
		</section>
	);
};
