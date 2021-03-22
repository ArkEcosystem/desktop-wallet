import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { Button } from "app/components/Button";
import { FormField, FormLabel, SubForm } from "app/components/Form";
import { Icon } from "app/components/Icon";
import { Tooltip } from "app/components/Tooltip";
import { useValidation } from "app/hooks";
import cn from "classnames";
import { SelectRecipient } from "domains/profile/components/SelectRecipient";
import { InputAmount } from "domains/transaction/components/InputAmount";
import { RecipientList } from "domains/transaction/components/RecipientList";
import { RecipientListItem } from "domains/transaction/components/RecipientList/RecipientList.models";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import tw, { styled } from "twin.macro";

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

const InputButtonStyled = styled.button`
	& {
		${tw`flex items-center px-5 h-full transition-colors duration-300 focus:outline-none rounded font-semibold border-2 border-theme-primary-100 dark:border-theme-secondary-800 text-theme-secondary-700 dark:text-theme-secondary-200`};
	}
	&.active {
		${tw`border-theme-success-600 bg-theme-success-100 dark:bg-theme-success-900`}
	}
	&:disabled {
		${tw`border border-theme-secondary-300 dark:border-theme-secondary-700 text-theme-secondary-500 dark:text-theme-secondary-700 cursor-not-allowed`},
	}
`;

