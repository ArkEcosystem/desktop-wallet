import { NetworkData, Profile, Wallet } from "@arkecosystem/platform-sdk-profiles";
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
import { useHistory } from "react-router-dom";

type SendTransactionFormProps = {
	networks: NetworkData[];
	profile: Profile;
	onFail?: any;
};

export const SendTransactionForm = ({ networks, profile, onFail }: SendTransactionFormProps) => {
	const history = useHistory();
	const { t } = useTranslation();
	const [wallets, setWallets] = useState<Wallet[]>([]);

	const form = useFormContext();
	const { getValues, setValue } = form;
	const { network, recipients, senderAddress, smartbridge } = form.watch();
	const [feeOptions, setFeeOptions] = useState({
		last: undefined,
		min: (0 * 1e8).toFixed(0),
		max: (100 * 1e8).toFixed(0),
		average: (14 * 1e8).toFixed(0),
	});

	const fee = getValues("fee") || null;
	const maxAvailableAmount = 80;

	useEffect(() => {
		const loadFees = async () => {
			// TODO: shouldn't be necessary once SelectAddress returns wallets instead
			const senderWallet = profile.wallets().findByAddress(senderAddress);

			try {
				const transferFees = (await senderWallet!.fee().all(7))?.transfer;

				setFeeOptions({
					last: undefined,
					min: transferFees.min,
					max: transferFees.max,
					average: transferFees.avg,
				});

				setValue("fee", transferFees.avg, true);
			} catch (error) {
				onFail?.(error);
			}
		};

		loadFees();
	}, [setFeeOptions, setValue, onFail, profile, senderAddress]);

	useEffect(() => {
		if (network) {
			setWallets(profile.wallets().findByCoinWithNetwork(network.coin(), network.id()));
		}
	}, [network, profile]);

	const onSelectSender = (address: any) => {
		setValue("senderAddress", address, true);

		const wallet = wallets.find((wallet) => wallet.address() === address);
		history.push(`/profiles/${profile.id()}/transactions/${wallet!.id()}/transfer`);
	};

	return (
		<>
			<FormField name="network" className="relative mt-1">
				<div className="mb-2">
					<FormLabel label="Network" />
				</div>
				<SelectNetwork id="SendTransactionForm__network" networks={networks} selected={network} disabled />
			</FormField>

			<FormField name="senderAddress" className="relative mt-1">
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
						data-testid="Input__smartbridge"
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
		</>
	);
};
