import { Network } from "@arkecosystem/platform-sdk/dist/coins";
import { Address } from "app/components/Address";
import { Avatar } from "app/components/Avatar";
import { Divider } from "app/components/Divider";
import { FormField, FormHelperText, FormLabel } from "app/components/Form";
import { Header } from "app/components/Header";
import { Input } from "app/components/Input";
import { LedgerData } from "app/contexts/Ledger/utils";
import { NetworkIcon } from "domains/network/components/NetworkIcon";
import { TransactionDetail } from "domains/transaction/components/TransactionDetail";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const LedgerImportStep = ({ wallets }: { wallets: LedgerData[] }) => {
	const { t } = useTranslation();
	const { watch, register } = useFormContext();

	const [network] = useState<Network>(() => watch("network"));

	return (
		<section data-testid="LedgerImportStep" className="space-y-8">
			<Header
				title={t("WALLETS.PAGE_IMPORT_WALLET.PROCESS_COMPLETED_STEP.TITLE")}
				subtitle={t("WALLETS.PAGE_IMPORT_WALLET.PROCESS_COMPLETED_STEP.SUBTITLE")}
			/>

			<TransactionDetail
				label={t("COMMON.CRYPTOASSET")}
				extra={<NetworkIcon size="lg" coin={network.coin()} network={network.id()} />}
				borderPosition="bottom"
				paddingPosition="bottom"
			>
				{network.name()}
			</TransactionDetail>

			<ul>
				{wallets.map((wallet) => (
					<li key={wallet.address}>
						<TransactionDetail
							label={t("COMMON.ADDRESS")}
							extra={<Avatar size="lg" address={wallet.address} />}
							paddingPosition="bottom"
							border={false}
						>
							<Address address={wallet.address} maxChars={0} />
						</TransactionDetail>

						<FormField name={`names.${wallet.address}`}>
							<FormLabel label={t("WALLETS.PAGE_IMPORT_WALLET.WALLET_NAME")} required={false} optional />
							<Input
								ref={register({
									maxLength: {
										value: 42,
										message: t("WALLETS.PAGE_IMPORT_WALLET.VALIDATION.MAXLENGTH_ERROR", {
											maxLength: 42,
										}),
									},
								})}
								data-testid="ImportWallet__name-input"
							/>
							<FormHelperText />
						</FormField>

						<Divider dashed />
					</li>
				))}
			</ul>
		</section>
	);
};
