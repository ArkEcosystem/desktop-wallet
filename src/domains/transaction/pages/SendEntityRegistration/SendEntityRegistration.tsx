import { Contracts } from "@arkecosystem/platform-sdk";
import { Enums, ProfileSetting } from "@arkecosystem/platform-sdk-profiles";
import { Button } from "app/components/Button";
import { Form } from "app/components/Form";
import { Icon } from "app/components/Icon";
import { Page, Section } from "app/components/Layout";
import { StepIndicator } from "app/components/StepIndicator";
import { TabPanel, Tabs } from "app/components/Tabs";
import { useEnvironmentContext } from "app/contexts";
import { useActiveProfile, useActiveWallet } from "app/hooks";
import { AuthenticationStep } from "domains/transaction/components/AuthenticationStep";
import { EntityRegistrationForm } from "domains/transaction/components/EntityRegistrationForm/EntityRegistrationForm";
import { ErrorStep } from "domains/transaction/components/ErrorStep";
import { MultiSignatureRegistrationForm } from "domains/transaction/components/MultiSignatureRegistrationForm";
import { SecondSignatureRegistrationForm } from "domains/transaction/components/SecondSignatureRegistrationForm";
import { isMnemonicError } from "domains/transaction/utils";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";

import { RegistrationTypeStep, SummaryStep } from "./";
import { SendEntityRegistrationForm } from "./SendEntityRegistration.models";

type SendEntityRegistrationProps = {
	formDefaultValues?: any;
};

