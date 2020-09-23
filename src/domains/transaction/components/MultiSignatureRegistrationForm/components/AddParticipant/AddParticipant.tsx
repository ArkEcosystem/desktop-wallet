import { Profile, ReadOnlyWallet, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { Button } from "app/components/Button";
import { FormField, FormHelperText, FormLabel } from "app/components/Form";
import { Spinner } from "app/components/Spinner";
import { SelectRecipient } from "domains/profile/components/SelectRecipient";
import { RecipientList } from "domains/transaction/components/RecipientList";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

export type Participant = {
	address: string;
	publicKey: string;
	balance: string;
};

type Props = {
	profile: Profile;
	wallet: ReadWriteWallet;
	onChange?: (wallets: Participant[]) => void;
	defaultParticipants?: Participant[];
};

export const AddParticipant = ({ profile, wallet, onChange, defaultParticipants }: Props) => {
	const { t } = useTranslation();

	const [isValidating, setIsValidating] = useState(false);
	const [participants, setParticipants] = useState<Participant[]>(defaultParticipants!);
	const lastValidationRef = useRef<unknown | undefined>();

	const form = useForm({ mode: "onSubmit", reValidateMode: "onSubmit" });
	const { register, handleSubmit, setValue, watch } = form;
	const address = watch("address");

	useEffect(() => {
		if (!defaultParticipants!.length) {
			setParticipants([
				{
					address: wallet.address(),
					publicKey: wallet.publicKey()!,
					balance: wallet.balance().toString(),
				},
			]);
		}
	}, [wallet, defaultParticipants]);

	useEffect(() => {
		onChange?.(participants);
	}, [onChange, participants]);

	const addParticipant = () => {
		if (lastValidationRef.current) {
			const ref = lastValidationRef.current as ReadWriteWallet;
			const participant = {
				address: ref.address(),
				publicKey: ref.publicKey()!,
				balance: ref.balance().toString(),
			};
			setParticipants((prev) => [...prev, participant]);
			setValue("address", "");
		}
	};

	const removeParticipant = (address: string) => {
		setParticipants((prev) => prev.filter((wallet) => wallet.address !== address));
	};

	const findDuplicate = useCallback(
		(address: string) => {
			if (participants.some((item) => item.address === address)) {
				return t("TRANSACTION.MULTISIGNATURE.ERROR.ADDRESS_ALREADY_ADDED");
			}
			return true;
		},
		[participants, t],
	);

	const findByAddress = useCallback(
		async (address: string) => {
			setIsValidating(true);
			lastValidationRef.current = undefined;

			try {
				let participantWallet: unknown = profile.wallets().findByAddress(address);

				if (!participantWallet) {
					const response = await wallet.client().wallets({ address });
					const remote = response.findByAddress(address);

					if (!remote) {
						return t("TRANSACTION.MULTISIGNATURE.ERROR.ADDRESS_NOT_FOUND");
					}

					participantWallet = remote;
				}

				if (!(participantWallet as ReadOnlyWallet)?.publicKey()) {
					return t("TRANSACTION.MULTISIGNATURE.ERROR.PUBLIC_KEY_NOT_FOUND");
				}

				lastValidationRef.current = participantWallet;
				return true;
			} catch {
				return t("TRANSACTION.MULTISIGNATURE.ERROR.ADDRESS_NOT_FOUND");
			} finally {
				setIsValidating(false);
			}
		},
		[profile, t, wallet],
	);

	return (
		<div>
			<FormProvider {...form}>
				<FormField name="address" className="relative">
					<FormLabel label={t("TRANSACTION.MULTISIGNATURE.PARTICIPANT_ADDRESS")} />

					<SelectRecipient
						address={address}
						profile={profile}
						ref={register({
							required: true,
							validate: {
								findDuplicate,
								findByAddress,
							},
						})}
						onChange={(address: string) => setValue("address", address, { shouldDirty: true })}
					/>
					<FormHelperText />
				</FormField>

				<Button
					className="w-full my-4"
					variant="plain"
					type="button"
					onClick={handleSubmit(() => addParticipant())}
				>
					{isValidating ? <Spinner size="sm" /> : t("TRANSACTION.MULTISIGNATURE.ADD_PARTICIPANT")}
				</Button>
			</FormProvider>

			<FormField name="participants">
				<FormLabel label={t("TRANSACTION.MULTISIGNATURE.PARTICIPANTS")} />
				<RecipientList
					recipients={participants.map((item) => ({ ...item, amount: BigNumber.make(item.balance) }))}
					assetSymbol={wallet.network().ticker()}
					onRemove={removeParticipant}
					isEditable
				/>
			</FormField>
		</div>
	);
};

AddParticipant.defaultProps = {
	defaultParticipants: [],
};
