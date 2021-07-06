import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { Address } from "app/components/Address";
import { Avatar } from "app/components/Avatar";
import { FormField, FormLabel } from "app/components/Form";
import { Header } from "app/components/Header";
import { InputDefault } from "app/components/Input";
import { TransactionDetail, TransactionNetwork } from "domains/transaction/components/TransactionDetail";
import { alias } from "domains/wallet/validations";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { assertNetwork, assertWallet } from "utils/assertions";

export const SuccessStep = ({ profile }: { profile: Contracts.IProfile }) => {
	const { t } = useTranslation();

	const { getValues, register, watch } = useFormContext();

	// getValues does not get the value of `defaultValues` on first render
	const [defaultNetwork] = useState(() => watch("network"));
	const network = getValues("network") || defaultNetwork;

	const [defaultWallet] = useState(() => watch("wallet"));
	const wallet = getValues("wallet") || defaultWallet;

	assertNetwork(network);
	assertWallet(wallet);

	const aliasValidation = alias({ profile, t, wallet });

	return (
		<section data-testid="CreateWallet__SuccessStep">
			<Header
				title={t("WALLETS.PAGE_CREATE_WALLET.PROCESS_COMPLETED_STEP.TITLE")}
				subtitle={t("WALLETS.PAGE_CREATE_WALLET.PROCESS_COMPLETED_STEP.SUBTITLE")}
			/>

			<TransactionNetwork network={network} border={false} />

			<TransactionDetail
				label={t("COMMON.ADDRESS")}
				borderPosition="both"
				extra={<Avatar size="lg" address={wallet.address()} />}
			>
				<Address address={wallet.address()} />
			</TransactionDetail>

			<div className="pt-6">
				<FormField name="name">
					<FormLabel label={t("WALLETS.WALLET_NAME")} />
					<InputDefault
						data-testid="CreateWallet__wallet-name"
						ref={register(aliasValidation)}
						defaultValue={wallet.alias()}
					/>
				</FormField>
			</div>
		</section>
	);
};
