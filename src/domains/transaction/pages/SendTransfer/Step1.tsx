import { Contracts } from "@arkecosystem/platform-sdk";
import { NetworkData, Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { upperFirst } from "@arkecosystem/utils";
import { Address } from "app/components/Address";
import { Avatar } from "app/components/Avatar";
import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { Form, FormField, FormHelperText, FormLabel } from "app/components/Form";
import { Icon } from "app/components/Icon";
import { Input, InputAddonEnd, InputGroup, InputPassword } from "app/components/Input";
import { Label } from "app/components/Label";
import { Page, Section } from "app/components/Layout";
import { StepIndicator } from "app/components/StepIndicator";
import { TabPanel, Tabs } from "app/components/Tabs";
import { TransactionDetail } from "app/components/TransactionDetail";
import { useEnvironmentContext } from "app/contexts";
import { useClipboard } from "app/hooks";
import { useActiveProfile, useActiveWallet } from "app/hooks/env";
import { AddRecipient } from "domains/transaction/components/AddRecipient";
import { LedgerConfirmation } from "domains/transaction/components/LedgerConfirmation";
import { RecipientList } from "domains/transaction/components/RecipientList";
import { RecipientListItem } from "domains/transaction/components/RecipientList/RecipientList.models";
import { SendTransactionForm } from "domains/transaction/components/SendTransactionForm";
import { TotalAmountBox } from "domains/transaction/components/TotalAmountBox";
import { TransactionSuccessful } from "domains/transaction/components/TransactionSuccessful";
import React, { useEffect, useMemo, useState } from "react";
import { useForm, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

export const FirstStep = ({ networks, profile }: { networks: NetworkData[]; profile: Profile }) => {
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
								onChange={(recipients: RecipientListItem[]) => setValue("recipients", recipients, true)}
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
									onChange={(event: any) => setValue("smartbridge", event.target.value, true)}
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
