import Tippy from "@tippyjs/react";
import { Button } from "app/components/Button";
import { FormField, FormLabel } from "app/components/Form";
import { Icon } from "app/components/Icon";
import { Input, InputAddonEnd, InputGroup } from "app/components/Input";
import { SelectAddress } from "domains/profile/components/SelectAddress";
import { RecipientList } from "domains/transaction/components/RecipientList";
import { RecipientListItem } from "domains/transaction/components/RecipientList/RecipientList.models";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

import { AddRecipientProps, ToggleButtonProps } from "./AddRecipient.models";
import { AddRecipientWrapper } from "./AddRecipient.styles";

const ToggleButtons = ({ helpText, labelText, isSingle, singleLabel, multipleLabel, onChange }: ToggleButtonProps) => {
	return (
		<div className="text-theme-neutral-dark hover:text-theme-primary">
			<div className="flex mb-2 space-x-2">
				<div className="text-sm font-medium transition-colors duration-100">{labelText}</div>
				<div>
					<Tippy content={helpText}>
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
					{singleLabel}
				</Button>
				<Button
					variant={!isSingle ? "solid" : "plain"}
					className="flex-1 border-l-0"
					data-testid="add-recipient-is-multiple-toggle"
					onClick={() => onChange?.(false)}
				>
					{multipleLabel}
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
	singleLabel,
	multipleLabel,
	contacts,
	recipients,
	onChange,
	labelText,
	helpText,
}: AddRecipientProps) => {
	const [addedRecipients, setAddressRecipients] = useState(recipients as RecipientListItem[]);
	const [isSingle, setIsSingle] = useState(isSingleRecipient);

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
			<ToggleButtons
				isSingle={isSingle}
				labelText={labelText}
				helpText={helpText}
				singleLabel={singleLabel}
				multipleLabel={multipleLabel}
				onChange={(isSingle) => setIsSingle(isSingle)}
			/>

			<div
				data-testid="add-recipient__form-wrapper"
				className={`space-y-8 mt-8 mb-2 ${!isSingle ? "MultiRecipientWrapper" : ""}`}
			>
				<FormField name="recipientAddress" className="relative mt-1">
					<div className="mb-2">
						<FormLabel label={isSingle ? "Recipient" : `Recipient #${addedRecipients.length + 1}`} />
					</div>

					<SelectAddress
						address={recipientAddress as any}
						ref={register}
						contacts={contacts}
						onChange={(address: any) => setValue("recipientAddress", address)}
					/>
				</FormField>

				<FormField name="amount" className="relative mt-1">
					<div className="mb-2">
						<FormLabel label="Amount ARK" />
					</div>
					<InputGroup>
						<Input
							data-testid="add-recipient__amount-input"
							type="number"
							name="amount"
							placeholder="Amount"
							className="pr-20"
							ref={register}
						/>
						<InputAddonEnd>
							<button
								data-testid="add-recipient__send-all"
								onClick={() => setValue("amount", maxAvailableAmount)}
								className="h-12 pl-6 pr-3 mr-1 bg-white text-theme-primary focus:outline-none"
							>
								Send All
							</button>
						</InputAddonEnd>
					</InputGroup>
				</FormField>

				{!isSingle && amount > 0 && !!recipientAddress && (
					<Button
						data-testid="add-recipient__add-btn"
						variant="plain"
						className="w-full"
						onClick={() => onAddRecipient(recipientAddress as any, amount)}
					>
						Add Recipient
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
	singleLabel: "Single",
	multipleLabel: "Multiple",
	recipients: [],
	labelText: "Select a Single or Multiple Recipient Transaction",
	helpText: "A multiple recipient transaction allows up to 64 recipients in one transaction",
};
