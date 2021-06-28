import { Button } from "app/components/Button";
import { Form } from "app/components/Form";
import { Header } from "app/components/Header";
import { ListDivided } from "app/components/ListDivided";
import { Toggle } from "app/components/Toggle";
import { useEnvironmentContext } from "app/contexts";
import { useActiveProfile } from "app/hooks";
import { toasts } from "app/services";
import { useProfileExport } from "domains/setting/hooks/use-profile-export";
import electron from "electron";
import fs from "fs";
import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const Export = () => {
	const { t } = useTranslation();

	const form = useForm({ mode: "onChange" });
	const { register } = form;

	const profile = useActiveProfile();
	const { env } = useEnvironmentContext();
	const { formatExportData } = useProfileExport({ profile, env });

	const walletExportOptions = [
		{
			isFloatingLabel: true,
			label: t("SETTINGS.EXPORT.OPTIONS.EXCLUDE_EMPTY_WALLETS.TITLE"),
			labelDescription: t("SETTINGS.EXPORT.OPTIONS.EXCLUDE_EMPTY_WALLETS.DESCRIPTION"),
			labelAddon: (
				<Toggle
					ref={register}
					name="excludeEmptyWallets"
					defaultChecked={false}
					data-testid="Plugin-settings__toggle--exclude-empty-wallets"
				/>
			),
			wrapperClass: "pt-4 pb-6",
		},
		{
			isFloatingLabel: true,
			label: t("SETTINGS.EXPORT.OPTIONS.EXCLUDE_LEDGER_WALLETS.TITLE"),
			labelDescription: t("SETTINGS.EXPORT.OPTIONS.EXCLUDE_LEDGER_WALLETS.DESCRIPTION"),
			labelAddon: (
				<Toggle
					ref={register}
					name="excludeLedgerWallets"
					defaultChecked={false}
					data-testid="Plugin-settings__toggle--exclude-ledger-wallets"
				/>
			),
			wrapperClass: "pt-6",
		},
	];

	const exportDataToFile = async () => {
		const exportData = formatExportData({
			...form.getValues(["excludeEmptyWallets", "excludeLedgerWallets"]),
		});

		const defaultPath = `profile-${profile.id()}.dwe`;
		const { filePath } = await electron.remote.dialog.showSaveDialog({ defaultPath });

		/* istanbul ignore next */
		if (!filePath) {
			return;
		}

		fs.writeFileSync(filePath, exportData, "utf-8");
		return toasts.success(t("SETTINGS.EXPORT.SUCCESS"));
	};

	const handleSubmit = async () => {
		await exportDataToFile();
	};

	return (
		<>
			<Header title={t("SETTINGS.EXPORT.TITLE")} subtitle={t("SETTINGS.EXPORT.SUBTITLE")} />

			<Form id="export-settings__form" context={form} onSubmit={handleSubmit} className="mt-8">
				<h2 className="mb-0">{t("COMMON.WALLETS")}</h2>

				<ListDivided items={walletExportOptions} />

				<div className="flex justify-end mt-8 space-x-3 w-full">
					<Button data-testid="Export-settings__submit-button" type="submit">
						{t("COMMON.EXPORT")}
					</Button>
				</div>
			</Form>
		</>
	);
};
