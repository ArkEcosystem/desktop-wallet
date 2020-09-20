import { Profile, ReadOnlyWallet, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { Button } from "app/components/Button";
import { FormField, FormHelperText, FormLabel } from "app/components/Form";
import { Spinner } from "app/components/Spinner";
import { SelectRecipient } from "domains/profile/components/SelectRecipient";
import { RecipientList } from "domains/transaction/components/RecipientList";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

export type Participant = {
	address: string;
	publicKey: string;
	balance: string;
};

type Props = { profile: Profile; wallet: ReadWriteWallet; onChange?: (wallets: Participant[]) => void };

export const AddParticipant = ({ profile, wallet, onChange }: Props) => {
	const { t } = useTranslation();

	const [isValidating, setIsValidating] = useState(false);
	const [participantsWallets, setParticipantsWallets] = useState<ReadWriteWallet[]>([]);
	const lastValidationRef = useRef<unknown | undefined>();

	const participants = useMemo(
		() =>
			participantsWallets.map((wallet) => ({
				address: wallet.address(),
				publicKey: wallet.publicKey()!,
				balance: wallet.balance().toString(),
			})),
		[participantsWallets],
	);

	const form = useForm();
	const { register, handleSubmit } = form;

	useEffect(() => {
		onChange?.(participants);
	}, [participants, onChange]);

	const addParticipant = () => {
		if (lastValidationRef.current) {
			setParticipantsWallets((prev) => [...prev, lastValidationRef.current as ReadWriteWallet]);
		}
	};

	const removeParticipant = (address: string) => {
		setParticipantsWallets((prev) => prev.filter((wallet) => wallet.address() !== address));
	};

	const findAddress = async (address: string) => {
		setIsValidating(true);
		lastValidationRef.current = undefined;

		try {
			let participantWallet: unknown = profile.wallets().findByAddress(address);

			if (!participantWallet) {
				const response = await wallet.client().wallets({ address });
				const remote = response.findByAddress(address);

				if (!remote) {
					return t("TRANSACTION.INPUT_MULTISIG.ADDRESS_NOT_FOUND");
				}

				participantWallet = remote;
			}

			if (!(participantWallet as ReadOnlyWallet)?.publicKey()) {
				return t("TRANSACTION.INPUT_MULTISIG.PUBLIC_KEY_NOT_FOUND");
			}

			lastValidationRef.current = participantWallet;
			return true;
		} catch {
			return t("TRANSACTION.INPUT_MULTISIG.ADDRESS_NOT_FOUND");
		} finally {
			setIsValidating(false);
		}
	};

	return (
		<div>
			<FormProvider {...form}>
				<FormField name="address" className="relative">
					<FormLabel label="Sender" />

					<SelectRecipient
						profile={profile}
						ref={register({
							required: true,
							validate: {
								findAddress,
							},
						})}
					/>
					<FormHelperText />
				</FormField>

				<Button
					data-testid="LinkCollection__add-link"
					className="w-full"
					variant="plain"
					type="button"
					onClick={handleSubmit(() => addParticipant())}
				>
					{isValidating ? <Spinner size="sm" /> : t("TRANSACTION.ADD_LINK")}
				</Button>
			</FormProvider>

			<RecipientList
				recipients={participants.map((item) => ({ ...item, amount: item.balance }))}
				assetSymbol={wallet.network().ticker()}
				onRemove={removeParticipant}
				isEditable
			/>
		</div>
	);
};
