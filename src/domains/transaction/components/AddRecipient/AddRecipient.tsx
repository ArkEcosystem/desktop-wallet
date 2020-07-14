import { Button } from "app/components/Button";
import { FormField, FormLabel } from "app/components/Form";
import { Input, InputAddonEnd, InputGroup } from "app/components/Input";
import { SelectAddress } from "domains/profile/components/SelectAddress";
import { RecipientList } from "domains/transaction/components/RecipientList";
import { RecipientListItem } from "domains/transaction/components/RecipientList/RecipientList.models";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { styled } from "twin.macro";

import { defaultStyle } from "./AddRecipient.styles";

type AddRecipientProps = {
	maxAvailableAmount: number;
	availableAmount: number;
	assetSymbol: string;
	onSubmit?: any;
	onBack?: any;
	isSingleRecipient?: boolean;
	singleLabel?: string;
	multipleLabel?: string;
	contacts?: any;
};

const FormWrapper = styled.div`
	${defaultStyle}
`;

export const AddRecipient = ({
	maxAvailableAmount,
	availableAmount,
	assetSymbol,
	isSingleRecipient,
	singleLabel,
	multipleLabel,
	contacts,
}: AddRecipientProps) => {
	const [addedRecipients, setAddressRecipients] = useState([] as RecipientListItem[]);
	const [isSingle, setIsSingle] = useState(isSingleRecipient);

	const form = useForm({
		defaultValues: { amount: availableAmount, recipientAddress: null, isSingle: isSingleRecipient },
	});
	const { setValue, register } = form;
	const { recipientAddress, amount } = form.watch();

	const onAddRecipient = (address: string, amount: number) => {
		addedRecipients.push({ amount, address });
		setAddressRecipients(addedRecipients);

		form.setValue("amount", 0);
		form.setValue("recipientAddress", null);
	};

	const onRemoveRecipient = (address: string) => {
		const index = addedRecipients.findIndex((addedRecipient: any) => addedRecipient.address === address);
		const newRecipients = addedRecipients.concat();
		newRecipients.splice(index, 1);
		setAddressRecipients(newRecipients);
	};

	return (
		<FormWrapper>
			<div className="flex items-stretch select-buttons">
				<Button
					variant={isSingle ? "solid" : "plain"}
					className="flex-1"
					data-testid="add-recipient-is-single-toggle"
					onClick={() => setIsSingle(true)}
				>
					{singleLabel}
				</Button>
				<Button
					variant={!isSingle ? "solid" : "plain"}
					className="flex-1 border-l-0"
					data-testid="add-recipient-is-multiple-toggle"
					onClick={() => setIsSingle(false)}
				>
					{multipleLabel}
				</Button>
			</div>

			<div
				data-testid="add-recipient__form-wrapper"
				className={`space-y-8 mt-12 rounded-sm ${!isSingle ? "MultiRecipientWrapper" : ""}`}
			>
				<FormField name="recipientAddress" className="relative mt-1">
					<div className="mb-2">
						<FormLabel label="Recipient" />
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
								className="pl-6 pr-3 mr-1 bg-white text-theme-primary bg-theme-background focus:outline-none"
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
				<div className="mt-12">
					<RecipientList
						recipients={addedRecipients}
						isEditable={true}
						onRemove={onRemoveRecipient}
						assetSymbol={assetSymbol}
					/>
				</div>
			)}
		</FormWrapper>
	);
};

AddRecipient.defaultProps = {
	maxAvailableAmount: 0,
	assetSymbol: "ARK",
	availableAmount: null,
	isSingleRecipient: true,
	singleLabel: "Single",
	multipleLabel: "Multiple",
};
