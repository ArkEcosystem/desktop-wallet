import { Contracts } from "@arkecosystem/platform-sdk";
import { Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { upperFirst } from "@arkecosystem/utils";
import { Address } from "app/components/Address";
import { Avatar } from "app/components/Avatar";
import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { Form, FormField, FormHelperText, FormLabel } from "app/components/Form";
import { Icon } from "app/components/Icon";
import { InputPassword } from "app/components/Input";
import { Label } from "app/components/Label";
import { Page, Section } from "app/components/Layout";
import { StepIndicator } from "app/components/StepIndicator";
import { TabPanel, Tabs } from "app/components/Tabs";
import { TransactionDetail } from "app/components/TransactionDetail";
import { useEnvironmentContext } from "app/contexts";
import { useActiveProfile, useActiveWallet } from "app/hooks/env";
import { InputFee } from "domains/transaction/components/InputFee";
import { TotalAmountBox } from "domains/transaction/components/TotalAmountBox";
import { TransactionSuccessful } from "domains/transaction/components/TransactionSuccessful";
import React, { useEffect, useMemo, useState } from "react";
import { useForm, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

export const FirstStep = ({
	delegate,
	profile,
	wallet,
}: {
	delegate: Contracts.WalletData;
	profile: Profile;
	wallet: ReadWriteWallet;
}) => {
	const { t } = useTranslation();
	const { getValues, setValue } = useFormContext();

	const [feeOptions, setFeeOptions] = useState({
		last: undefined,
		min: (0 * 1e8).toFixed(0),
		max: (100 * 1e8).toFixed(0),
		average: (14 * 1e8).toFixed(0),
	});

	const senderAddress = getValues("senderAddress");
	const fee = getValues("fee") || null;
	const coinName = wallet.coinId();
	const network = `${coinName} ${wallet.network().name()}`;
	const walletName = profile.wallets().findByAddress(senderAddress)?.alias();

	useEffect(() => {
		const loadFees = async () => {
			const senderWallet = profile.wallets().findByAddress(senderAddress);

			try {
				// TODO: sync fees in the background, like delegates
				const transferFees = (await senderWallet!.coin().fee().all(7))?.vote;

				setFeeOptions({
					last: undefined,
					min: transferFees.min,
					max: transferFees.max,
					average: transferFees.avg,
				});

				setValue("fee", transferFees.avg, true);
			} catch (error) {
				return;
			}
		};

		loadFees();
	}, [setFeeOptions, setValue, profile, senderAddress]);

	return (
		<section data-testid="SendVoteTransaction__step--first">
			<h1 className="mb-0">{t("TRANSACTION.PAGE_VOTE.FIRST_STEP.TITLE")}</h1>
			<div className="text-theme-neutral-dark">{t("TRANSACTION.PAGE_VOTE.FIRST_STEP.DESCRIPTION")}</div>

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

				<TransactionDetail extra={<Avatar size="lg" address={senderAddress} />}>
					<div className="mb-2 text-sm font-semibold text-theme-neutral">
						<span className="mr-1">{t("TRANSACTION.SENDER")}</span>
						<Label color="warning">
							<span className="text-sm">{t("TRANSACTION.YOUR_ADDRESS")}</span>
						</Label>
					</div>
					<Address address={senderAddress} walletName={walletName} />
				</TransactionDetail>

				<TransactionDetail
					label={t("TRANSACTION.DELEGATE")}
					extra={<Avatar size="lg" address={delegate?.address()} />}
				>
					<Address address={delegate ? delegate?.address() : ""} walletName={delegate?.username()} />
				</TransactionDetail>

				<TransactionDetail className="pt-6 pb-0">
					<FormField name="fee">
						<FormLabel label={t("TRANSACTION.TRANSACTION_FEE")} />
						<InputFee
							{...feeOptions}
							defaultValue={fee || 0}
							value={fee || 0}
							step={0.01}
							onChange={(value: any) => setValue("fee", value, true)}
						/>
					</FormField>
				</TransactionDetail>
			</div>
		</section>
	);
};

export const SecondStep = ({
	delegate,
	profile,
	wallet,
}: {
	delegate: Contracts.WalletData;
	profile: Profile;
	wallet: ReadWriteWallet;
}) => {
	const { t } = useTranslation();
	const { getValues, unregister } = useFormContext();

	const { fee, senderAddress } = getValues();
	const coinName = wallet.coinId();
	const network = `${coinName} ${wallet.network().name()}`;
	const walletName = profile.wallets().findByAddress(senderAddress)?.alias();

	useEffect(() => {
		unregister("mnemonic");
	}, [unregister]);

	return (
		<section data-testid="SendVoteTransaction__step--second">
			<div>
				<h1 className="mb-0">{t("TRANSACTION.PAGE_VOTE.SECOND_STEP.TITLE")}</h1>
				<p className="text-theme-neutral-dark">{t("TRANSACTION.PAGE_VOTE.SECOND_STEP.DESCRIPTION")}</p>
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

				<TransactionDetail extra={<Avatar size="lg" address={senderAddress} />}>
					<div className="mb-2 text-sm font-semibold text-theme-neutral">
						<span className="mr-1">{t("TRANSACTION.SENDER")}</span>
						<Label color="warning">
							<span className="text-sm">{t("TRANSACTION.YOUR_ADDRESS")}</span>
						</Label>
					</div>
					<Address address={senderAddress} walletName={walletName} />
				</TransactionDetail>

				<TransactionDetail
					label={t("TRANSACTION.DELEGATE")}
					extra={<Avatar size="lg" address={delegate?.address()} />}
				>
					<Address address={delegate?.address()} walletName={delegate?.username()} />
				</TransactionDetail>

				<div className="my-4">
					<TotalAmountBox amount={BigNumber.ZERO} fee={BigNumber.make(fee)} />
				</div>
			</div>
		</section>
	);
};

export const ThirdStep = () => {
	const { register } = useFormContext();
	const { t } = useTranslation();

	return (
		<section data-testid="SendVoteTransaction__step--third">
			<div>
				<h1 className="mb-0">{t("TRANSACTION.AUTHENTICATION_STEP.TITLE")}</h1>
				<div className="text-theme-neutral-dark">{t("TRANSACTION.AUTHENTICATION_STEP.DESCRIPTION")}</div>

				<div className="grid grid-flow-row">
					<FormField name="mnemonic" className="pt-8 pb-0">
						<FormLabel label={t("TRANSACTION.MNEMONIC")} />
						<InputPassword ref={register({ required: true })} />
						<FormHelperText />
					</FormField>
				</div>
			</div>
		</section>
	);
};

export const FourthStep = ({
	delegate,
	transaction,
	senderWallet,
}: {
	delegate: Contracts.WalletData;
	transaction: Contracts.SignedTransactionData;
	senderWallet: ReadWriteWallet;
}) => {
	const { t } = useTranslation();

	return (
		<TransactionSuccessful transaction={transaction} senderWallet={senderWallet}>
			<TransactionDetail
				label={t("TRANSACTION.DELEGATE")}
				extra={<Avatar size="lg" address={delegate?.address()} />}
			>
				<Address address={delegate?.address()} walletName={delegate?.username()} />
			</TransactionDetail>

			<TransactionDetail label={t("TRANSACTION.TRANSACTION_FEE")}>0.09660435 ARK</TransactionDetail>

			<TransactionDetail
				label={t("TRANSACTION.TRANSACTION_TYPE")}
				className="pb-0"
				extra={
					<div className="ml-1 text-theme-neutral-900">
						<Circle className="border-theme-neutral-900 bg-theme-background" size="lg">
							<Icon name="Voted" />
						</Circle>
					</div>
				}
			>
				{t("TRANSACTION.TRANSACTION_TYPES.VOTE")}
			</TransactionDetail>
		</TransactionSuccessful>
	);
};

export const SendVoteTransaction = () => {
	const { t } = useTranslation();
	const { voteId, senderId } = useParams();
	const { env } = useEnvironmentContext();
	const activeProfile = useActiveProfile();
	const activeWallet = useActiveWallet();
	const networks = useMemo(() => env.availableNetworks(), [env]);

	const [activeTab, setActiveTab] = useState(1);
	const [delegate, setDelegate] = useState<Contracts.WalletData>((null as unknown) as Contracts.WalletData);
	const [transaction, setTransaction] = useState((null as unknown) as Contracts.SignedTransactionData);

	const form = useForm({ mode: "onChange" });
	const { clearError, formState, getValues, register, setError, setValue } = form;

	useEffect(() => {
		register("network", { required: true });
		register("senderAddress", { required: true });
		register("vote", { required: true });
		register("fee", { required: true });

		setValue("senderAddress", senderId, true);
		setValue("vote", voteId, true);

		for (const network of networks) {
			if (network.coin() === activeWallet.coinId() && network.id() === activeWallet.networkId()) {
				setValue("network", network, true);

				break;
			}
		}
	}, [activeWallet, networks, register, senderId, setValue, voteId]);

	useEffect(() => {
		const loadDelegate = async () => {
			setDelegate(await activeWallet.client().delegate(voteId));
		};

		loadDelegate();
	}, [activeWallet, voteId]);

	const crumbs = [
		{
			route: `/profiles/${activeProfile.id()}/dashboard`,
			label: t("COMMON.GO_BACK_TO_PORTFOLIO"),
		},
	];

	const handleBack = () => {
		setActiveTab(activeTab - 1);
	};

	const handleNext = () => {
		setActiveTab(activeTab + 1);
	};

	const submitForm = async () => {
		clearError("mnemonic");
		const { fee, mnemonic, senderAddress } = getValues();
		const senderWallet = activeProfile.wallets().findByAddress(senderAddress);

		try {
			const transactionId = await senderWallet!.transaction().signVote({
				fee,
				from: senderAddress,
				sign: {
					mnemonic,
				},
				data: {
					vote: `+${delegate.publicKey()}`,
				},
			});

			await senderWallet!.transaction().broadcast(transactionId);

			await env.persist();

			setTransaction(senderWallet!.transaction().transaction(transactionId));

			handleNext();
		} catch (error) {
			console.error("Could not vote: ", error);

			setValue("mnemonic", "");
			setError("mnemonic", "manual", t("TRANSACTION.INVALID_MNEMONIC"));
		}
	};

	return (
		<Page profile={activeProfile} crumbs={crumbs}>
			<Section className="flex-1">
				<Form className="max-w-xl mx-auto" context={form} onSubmit={submitForm}>
					<Tabs activeId={activeTab}>
						<StepIndicator size={4} activeIndex={activeTab} />

						<div className="mt-8">
							<TabPanel tabId={1}>
								<FirstStep delegate={delegate} profile={activeProfile} wallet={activeWallet} />
							</TabPanel>
							<TabPanel tabId={2}>
								<SecondStep delegate={delegate} profile={activeProfile} wallet={activeWallet} />
							</TabPanel>
							<TabPanel tabId={3}>
								<ThirdStep />
							</TabPanel>
							<TabPanel tabId={4}>
								<FourthStep delegate={delegate} transaction={transaction} senderWallet={activeWallet} />
							</TabPanel>

							<div className="flex justify-end mt-8 space-x-3">
								{activeTab < 4 && (
									<>
										<Button
											disabled={activeTab === 1}
											variant="plain"
											onClick={handleBack}
											data-testid="SendVoteTransaction__button--back"
										>
											{t("COMMON.BACK")}
										</Button>

										{activeTab < 3 && (
											<Button
												disabled={!formState.isValid}
												onClick={handleNext}
												data-testid="SendVoteTransaction__button--continue"
											>
												{t("COMMON.CONTINUE")}
											</Button>
										)}

										{activeTab === 3 && (
											<Button
												type="submit"
												disabled={!formState.isValid}
												data-testid="SendVoteTransaction__button--submit"
											>
												{t("COMMON.SEND")}
											</Button>
										)}
									</>
								)}

								{activeTab === 4 && (
									<>
										<Button
											variant="plain"
											data-testid="SendVoteTransaction__button--back-to-wallet"
										>
											{t("COMMON.BACK_TO_WALLET")}
										</Button>
										<Button
											variant="plain"
											className="space-x-2"
											data-testid="SendVoteTransaction__button--copy"
										>
											<Icon name="Copy" />
											<span>{t("COMMON.COPY")}</span>
										</Button>
									</>
								)}
							</div>
						</div>
					</Tabs>
				</Form>
			</Section>
		</Page>
	);
};