export const SendEntityRegistration = ({ formDefaultValues }: SendEntityRegistrationProps) => {
	const { t } = useTranslation();
	const history = useHistory();

	const [activeTab, setActiveTab] = useState(1);
	const [transaction, setTransaction] = useState((null as unknown) as Contracts.SignedTransactionData);
	const [registrationForm, setRegistrationForm] = useState<SendEntityRegistrationForm>();
	const [entityRegistrationTitle, setEntityRegistrationTitle] = useState<string>();
	const [availableNetworks, setAvailableNetworks] = useState<any[]>([]);
	const { registrationType: selectedRegistrationType } = useParams();

	const { env } = useEnvironmentContext();
	const activeProfile = useActiveProfile();
	const activeWallet = useActiveWallet();

	const networks = useMemo(() => {
		const usesTestNetworks = activeProfile.settings().get(ProfileSetting.UseTestNetworks);
		return usesTestNetworks
			? env.availableNetworks()
			: env.availableNetworks().filter((network) => network.isLive());
	}, [env, activeProfile]);

	const form = useForm({ mode: "onChange", defaultValues: formDefaultValues });
	const { formState, getValues, register, setValue, setError, unregister } = form;
	const { registrationType } = getValues();

	const stepCount = registrationForm ? registrationForm.tabSteps + 3 : 1;

	const getFeesByRegistrationType = useCallback(
		(type: string) => env.fees().findByType(activeWallet.coinId(), activeWallet.networkId(), type),
		[env, activeWallet],
	);

	const setFeesByRegistrationType = useCallback(
		(type: string) => {
			const fees = getFeesByRegistrationType("entityRegistration");

			setValue("fees", fees);
			setValue("fee", fees?.avg);
		},
		[getFeesByRegistrationType, setValue],
	);

	useEffect(() => {
		register("fee");
		register("fees");

		register("network", { required: true });
		register("registrationType", { required: true });
		register("senderAddress", { required: true });

		register("ipfsData");
		register("ipfsData.images");
		register("ipfsData.videos");
		register("ipfsData.sourceControl");
		register("ipfsData.socialMedia");
		register("ipfsData.meta.displayName");
		register("ipfsData.meta.description");
		register("ipfsData.meta.website");
	}, [register]);

	useEffect(() => {
		if (!activeWallet?.address?.()) return;

		setValue("senderAddress", activeWallet.address(), { shouldValidate: true, shouldDirty: true });

		for (const network of networks) {
			if (network.coin() === activeWallet.coinId() && network.id() === activeWallet.networkId()) {
				setValue("network", network, { shouldValidate: true, shouldDirty: true });

				break;
			}
		}
	}, [activeWallet, networks, setValue]);

	useEffect(() => {
		if (!activeWallet?.address?.() || !registrationType?.value) return;

		const fees = getFeesByRegistrationType(registrationType.value);
		setValue("fees", fees);
		setValue("fee", fees?.avg || fees?.static);
	}, [setValue, activeWallet, registrationType, getFeesByRegistrationType]);

	// When the wallet is already a delegate without entity registered and
	// selects update delegate action, then entity registration is performed.
	// This effect sets the appropriate data (fees, entityName, form title) and redirects to step 2
	// to internally perform entity registration while the user experiences update action.
	useEffect(() => {
		if (selectedRegistrationType === "delegate") {
			setRegistrationForm(EntityRegistrationForm);
			setValue(
				"registrationType",
				{
					value: "entityRegistration",
					type: Enums.EntityType.Delegate,
					label: "Delegate",
				},
				{ shouldValidate: true, shouldDirty: true },
			);

			setFeesByRegistrationType("entityRegistration");

			const delegate = env
				.delegates()
				.findByAddress(activeWallet.coinId(), activeWallet.networkId(), activeWallet.address());

			register("entityName");
			setValue("entityName", delegate.username());

			setEntityRegistrationTitle(t("TRANSACTION.TRANSACTION_TYPES.DELEGATE_ENTITY_UPDATE"));

			return setActiveTab(2);
		}

		if (selectedRegistrationType === "secondSignature") {
			setRegistrationForm(SecondSignatureRegistrationForm);
			setValue(
				"registrationType",
				{
					value: "secondSignature",
					label: "Second Signature",
				},
				{ shouldValidate: true, shouldDirty: true },
			);

			setFeesByRegistrationType("secondSignature");

			return setActiveTab(2);
		}

		if (selectedRegistrationType === "multiSignature") {
			setRegistrationForm(MultiSignatureRegistrationForm);
			setValue(
				"registrationType",
				{
					value: "multiSignature",
					label: "Multisignature",
				},
				{ shouldValidate: true, shouldDirty: true },
			);

			setFeesByRegistrationType("multiSignature");

			return setActiveTab(2);
		}
	}, [
		activeWallet,
		env,
		getFeesByRegistrationType,
		getValues,
		register,
		selectedRegistrationType,
		setFeesByRegistrationType,
		setValue,
		t,
	]);

	useEffect(() => {
		const userNetworks: string[] = [];
		const wallets: any = activeProfile.wallets().values();
		for (const wallet of wallets) {
			userNetworks.push(wallet.networkId());
		}

		setAvailableNetworks(networks.filter((network) => userNetworks.includes(network.id())));
	}, [activeProfile, networks]);

	const submitForm = async () => {
		try {
			const transaction = await registrationForm!.signTransaction({
				env,
				form,
				profile: activeProfile,
				type: registrationType.type,
			});

			setTransaction(transaction);
			handleNext();
		} catch (error) {
			if (isMnemonicError(error)) {
				setValue("mnemonic", "");
				return setError("mnemonic", { type: "manual", message: t("TRANSACTION.INVALID_MNEMONIC") });
			}

			setActiveTab(10);
		}
	};

	const handleBack = () => {
		setActiveTab(activeTab - 1);

		if (activeTab - 1 === 1) {
			for (const field of registrationForm!.formFields) {
				unregister(field);
			}
		}
	};

	const handleNext = () => {
		setActiveTab(activeTab + 1);
	};

	const crumbs = [
		{
			route: `/profiles/${activeProfile.id()}/dashboard`,
			label: t("COMMON.GO_BACK_TO_PORTFOLIO"),
		},
	];
	const registrationTitleByType = useMemo(
		() => t("TRANSACTION.PAGE_REGISTRATION.TITLE", { title: registrationType?.label }),
		[t, registrationType],
	);

	return (
		<Page profile={activeProfile} crumbs={crumbs}>
			<Section className="flex-1">
				<Form
					data-testid="Registration__form"
					className="mx-auto max-w-xl"
					context={form}
					onSubmit={submitForm}
				>
					<Tabs activeId={activeTab}>
						<StepIndicator size={stepCount} activeIndex={activeTab} />

						<div className="mt-8">
							<TabPanel tabId={1}>
								<RegistrationTypeStep
									networks={availableNetworks}
									profile={activeProfile}
									wallet={activeWallet}
									setRegistrationForm={setRegistrationForm}
									fees={getValues("fees")}
								/>
							</TabPanel>
							<TabPanel tabId={10}>
								<ErrorStep
									onBack={() =>
										history.push(`/profiles/${activeProfile.id()}/wallets/${activeWallet.id()}`)
									}
									isRepeatDisabled={formState.isSubmitting}
									onRepeat={form.handleSubmit(submitForm)}
								/>
							</TabPanel>

							{activeTab > 1 && registrationForm && getValues("fees") && (
								<registrationForm.component
									title={entityRegistrationTitle || registrationTitleByType}
									activeTab={activeTab}
									fees={getValues("fees")}
									wallet={activeWallet}
									profile={activeProfile}
								/>
							)}

							{registrationForm && (
								<>
									<TabPanel tabId={stepCount - 1}>
										<AuthenticationStep wallet={activeWallet} />
									</TabPanel>
									<TabPanel tabId={stepCount}>
										<SummaryStep
											transaction={transaction}
											registrationForm={registrationForm}
											senderWallet={activeWallet}
										/>
									</TabPanel>
								</>
							)}

							<div className="flex justify-end mt-10 space-x-3">
								{activeTab < stepCount && (
									<Button
										disabled={activeTab === 1}
										data-testid="Registration__back-button"
										variant="secondary"
										onClick={handleBack}
									>
										{t("COMMON.BACK")}
									</Button>
								)}

								{activeTab < stepCount - 1 && (
									<Button
										data-testid="Registration__continue-button"
										disabled={!formState.isValid}
										onClick={handleNext}
									>
										{t("COMMON.CONTINUE")}
									</Button>
								)}

								{registrationForm && activeTab === stepCount - 1 && (
									<Button
										type="submit"
										data-testid="Registration__send-button"
										disabled={!formState.isValid}
										className="space-x-2"
									>
										<Icon name="Send" width={20} height={20} />
										<span>{t("COMMON.SEND")}</span>
									</Button>
								)}

								{registrationForm && activeTab === stepCount && (
									<div className="flex justify-end space-x-3">
										<Button
											data-testid="Registration__button--back-to-wallet"
											variant="secondary"
											onClick={() =>
												history.push(
													`/profiles/${activeProfile.id()}/wallets/${activeWallet.id()}`,
												)
											}
										>
											{t("COMMON.BACK_TO_WALLET")}
										</Button>

										<Button
											data-testid="Registration__download-button"
											variant="secondary"
											className="space-x-2"
										>
											<Icon name="Download" />
											<span>{t("COMMON.DOWNLOAD")}</span>
										</Button>
									</div>
								)}
							</div>
						</div>
					</Tabs>
				</Form>
			</Section>
		</Page>
	);
};

SendEntityRegistration.defaultProps = {
	formDefaultValues: {
		fees: {
			static: "5",
			min: "0",
			avg: "1",
			max: "2",
		},
		fee: "0",
		ipfsData: {
			meta: {
				displayName: undefined,
				description: undefined,
				website: undefined,
			},
			images: [],
			videos: [],
			sourceControl: [],
			socialMedia: [],
		},
	},
};
