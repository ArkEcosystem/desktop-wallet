import { Environment, NetworkData, Profile, ReadWriteWallet, WalletSetting } from "@arkecosystem/platform-sdk-profiles";
import { Alert } from "app/components/Alert";
import { Avatar } from "app/components/Avatar";
import { Button } from "app/components/Button";
import { Clipboard } from "app/components/Clipboard";
import { Divider } from "app/components/Divider";
import { Form, FormField, FormHelperText, FormLabel } from "app/components/Form";
import { Header } from "app/components/Header";
import { Icon } from "app/components/Icon";
import { Input } from "app/components/Input";
import { Page, Section } from "app/components/Layout";
import { StepIndicator } from "app/components/StepIndicator";
import { TabPanel, Tabs } from "app/components/Tabs";
import { useEnvironmentContext } from "app/contexts";
import { useActiveProfile } from "app/hooks/env";
import { NetworkIcon } from "domains/network/components/NetworkIcon";
import { SelectNetwork } from "domains/network/components/SelectNetwork";
import { getNetworkExtendedData } from "domains/network/helpers";
import React, { useEffect, useMemo, useState } from "react";
import { useForm, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { MnemonicList } from "../../components/MnemonicList";
import { MnemonicVerification } from "../../components/MnemonicVerification";

export const SecondStep = () => {
	const { getValues, unregister } = useFormContext();
	const mnemonic = getValues("mnemonic");

	const { t } = useTranslation();

	useEffect(() => {
		unregister("verification");
	}, [unregister]);

	return (
		<section data-testid="CreateWallet__second-step">
			<div className="my-8">
				<Header title={t("WALLETS.PAGE_CREATE_WALLET.PASSPHRASE_STEP.TITLE")} />
			</div>

			<div className="space-y-8">
				<Alert size="lg">{t("WALLETS.PAGE_CREATE_WALLET.PASSPHRASE_STEP.WARNING")}</Alert>
				<MnemonicList mnemonic={mnemonic} />
				<div className="flex justify-end w-full">
					<Clipboard data={mnemonic}>
						<Button data-testid="CreateWallet__copy" variant="plain">
							<Icon name="Copy" />
							<span>{t("COMMON.COPY")}</span>
						</Button>
					</Clipboard>
				</div>
			</div>

			<Divider dashed />

			<div className="py-3">
				<div className="flex justify-between">
					<div>
						<h3 className="mb-1 text-theme-neutral-dark">
							{t("WALLETS.PAGE_CREATE_WALLET.PASSPHRASE_STEP.DOWNLOAD.TITLE")}
						</h3>
						<p className="text-theme-neutral">
							{t("WALLETS.PAGE_CREATE_WALLET.PASSPHRASE_STEP.DOWNLOAD.DESCRIPTION")}
						</p>
					</div>
					<Icon name="FilePassword" width={40} height={40} />
				</div>
				<div className="flex justify-end w-full">
					<Button
						data-testid="CreateWallet__download"
						variant="plain"
						className="flex items-center mt-4 space-x-2"
					>
						<Icon name="Download" />
						<span>{t("COMMON.DOWNLOAD")}</span>
					</Button>
				</div>
			</div>

			<Divider dashed />
		</section>
	);
};
