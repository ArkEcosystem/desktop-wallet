import { NetworkData, Profile, Wallet } from "@arkecosystem/platform-sdk-profiles";
import { Button } from "app/components/Button";
import { FormField, FormLabel } from "app/components/Form";
import { Input, InputAddonEnd, InputGroup } from "app/components/Input";
import { SelectNetwork } from "domains/network/components/SelectNetwork";
import { SelectAddress } from "domains/profile/components/SelectAddress";
import { AddRecipient } from "domains/transaction/components/AddRecipient";
import { InputFee } from "domains/transaction/components/InputFee";
import { RecipientListItem } from "domains/transaction/components/RecipientList/RecipientList.models";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { styled } from "twin.macro";

import { defaultStyle } from "./SendTransactionForm.styles";

type SendTransactionFormProps = {
	formDefaultData: any;
	onSubmit?: (result: any) => void;
	onBack?: () => void;
	networks: NetworkData[];
	profile: Profile;
};

const FormWrapper = styled.div`
	${defaultStyle}
`;

export const SendTransactionForm = ({
	formDefaultData,
	onSubmit,
	onBack,
	networks,
	profile,
}: SendTransactionFormProps) => {
	const { t } = useTranslation();
	const [wallets, setWallets] = useState<Wallet[]>([]);

	const form = useFormContext();
	const { formState, getValues, register, setValue } = form;
	const { network, recipients, senderAddress, smartbridge } = form.watch();
	const [feeOptions, setFeeOptions] = useState({
		last: undefined,
		min: (0 * 1e8).toFixed(0),
		max: (100 * 1e8).toFixed(0),
		average: (14 * 1e8).toFixed(0),
	});

	// TODO: Get fees from SDK/API
	const fee = getValues("fee") || null;
	const maxFee = 100;
	const maxAvailableAmount = 80;

	const updateFees = async () => {
		if (!senderAddress) {
			return;
		}

		// TODO: shouldn't be necessary once SelectAddress returns wallets instead
		const senderWallet = profile
			?.wallets()
			.values()
			.find((wallet: Wallet) => wallet.address() === senderAddress);

		const transferFees = (await senderWallet?.fee().all(7))?.transfer;

		if (transferFees) {
			setFeeOptions({
				last: undefined,
				min: transferFees.min,
				max: transferFees.max,
				average: transferFees.avg,
			});

			setValue("fee", transferFees.avg, true);
		}
	};

	useEffect(() => {
		if (network) {
			setWallets(
				profile
					.wallets()
					.values()
					.filter((wallet) => wallet.network() === network.toObject()),
			);
		}
	}, [network]);

	useEffect(() => {
		updateFees();
	}, [senderAddress]);

	const onSelectNetwork = (network?: NetworkData | null) => {
		setValue("network", network, true);
	};

	const onFormSubmit = () => {
		onSubmit?.(getValues());
	};

	return (
		<FormWrapper>
			<FormField name="network" className="relative mt-1">
				<div className="mb-2">
					<FormLabel label="Network" />
				</div>
				<SelectNetwork
					id="SendTransactionForm__network"
					networks={networks}
					value={network}
					onSelect={onSelectNetwork}
				/>
			</FormField>

			<FormField name="senderAddress" className="relative mt-1">
				<div className="mb-2">
					<FormLabel label="Sender" />
				</div>

				<div data-testid="sender-address">
					<SelectAddress
						address={senderAddress}
						wallets={wallets}
						onChange={(address: any) => setValue("senderAddress", address, true)}
					/>
				</div>
			</FormField>

			<div data-testid="recipient-address">
				<AddRecipient
					maxAvailableAmount={maxAvailableAmount}
					profile={profile}
					onChange={(recipients: RecipientListItem[]) => setValue("recipients", recipients, true)}
					recipients={recipients}
				/>
			</div>

			<FormField name="smartbridge" className="relative mt-1">
				<div className="mb-2">
					<FormLabel label="Smartbridge" />
				</div>
				<InputGroup>
					<Input
						type="text"
						placeholder=" "
						className="pr-20"
						maxLength={255}
						defaultValue={smartbridge}
						onChange={(event: any) => setValue("smartbridge", event.target.value, true)}
					/>
					<InputAddonEnd>
						<button type="button" className="px-4 text-theme-neutral-light focus:outline-none">
							255 Max
						</button>
					</InputAddonEnd>
				</InputGroup>
			</FormField>

			<FormField name="fee">
				<FormLabel>{t("TRANSACTION.TRANSACTION_FEE")}</FormLabel>
				<InputFee
					{...feeOptions}
					defaultValue={fee || 0}
					value={fee || 0}
					step={0.01}
					onChange={(value: any) => setValue("fee", value, true)}
				/>
			</FormField>

			<div className="flex justify-end space-x-3 hidden">
				<Button data-testid="send-transaction-click-back" variant="plain" onClick={onBack}>
					Back
				</Button>
				<Button data-testid="send-transaction-click-submit" onSubmit={onFormSubmit}>
					Continue
				</Button>
			</div>
		</FormWrapper>
	);
};

SendTransactionForm.defaultProps = {
	formDefaultData: {},
};
