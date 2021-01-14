/* eslint-disable @typescript-eslint/require-await */
import { Alert } from "app/components/Alert";
import { Button } from "app/components/Button";
import { Clipboard } from "app/components/Clipboard";
import { Divider } from "app/components/Divider";
import { Header } from "app/components/Header";
import { Icon } from "app/components/Icon";
import { toasts } from "app/services";
import { MnemonicList } from "domains/wallet/components/MnemonicList";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Trans, useTranslation } from "react-i18next";
import { saveFile } from "utils/electron-utils";

export const BackupStep = () => {
	const { getValues, unregister, watch } = useFormContext();

	// getValues does not get the value of `defaultValues` on first render
	const [defaultMnemonic] = useState(() => watch("secondMnemonic"));
	const mnemonic = getValues("secondMnemonic") || defaultMnemonic;

	const [defaultWallet] = useState(() => watch("wallet"));
	const wallet = getValues("wallet") || defaultWallet;

	const { t } = useTranslation();

	useEffect(() => {
		unregister("verification");
	}, [unregister]);

	const handleDownload = async () => {
		const fileName = `${wallet.address()}.txt`;

		try {
			const filePath = await saveFile(mnemonic, fileName, {
				filters: { name: "Text Document", extensions: ["txt"] },
				returnBasename: true,
			});

			if (filePath) {
				toasts.success(
					<Trans
						i18nKey="COMMON.SAVE_FILE.SUCCESS"
						values={{ filePath }}
						components={{ bold: <strong /> }}
					/>,
				);
			}
		} catch (error) {
			toasts.error(t("COMMON.SAVE_FILE.ERROR", { error: error.message }));
		}
	};

	return (
		<section data-testid="SecondSignature__backup-step" className="space-y-8">
			<Header title={t("TRANSACTION.PAGE_SECOND_SIGNATURE.PASSPHRASE_STEP.TITLE")} />

			<Alert>{t("TRANSACTION.PAGE_SECOND_SIGNATURE.PASSPHRASE_STEP.WARNING")}</Alert>
			<MnemonicList mnemonic={mnemonic} />

			<div className="flex justify-end w-full">
				<Clipboard data={mnemonic}>
					<Button data-testid="SecondSignature__copy" variant="secondary">
						<Icon name="Copy" />
						<span>{t("COMMON.COPY")}</span>
					</Button>
				</Clipboard>
			</div>

			<Divider dashed />

			<div className="flex justify-between items-center">
				<div className="space-y-2">
					<span className="text-lg font-semibold text-theme-secondary-text">
						{t("TRANSACTION.PAGE_SECOND_SIGNATURE.PASSPHRASE_STEP.DOWNLOAD.TITLE")}
					</span>
					<p className="text-sm text-theme-secondary-500">
						{t("TRANSACTION.PAGE_SECOND_SIGNATURE.PASSPHRASE_STEP.DOWNLOAD.DESCRIPTION")}
					</p>
				</div>

				<Icon name="FilePassword" width={40} height={40} />
			</div>

			<div className="flex justify-end w-full">
				<Button
					data-testid="SecondSignature__download"
					variant="secondary"
					className="flex items-center space-x-2"
					onClick={handleDownload}
				>
					<Icon name="Download" />
					<span>{t("COMMON.DOWNLOAD")}</span>
				</Button>
			</div>

			<Divider dashed />
		</section>
	);
};
