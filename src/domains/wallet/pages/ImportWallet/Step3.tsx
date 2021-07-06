import { Networks } from "@arkecosystem/platform-sdk";
import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { Address } from "app/components/Address";
import { AmountCrypto } from "app/components/Amount";
import { Avatar } from "app/components/Avatar";
import { FormField, FormLabel } from "app/components/Form";
import { Header } from "app/components/Header";
import { InputDefault } from "app/components/Input";
import { TransactionDetail, TransactionNetwork } from "domains/transaction/components/TransactionDetail";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { assertWallet } from "utils/assertions";

const ALIAS_MAX_LENGTH = 42;

export const ThirdStep = ({
	importedWallet,
	profile,
}: {
	importedWallet: Contracts.IReadWriteWallet | undefined;
	profile: Contracts.IProfile;
}) => {
	assertWallet(importedWallet);

	const { getValues, register, watch } = useFormContext();
	const { t } = useTranslation();

	// getValues does not get the value of `defaultValues` on first render
	const [defaultNetwork] = useState(() => watch("network"));
	const network: Networks.Network = getValues("network") || defaultNetwork;

	const validation = {
		maxLength: {
			message: t("WALLETS.PAGE_IMPORT_WALLET.VALIDATION.MAXLENGTH_ERROR", {
				maxLength: ALIAS_MAX_LENGTH,
			}),
			value: ALIAS_MAX_LENGTH,
		},
		required: t("WALLETS.PAGE_IMPORT_WALLET.VALIDATION.ALIAS_REQUIRED"),
		validate: {
			duplicateAlias: (alias: string) => {
				const walletSameAlias = profile.wallets().findByAlias(alias.trim());

				if (!walletSameAlias || walletSameAlias.id() === importedWallet.id()) {
					return true;
				}

				return t("WALLETS.PAGE_IMPORT_WALLET.VALIDATION.ALIAS_EXISTS", {
					alias: alias.trim(),
				});
			},
		},
	};

	return (
		<section data-testid="ImportWallet__third-step">
			<Header
				title={t("WALLETS.PAGE_IMPORT_WALLET.PROCESS_COMPLETED_STEP.TITLE")}
				subtitle={t("WALLETS.PAGE_IMPORT_WALLET.PROCESS_COMPLETED_STEP.SUBTITLE")}
			/>

			<div>
				<TransactionNetwork network={network} border={false} />

				<TransactionDetail
					label={t("COMMON.ADDRESS")}
					borderPosition="bottom"
					extra={<Avatar size="lg" address={importedWallet.address()} />}
				>
					<Address address={importedWallet.address()} />
				</TransactionDetail>
			</div>

			<TransactionDetail label={t("COMMON.BALANCE")} borderPosition="bottom" paddingPosition="bottom">
				<AmountCrypto value={importedWallet.balance()} ticker={network.ticker()} />
			</TransactionDetail>

			<FormField name="name">
				<FormLabel label={t("WALLETS.WALLET_NAME")} />
				<InputDefault
					ref={register(validation)}
					data-testid="ImportWallet__name-input"
					defaultValue={importedWallet.alias()}
				/>
			</FormField>
		</section>
	);
};
