import { NetworkData, Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { FormField, FormLabel } from "app/components/Form";
import { Select } from "app/components/SelectDropdown";
import { SelectNetwork } from "domains/network/components/SelectNetwork";
import { SelectAddress } from "domains/profile/components/SelectAddress";
import { BusinessRegistrationForm } from "domains/transaction/components/BusinessRegistrationForm/BusinessRegistrationForm";
import { DelegateRegistrationForm } from "domains/transaction/components/DelegateRegistrationForm/DelegateRegistrationForm";
import { SecondSignatureRegistrationForm } from "domains/transaction/components/SecondSignatureRegistrationForm";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { SendEntityRegistrationType } from "./SendEntityRegistration.models";

const registrationComponents: any = {
	delegateRegistration: DelegateRegistrationForm,
	entityRegistration: BusinessRegistrationForm,
	secondSignature: SecondSignatureRegistrationForm,
};

const RegistrationTypeDropdown = ({ className, defaultValue, onChange, registrationTypes }: any) => {
	const { t } = useTranslation();

	return (
		<FormField data-testid="Registration__type" name="registrationType" className={`relative h-20 ${className}`}>
			<div className="mb-2">
				<FormLabel label={t("TRANSACTION.REGISTRATION_TYPE")} />
			</div>
			<div>
				<Select options={registrationTypes} defaultValue={defaultValue} onChange={onChange} />
			</div>
		</FormField>
	);
};

type FirstStepProps = {
	networks: NetworkData[];
	profile: Profile;
	wallet: ReadWriteWallet;
	setRegistrationForm: any;
	fees: Record<string, any>;
};

export const FirstStep = ({ networks, profile, wallet, setRegistrationForm, fees }: FirstStepProps) => {
	const { t } = useTranslation();
	const history = useHistory();

	const [wallets, setWallets] = useState<ReadWriteWallet[]>([]);

	const registrationTypes: SendEntityRegistrationType[] = [
		{
			value: "entityRegistration",
			label: "Business",
		},
	];

	if (!wallet.isDelegate()) {
		registrationTypes.push({
			value: "delegateRegistration",
			label: "Delegate",
		});
	}

	if (!wallet.isSecondSignature()) {
		registrationTypes.push({
			value: "secondSignature",
			label: "Second Signature",
		});
	}

	const form = useFormContext();
	const { setValue } = form;
	const { network, senderAddress, registrationType } = form.watch();

	useEffect(() => {
		if (network) {
			setWallets(profile.wallets().findByCoinWithNetwork(network.coin(), network.id()));
		}
	}, [network, profile]);

	const onSelectSender = (address: any) => {
		setValue("senderAddress", address, true);

		const wallet = wallets.find((wallet) => wallet.address() === address);
		history.push(`/profiles/${profile.id()}/wallets/${wallet!.id()}/send-entity-registration`);
	};

	const onSelectType = (selectedItem: SendEntityRegistrationType) => {
		setValue("registrationType", selectedItem.value, true);
		setRegistrationForm(registrationComponents[selectedItem.value]);

		if (fees[selectedItem.value]) {
			setValue("fee", fees[selectedItem.value].avg, true);
		}
	};

	return (
		<div data-testid="Registration__first-step">
			<h1 className="mb-0">{t("TRANSACTION.PAGE_REGISTRATION.FIRST_STEP.TITLE")}</h1>
			<div className="text-theme-neutral-dark">{t("TRANSACTION.PAGE_REGISTRATION.FIRST_STEP.DESCRIPTION")}</div>

			<div className="mt-8 space-y-8">
				<FormField name="network" className="relative">
					<div className="mb-2">
						<FormLabel label="Network" />
					</div>
					<SelectNetwork id="SendTransactionForm__network" networks={networks} selected={network} disabled />
				</FormField>

				<FormField name="senderAddress" className="relative">
					<div className="mb-2">
						<FormLabel label="Sender" />
					</div>

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
						(type: SendEntityRegistrationType) => type.value === registrationType,
					)}
					registrationTypes={registrationTypes}
					onChange={onSelectType}
					className="mt-8"
				/>
			</div>
		</div>
	);
};
