import { Coins } from "@arkecosystem/platform-sdk";
import { Enums, Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { FormField, FormLabel } from "app/components/Form";
import { Header } from "app/components/Header";
import { Select } from "app/components/SelectDropdown";
import { SelectNetwork } from "domains/network/components/SelectNetwork";
import { SelectAddress } from "domains/profile/components/SelectAddress";
import { DelegateRegistrationForm } from "domains/transaction/components/DelegateRegistrationForm/DelegateRegistrationForm";
import { EntityRegistrationForm } from "domains/transaction/components/EntityRegistrationForm/EntityRegistrationForm";
import { MultiSignatureRegistrationForm } from "domains/transaction/components/MultiSignatureRegistrationForm";
import { SecondSignatureRegistrationForm } from "domains/transaction/components/SecondSignatureRegistrationForm";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { SendEntityRegistrationType } from "./SendEntityRegistration.models";

type FirstStepProps = {
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

const RegistrationTypeDropdown = ({ className, defaultValue, registrationTypes, onChange }: any) => {
	const { t } = useTranslation();

	return (
		<FormField data-testid="Registration__type" name="registrationType" className={`relative h-20 ${className}`}>
			<FormLabel label={t("TRANSACTION.REGISTRATION_TYPE")} />
			<Select options={registrationTypes} defaultValue={defaultValue} onChange={onChange} />
		</FormField>
	);
};

export const FirstStep = ({ networks, profile, wallet, setRegistrationForm, fees }: FirstStepProps) => {
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

	if (network?.can("Transaction.entityRegistration")) {
		registrationTypes.push({
			value: "entityRegistration",
			type: Enums.EntityType.Business,
			label: "Business",
		});
	}

	if (!wallet.isDelegate?.() && network?.can("Transaction.delegateRegistration")) {
		registrationTypes.push({
			value: "delegateRegistration",
			label: "Delegate",
		});
	}

	if (!wallet.isMultiSignature?.() && network?.can("Transaction.multiSignature")) {
		registrationTypes.push({
			value: "multiSignature",
			label: "MultiSignature",
		});
	}

	if (!wallet.isSecondSignature?.() && network?.can("Transaction.secondSignature")) {
		registrationTypes.push({
			value: "secondSignature",
			label: "Second Signature",
		});
	}

	const onSelectSender = (address: any) => {
		setValue("senderAddress", address, { shouldValidate: true, shouldDirty: true });

		const wallet = wallets.find((wallet) => wallet.address() === address);
		history.push(`/profiles/${profile.id()}/wallets/${wallet!.id()}/send-entity-registration`);
	};

	const onSelectType = (selectedItem: SendEntityRegistrationType) => {
		setValue("registrationType", selectedItem, { shouldValidate: true, shouldDirty: true });
		setRegistrationForm(registrationComponents[selectedItem.value]);

		if (fees[selectedItem.value]) {
			setValue("fee", fees[selectedItem.value].avg, { shouldValidate: true, shouldDirty: true });
		}
	};

	return (
		<section data-testid="Registration__first-step" className="space-y-8">
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

			<RegistrationTypeDropdown
				selectedType={registrationTypes.find(
					(type: SendEntityRegistrationType) => type.value === registrationType?.value,
				)}
				registrationTypes={registrationTypes}
				onChange={onSelectType}
			/>
		</section>
	);
};
