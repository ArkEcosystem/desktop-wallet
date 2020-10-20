import { BigNumber } from "@arkecosystem/platform-sdk-support";
import Tippy from "@tippyjs/react";
import { Button } from "app/components/Button";
import { FormField, FormHelperText, FormLabel, SubForm } from "app/components/Form";
import { Icon } from "app/components/Icon";
import { InputAddonEnd, InputCurrency, InputGroup } from "app/components/Input";
import { useValidation } from "app/hooks";
import { SelectRecipient } from "domains/profile/components/SelectRecipient";
import { RecipientList } from "domains/transaction/components/RecipientList";
import { RecipientListItem } from "domains/transaction/components/RecipientList/RecipientList.models";
import React, { useEffect, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { AddRecipientProps, ToggleButtonProps } from "./AddRecipient.models";
import { AddRecipientWrapper } from "./AddRecipient.styles";

const ToggleButtons = ({ isSingle, onChange }: ToggleButtonProps) => {
	const { t } = useTranslation();

	return (
		<div className="text-theme-secondary-text hover:text-theme-primary">
			<div className="flex items-center mb-2 space-x-2">
				<div className="font-normal transition-colors duration-100 text-md">
					{t("TRANSACTION.SINGLE_OR_MULTI")}
				</div>
				<div>
					<Tippy content={t("TRANSACTION.RECIPIENTS_HELPTEXT", { count: 64 })}>
						<div className="rounded-full cursor-pointer text-theme-primary-600 hover:text-theme-primary-100 questionmark">
							<Icon name="QuestionMark" width={20} height={20} />
						</div>
					</Tippy>
				</div>
			</div>

			<div className="flex items-stretch select-buttons">
				<Button
					variant={isSingle ? "solid" : "plain"}
					className="flex-1"
					data-testid="add-recipient-is-single-toggle"
					onClick={() => onChange?.(true)}
				>
					{t("TRANSACTION.SINGLE")}
				</Button>
				<Button
					variant={!isSingle ? "solid" : "plain"}
					className="flex-1 border-l-0"
					data-testid="add-recipient-is-multiple-toggle"
					onClick={() => onChange?.(false)}
				>
					{t("TRANSACTION.MULTIPLE")}
				</Button>
			</div>
		</div>
	);
};

export const AddRecipient = ({
	assetSymbol,
	isSingleRecipient = true,
	profile,
	recipients,
	onChange,
}: AddRecipientProps) => {
	const [addedRecipients, setAddressRecipients] = useState<RecipientListItem[]>(recipients!);
	const [isSingle, setIsSingle] = useState(isSingleRecipient);

	const { t } = useTranslation();
	const {
		getValues,
		setValue,
		register,
		watch,
		trigger,
		clearErrors,
		formState: { errors },
	} = useFormContext();
	const { network, senderAddress, fee, recipientAddress } = watch();
	const { sendTransfer } = useValidation();

	const availableBalance = useMemo(() => {
		const senderBalance = profile.wallets().findByAddress(senderAddress)?.balance() || BigNumber.ZERO;

		if (isSingle) return senderBalance;

		return addedRecipients.reduce((sum, item) => sum.minus(item.amount), senderBalance).minus(fee);
	}, [addedRecipients, profile, senderAddress, isSingle, fee]);

	const isSenderFilled = useMemo(() => !!network?.id() && !!senderAddress, [network, senderAddress]);

	useEffect(() => {
		clearErrors();

		// Case: user added a single recipient (in multiple tab)
		// and switched to single. Copy the values to input fields
		// when it's only 1 recipient.
		if (isSingle && addedRecipients.length === 1) {
			setValue("amount", addedRecipients[0].amount);
			setValue("displayAmount", addedRecipients[0].displayAmount);
			setValue("recipientAddress", addedRecipients[0].address);
			return;
		}

		// Clear the recipient inputs when moving back to multiple tab with
		// added recipients.
		if (!isSingle && addedRecipients.length > 0) clearFields();
	}, [isSingle, clearErrors, addedRecipients]);

	useEffect(() => {
		register("amount", sendTransfer.amount(network, availableBalance, addedRecipients, isSingle));
		register("displayAmount");
	}, [register, availableBalance, network, sendTransfer]);

	const clearFields = () => {
		setValue("amount", undefined);
		setValue("displayAmount", undefined);
		setValue("recipientAddress", undefined);
	};

	const singleRecipientOnChange = (amountValue: string, recipientAddressValue: string) => {
		if (!isSingle) return;

		if (!recipientAddressValue || !BigNumber.make(amountValue).toNumber()) {
			return onChange?.([]);
		}

		onChange?.([
			{
				amount: BigNumber.make(amountValue),
				address: recipientAddressValue,
			},
		]);
	};

	const handleAddRecipient = async (address: string, amount: number, displayAmount: string) => {
		const isValid = await trigger(["recipientAddress", "amount"]);
		if (!isValid) return;

		const newRecipients = [
			...addedRecipients,
			{
				amount: BigNumber.make(amount),
				displayAmount,
				address,
			},
		];

		setAddressRecipients(newRecipients);
		onChange?.(newRecipients);
		clearFields();
	};

	const handleRemoveRecipient = (address: string) => {
		const index = addedRecipients.findIndex((addedRecipient: any) => addedRecipient.address === address);
		const newRecipients = addedRecipients.concat();
		newRecipients.splice(index, 1);
		setAddressRecipients(newRecipients);
		onChange?.(addedRecipients);
	};

	return (
		<AddRecipientWrapper>
			<ToggleButtons isSingle={isSingle} onChange={(isSingle) => setIsSingle(isSingle)} />

			<SubForm data-testid="add-recipient__form-wrapper" className="mt-6" noBackground={isSingle}>
				<div className="space-y-8">
					<FormField name="recipientAddress" className="relative mt-1">
						<div className="mb-2">
							<FormLabel
								label={
									isSingle
										? t("COMMON.RECIPIENT")
										: t("COMMON.RECIPIENT_#", { count: addedRecipients.length + 1 })
								}
							/>
						</div>

						<SelectRecipient
							disabled={!isSenderFilled}
							address={recipientAddress}
							ref={register(sendTransfer.recipientAddress(network, addedRecipients, isSingle))}
							profile={profile}
							onChange={(address: any) => {
								setValue("recipientAddress", address, { shouldValidate: true, shouldDirty: true });
								singleRecipientOnChange(getValues("amount"), address);
							}}
						/>
						<FormHelperText />
					</FormField>

					<FormField name="amount" className="relative mt-1">
						<div className="mb-2">
							<FormLabel label={t("COMMON.AMOUNT")} />
						</div>
						<InputGroup>
							<InputCurrency
								disabled={!isSenderFilled}
								data-testid="add-recipient__amount-input"
								placeholder={t("COMMON.AMOUNT")}
								className="pr-20"
								value={getValues("displayAmount")}
								onChange={(currency) => {
									setValue("displayAmount", currency.display);
									setValue("amount", currency.value, { shouldValidate: true, shouldDirty: true });
									singleRecipientOnChange(currency.value, recipientAddress);
								}}
							/>
							<InputAddonEnd>
								<button
									type="button"
									data-testid="add-recipient__send-all"
									onClick={() => {
										setValue("displayAmount", availableBalance.toHuman());
										setValue("amount", availableBalance.toString(), {
											shouldValidate: true,
											shouldDirty: true,
										});
										singleRecipientOnChange(availableBalance.toString(), recipientAddress);
									}}
									className="h-12 pl-6 pr-3 mr-1 text-theme-primary focus:outline-none"
								>
									{t("TRANSACTION.SEND_ALL")}
								</button>
							</InputAddonEnd>
						</InputGroup>
						<FormHelperText />
					</FormField>
				</div>

				{!isSingle && getValues("amount") && !!recipientAddress && (
					<Button
						disabled={
							!!errors.amount || !!errors.recipientAddress || BigNumber.make(getValues("amount")).isZero()
						}
						data-testid="add-recipient__add-btn"
						variant="plain"
						className="w-full mt-4"
						onClick={() =>
							handleAddRecipient(
								recipientAddress as string,
								getValues("amount"),
								getValues("displayAmount"),
							)
						}
					>
						{t("TRANSACTION.ADD_RECIPIENT")}
					</Button>
				)}
			</SubForm>

			{!isSingle && addedRecipients.length > 0 && (
				<div className="border-b border-dashed border-theme-neutral-300 dark:border-theme-neutral-800">
					<RecipientList
						recipients={addedRecipients}
						isEditable={true}
						onRemove={handleRemoveRecipient}
						assetSymbol={assetSymbol}
					/>
				</div>
			)}
		</AddRecipientWrapper>
	);
};

AddRecipient.defaultProps = {
	assetSymbol: "ARK",
	recipients: [],
};
