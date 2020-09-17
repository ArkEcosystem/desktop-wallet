import { Alert } from "app/components/Alert";
import { Button } from "app/components/Button";
import { Clipboard } from "app/components/Clipboard";
import { Divider } from "app/components/Divider";
import { Header } from "app/components/Header";
import { Icon } from "app/components/Icon";
import { MnemonicList } from "domains/wallet/components/MnemonicList";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const BackupStep = () => {
	const { getValues, unregister, watch } = useFormContext();

	// getValues does not get the value of `defaultValues` on first render
	const [defaultMnemonic] = useState(() => watch("secondMnemonic"));
	const mnemonic = getValues("secondMnemonic") || defaultMnemonic;

	const { t } = useTranslation();

	useEffect(() => {
		unregister("verification");
	}, [unregister]);

	return (
		<section data-testid="SecondSignature__backup-step">
			<div className="my-8">
				<Header title={t("TRANSACTION.PAGE_SECOND_SIGNATURE.PASSPHRASE_STEP.TITLE")} />
			</div>

			<div className="space-y-8">
				<Alert size="lg">{t("TRANSACTION.PAGE_SECOND_SIGNATURE.PASSPHRASE_STEP.WARNING")}</Alert>
				<MnemonicList mnemonic={mnemonic} />
				<div className="flex justify-end w-full">
					<Clipboard data={mnemonic}>
						<Button data-testid="SecondSignature__copy" variant="plain">
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
							{t("TRANSACTION.PAGE_SECOND_SIGNATURE.PASSPHRASE_STEP.DOWNLOAD.TITLE")}
						</h3>
						<p className="text-theme-neutral">
							{t("TRANSACTION.PAGE_SECOND_SIGNATURE.PASSPHRASE_STEP.DOWNLOAD.DESCRIPTION")}
						</p>
					</div>
					<Icon name="FilePassword" width={40} height={40} />
				</div>
				<div className="flex justify-end w-full">
					<Button
						data-testid="SecondSignature__download"
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
