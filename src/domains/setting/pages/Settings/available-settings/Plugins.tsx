import { Button } from "app/components/Button";
import { Divider } from "app/components/Divider";
import { Form, FormField, FormLabel } from "app/components/Form";
import { Header } from "app/components/Header";
import { ListDivided } from "app/components/ListDivided";
import { Select } from "app/components/SelectDropdown";
import { Toggle } from "app/components/Toggle";
import { useActiveProfile } from "app/hooks/env";
import { AddBlacklistPlugin } from "domains/plugin/components/AddBlacklistPlugin";
import { BlacklistPlugins } from "domains/plugin/components/BlacklistPlugins";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

type PluginsProps = {
	formConfig: any;
	onSubmit?: any;
};

export const Plugins = ({ formConfig, onSubmit }: PluginsProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const activeProfile = useActiveProfile()!;
	const [modalOpenListIsOpen, setModalOpenListIsOpen] = useState(false);
	const [modalAddPluginIsOpen, setModalAddPluginIsOpen] = useState(false);

	const { t } = useTranslation();

	const pluginItems = [
		{
			isFloatingLabel: true,
			label: t("SETTINGS.PLUGINS.APPLY_BLACKLIST.TITLE"),
			labelClass: "text-lg font-semibold text-theme-neutral-dark",
			wrapperClass: "pb-6",
			content: (
				<>
					<div className="flex flex-row justify-between">
						<span className="text-theme-neutral text-sm">
							{t("SETTINGS.PLUGINS.APPLY_BLACKLIST.DESCRIPTION")}
						</span>
						<div className="-mt-7">
							<Toggle />
						</div>
					</div>
					<div className="flex justify-end w-full pt-6 space-x-3">
						<Button
							variant="plain"
							onClick={() => setModalOpenListIsOpen(true)}
							data-testid="plugins__open-list"
						>
							{t("SETTINGS.PLUGINS.OPEN_BLACKLIST")}
						</Button>
						<Button
							variant="plain"
							onClick={() => setModalAddPluginIsOpen(true)}
							data-testid="plugins__add-plugin"
						>
							{t("SETTINGS.PLUGINS.ADD_PLUGIN")}
						</Button>
					</div>

					<BlacklistPlugins isOpen={modalOpenListIsOpen} onClose={() => setModalOpenListIsOpen(false)} />
					<AddBlacklistPlugin isOpen={modalAddPluginIsOpen} onClose={() => setModalAddPluginIsOpen(false)} />
				</>
			),
		},
		{
			isFloatingLabel: true,
			label: t("SETTINGS.PLUGINS.PLUGIN_SOURCE.TITLE"),
			labelClass: "text-lg font-semibold text-theme-neutral-dark",
			wrapperClass: "pt-6",
			content: (
				<>
					<div className="flex flex-row justify-between mb-5">
						<span className="text-theme-neutral text-sm">
							{t("SETTINGS.PLUGINS.PLUGIN_SOURCE.DESCRIPTION")}
						</span>
						<div className="-mt-7">
							<Toggle />
						</div>
					</div>
					<FormField name="load-plugins">
						<FormLabel>{t("SETTINGS.PLUGINS.PLUGIN_SOURCE.LOAD_FROM")}</FormLabel>
						<Select
							placeholder={t("COMMON.SELECT_OPTION", {
								option: t("SETTINGS.PLUGINS.PLUGIN_SOURCE.TITLE").toString(),
							})}
							options={[{ label: "Github", value: "github" }]}
						/>
					</FormField>
				</>
			),
		},
	];

	return (
		<>
			<Header title={t("SETTINGS.PLUGINS.TITLE")} subtitle={t("SETTINGS.PLUGINS.SUBTITLE")} />

			<Form id="plugin-settings__form" context={formConfig.context} onSubmit={onSubmit} className="mt-8">
				<ListDivided items={pluginItems} />
				<Divider dashed />
				<div className="flex justify-end w-full pt-2">
					<Button>{t("COMMON.SAVE")}</Button>
				</div>
			</Form>
		</>
	);
};
