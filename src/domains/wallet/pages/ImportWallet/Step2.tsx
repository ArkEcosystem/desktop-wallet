import { Coins } from "@arkecosystem/platform-sdk";
import { NetworkData, Profile, ReadWriteWallet, WalletSetting } from "@arkecosystem/platform-sdk-profiles";
import { Avatar } from "app/components/Avatar";
import { Button } from "app/components/Button";
import { Divider } from "app/components/Divider";
import { Form, FormField, FormHelperText, FormLabel } from "app/components/Form";
import { Header } from "app/components/Header";
import { Input, InputAddress, InputPassword } from "app/components/Input";
import { Page, Section } from "app/components/Layout";
import { StepIndicator } from "app/components/StepIndicator";
import { TabPanel, Tabs } from "app/components/Tabs";
import { Toggle } from "app/components/Toggle";
import { useEnvironmentContext } from "app/contexts";
import { useActiveProfile } from "app/hooks/env";
import { NetworkIcon } from "domains/network/components/NetworkIcon";
import { SelectNetwork } from "domains/network/components/SelectNetwork";
import { getNetworkExtendedData } from "domains/network/helpers";
import React, { useEffect, useMemo, useState } from "react";
import { useForm, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

export const SecondStep = ({ profile }: { profile: Profile }) => {
	const { env } = useEnvironmentContext();
	const { getValues, register, unregister } = useFormContext();
	const [isAddressOnly, setIsAddressOnly] = useState(false);

	const network: NetworkData = getValues("network");

	const { t } = useTranslation();

	const renderImportInput = () => {
		if (!isAddressOnly) {
			return (
				<FormField name="passphrase">
					<FormLabel label={t("COMMON.YOUR_PASSPHRASE")} />
					<InputPassword
						ref={register({
							required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
								field: t("COMMON.YOUR_PASSPHRASE"),
							}).toString(),
							validate: async (passphrase) => {
								const instance: Coins.Coin = await env.coin(network.coin(), network.id());
								const address = await instance.identity().address().fromMnemonic(passphrase);

								return (
									!profile.wallets().findByAddress(address) ||
									t("COMMON.INPUT_PASSPHRASE.VALIDATION.ADDRESS_ALREADY_EXISTS", {
										address,
									}).toString()
								);
							},
						})}
						data-testid="ImportWallet__passphrase-input"
					/>
					<FormHelperText />
				</FormField>
			);
		}

		return (
			<FormField name="address">
				<FormLabel label={t("COMMON.ADDRESS")} />
				<InputAddress
					coin={network.coin()}
					network={network.id()}
					registerRef={register}
					additionalRules={{
						required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
							field: t("COMMON.ADDRESS"),
						}).toString(),
						validate: {
							duplicateAddress: (address) =>
								!profile.wallets().findByAddress(address) ||
								t("COMMON.INPUT_ADDRESS.VALIDATION.ADDRESS_ALREADY_EXISTS", { address }).toString(),
						},
					}}
					data-testid="ImportWallet__address-input"
				/>
				<FormHelperText />
			</FormField>
		);
	};

	return (
		<section className="space-y-8" data-testid="ImportWallet__second-step">
			<div className="my-8">
				<Header
					title={t("WALLETS.PAGE_IMPORT_WALLET.METHOD_STEP.TITLE")}
					subtitle={t("WALLETS.PAGE_IMPORT_WALLET.METHOD_STEP.SUBTITLE")}
				/>
			</div>
			<div className="flex flex-col mt-8">
				<div className="flex items-center justify-between">
					<div className="text-lg font-semibold text-theme-neutral-dark">
						{t("WALLETS.PAGE_IMPORT_WALLET.METHOD_STEP.ADDRESS_ONLY.TITLE")}
					</div>

					<Toggle
						name="isAddressOnly"
						checked={isAddressOnly}
						onChange={() => {
							unregister("passphrase");
							setIsAddressOnly(!isAddressOnly);
						}}
						data-testid="ImportWallet__address-toggle"
					/>
				</div>

				<div className="pr-12 mt-1 text-sm text-theme-neutral">
					{t("WALLETS.PAGE_IMPORT_WALLET.METHOD_STEP.ADDRESS_ONLY.DESCRIPTION")}
				</div>
			</div>
			<div className="mt-8" data-testid="ImportWallet__fields">
				{renderImportInput()}
			</div>
		</section>
	);
};
