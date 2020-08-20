import { Contracts } from "@arkecosystem/platform-sdk";
import { NetworkData, Profile, Wallet } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { upperFirst } from "@arkecosystem/utils";
import { Address } from "app/components/Address";
import { Avatar } from "app/components/Avatar";
import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { Form, FormField, FormHelperText, FormLabel } from "app/components/Form";
import { Icon } from "app/components/Icon";
import { Input, InputGroup, InputPassword } from "app/components/Input";
import { Label } from "app/components/Label";
import { Page, Section } from "app/components/Layout";
import { StepIndicator } from "app/components/StepIndicator";
import { TabPanel, Tabs } from "app/components/Tabs";
import { TransactionDetail } from "app/components/TransactionDetail";
import { useEnvironmentContext } from "app/contexts";
import { useClipboard } from "app/hooks";
import { useActiveProfile, useActiveWallet } from "app/hooks/env";
import { SendTransactionForm } from "domains/transaction/components/SendTransactionForm";
import { TotalAmountBox } from "domains/transaction/components/TotalAmountBox";
import { TransactionSuccessful } from "domains/transaction/components/TransactionSuccessful";
import React, { useEffect, useMemo, useState } from "react";
import { useForm, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

export const FirstStep = ({ networks, profile }: { networks: NetworkData[]; profile: Profile }) => {
	const { t } = useTranslation();
	const { getValues, setValue } = useFormContext();
	const { hash } = getValues();

	return (
		<section data-testid="SendIPFSTransaction__step--first">
			<div>
				<h1 className="mb-0">{t("TRANSACTION.PAGE_IPFS.FIRST_STEP.TITLE")}</h1>
				<div className="text-theme-neutral-dark">{t("TRANSACTION.PAGE_IPFS.FIRST_STEP.DESCRIPTION")}</div>
			</div>
			<div className="mt-8">
				<SendTransactionForm networks={networks} profile={profile}>
					<>
						<FormField name="hash" className="relative mt-1">
							<div className="mb-2">
								<FormLabel label={t("TRANSACTION.IPFS_HASH")} />
							</div>
							<InputGroup>
								<Input
									data-testid="Input__hash"
									type="text"
									placeholder=" "
									className="pr-20"
									defaultValue={hash}
									onChange={(event: any) => setValue("hash", event.target.value, true)}
								/>
							</InputGroup>
						</FormField>
					</>
				</SendTransactionForm>
			</div>
		</section>
	);
};

export const SecondStep = ({ wallet }: { wallet: Wallet }) => {
	const { t } = useTranslation();
	const { getValues, unregister } = useFormContext();
	const { fee, hash } = getValues();
	const coinName = wallet.manifest().get<string>("name");

	useEffect(() => {
		unregister("mnemonic");
	}, [unregister]);

	return (
		<section data-testid="SendIPFSTransaction__step--second">
			<h1 className="mb-0">{t("TRANSACTION.PAGE_IPFS.SECOND_STEP.TITLE")}</h1>
			<div className="text-theme-neutral-dark">{t("TRANSACTION.PAGE_IPFS.SECOND_STEP.DESCRIPTION")}</div>

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
						{wallet.network().name}
					</div>
				</TransactionDetail>

				<TransactionDetail extra={<Avatar size="lg" address="ABUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" />}>
					<div className="mb-2 font-semibold text-theme-neutral">
						<span className="mr-1 text-sm">Sender</span>
						<Label color="warning">
							<span className="text-sm">{t("TRANSACTION.YOUR_ADDRESS")}</span>
						</Label>
					</div>
					<Address address={wallet.address()} walletName={wallet.alias()} />
				</TransactionDetail>

				<TransactionDetail
					label={t("TRANSACTION.IPFS_HASH")}
					className="pt-6"
					extra={
						<div className="mx-2">
							<Icon name="Ipfs" width={32} height={32} />
						</div>
					}
				>
					{hash}
				</TransactionDetail>

				<div className="mt-2">
					<TotalAmountBox amount={BigNumber.ZERO} fee={BigNumber.make(fee)} />
				</div>
			</div>
		</section>
	);
};

export const ThirdStep = () => {
	const { t } = useTranslation();
	const { register } = useFormContext();

	return (
		<section data-testid="SendIPFSTransaction__step--third">
			<div>
				<h1 className="mb-0">{t("TRANSACTION.AUTHENTICATION_STEP.TITLE")}</h1>
				<div className="text-theme-neutral-dark">{t("TRANSACTION.AUTHENTICATION_STEP.DESCRIPTION")}</div>

				<div className="grid grid-flow-row">
					<FormField name="mnemonic" className="pt-8 pb-0">
						<FormLabel>{t("TRANSACTION.MNEMONIC")}</FormLabel>
						<InputPassword ref={register({ required: true })} />
						<FormHelperText />
					</FormField>
				</div>
			</div>
		</section>
	);
};

export const FourthStep = ({ transaction }: { transaction: Contracts.SignedTransactionData }) => (
	<TransactionSuccessful transactionId={transaction.id()} />
);

export const SendIPFSTransaction = () => {
	const { t } = useTranslation();
	const history = useHistory();

	const [activeTab, setActiveTab] = useState(1);
	const [transaction, setTransaction] = useState((null as unknown) as Contracts.SignedTransactionData);
	// eslint-disable-next-line
	const [_, copy] = useClipboard({
		resetAfter: 1000,
	});
	const { env } = useEnvironmentContext();
	const activeProfile = useActiveProfile();
	const activeWallet = useActiveWallet();
	const networks = useMemo(() => env.availableNetworks(), [env]);

	const form = useForm({ mode: "onChange" });
	const { clearError, formState, getValues, register, setError, setValue } = form;

	useEffect(() => {
		register("network", { required: true });
		register("senderAddress", { required: true });
		register("fee", { required: true });
		register("hash", {
			required: true,
			validate: (value) => /^Qm/.test(value) && value.length > 2 && value.length <= 90,
		});

		setValue("senderAddress", activeWallet.address(), true);

		for (const network of networks) {
			if (
				network.id() === activeWallet.network().id &&
				network.coin() === activeWallet.manifest().get<string>("name")
			) {
				setValue("network", network, true);

				break;
			}
		}
	}, [activeWallet, networks, register, setValue]);

	const submitForm = async () => {
		clearError("mnemonic");
		const { fee, mnemonic, senderAddress, hash } = getValues();
		const senderWallet = activeProfile.wallets().findByAddress(senderAddress);

		try {
			const transactionId = await senderWallet!.transaction().signIpfs({
				fee,
				from: senderAddress,
				sign: {
					mnemonic,
				},
				data: {
					hash,
				},
			});

			await senderWallet!.transaction().broadcast([transactionId]);

			await env.persist();

			setTransaction(senderWallet!.transaction().transaction(transactionId));

			handleNext();
		} catch (error) {
			console.error("Could not create transaction: ", error);

			setValue("mnemonic", "");
			setError("mnemonic", "manual", t("TRANSACTION.INVALID_MNEMONIC"));
		}
	};

	const handleBack = () => {
		setActiveTab(activeTab - 1);
	};

	const handleNext = () => {
		setActiveTab(activeTab + 1);
	};

	const copyTransaction = () => {
		copy(transaction.id());
	};

	const crumbs = [
		{
			route: `/profiles/${activeProfile.id()}/dashboard`,
			label: t("COMMON.GO_BACK_TO_PORTFOLIO"),
		},
	];

	return (
		<Page profile={activeProfile} crumbs={crumbs}>
			<Section className="flex-1">
				<Form className="max-w-xl mx-auto" context={form} onSubmit={submitForm}>
					<Tabs activeId={activeTab}>
						<StepIndicator size={4} activeIndex={activeTab} />

						<div className="mt-8">
							<TabPanel tabId={1}>
								<FirstStep networks={networks} profile={activeProfile} />
							</TabPanel>
							<TabPanel tabId={2}>
								<SecondStep wallet={activeWallet} />
							</TabPanel>
							<TabPanel tabId={3}>
								<ThirdStep />
							</TabPanel>
							<TabPanel tabId={4}>
								<FourthStep transaction={transaction} />
							</TabPanel>

							<div className="flex justify-end mt-10 space-x-2">
								{activeTab < 4 && (
									<>
										<Button
											disabled={activeTab === 1}
											data-testid="SendIPFSTransaction__button--back"
											variant="plain"
											onClick={handleBack}
										>
											{t("COMMON.BACK")}
										</Button>

										{activeTab < 3 && (
											<Button
												data-testid="SendIPFSTransaction__button--continue"
												disabled={!formState.isValid}
												onClick={handleNext}
											>
												{t("COMMON.CONTINUE")}
											</Button>
										)}

										{activeTab === 3 && (
											<Button
												type="submit"
												data-testid="SendIPFSTransaction__button--submit"
												disabled={!formState.isValid}
											>
												{t("TRANSACTION.SIGN_CONTINUE")}
											</Button>
										)}
									</>
								)}

								{activeTab === 4 && (
									<>
										<Button
											data-testid="SendIPFSTransaction__button--back-to-wallet"
											variant="plain"
											className="block"
											onClick={() =>
												history.push(
													`/profiles/${activeProfile.id()}/wallets/${activeWallet.id()}`,
												)
											}
										>
											{t("COMMON.BACK_TO_WALLET")}
										</Button>

										<Button
											onClick={copyTransaction}
											data-testid="SendIPFSTransaction__button--copy"
											variant="plain"
											className="space-x-2"
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

SendIPFSTransaction.defaultProps = {
	networks: [],
};
