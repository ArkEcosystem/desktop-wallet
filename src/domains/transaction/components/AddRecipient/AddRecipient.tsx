import { BigNumber } from "@arkecosystem/platform-sdk-support";
import Tippy from "@tippyjs/react";
import { Button } from "app/components/Button";
import { FormField, FormHelperText,FormLabel, SubForm } from "app/components/Form";
import { Icon } from "app/components/Icon";
import { InputAddonEnd, InputCurrency, InputGroup } from "app/components/Input";
import { useValidation } from "app/hooks";
import { SelectRecipient } from "domains/profile/components/SelectRecipient";
import { RecipientList } from "domains/transaction/components/RecipientList";
import { RecipientListItem } from "domains/transaction/components/RecipientList/RecipientList.models";
import React, {  useEffect, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { AddRecipientProps, ToggleButtonProps } from "./AddRecipient.models";
import { AddRecipientWrapper } from "./AddRecipient.styles";

const ToggleButtons = ({ isSingle, onChange }: ToggleButtonProps) => {
	const { t } = useTranslation();

	return (
		<div className="text-theme-neutral-dark hover:text-theme-primary">
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
	maxAvailableAmount,
	assetSymbol,
	isSingleRecipient,
	profile,
	recipients,
	onChange,
}: AddRecipientProps) => {
	const [addedRecipients, setAddressRecipients] = useState<RecipientListItem[]>(recipients!);
	const [isSingle, setIsSingle] = useState(isSingleRecipient);
	const [displayAmount, setDisplayAmount] = useState<string | undefined>();
	const [isSubFormStateValid, setSubFormState] = useState<boolean>(false);

	const { t } = useTranslation();
	const { sendTransfer } = useValidation();
	const { getValues, setValue, register, trigger, watch } = useFormContext();
	const { recipientAddress, amount, network } = watch();

	useEffect(() => {
		register("amount", sendTransfer.amount());
	}, [register]);

	useEffect(() => {
		const setValidationState = async () => {
			const isValidFields = await trigger(["amount", "recipientAddress"]);
			setSubFormState(isValidFields);
		};
		setValidationState();
	}, [amount, recipientAddress, trigger]);

	const availableAmount = useMemo(
		() => addedRecipients.reduce((sum, item) => sum.minus(item.amount), maxAvailableAmount),
		[maxAvailableAmount, addedRecipients],
	);

	const clearFields = () => {
		setDisplayAmount("0.0");
		setValue("amount", undefined);
		setValue("recipientAddress", null);
	};

	const singleRecipientOnChange = () => {
		const recipientAddress = getValues("recipientAddress");
		const amount = getValues("amount");

		if (!isSingle) {
			return;
		}

		if (!recipientAddress || !BigNumber.make(amount).toNumber()) {
			onChange?.([]);

			return;
		}

		onChange?.([
			{
				amount: BigNumber.make(amount),
				address: recipientAddress,
			},
		]);
	};

	const handleAddRecipient = (address: string, amount: number) => {
		addedRecipients.push({
			amount: BigNumber.make(amount),
			address,
		});
		setAddressRecipients(addedRecipients);
		onChange?.(addedRecipients);
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
							address={recipientAddress}
							ref={register(sendTransfer.recipientAddress(network))}
							profile={profile}
							onChange={(address: any) => {
								setValue("recipientAddress", address, { shouldValidate: true, shouldDirty: true });
								singleRecipientOnChange();
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
								data-testid="add-recipient__amount-input"
								placeholder={t("COMMON.AMOUNT")}
								className="pr-20"
								value={displayAmount}
								onChange={(currency) => {
									setDisplayAmount(currency.display);
									setValue("amount", currency.value, { shouldValidate: true, shouldDirty: true });
									singleRecipientOnChange();
								}}
							/>
							<InputAddonEnd>
								<button
									type="button"
									data-testid="add-recipient__send-all"
									onClick={() => {
										setDisplayAmount(availableAmount.toHuman());
										setValue("amount", availableAmount.toString(), {
											shouldValidate: true,
											shouldDirty: true,
										});
										singleRecipientOnChange();
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

				{!isSingle && displayAmount && !!recipientAddress && (
					<Button
						disabled={!isSubFormStateValid}
						data-testid="add-recipient__add-btn"
						variant="plain"
						className="w-full mt-4"
						onClick={() => handleAddRecipient(recipientAddress as string, amount)}
					>
						{t("TRANSACTION.ADD_RECIPIENT")}
					</Button>
				)}
			</SubForm>

			{!isSingle && addedRecipients.length > 0 && (
				<div className="border-b border-dashed border-theme-neutral-300">
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
	isSingleRecipient: true,
	recipients: [],
};
