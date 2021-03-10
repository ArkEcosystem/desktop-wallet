import { Button } from "app/components/Button";
import { Form } from "app/components/Form";
import { Header } from "app/components/Header";
import { ListDivided } from "app/components/ListDivided";
import { Toggle } from "app/components/Toggle";
import { useActiveProfile } from "app/hooks";
import { useProfileExport } from "domains/setting/hooks/use-profile-export";
import electron from "electron";
import fs from "fs";
import React from "react";
import { useTranslation } from "react-i18next";

import { SettingsProps } from "../Settings.models";

export const Export = ({ formConfig, onSuccess }: SettingsProps) => {
	const { t } = useTranslation();

	const { register, context } = formConfig;

	const profile = useActiveProfile();
	const { formatExportData } = useProfileExport(profile);

	const walletExportOptions = [
		{
			isFloatingLabel: true,
			label: t("SETTINGS.EXPORT.EXCLUDE_WALLETS_WITHOUT_NAME"),
			labelClass: "text-lg text-theme-secondary-text",
			labelAddon: (
				<Toggle
					ref={register}
					name="excludeWalletsWithoutName"
					defaultChecked={false}
					data-testid="Plugin-settings__toggle--exclude-without-name"
				/>
			),
			wrapperClass: "py-4",
		},
		{
			isFloatingLabel: true,
			label: t("SETTINGS.EXPORT.EXCLUDE_EMPTY_WALLETS"),
			labelClass: "text-lg text-theme-secondary-text",
			labelAddon: (
				<Toggle
					ref={register}
					name="excludeEmptyWallets"
					defaultChecked={false}
					data-testid="Plugin-settings__toggle--exclude-empty-wallets"
				/>
			),
			wrapperClass: "py-4",
		},
		{
			isFloatingLabel: true,
			label: t("SETTINGS.EXPORT.EXCLUDE_LEDGER_WALLETS"),
			labelClass: "text-lg text-theme-secondary-text",
			labelAddon: (
				<Toggle
					ref={register}
					name="excludeLedgerWallets"
					defaultChecked={false}
					data-testid="Plugin-settings__toggle--exclude-ledger-wallets"
				/>
			),
			wrapperClass: "py-4",
		},
	];

	const exportDataToFile = async () => {
		const exportData = formatExportData({
			excludeWalletsWithoutName: context.getValues("excludeWalletsWithoutName"),
			excludeEmptyWallets: context.getValues("excludeEmptyWallets"),
			excludeLedgerWallets: context.getValues("excludeLedgerWallets"),
		});

		const defaultPath = `profile-${profile.id()}.dwe`;
		const { filePath } = await electron.remote.dialog.showSaveDialog({ defaultPath });

		/* istanbul ignore next */
		if (!filePath) {
			return;
		}

		fs.writeFileSync(filePath, exportData, "utf-8");
		return onSuccess(t("SETTINGS.EXPORT.SUCCESS"));
	};

	const handleSubmit = async () => {
		await exportDataToFile();
	};

	return (
		<>
			<Header title={t("SETTINGS.EXPORT.TITLE")} subtitle={t("SETTINGS.EXPORT.SUBTITLE")} />

			<Form id="export-settings__form" context={formConfig.context} onSubmit={handleSubmit} className="mt-8">
				<h2 className="mt-8 mb-0">{t("COMMON.WALLETS")}</h2>
				<ListDivided items={walletExportOptions} />

				<div className="flex justify-end pt-2 w-full space-x-3">
					<Button data-testid="Export-settings__submit-button" type="submit">
						{t("COMMON.EXPORT")}
					</Button>
				</div>
			</Form>
		</>
	);
};
