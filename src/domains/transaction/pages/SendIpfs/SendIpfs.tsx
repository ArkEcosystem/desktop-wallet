import { Contracts } from "@arkecosystem/platform-sdk";
import { Button } from "app/components/Button";
import { Form } from "app/components/Form";
import { Icon } from "app/components/Icon";
import { Page, Section } from "app/components/Layout";
import { StepIndicator } from "app/components/StepIndicator";
import { TabPanel, Tabs } from "app/components/Tabs";
import { useEnvironmentContext } from "app/contexts";
import { useActiveProfile, useActiveWallet, useClipboard } from "app/hooks";
import { AuthenticationStep } from "domains/transaction/components/AuthenticationStep";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { FirstStep } from "./Step1";
import { SecondStep } from "./Step2";
import { FourthStep } from "./Step4";

export const SendIpfs = () => {
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
	const { clearErrors, formState, getValues, register, setError, setValue } = form;

	useEffect(() => {
		register("network", { required: true });
		register("senderAddress", { required: true });
		register("fee", { required: true });
		register("hash", {
			required: true,
			validate: (value) =>
				/(Qm[A-HJ-NP-Za-km-z1-9]{44,45})/.test(value) ||
				t("TRANSACTION.INPUT_IPFS_HASH.VALIDATION.NOT_VALID").toString(),
		});

		setValue("senderAddress", activeWallet.address(), { shouldValidate: true, shouldDirty: true });

		for (const network of networks) {
			if (network.coin() === activeWallet.coinId() && network.id() === activeWallet.networkId()) {
				setValue("network", network, { shouldValidate: true, shouldDirty: true });

				break;
			}
		}
	}, [activeWallet, networks, register, setValue, t]);

	const submitForm = async () => {
		clearErrors("mnemonic");

		const { fee, mnemonic, secondMnemonic, senderAddress, hash } = getValues();
		const senderWallet = activeProfile.wallets().findByAddress(senderAddress);

		try {
			const transactionId = await senderWallet!.transaction().signIpfs({
				fee: /* istanbul ignore next */ fee?.value || fee,
				from: senderAddress,
				sign: {
					mnemonic,
					secondMnemonic,
				},
				data: {
					hash,
				},
			});

			await senderWallet!.transaction().broadcast(transactionId);

			await env.persist();

			setTransaction(senderWallet!.transaction().transaction(transactionId));

			handleNext();
		} catch (error) {
			console.error("Could not create transaction: ", error);

			setValue("mnemonic", "");
			setError("mnemonic", { type: "manual", message: t("TRANSACTION.INVALID_MNEMONIC") });
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
								<AuthenticationStep wallet={activeWallet} />
							</TabPanel>
							<TabPanel tabId={4}>
								<FourthStep transaction={transaction} senderWallet={activeWallet} />
							</TabPanel>

							<div className="flex justify-end mt-10 space-x-2">
								{activeTab < 4 && (
									<>
										<Button
											disabled={activeTab === 1}
											data-testid="SendIpfs__button--back"
											variant="plain"
											onClick={handleBack}
										>
											{t("COMMON.BACK")}
										</Button>

										{activeTab < 3 && (
											<Button
												data-testid="SendIpfs__button--continue"
												disabled={!formState.isValid}
												onClick={handleNext}
											>
												{t("COMMON.CONTINUE")}
											</Button>
										)}

										{activeTab === 3 && (
											<Button
												type="submit"
												data-testid="SendIpfs__button--submit"
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
											data-testid="SendIpfs__button--back-to-wallet"
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
											data-testid="SendIpfs__button--copy"
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

SendIpfs.defaultProps = {
	networks: [],
};
