import { NetworkData, Profile } from "@arkecosystem/platform-sdk-profiles";
import { FormField, FormHelperText, FormLabel } from "app/components/Form";
import { Input, InputGroup } from "app/components/Input";
import { SendTransactionForm } from "domains/transaction/components/SendTransactionForm";
import React from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const FirstStep = ({ networks, profile }: { networks: NetworkData[]; profile: Profile }) => {
	const { t } = useTranslation();
	const { getValues, setValue } = useFormContext();
	const { hash } = getValues();

	return (
		<section data-testid="SendIpfs__step--first">
			<div>
				<h1 className="mb-0">{t("TRANSACTION.PAGE_IPFS.FIRST_STEP.TITLE")}</h1>
				<div className="text-theme-neutral-dark">{t("TRANSACTION.PAGE_IPFS.FIRST_STEP.DESCRIPTION")}</div>
			</div>
			<div className="mt-8">
				<SendTransactionForm networks={networks} profile={profile} transactionType="ipfs">
					<>
						<FormField name="hash" className="relative mt-1">
							<div className="mb-2">
								<FormLabel label={t("TRANSACTION.IPFS_HASH")} />
							</div>
							<InputGroup>
								<Input
									data-testid="Input__hash"
									type="text"
									placeholder=" "
									className="pr-20"
									defaultValue={hash}
									onChange={(event: any) => setValue("hash", event.target.value, true)}
								/>
							</InputGroup>
							<FormHelperText />
						</FormField>
					</>
				</SendTransactionForm>
			</div>
		</section>
	);
};
