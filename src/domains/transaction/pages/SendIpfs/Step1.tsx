import { Coins } from "@arkecosystem/platform-sdk";
import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { FormField, FormHelperText, FormLabel } from "app/components/Form";
import { Header } from "app/components/Header";
import { Input, InputGroup } from "app/components/Input";
import { SendTransactionForm } from "domains/transaction/components/SendTransactionForm";
import React from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const FirstStep = ({ networks, profile }: { networks: Coins.Network[]; profile: Profile }) => {
	const { t } = useTranslation();
	const { getValues, setValue } = useFormContext();
	const { hash } = getValues();

	return (
		<section data-testid="SendIpfs__step--first" className="space-y-8">
			<Header
				title={t("TRANSACTION.PAGE_IPFS.FIRST_STEP.TITLE")}
				subtitle={t("TRANSACTION.PAGE_IPFS.FIRST_STEP.DESCRIPTION")}
			/>

			<SendTransactionForm networks={networks} profile={profile} transactionType="ipfs">
				<FormField name="hash">
					<FormLabel label={t("TRANSACTION.IPFS_HASH")} />
					<InputGroup>
						<Input
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
					</InputGroup>
					<FormHelperText />
				</FormField>
			</SendTransactionForm>
		</section>
	);
};
