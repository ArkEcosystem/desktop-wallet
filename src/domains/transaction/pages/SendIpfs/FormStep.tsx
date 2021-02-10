import { Coins } from "@arkecosystem/platform-sdk";
import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { FormField, FormLabel } from "app/components/Form";
import { Header } from "app/components/Header";
import { InputDefault } from "app/components/Input";
import { SendTransactionForm } from "domains/transaction/components/SendTransactionForm";
import React from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const FormStep = ({ networks, profile }: { networks: Coins.Network[]; profile: Profile }) => {
	const { t } = useTranslation();
	const { getValues, setValue } = useFormContext();
	const { hash } = getValues();

	return (
		<section data-testid="SendIpfs__form-step" className="space-y-8">
			<Header
				title={t("TRANSACTION.PAGE_IPFS.FIRST_STEP.TITLE")}
				subtitle={t("TRANSACTION.PAGE_IPFS.FIRST_STEP.DESCRIPTION")}
			/>

			<SendTransactionForm networks={networks} profile={profile} transactionType="ipfs" hasWalletId={true}>
				<FormField name="hash">
					<FormLabel label={t("TRANSACTION.IPFS_HASH")} />
					<InputDefault
						data-testid="Input__hash"
						type="text"
						placeholder=" "
						className="pr-20"
						defaultValue={hash}
						onChange={(event: any) =>
							setValue("hash", event.target.value, {
								shouldValidate: true,
								shouldDirty: true,
							})
						}
					/>
				</FormField>
			</SendTransactionForm>
		</section>
	);
};
