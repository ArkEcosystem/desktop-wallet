import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { AmountCrypto } from "app/components/Amount";
import { Button } from "app/components/Button";
import { FormField, FormLabel, SubForm } from "app/components/Form";
import { Icon } from "app/components/Icon";
import { InputCurrency } from "app/components/Input";
import { Switch } from "app/components/Switch";
import { Tooltip } from "app/components/Tooltip";
import { useValidation } from "app/hooks";
import { useExchangeRate } from "app/hooks/use-exchange-rate";
import cn from "classnames";
import { SelectRecipient } from "domains/profile/components/SelectRecipient";
import { RecipientList } from "domains/transaction/components/RecipientList";
import { RecipientListItem } from "domains/transaction/components/RecipientList/RecipientList.models";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import tw, { css, styled } from "twin.macro";

import { AddRecipientProperties, ToggleButtonProperties } from "./AddRecipient.models";
import { AddRecipientWrapper } from "./AddRecipient.styles";

const TransferType = ({ isSingle, disableMultiple, onChange }: ToggleButtonProperties) => {
	const { t } = useTranslation();

	return (
		<div className="flex items-center space-x-2">
			<Tooltip
				content={t("TRANSACTION.PAGE_TRANSACTION_SEND.FORM_STEP.MULTIPLE_UNAVAILBLE")}
				disabled={!disableMultiple}
			>
				<span>
					<Switch
						size="sm"
						disabled={disableMultiple}
						value={isSingle}
						onChange={onChange}
						leftOption={{
							label: t("TRANSACTION.SINGLE"),
							value: true,
						}}
						rightOption={{
							label: t("TRANSACTION.MULTIPLE"),
							value: false,
						}}
					/>
				</span>
			</Tooltip>

			<Tooltip content={t("TRANSACTION.RECIPIENTS_HELPTEXT", { count: 64 })}>
				<div className="flex justify-center items-center w-5 h-5 rounded-full cursor-pointer bg-theme-primary-100 text-theme-primary-600 questionmark dark:bg-theme-secondary-800 dark:text-theme-secondary-200 hover:bg-theme-primary-200">
					<Icon width={10} height={10} name="QuestionMark" />
				</div>
			</Tooltip>
		</div>
	);
};

const InputButtonStyled = styled.button(() => [
	tw`flex items-center h-full px-5 font-semibold text-theme-secondary-700`,
	tw`border-2 rounded border-theme-primary-100`,
	tw`transition-colors duration-300`,
	tw`dark:(border-theme-secondary-800 text-theme-secondary-200)`,
	tw`focus:(outline-none ring-2 ring-theme-primary-400)`,
	tw`disabled:(
		border border-theme-secondary-300 text-theme-secondary-500 cursor-not-allowed
		dark:(border-theme-secondary-700 text-theme-secondary-700)
	)`,
	css`
		&.active {
			${tw`border-theme-success-600 bg-theme-success-100 dark:bg-theme-success-900`}
		}
	`,
]);

