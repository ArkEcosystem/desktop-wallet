import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { Address } from "app/components/Address";
import { Avatar } from "app/components/Avatar";
import { Circle } from "app/components/Circle";
import { FormField, FormLabel } from "app/components/Form";
import { Icon } from "app/components/Icon";
import { Input } from "app/components/Input";
import { Label } from "app/components/Label";
import { Link } from "app/components/Link";
import { TabPanel, Tabs } from "app/components/Tabs";
import { TextArea } from "app/components/TextArea";
import { TransactionDetail } from "app/components/TransactionDetail";
import { NetworkIcon } from "domains/network/components/NetworkIcon";
import { InputFee } from "domains/transaction/components/InputFee";
import { LinkCollection } from "domains/transaction/components/LinkCollection";
import { LinkList } from "domains/transaction/components/LinkList";
import { TotalAmountBox } from "domains/transaction/components/TotalAmountBox";
import {
	RegistrationComponent,
	RegistrationForm,
	RegistrationTransactionDetailsOptions,
} from "domains/transaction/pages/Registration/Registration.models";
import React, { useCallback, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { EntityLink } from "../LinkCollection/LinkCollection.models";

const SecondStep = ({ feeOptions }: { feeOptions: Record<string, any> }) => {
	const { t } = useTranslation();
	const { register, setValue, getValues } = useFormContext();
	const { fee } = getValues();

	useEffect(() => {
		register("ipfsData.sourceControl");
		register("ipfsData.socialMedia");
	}, [register]);

	const handleMedia = useCallback(
		(links: EntityLink[]) => {
			// TODO: Filter image and video provider
			const images = links.filter((item) => item);
			const videos = links.filter((item) => item);

			setValue("ipfsData.images", images);
			setValue("ipfsData.videos", videos);
		},
		[setValue],
	);

	return (
		<div data-testid="BusinessRegistrationForm__step--second">
			<h1 className="mb-0">{t("TRANSACTION.PAGE_REGISTRATION.SECOND_STEP.TITLE")}</h1>
			<div className="text-theme-neutral-dark">{t("TRANSACTION.PAGE_REGISTRATION.SECOND_STEP.DESCRIPTION")}</div>

			<div>
				<div className="pb-8 mt-8">
					<FormField name="ipfsData.meta.displayName" className="font-normal">
						<FormLabel>{t("TRANSACTION.NAME")}</FormLabel>
						<Input
							data-testid="BusinessRegistrationForm__name"
							type="text"
							ref={register({ required: true })}
						/>
					</FormField>

					<FormField name="ipfsData.meta.description" className="mt-8 font-normal">
						<FormLabel>{t("TRANSACTION.DESCRIPTION")}</FormLabel>
						<TextArea data-testid="BusinessRegistrationForm__description" ref={register} />
					</FormField>

					<FormField name="ipfsData.meta.website" className="mt-8 font-normal">
						<FormLabel>{t("TRANSACTION.WEBSITE")}</FormLabel>
						<Input data-testid="BusinessRegistrationForm__website" type="text" ref={register} />
					</FormField>
				</div>

				<TransactionDetail className="pb-8">
					<LinkCollection
						title={t("TRANSACTION.REPOSITORIES.TITLE")}
						description={t("TRANSACTION.REPOSITORIES.DESCRIPTION")}
						types={[
							{ label: "BitBucket", value: "bitbucket" },
							{ label: "GitHub", value: "github" },
							{ label: "GitLab", value: "gitlab" },
						]}
						typeName="repository"
						onChange={(links) => setValue("ipfsData.sourceControl", links, true)}
					/>
				</TransactionDetail>

				<TransactionDetail className="pb-8">
					<LinkCollection
						title={t("TRANSACTION.SOCIAL_MEDIA.TITLE")}
						description={t("TRANSACTION.SOCIAL_MEDIA.DESCRIPTION")}
						types={[
							{ label: "Facebook", value: "facebook" },
							{ label: "Twitter", value: "twitter" },
							{ label: "LinkedIn", value: "linkedin" },
						]}
						typeName="media"
						onChange={(links) => setValue("ipfsData.socialMedia", links, true)}
					/>
				</TransactionDetail>

				<TransactionDetail className="pb-8">
					<LinkCollection
						title={t("TRANSACTION.PHOTO_VIDEO.TITLE")}
						description={t("TRANSACTION.PHOTO_VIDEO.DESCRIPTION")}
						types={[
							{ label: "YouTube", value: "youtube" },
							{ label: "Vimeo", value: "vimeo" },
							{ label: "Flickr", value: "flickr" },
						]}
						typeName="files"
						selectionTypes={["flickr"]}
						selectionTypeTitle="Avatar"
						onChange={handleMedia}
					/>
				</TransactionDetail>

				<TransactionDetail className="pt-6 pb-0">
					<FormField name="fee">
						<FormLabel>{t("TRANSACTION.TRANSACTION_FEE")}</FormLabel>
						<InputFee
							{...(feeOptions as any)}
							defaultValue={fee || 0}
							value={fee || 0}
							step={0.01}
							onChange={(value) => setValue("fee", value, true)}
						/>
					</FormField>
				</TransactionDetail>
			</div>
		</div>
	);
};

const ThirdStep = ({ wallet }: { wallet: ReadWriteWallet }) => {
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

const component = ({ activeTab, wallet, feeOptions }: RegistrationComponent) => (
	<Tabs activeId={activeTab}>
		<TabPanel tabId={2}>
			<SecondStep feeOptions={feeOptions} />
		</TabPanel>
		<TabPanel tabId={3}>
			<ThirdStep wallet={wallet} />
		</TabPanel>
	</Tabs>
);

const transactionDetails = ({ translations }: RegistrationTransactionDetailsOptions) => (
	<>
		<TransactionDetail
			label={translations("TRANSACTION.TRANSACTION_TYPE")}
			extra={
				<Circle className="border-black" size="lg">
					<Icon name="Business" width={20} height={20} />
				</Circle>
			}
		>
			Business Registration
		</TransactionDetail>
		<TransactionDetail label={translations("TRANSACTION.NAME")}>ROBank Eco</TransactionDetail>
		<TransactionDetail label={translations("TRANSACTION.DESCRIPTION")}>Not a trustworthy bank</TransactionDetail>
		<TransactionDetail label={translations("TRANSACTION.WEBSITE")}>
			<a href="http://robank.com" target="_blank" rel="noopener noreferrer" className="link">
				http://robank.com
			</a>
		</TransactionDetail>
	</>
);

component.displayName = "BusinessRegistrationForm";
transactionDetails.displayName = "BusinessRegistrationFormTransactionDetails";

export const BusinessRegistrationForm: RegistrationForm = {
	tabSteps: 2,
	component,
	transactionDetails,
	formFields: ["ipfsData"],

	// eslint-disable-next-line @typescript-eslint/require-await
	signTransaction: async ({ handleNext, form, setTransaction, profile, env, translations }) => {
		const { getValues, setValue, setError } = form;
		const { fee, ipfsData, mnemonic, senderAddress } = getValues({ nest: true });

		try {
			const senderWallet = profile.wallets().findByAddress(senderAddress);
			// TODO: Hash ipfs data
			// const hash = ipfsData
			const hash = "abc";
			const transactionId = await senderWallet!
				.transaction()
				.signIpfs({ fee, from: senderAddress, sign: { mnemonic }, data: { hash } });

			await senderWallet!.transaction().broadcast(transactionId);

			await env.persist();
			handleNext();
		} catch (error) {
			console.error("Could not create transaction: ", error);

			setValue("mnemonic", "");
			setError("mnemonic", "manual", translations("TRANSACTION.INVALID_MNEMONIC"));
		}
	},
};
