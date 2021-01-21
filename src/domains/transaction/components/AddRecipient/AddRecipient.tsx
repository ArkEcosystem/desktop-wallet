import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { Button } from "app/components/Button";
import { FormField, FormHelperText, FormLabel, SubForm } from "app/components/Form";
import { Icon } from "app/components/Icon";
import { InputAddonEnd, InputCurrency, InputGroup } from "app/components/Input";
import { Tooltip } from "app/components/Tooltip";
import { useValidation } from "app/hooks";
import { SelectRecipient } from "domains/profile/components/SelectRecipient";
import { RecipientList } from "domains/transaction/components/RecipientList";
import { RecipientListItem } from "domains/transaction/components/RecipientList/RecipientList.models";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { AddRecipientProps, ToggleButtonProps } from "./AddRecipient.models";
import { AddRecipientWrapper } from "./AddRecipient.styles";

const ToggleButtons = ({ isSingle, onChange }: ToggleButtonProps) => {
	const { t } = useTranslation();

	return (
		<div className="text-theme-secondary-text hover:text-theme-primary-600">
			<div className="flex items-center mb-2 space-x-2">
				<div className="font-normal transition-colors duration-100 text-md">
					{t("TRANSACTION.SINGLE_OR_MULTI")}
				</div>
				<div>
					<Tooltip content={t("TRANSACTION.RECIPIENTS_HELPTEXT", { count: 64 })}>
						<div className="rounded-full cursor-pointer text-theme-primary-600 hover:text-theme-primary-100 questionmark">
							<Icon name="QuestionMark" width={20} height={20} />
						</div>
					</Tooltip>
				</div>
			</div>

			<div className="flex items-stretch select-buttons">
				<Button
					data-testid="AddRecipient__single"
					className="flex-1"
					size="lg"
					variant={isSingle ? "primary" : "secondary"}
					onClick={() => onChange?.(true)}
				>
					{t("TRANSACTION.SINGLE")}
				</Button>
				<Button
					data-testid="AddRecipient__multi"
					className="flex-1 border-l-0"
					size="lg"
					variant={!isSingle ? "primary" : "secondary"}
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
	showMultiPaymentOption,
	withDeeplink,
	onChange,
}: AddRecipientProps) => {
	const { t } = useTranslation();

	const [addedRecipients, setAddressRecipients] = useState<RecipientListItem[]>(recipients!);
	const [isSingle, setIsSingle] = useState(isSingleRecipient);
	const [recipientsAmount, setRecipientsAmount] = useState<any>();

	const {
		getValues,
		setValue,
		register,
		watch,
		trigger,
		clearErrors,
		formState: { errors },
	} = useFormContext();
	const { network, senderAddress, fee, recipientAddress, amount } = watch();
	const { sendTransfer } = useValidation();

	const remainingBalance = useMemo(() => {
		const senderBalance = profile.wallets().findByAddress(senderAddress)?.balance() || BigNumber.ZERO;

		if (isSingle) {
			return senderBalance;
		}

		return addedRecipients.reduce((sum, item) => sum.minus(item.amount!), senderBalance);
	}, [addedRecipients, profile, senderAddress, isSingle]);

	const isSenderFilled = useMemo(() => !!network?.id() && !!senderAddress, [network, senderAddress]);

	const clearFields = useCallback(() => {
		setValue("amount", undefined);
		setValue("displayAmount", undefined);
		setValue("recipientAddress", undefined);
	}, [setValue]);

	useEffect(() => {
		register("remainingBalance");
	}, [register]);

	useEffect(() => {
		const remaining = remainingBalance.isLessThanOrEqualTo(BigNumber.ZERO)
			? BigNumber.ZERO
			: remainingBalance.minus(amount || 0);

		setValue("remainingBalance", remaining);
	}, [remainingBalance, setValue, amount, recipientAddress, fee, senderAddress]);

	useEffect(() => {
		if (!withDeeplink) {
			return;
		}

		setRecipientsAmount(
			recipients
				?.reduce((accumulator, currentValue) => Number(accumulator) + Number(currentValue.amount), 0)
				.toString(),
		);
	}, [recipients, withDeeplink]);

	useEffect(() => {
		register("amount", sendTransfer.amount(network, remainingBalance, addedRecipients, isSingle));
		register("displayAmount");
	}, [register, remainingBalance, network, sendTransfer, addedRecipients, isSingle]);

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
		if (!isSingle && addedRecipients.length > 0) {
			clearFields();
		}
	}, [isSingle, clearErrors, clearFields, addedRecipients, setValue]);

	const singleRecipientOnChange = (amountValue: string, recipientAddressValue: string) => {
		if (!isSingle) {
			return;
		}

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
		if (!isValid) {
			return;
		}

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
			{showMultiPaymentOption && (
				<ToggleButtons isSingle={isSingle} onChange={(isSingle) => setIsSingle(isSingle)} />
			)}

			<SubForm
				data-testid="AddRecipient__form-wrapper"
				className={`${showMultiPaymentOption ? "mt-6" : ""}`}
				noBackground={isSingle}
			>
				<div className="space-y-8">
					<FormField name="recipientAddress">
						<FormLabel
							label={
								isSingle
									? t("COMMON.RECIPIENT")
									: t("COMMON.RECIPIENT_#", { count: addedRecipients.length + 1 })
							}
						/>
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

					<FormField name="amount">
						<FormLabel label={t("COMMON.AMOUNT")} />
						<InputGroup>
							<InputCurrency
								disabled={!isSenderFilled}
								data-testid="AddRecipient__amount"
								placeholder={t("COMMON.AMOUNT")}
								className="pr-20"
								value={getValues("displayAmount") || recipientsAmount}
								onChange={(currency) => {
									setValue("displayAmount", currency.display);
									setValue("amount", currency.value, { shouldValidate: true, shouldDirty: true });
									singleRecipientOnChange(currency.value, recipientAddress);
								}}
							/>
							<InputAddonEnd>
								<button
									type="button"
									data-testid="AddRecipient__send-all"
									onClick={() => {
										setValue("displayAmount", remainingBalance.minus(fee).toHuman());
										setValue("amount", remainingBalance.minus(fee).toString(), {
											shouldValidate: true,
											shouldDirty: true,
										});
										singleRecipientOnChange(remainingBalance.toString(), recipientAddress);
									}}
									className="pr-3 pl-6 mr-1 h-12 font-medium text-theme-primary-600 focus:outline-none"
								>
									{t("TRANSACTION.SEND_ALL")}
								</button>
							</InputAddonEnd>
						</InputGroup>
						<FormHelperText />
					</FormField>
				</div>

				{!isSingle && !BigNumber.make(getValues("amount")).isZero() && !!recipientAddress && (
					<Button
						disabled={
							!!errors.amount || !!errors.recipientAddress || BigNumber.make(getValues("amount")).isZero()
						}
						data-testid="AddRecipient__add-button"
						variant="secondary"
						className="mt-4 w-full"
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
				<div className="mt-3 border-b border-dashed border-theme-secondary-300 dark:border-theme-secondary-800">
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
	showMultiPaymentOption: true,
};
