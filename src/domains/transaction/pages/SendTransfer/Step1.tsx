import { Coins } from "@arkecosystem/platform-sdk";
import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { FormField, FormLabel } from "app/components/Form";
import { Input, InputAddonEnd, InputGroup } from "app/components/Input";
import { AddRecipient } from "domains/transaction/components/AddRecipient";
import { RecipientListItem } from "domains/transaction/components/RecipientList/RecipientList.models";
import { SendTransactionForm } from "domains/transaction/components/SendTransactionForm";
import React from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const FormStep = ({ networks, profile }: { networks: Coins.Network[]; profile: Profile }) => {
	const { t } = useTranslation();
	const { getValues, setValue } = useFormContext();
	const { recipients, smartbridge } = getValues();

	return (
		<section data-testid="SendTransfer__step--first">
			<div>
				<h1 className="mb-0">{t("TRANSACTION.PAGE_TRANSACTION_SEND.FIRST_STEP.TITLE")}</h1>
				<div className="text-theme-neutral-dark">
					{t("TRANSACTION.PAGE_TRANSACTION_SEND.FIRST_STEP.DESCRIPTION")}
				</div>
			</div>
			<div className="mt-8">
				<SendTransactionForm networks={networks} profile={profile}>
					<>
						<div data-testid="recipient-address">
							<AddRecipient
								maxAvailableAmount={80}
								profile={profile}
								onChange={(recipients: RecipientListItem[]) =>
									setValue("recipients", recipients, { shouldValidate: true, shouldDirty: true })
								}
								recipients={recipients}
							/>
						</div>

						<FormField name="smartbridge" className="relative">
							<div className="mb-2">
								<FormLabel label="Smartbridge" />
							</div>
							<InputGroup>
								<Input
									data-testid="Input__smartbridge"
									type="text"
									placeholder=" "
									className="pr-24"
									maxLength={255}
									defaultValue={smartbridge}
									onChange={(event: any) =>
										setValue("smartbridge", event.target.value, {
											shouldValidate: true,
											shouldDirty: true,
										})
									}
								/>
								<InputAddonEnd>
									<button type="button" className="px-4 text-theme-neutral-light focus:outline-none">
										255 Max
									</button>
								</InputAddonEnd>
							</InputGroup>
						</FormField>
					</>
				</SendTransactionForm>
			</div>
		</section>
	);
};
