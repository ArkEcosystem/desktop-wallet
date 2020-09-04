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
import { Input, InputGroup, InputPassword } from "app/components/Input";
import { Label } from "app/components/Label";
import { Page, Section } from "app/components/Layout";
import { StepIndicator } from "app/components/StepIndicator";
import { TabPanel, Tabs } from "app/components/Tabs";
import { TransactionDetail } from "app/components/TransactionDetail";
import { useEnvironmentContext } from "app/contexts";
import { useClipboard } from "app/hooks";
import { useActiveProfile, useActiveWallet } from "app/hooks/env";
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
	const { hash } = getValues();

	return (
		<section data-testid="SendIpfs__step--first">
			<div>
				<h1 className="mb-0">{t("TRANSACTION.PAGE_IPFS.FIRST_STEP.TITLE")}</h1>
				<div className="text-theme-neutral-dark">{t("TRANSACTION.PAGE_IPFS.FIRST_STEP.DESCRIPTION")}</div>
			</div>
			<div className="mt-8">
				<SendTransactionForm networks={networks} profile={profile}>
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
