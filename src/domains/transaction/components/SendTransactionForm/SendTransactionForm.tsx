import { Address } from "app/components/Address";
import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { Divider } from "app/components/Divider";
import { Form, FormField, FormLabel } from "app/components/Form";
import { Icon } from "app/components/Icon";
import { Input, InputAddonEnd, InputGroup } from "app/components/Input";
import { InputRange } from "app/components/Input/InputRange";
import { Select } from "app/components/Select";
import { SelectAsset } from "app/components/SelectAsset";
import { SelectionBar, SelectionBarOption } from "app/components/SelectionBar";
import { useSelectionState } from "app/components/SelectionBar/useSelectionState";
import { RecipientList } from "domains/transaction/components/RecipientList";
import { RecipientListItem } from "domains/transaction/components/RecipientList/RecipientList.models";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { styled } from "twin.macro";

import { defaultStyle } from "./SendTransactionForm.styles";

type SendTransactionFormProps = {
	maxAvailableAmount: number;
	contactList: any;
	senderList: any;
	formDefaultData: any;
	feeRange: any;
	defaultFee: number;
	maxFee: number;
	assetSymbol: string;
	onSubmit?: any;
	onBack?: any;
	assets: any;
};

const ProfileFormField = ({ register, profiles, selectedProfile, formName, formLabel, disabled }: any) => {
	return (
		<FormField name={formName} className="relative h-20 mt-1">
			<div className="mb-2">
				<FormLabel label={formLabel} />
			</div>

			<InputGroup className="send-transaction__select-contact select-transparent">
				<Select
					data-testid={`send-transaction__select-${formName}`}
					disabled={disabled}
					placeholder=" "
					name={formName}
					ref={register}
				>
					{profiles &&
						profiles.map((profile: any, index: number) => (
							<option key={index} value={profile.address} data-testid="send-transaction__profile-select">
								{profile.formatted}
							</option>
						))}
				</Select>
				<InputAddonEnd>
					<button className="px-3 pr-2 text-theme-primary-300 focus:outline-none">
						<Icon name="User" width={20} height={20} />
					</button>
					<Divider type="vertical" />
					<button className="pl-2 pr-4 text-theme-primary-300 focus:outline-none">
						<Icon name="Receive" width={20} height={20} />
					</button>
				</InputAddonEnd>
			</InputGroup>

			{!selectedProfile && (
				<div className="absolute ml-4 -mt-10">
					<Circle className="mt-px bg-theme-neutral-200 border-theme-neutral-200" size="small" noShadow />
				</div>
			)}
			{selectedProfile && (
				<div className="flex ml-4 -mt-10">
					<Circle
						avatarId={selectedProfile?.address}
						className="bg-theme-neutral-300 border-theme-neutral-300"
						size="small"
						noShadow
					/>
					<div className="mt-1 ml-4 font-semibold text-theme-neutral-800">
						<Address
							maxChars={30}
							address={selectedProfile?.address}
							walletName={selectedProfile?.walletName}
						/>
					</div>
				</div>
			)}
		</FormField>
	);
};

const FormWrapper = styled.div`
	${defaultStyle}
`;

export const SendTransactionForm = ({
	feeRange,
	maxAvailableAmount,
	formDefaultData,
	contactList,
	senderList,
	maxFee,
	onSubmit,
	onBack,
	assetSymbol,
	assets,
}: SendTransactionFormProps) => {
	const [addedRecipients, setAddressRecipients] = useState([] as RecipientListItem[]);

	const form = useForm({ defaultValues: formDefaultData });
	const { setValue, register } = form;
	const { network, fee, sender, recipient, amount } = form.watch();
	const feeRangeValue = useSelectionState(0);

	const onClickBack = () => {
		if (typeof onBack === "function") onBack();
	};

	const onFormSubmit = () => {
		const formResult = { ...form.getValues(), ...{ recipients: addedRecipients } };
		if (typeof onSubmit === "function") onSubmit(formResult);
	};

	const getProfileInfo = (address: string) => {
		const profiles = [...contactList, ...senderList];
		return profiles.find((profile: any) => profile.address === address);
	};

	const onAddRecipient = (recipient: string, amount: number) => {
		const { walletName, address } = getProfileInfo(recipient);
		addedRecipients.push({ amount, walletName, address });
		setAddressRecipients(addedRecipients);

		// Reset values
		form.setValue("amount", 0);
		form.setValue("recipient", null);
	};

	const onRemoveRecipient = (address: string) => {
		const index = addedRecipients.findIndex((addedRecipient: any) => addedRecipient.address === address);
		const newRecipients = addedRecipients.concat();
		newRecipients.splice(index, 1);
		setAddressRecipients(newRecipients);
	};

	const availableContacts = contactList.filter((contact: any) => {
		if (addedRecipients.length === 0) return true;
		const added = addedRecipients.map(({ address }: any) => address);
		return !added.includes(contact.address);
	});

	return (
		<FormWrapper>
			<Form id="send-transaction__form" context={form} onSubmit={() => void 0}>
				<FormField name="network" className="relative mt-1">
					<div className="mb-2">
						<FormLabel label="Network" />
					</div>
					<SelectAsset assets={assets} name="network" value={network} />
				</FormField>

				<ProfileFormField
					formName="sender"
					formLabel="Sender"
					profiles={senderList}
					selectedProfile={getProfileInfo(sender)}
					register={register}
				/>

				<ProfileFormField
					formName="recipient"
					formLabel="Recipient"
					profiles={availableContacts}
					selectedProfile={getProfileInfo(recipient)}
					register={register}
				/>

				<FormField name="amount" className="relative mt-1">
					<div className="mb-2">
						<FormLabel label="Amount ARK" />
					</div>
					<InputGroup>
						<Input
							data-testid="send-transaction__amount-input"
							type="number"
							name="amount"
							placeholder="Amount"
							className="pr-20"
							ref={register}
						/>
						<InputAddonEnd>
							<button
								data-testid="send-transaction__send-all"
								onClick={() => setValue("amount", maxAvailableAmount)}
								className="pl-6 pr-4 bg-white text-theme-primary bg-theme-background focus:outline-none"
							>
								Send All
							</button>
						</InputAddonEnd>
					</InputGroup>
				</FormField>

				{amount > 0 && !!recipient && (
					<Button
						data-testid="send-transaction__add-recipient"
						variant="plain"
						className="w-full"
						onClick={() => onAddRecipient(recipient, amount)}
					>
						Add Recipient
					</Button>
				)}

				{addedRecipients.length > 0 && (
					<div>
						<div className="pb-4 mb-4 text-sm font-semibold text-theme-neutral-700">Recipients</div>
						<RecipientList
							recipients={addedRecipients}
							isEditable={true}
							onRemove={onRemoveRecipient}
							assetSymbol={assetSymbol}
						/>
					</div>
				)}

				<FormField name="smartbridge" className="relative mt-1">
					<div className="mb-2">
						<FormLabel label="Smartbridge" />
					</div>
					<InputGroup>
						<Input type="text" placeholder=" " className="pr-20" maxLength={255} />
						<InputAddonEnd>
							<button className="px-4 text-theme-neutral-400 focus:outline-none">255 Max</button>
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
					<Button data-testid="send-transaction-click-back" variant="plain" onClick={onClickBack}>
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
	assets: [],
	defaultFee: 0,
	formDefaultData: {
		network: null,
		sender: null,
		amount: null,
		smartbridge: null,
		fee: 0,
	},
	senderList: [],
	contactList: [],
};