export const AddRecipient = ({
	assetSymbol,
	profile,
	recipients,
	showMultiPaymentOption,
	withDeeplink,
	onChange,
}: AddRecipientProps) => {
	const { t } = useTranslation();
	const [addedRecipients, setAddedRecipients] = useState<RecipientListItem[]>([]);
	const [isSingle, setIsSingle] = useState(recipients!.length === 0);
	const [recipientsAmount, setRecipientsAmount] = useState<any>();
	const isMountedRef = useRef(false);

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

	const senderWallet = useMemo(() => profile.wallets().findByAddress(senderAddress), [profile, senderAddress]);

	const remainingBalance = useMemo(() => {
		const senderBalance = senderWallet?.balance() || BigNumber.ZERO;

		if (isSingle) {
			return senderBalance;
		}

		return addedRecipients.reduce((sum, item) => sum.minus(item.amount!), senderBalance);
	}, [addedRecipients, senderWallet, isSingle]);

	const maximumAmount = useMemo(() => {
		const maximum = senderWallet?.balance().minus(fee);

		return maximum?.isPositive() ? maximum : undefined;
	}, [fee, senderWallet]);

	const isSenderFilled = useMemo(() => !!network?.id() && !!senderAddress, [network, senderAddress]);

	const clearFields = useCallback(() => {
		setValue("amount", undefined);
		setValue("displayAmount", undefined);
		setValue("recipientAddress", null);
	}, [setValue]);

	useEffect(() => {
		register("remainingBalance");
		register("isSendAllSelected");
	}, [register]);

	useEffect(() => {
		const remaining = remainingBalance.isLessThanOrEqualTo(BigNumber.ZERO) ? BigNumber.ZERO : remainingBalance;

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
		if (network && recipientAddress) {
			trigger("recipientAddress");
		}
	}, [network, recipientAddress, trigger]);

	useEffect(() => {
		register("amount", sendTransfer.amount(network, remainingBalance, addedRecipients, isSingle));
		register("displayAmount");
		register("recipientAddress", sendTransfer.recipientAddress(network, addedRecipients, isSingle));
	}, [register, remainingBalance, network, sendTransfer, addedRecipients, isSingle]);

	useEffect(() => {
		clearErrors();

		if (isSingle && addedRecipients.length === 1) {
			setValue("amount", addedRecipients[0].amount);
			setValue("displayAmount", addedRecipients[0].amount?.toHuman());
			setValue("recipientAddress", addedRecipients[0].address);
		}

		// Clear the recipient inputs when moving back to multiple tab with
		// added recipients.
		if (!isSingle && addedRecipients.length > 0) {
			clearFields();
		}
	}, [isSingle, clearErrors, clearFields, addedRecipients, setValue]);

	useEffect(() => {
		if (!isSingle) {
			setValue("isSendAllSelected", false);
		}
	}, [isSingle, setValue]);

	useEffect(() => {
		if (isMountedRef.current) {
			return;
		}

		if (!recipients?.length) {
			return;
		}

		setAddedRecipients(recipients);
	}, [recipients, setValue, getValues]);

	useEffect(() => {
		isMountedRef.current = true;
	}, []);

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

	const handleAddRecipient = (address: string, amount: number, displayAmount: string) => {
		const newRecipients = [
			...addedRecipients,
			{
				amount: BigNumber.make(amount),
				displayAmount,
				address,
			},
		];

		setAddedRecipients(newRecipients);
		onChange?.(newRecipients);
		clearFields();
	};

	const handleRemoveRecipient = (index: number) => {
		const remainingRecipients = [...addedRecipients];
		remainingRecipients.splice(index, 1);

		setAddedRecipients(remainingRecipients);
		onChange?.(remainingRecipients);
	};

	const addons =
		!errors.amount && isSingle && isSenderFilled
			? {
					end: (
						<span className="whitespace-no-break font-semibold text-sm text-theme-secondary-500 dark:text-theme-secondary-700">
							{t("COMMON.MAX")} {maximumAmount?.toHuman()}
						</span>
					),
			  }
			: undefined;

	return (
		<AddRecipientWrapper>
			{showMultiPaymentOption && (
				<ToggleButtons isSingle={isSingle} onChange={(isSingle) => setIsSingle(isSingle)} />
			)}

			<SubForm
				data-testid="AddRecipient__form-wrapper"
				className={cn({ "mt-6": showMultiPaymentOption })}
				noBackground={isSingle}
				noPadding={isSingle}
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
							network={network}
							disabled={!isSenderFilled}
							address={recipientAddress}
							profile={profile}
							onChange={(address: any) => {
								setValue("recipientAddress", address, { shouldValidate: true, shouldDirty: true });
								singleRecipientOnChange(getValues("amount"), address);
							}}
						/>
					</FormField>

					<FormField name="amount">
						<FormLabel label={t("COMMON.AMOUNT")} />
						<div className="flex space-x-2">
							<div className="flex-1">
								<InputAmount
									disabled={!isSenderFilled}
									data-testid="AddRecipient__amount"
									placeholder={t("COMMON.AMOUNT")}
									value={getValues("displayAmount") || recipientsAmount}
									addons={addons}
									onChange={(currency) => {
										setValue("isSendAllSelected", false);
										setValue("displayAmount", currency.display);
										setValue("amount", currency.value, { shouldValidate: true, shouldDirty: true });
										singleRecipientOnChange(currency.value, recipientAddress);
									}}
								/>
							</div>

							{isSingle && (
								<div className="inline-flex">
									<InputButtonStyled
										type="button"
										disabled={!isSenderFilled}
										className={cn({ active: getValues("isSendAllSelected") })}
										onClick={() => {
											setValue("isSendAllSelected", !getValues("isSendAllSelected"));

											if (getValues("isSendAllSelected")) {
												const remaining = remainingBalance.isGreaterThan(fee)
													? remainingBalance.minus(fee)
													: remainingBalance;

												setValue("displayAmount", remaining.toHuman());

												setValue("amount", remaining.toString(), {
													shouldValidate: true,
													shouldDirty: true,
												});

												singleRecipientOnChange(remaining.toString(), recipientAddress);
											}
										}}
										data-testid="AddRecipient__send-all"
									>
										{t("TRANSACTION.SEND_ALL")}
									</InputButtonStyled>
								</div>
							)}
						</div>
					</FormField>
				</div>

				{!isSingle && (
					<Button
						disabled={
							!!errors.amount ||
							!!errors.recipientAddress ||
							!getValues("amount") ||
							!getValues("recipientAddress")
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
						network={network}
						recipients={addedRecipients}
						onRemove={handleRemoveRecipient}
						assetSymbol={assetSymbol}
						isEditable
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
