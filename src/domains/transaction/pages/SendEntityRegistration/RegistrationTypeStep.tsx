import { Coins } from "@arkecosystem/platform-sdk";
import { Enums, Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { FormField, FormLabel } from "app/components/Form";
import { Header } from "app/components/Header";
import { SelectNetwork } from "domains/network/components/SelectNetwork";
import { SelectAddress } from "domains/profile/components/SelectAddress";
import { DelegateRegistrationForm } from "domains/transaction/components/DelegateRegistrationForm/DelegateRegistrationForm";
import { EntityRegistrationForm } from "domains/transaction/components/EntityRegistrationForm/EntityRegistrationForm";
import { MultiSignatureRegistrationForm } from "domains/transaction/components/MultiSignatureRegistrationForm";
import { SecondSignatureRegistrationForm } from "domains/transaction/components/SecondSignatureRegistrationForm";
import { SelectRegistrationType } from "domains/transaction/components/SelectRegistrationType";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { SendEntityRegistrationType } from "./SendEntityRegistration.models";

type RegistrationTypeStepProps = {
	networks: Coins.Network[];
	profile: Profile;
	wallet: ReadWriteWallet;
	setRegistrationForm: any;
	fees: Record<string, any>;
};

const registrationComponents: any = {
	delegateRegistration: DelegateRegistrationForm,
	entityRegistration: EntityRegistrationForm,
	secondSignature: SecondSignatureRegistrationForm,
	multiSignature: MultiSignatureRegistrationForm,
};

export const RegistrationTypeStep = ({
	networks,
	profile,
	wallet,
	setRegistrationForm,
	fees,
}: RegistrationTypeStepProps) => {
	const { t } = useTranslation();
	const history = useHistory();

	const [wallets, setWallets] = useState<ReadWriteWallet[]>([]);

	const form = useFormContext();
	const { setValue } = form;
	const { network, senderAddress, registrationType } = form.watch();

	useEffect(() => {
		if (network) {
			return setWallets(profile.wallets().findByCoinWithNetwork(network.coin(), network.id()));
		}

		setWallets(profile.wallets().values());
	}, [network, profile]);

	const registrationTypes = [];

	if (wallet.hasSyncedWithNetwork?.()) {
		if (
			!wallet.isDelegate?.() &&
			!wallet.isMultiSignature?.() &&
			network?.can("Transaction.delegateRegistration")
		) {
			registrationTypes.push({
				value: "delegateRegistration",
				label: "Delegate",
			});
		}
	}

	if (network?.can("Transaction.entityRegistration")) {
		registrationTypes.push({
			value: "entityRegistration",
			type: Enums.EntityType.Business,
			label: "Business",
		});

		registrationTypes.push({
			value: "entityRegistration",
			type: Enums.EntityType.Module,
			label: "Module",
		});

		registrationTypes.push({
			value: "entityRegistration",
			type: Enums.EntityType.Plugin,
			label: "Plugin",
		});

		registrationTypes.push({
			value: "entityRegistration",
			type: Enums.EntityType.Product,
			label: "Product",
		});
	}

	const onSelectSender = (address: any) => {
		setValue("senderAddress", address, { shouldValidate: true, shouldDirty: true });

		const wallet = wallets.find((wallet) => wallet.address() === address);
		history.push(`/profiles/${profile.id()}/wallets/${wallet!.id()}/send-entity-registration`);
	};

	const onSelectType = (selectedItem: SendEntityRegistrationType | null | undefined) => {
		setValue("registrationType", selectedItem, { shouldValidate: true, shouldDirty: true });

		/* istanbul ignore else */
		if (selectedItem) {
			setRegistrationForm(registrationComponents[selectedItem.value]);

			if (fees[selectedItem.value]) {
				setValue("fee", fees[selectedItem.value].avg, { shouldValidate: true, shouldDirty: true });
				setValue("fees", fees[selectedItem.value]);
			}
		}
	};

	return (
		<section data-testid="Registration__selection-step" className="space-y-8">
			<Header
				title={t("TRANSACTION.PAGE_REGISTRATION.FIRST_STEP.TITLE")}
				subtitle={t("TRANSACTION.PAGE_REGISTRATION.FIRST_STEP.DESCRIPTION")}
			/>

			<FormField name="network">
				<div className="mb-2">
					<FormLabel label={t("TRANSACTION.CRYPTOASSET")} />
				</div>
				<SelectNetwork
					id="SendTransactionForm__network"
					networks={networks}
					selected={network}
					disabled={!!senderAddress}
					onSelect={(selectedNetwork: Coins.Network | null | undefined) =>
						setValue("network", selectedNetwork)
					}
				/>
			</FormField>

			<FormField name="senderAddress">
				<FormLabel label="Sender" />
				<div data-testid="sender-address">
					<SelectAddress
						address={senderAddress}
						wallets={wallets}
						disabled={wallets.length === 0}
						onChange={onSelectSender}
					/>
				</div>
			</FormField>

			<FormField data-testid="Registration__type" name="registrationType">
				<FormLabel label={t("TRANSACTION.REGISTRATION_TYPE")} />
				<SelectRegistrationType
					id="SendTransactionForm__registrationType"
					options={registrationTypes}
					selected={registrationType}
					onSelect={onSelectType}
				/>
			</FormField>
		</section>
	);
};
