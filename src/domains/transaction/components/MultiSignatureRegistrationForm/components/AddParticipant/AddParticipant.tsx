import { Profile, ReadOnlyWallet, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { Button } from "app/components/Button";
import { FormField, FormLabel, SubForm } from "app/components/Form";
import { toasts } from "app/services";
import { SelectRecipient } from "domains/profile/components/SelectRecipient";
import { RecipientList } from "domains/transaction/components/RecipientList";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

export type Participant = {
	address: string;
	publicKey: string;
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
				},
			]);
		}
	}, [wallet, defaultParticipants]);

	useEffect(() => {
		onChange?.(participants);
	}, [onChange, participants]);

	const addParticipant = () => {
		const ref = lastValidationRef.current as ReadWriteWallet;
		const participant = {
			address: ref.address(),
			publicKey: ref.publicKey()!,
		};
		setParticipants((prev) => [...prev, participant]);
		setValue("address", "");
	};

	const removeParticipant = (address: string) => {
		if (address === wallet.address()) {
			toasts.error(t("TRANSACTION.MULTISIGNATURE.ERROR.REMOVE_OWN_ADDRESS"));
			return;
		}
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
				<SubForm>
					<FormField name="address">
						<FormLabel label={t("TRANSACTION.MULTISIGNATURE.PARTICIPANT")} />
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
					</FormField>

					<Button
						className="my-4 w-full"
						variant="secondary"
						type="button"
						disabled={isValidating || !address}
						isLoading={isValidating}
						onClick={handleSubmit(() => addParticipant())}
					>
						{t("TRANSACTION.MULTISIGNATURE.ADD_PARTICIPANT")}
					</Button>
				</SubForm>
			</FormProvider>

			<div className="mt-3 border-b border-dashed border-theme-secondary-300 dark:border-theme-secondary-800">
				<RecipientList
					recipients={participants}
					assetSymbol={wallet.network().ticker()}
					onRemove={removeParticipant}
					label={t("COMMON.PARTICIPANT")}
					showAmount={false}
					isEditable
				/>
			</div>
		</div>
	);
};

AddParticipant.defaultProps = {
	defaultParticipants: [],
};
