import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { Button } from "app/components/Button";
import { FormField, FormLabel, SubForm } from "app/components/Form";
import { SelectRecipient } from "domains/profile/components/SelectRecipient";
import { RecipientList } from "domains/transaction/components/RecipientList";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

export interface Participant {
	address: string;
	publicKey: string;
}

interface Props {
	profile: Contracts.IProfile;
	wallet: Contracts.IReadWriteWallet;
	onChange?: (wallets: Participant[]) => void;
	defaultParticipants?: Participant[];
}

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

	const addParticipant = () => {
		const ref = lastValidationRef.current as Contracts.IReadWriteWallet;
		const participant = {
			address: ref.address(),
			publicKey: ref.publicKey()!,
		};

		const newParticipants = [...participants, participant];
		setParticipants(newParticipants);
		onChange?.(newParticipants);

		setValue("address", "");
	};

	const removeParticipant = (index: number) => {
		const remainingParticipants = [...participants];
		remainingParticipants.splice(index, 1);

		setParticipants(remainingParticipants);
		onChange?.(remainingParticipants);
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

				if (!(participantWallet as Contracts.IReadOnlyWallet)?.publicKey()) {
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
					buttonTooltip={t("TRANSACTION.MULTISIGNATURE.REMOVE_NOT_ALLOWED")}
					disableButton={(address: string) => address === wallet.address()}
					onRemove={removeParticipant}
					label="TRANSACTION.MULTISIGNATURE.PARTICIPANT_#"
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
