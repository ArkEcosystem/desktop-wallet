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
import { EntityProvider } from "domains/transaction/entity/providers";
import {
	RegistrationComponent,
	RegistrationForm,
	RegistrationTransactionDetailsOptions,
} from "domains/transaction/pages/Registration/Registration.models";
import React, { useCallback, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { EntityLink } from "../LinkCollection/LinkCollection.models";

const entityProvider = new EntityProvider();

const SecondStep = ({ feeOptions }: { feeOptions: Record<string, any> }) => {
	const { t } = useTranslation();
	const { register, setValue, getValues } = useFormContext();
	const { fee } = getValues();

	useEffect(() => {
		register("ipfsData.sourceControl");
		register("ipfsData.socialMedia");
		register("ipfsData.images");
		register("ipfsData.videos");
	}, [register]);

	const handleSourceControl = useCallback(
		(links: EntityLink[]) => {
			setValue("ipfsData.sourceControl", links, true);
		},
		[setValue],
	);

	const handleSocialMedia = useCallback(
		(links: EntityLink[]) => {
			setValue("ipfsData.socialMedia", links, true);
		},
		[setValue],
	);

	const handleMedia = useCallback(
		(links: EntityLink[]) => {
			// Image and video are separates tags in ipfsData
			// But in design they are handled together
			// Also, the link `type` should be an image | video | logo instead of provider id

			const imagesProviderIds = entityProvider.images().map((item) => item.id);

			const images = links.filter((link) => imagesProviderIds.includes(link.type));
			const videos = links.filter((link) => !imagesProviderIds.includes(link.type));

			if (images.length) {
				setValue(
					"ipfsData.images",
					images.map((item) => ({ ...item, type: "image" })),
				);
			}

			if (videos.length) {
				setValue(
					"ipfsData.videos",
					videos.map((item) => ({ ...item, type: "video" })),
				);
			}
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
						types={entityProvider
							.sourceControl()
							.map(({ displayName: label, id: value, validate }) => ({ label, value, validate }))}
						typeName="repository"
						onChange={handleSourceControl}
					/>
				</TransactionDetail>

				<TransactionDetail className="pb-8">
					<LinkCollection
						title={t("TRANSACTION.SOCIAL_MEDIA.TITLE")}
						description={t("TRANSACTION.SOCIAL_MEDIA.DESCRIPTION")}
						types={entityProvider
							.socialMedia()
							.map(({ displayName: label, id: value, validate }) => ({ label, value, validate }))}
						typeName="media"
						onChange={handleSocialMedia}
					/>
				</TransactionDetail>

				<TransactionDetail className="pb-8">
					<LinkCollection
						title={t("TRANSACTION.PHOTO_VIDEO.TITLE")}
						description={t("TRANSACTION.PHOTO_VIDEO.DESCRIPTION")}
						types={entityProvider
							.media()
							.map(({ displayName: label, id: value, validate }) => ({ label, value, validate }))}
						typeName="files"
						selectionTypes={entityProvider.images().map((item) => item.id)}
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

const transactionDetails = ({ translations, transaction }: RegistrationTransactionDetailsOptions) => (
	<>
		<TransactionDetail label={translations("TRANSACTION.NAME")}>
			{transaction?.data().asset.ipfsData.meta.displayName}
		</TransactionDetail>
		<TransactionDetail label={translations("TRANSACTION.DESCRIPTION")}>
			{transaction?.data().asset.ipfsData.meta.description}
		</TransactionDetail>
		<TransactionDetail label={translations("TRANSACTION.WEBSITE")}>
			<Link to={transaction?.data().asset.ipfsData.meta.website} isExternal>
				{transaction?.data().asset.ipfsData.meta.website}
			</Link>
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
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
