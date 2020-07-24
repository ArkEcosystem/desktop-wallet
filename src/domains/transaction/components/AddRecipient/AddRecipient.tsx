import Tippy from "@tippyjs/react";
import { Button } from "app/components/Button";
import { FormField, FormLabel } from "app/components/Form";
import { Icon } from "app/components/Icon";
import { Input, InputAddonEnd, InputGroup } from "app/components/Input";
import { SelectRecipient } from "domains/profile/components/SelectRecipient";
import { RecipientList } from "domains/transaction/components/RecipientList";
import { RecipientListItem } from "domains/transaction/components/RecipientList/RecipientList.models";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { AddRecipientProps, ToggleButtonProps } from "./AddRecipient.models";
import { AddRecipientWrapper } from "./AddRecipient.styles";

const ToggleButtons = ({ isSingle, onChange }: ToggleButtonProps) => {
	const { t } = useTranslation();

	return (
		<div className="text-theme-neutral-dark hover:text-theme-primary">
			<div className="flex items-center mb-2 space-x-2">
				<div className="font-normal text-md transition-colors duration-100">
					{t("TRANSACTION.SINGLE_OR_MULTI")}
				</div>
				<div>
					<Tippy content={t("TRANSACTION.RECIPIENTS_HELPTEXT", { count: 64 })}>
						<div className="rounded-full cursor-pointer bg-theme-primary-100 text-theme-primary-500">
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
	availableAmount,
	assetSymbol,
	isSingleRecipient,
	contacts,
	recipients,
	onChange,
}: AddRecipientProps) => {
	const [addedRecipients, setAddressRecipients] = useState(recipients as RecipientListItem[]);
	const [isSingle, setIsSingle] = useState(isSingleRecipient);

	const { t } = useTranslation();

	const form = useForm({
		defaultValues: { amount: availableAmount, recipientAddress: null, isSingle: isSingleRecipient },
	});

	const { setValue, register } = form;
	const { recipientAddress, amount } = form.watch();

	const clearFields = () => {
		setValue("amount", 0);
		setValue("recipientAddress", null);
	};

	const onAddRecipient = (address: string, amount: number) => {
		addedRecipients.push({ amount, address });
		setAddressRecipients(addedRecipients);
		onChange?.(addedRecipients);
		clearFields();
	};

	const onRemoveRecipient = (address: string) => {
		const index = addedRecipients.findIndex((addedRecipient: any) => addedRecipient.address === address);
		const newRecipients = addedRecipients.concat();
		newRecipients.splice(index, 1);
		setAddressRecipients(newRecipients);
		onChange?.(addedRecipients);
	};

	return (
		<AddRecipientWrapper>
			<ToggleButtons isSingle={isSingle} onChange={(isSingle) => setIsSingle(isSingle)} />

			<div
				data-testid="add-recipient__form-wrapper"
				className={`mt-8 mb-2 ${!isSingle ? "MultiRecipientWrapper" : ""}`}
			>
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
							address={recipientAddress as any}
							ref={register}
							contacts={contacts}
							onChange={(address: any) => setValue("recipientAddress", address)}
						/>
					</FormField>

					<FormField name="amount" className="relative mt-1">
						<div className="mb-2">
							<FormLabel label={t("COMMON.AMOUNT")} />
						</div>
						<InputGroup>
							<Input
								data-testid="add-recipient__amount-input"
								type="number"
								name="amount"
								placeholder={t("COMMON.AMOUNT")}
								className="pr-20"
								ref={register}
							/>
							<InputAddonEnd>
								<button
									data-testid="add-recipient__send-all"
									onClick={() => setValue("amount", maxAvailableAmount)}
									className="h-12 pl-6 pr-3 mr-1 bg-white text-theme-primary focus:outline-none"
								>
									{t("TRANSACTION.SEND_ALL")}
								</button>
							</InputAddonEnd>
						</InputGroup>
					</FormField>
				</div>

				{!isSingle && amount > 0 && !!recipientAddress && (
					<Button
						data-testid="add-recipient__add-btn"
						variant="plain"
						className="w-full mt-4"
						onClick={() => onAddRecipient(recipientAddress as any, amount)}
					>
						{t("TRANSACTION.ADD_RECIPIENT")}
					</Button>
				)}
			</div>

			{!isSingle && addedRecipients.length > 0 && (
				<div className="border-b border-dotted border-theme-neutral-200">
					<RecipientList
						recipients={addedRecipients}
						isEditable={true}
						onRemove={onRemoveRecipient}
						assetSymbol={assetSymbol}
					/>
				</div>
			)}
		</AddRecipientWrapper>
	);
};

AddRecipient.defaultProps = {
	maxAvailableAmount: 0,
	assetSymbol: "ARK",
	availableAmount: null,
	isSingleRecipient: true,
	recipients: [],
};