export const AddRecipient = ({
	assetSymbol,
	profile,
	recipients,
	showMultiPaymentOption,
	disableMultiPaymentOption,
	withDeeplink,
	onChange,
}: AddRecipientProperties) => {
	const { t } = useTranslation();
	const [addedRecipients, setAddedRecipients] = useState<RecipientListItem[]>([]);
	// @ts-ignore
	const [isSingle, setIsSingle] = useState(recipients.length <= 1);
	const [recipientsAmount, setRecipientsAmount] = useState<any>();
	const isMountedReference = useRef(false);

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

	const ticker = network?.ticker();
	const exchangeTicker = profile.settings().get<string>(Contracts.ProfileSetting.ExchangeCurrency) as string;
	const { convert } = useExchangeRate({ ticker, exchangeTicker });

	const remainingBalance = useMemo(() => {
		const senderBalance = senderWallet?.balance() || 0;

		if (isSingle) {
			return senderBalance;
		}

		return addedRecipients.reduce((sum, item) => sum - Number(item.amount || 0), senderBalance);
	}, [addedRecipients, senderWallet, isSingle]);

	const remainingNetBalance = useMemo(() => {
		const netBalance = remainingBalance - (fee || 0);

		return Math.sign(netBalance) ? netBalance : undefined;
	}, [fee, remainingBalance]);

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
		const remaining = remainingBalance <= 0 ? 0 : remainingBalance;

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
		register("amount", sendTransfer.amount(network, remainingNetBalance!, addedRecipients, isSingle));
		register("displayAmount");
		register("recipientAddress", sendTransfer.recipientAddress(profile, network, addedRecipients, isSingle));
	}, [register, network, sendTransfer, addedRecipients, isSingle, profile, remainingNetBalance]);

	useEffect(() => {
		if (getValues("displayAmount")) {
			trigger("amount");
		}
	}, [fee, getValues, trigger]);

	useEffect(() => {
		//region added Timeout to prevent show error for recipientAddress when switch between transfer type
		setTimeout(() => clearErrors(), 0);
		//endregion

		if (!isMountedReference.current) {
			return;
		}

		if (isSingle && addedRecipients.length === 1) {
			setValue("amount", addedRecipients[0].amount);
			setValue("displayAmount", addedRecipients[0].amount);
			setValue("recipientAddress", addedRecipients[0].address);
			return;
		}

		//region Clear the fields and update the recipient item(s) when switch between transfer type, to prevent enable/disable continue button
		if (isSingle && recipients?.length !== 1) {
			clearFields();
			onChange?.([]);
			return;
		}

		/* istanbul ignore next */
		if (!isSingle) {
			if (addedRecipients.length > 0) {
				clearFields();
				onChange?.(addedRecipients);
				return;
			}

			onChange?.([]);
		}
		//endregion
	}, [isSingle, clearErrors, clearFields, addedRecipients, setValue]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (!isSingle) {
			setValue("isSendAllSelected", false);
		}
	}, [isSingle, setValue]);

	//region Update AddedRecipients state when comes back to the current page
	useEffect(() => {
		if (isMountedReference.current) {
			return;
		}

		if (!recipients?.length) {
			return;
		}

		setAddedRecipients(recipients);
	}, [recipients, setValue, getValues]);

	useEffect(() => {
		isMountedReference.current = true;
	}, []);
	//endregion

	const singleRecipientOnChange = (amountValue: number, recipientAddressValue: string) => {
		if (!isSingle) {
			return;
		}

		if (!recipientAddressValue || !amountValue) {
			return onChange?.([]);
		}

		onChange?.([
			{
				amount: +amountValue,
				address: recipientAddressValue,
			},
		]);
	};

	const handleAddRecipient = (address: string, amount: number, displayAmount: string) => {
		let newRecipient: RecipientListItem = {
			amount: +amount,
			displayAmount,
			address,
		};

		/* istanbul ignore next */
		if (!senderWallet?.network().isTest()) {
			newRecipient = {
				...newRecipient,
				exchangeAmount: convert(+amount),
				exchangeTicker: exchangeTicker,
			};
		}

		const newRecipients = [...addedRecipients, newRecipient];

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

	const recipientAddressAddons = !errors.recipientAddress && getValues("recipientAddress") && (
		<div className="flex justify-center items-center w-5 h-5 rounded-full dark:text-white bg-theme-success-200 text-theme-success-600 dark:bg-theme-success-600">
			<Icon name="CheckmarkBig" width={10} height={10} data-testid="AddRecipient__recipient-address-checkmark" />
		</div>
	);

	const amountAddons =
		!errors.amount && !errors.fee && isSenderFilled && !senderWallet?.network().isTest()
			? {
					end: (
						<AmountCrypto
							value={convert(amount || 0)}
							ticker={exchangeTicker}
							data-testid="AddRecipient__currency-balance"
							className="text-sm font-semibold whitespace-no-break text-theme-secondary-500 dark:text-theme-secondary-700"
						/>
					),
			  }
			: undefined;

	return (
		<AddRecipientWrapper>
			<div className="flex justify-between items-center mb-2 text-theme-secondary-text hover:text-theme-primary-600">
				<div className="text-sm font-semibold transition-colors duration-100">{t("TRANSACTION.RECIPIENT")}</div>

				{showMultiPaymentOption && (
					<TransferType
						isSingle={isSingle}
						disableMultiple={disableMultiPaymentOption}
						onChange={(isSingle) => setIsSingle(isSingle)}
					/>
				)}
			</div>

			<SubForm data-testid="AddRecipient__form-wrapper" noBackground={isSingle} noPadding={isSingle}>
				<div className="space-y-5">
					<FormField name="recipientAddress">
						{!isSingle && (
							<FormLabel label={t("COMMON.RECIPIENT_#", { count: addedRecipients.length + 1 })} />
						)}

						<SelectRecipient
							network={network}
							disabled={!isSenderFilled}
							address={recipientAddress}
							profile={profile}
							placeholder={t("COMMON.ADDRESS")}
							addons={recipientAddressAddons}
							onChange={(address: any) => {
								setValue("recipientAddress", address, { shouldValidate: true, shouldDirty: true });
								singleRecipientOnChange(getValues("amount"), address);
							}}
						/>
					</FormField>

					<FormField name="amount">
						<FormLabel>
							<span>{t("COMMON.AMOUNT")}</span>
							{isSenderFilled && (
								<span className="ml-1 text-theme-secondary-500 dark:text-theme-secondary-700">
									{`(${t("COMMON.AVAILABLE")} ${remainingNetBalance})`}
								</span>
							)}
						</FormLabel>

						<div className="flex space-x-2">
							<div className="flex-1">
								<InputCurrency
									disabled={!isSenderFilled}
									data-testid="AddRecipient__amount"
									placeholder={t("COMMON.AMOUNT_PLACEHOLDER")}
									value={getValues("displayAmount") || recipientsAmount}
									addons={amountAddons}
									onChange={(amount: string) => {
										setValue("isSendAllSelected", false);
										setValue("displayAmount", amount);
										setValue("amount", amount, { shouldValidate: true, shouldDirty: true });
										singleRecipientOnChange(+amount, recipientAddress);
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
												const remaining =
													remainingBalance > fee ? remainingNetBalance : remainingBalance;

												setValue("displayAmount", remaining);

												setValue("amount", remaining, {
													shouldValidate: true,
													shouldDirty: true,
												});

												singleRecipientOnChange(remaining!, recipientAddress);
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
