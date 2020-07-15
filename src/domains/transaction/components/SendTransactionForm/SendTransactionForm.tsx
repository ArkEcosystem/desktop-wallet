import { Button } from "app/components/Button";
import { Form, FormField, FormLabel } from "app/components/Form";
import { Input, InputAddonEnd, InputGroup } from "app/components/Input";
import { InputRange } from "app/components/Input/InputRange";
import { SelectionBar, SelectionBarOption } from "app/components/SelectionBar";
import { useSelectionState } from "app/components/SelectionBar/useSelectionState";
import { SelectNetwork } from "app/components/SelectNetwork";
import { SelectAddress } from "domains/profile/components/SelectAddress";
import { AddRecipient } from "domains/transaction/components/AddRecipient";
import { RecipientListItem } from "domains/transaction/components/RecipientList/RecipientList.models";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { styled } from "twin.macro";

import { defaultStyle } from "./SendTransactionForm.styles";

type SendTransactionFormProps = {
	maxAvailableAmount: number;
	formDefaultData: any;
	feeRange: any;
	defaultFee: number;
	maxFee: number;
	assetSymbol: string;
	onSubmit?: any;
	onBack?: any;
	networks: any;
	contacts: any[];
	profiles: any[];
};

const FormWrapper = styled.div`
	${defaultStyle}
`;

export const SendTransactionForm = ({
	feeRange,
	maxAvailableAmount,
	formDefaultData,
	maxFee,
	onSubmit,
	onBack,
	assetSymbol,
	networks,
	contacts,
	profiles,
}: SendTransactionFormProps) => {
	const [addedRecipients] = useState([] as RecipientListItem[]);

	const form = useForm({ defaultValues: formDefaultData });
	const { register } = form;
	const { network, fee, sender, amount } = form.watch();
	const feeRangeValue = useSelectionState(0);

	const onFormSubmit = () => {
		const formResult = { ...form.getValues(), ...{ recipients: addedRecipients } };
		onSubmit?.(formResult);
	};

	return (
		<FormWrapper>
			<Form id="send-transaction__form" context={form} onSubmit={() => void 0}>
				<FormField name="network" className="relative mt-1">
					<div className="mb-2">
						<FormLabel label="Network" />
					</div>
					<SelectNetwork networks={networks} name="network" value={network} />
				</FormField>

				<FormField name="sender" className="relative mt-1">
					<div className="mb-2">
						<FormLabel label="Sender" />
					</div>

					<div data-testid="sender-address">
						<SelectAddress
							contactSearchTitle="My addresses"
							contactSearchDescription="Find and select preferred address from you saved profiles"
							address={sender}
							ref={register}
							contacts={profiles}
						/>
					</div>
				</FormField>

				<div data-testid="recipient-address">
					<AddRecipient
						assetSymbol={assetSymbol}
						maxAvailableAmount={maxAvailableAmount}
						availableAmount={amount}
						contacts={contacts}
					/>
				</div>

				<FormField name="smartbridge" className="relative mt-1">
					<div className="mb-2">
						<FormLabel label="Smartbridge" />
					</div>
					<InputGroup>
						<Input type="text" placeholder=" " className="pr-20" maxLength={255} />
						<InputAddonEnd>
							<button className="px-4 text-theme-neutral-light focus:outline-none">255 Max</button>
						</InputAddonEnd>
					</InputGroup>
				</FormField>

				<div className="flex">
					<div className="w-2/4">
						<FormField name="fee" className="relative mt-1">
							<div className="mb-2">
								<FormLabel label="Fee ARK" />
								<InputRange ref={register} defaultValue={fee} min={0} max={maxFee} step={0.01} />
							</div>
						</FormField>
					</div>
					<div className="w-2/4 text-right mt-7">
						<SelectionBar>
							<SelectionBarOption value={feeRange.last} {...feeRangeValue}>
								Last
							</SelectionBarOption>
							<SelectionBarOption value={feeRange.min} {...feeRangeValue}>
								Min
							</SelectionBarOption>
							<SelectionBarOption value={feeRange.average} {...feeRangeValue}>
								Average
							</SelectionBarOption>
						</SelectionBar>
					</div>
				</div>
				<div className="flex justify-end space-x-3">
					<Button data-testid="send-transaction-click-back" variant="plain" onClick={() => onBack?.()}>
						Back
					</Button>
					<Button data-testid="send-transaction-click-submit" type="submit" onClick={onFormSubmit}>
						Continue
					</Button>
				</div>
			</Form>
		</FormWrapper>
	);
};

SendTransactionForm.defaultProps = {
	maxFee: 100,
	maxAvailableAmount: 0,
	assetSymbol: "ARK",
	feeRange: {
		last: 10,
		min: 1,
		average: 14,
	},
	networks: [],
	defaultFee: 0,
	formDefaultData: {
		network: null,
		sender: null,
		amount: null,
		smartbridge: null,
		fee: 0,
	},
	profiles: [],
};
