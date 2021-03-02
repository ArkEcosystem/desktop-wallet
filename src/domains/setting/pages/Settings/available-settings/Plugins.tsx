import { Button } from "app/components/Button";
import { Divider } from "app/components/Divider";
import { Form, FormField, FormLabel } from "app/components/Form";
import { Header } from "app/components/Header";
import { ListDivided } from "app/components/ListDivided";
import { Select } from "app/components/SelectDropdown";
import { Toggle } from "app/components/Toggle";
import React from "react";
import { useTranslation } from "react-i18next";

import { SettingsProps } from "../Settings.models";

export const Plugins = ({ formConfig, onSuccess }: SettingsProps) => {
	const { t } = useTranslation();

	const pluginItems = [
		{
			isFloatingLabel: true,
			label: t("SETTINGS.PLUGINS.PLUGIN_SOURCE.TITLE"),
			labelDescription: t("SETTINGS.PLUGINS.PLUGIN_SOURCE.DESCRIPTION"),
			labelAddon: <Toggle />,
			content: (
				<div className="pt-6">
					<FormField name="load-plugins">
						<FormLabel>{t("SETTINGS.PLUGINS.PLUGIN_SOURCE.LOAD_FROM")}</FormLabel>
						<Select
							placeholder={t("COMMON.SELECT_OPTION", {
								option: t("SETTINGS.PLUGINS.PLUGIN_SOURCE.TITLE").toString(),
							})}
							options={[{ label: "Github", value: "github" }]}
						/>
					</FormField>
				</div>
			),
		},
	];

	const handleSubmit = () => {
		onSuccess(t("SETTINGS.PLUGINS.SUCCESS"));
	};

	return (
		<>
			<Header title={t("SETTINGS.PLUGINS.TITLE")} subtitle={t("SETTINGS.PLUGINS.SUBTITLE")} />

			<Form id="plugin-settings__form" context={formConfig.context} onSubmit={handleSubmit} className="mt-8">
				<ListDivided items={pluginItems} />

				<Divider dashed />

				<div className="flex justify-end pt-2 w-full">
					<Button data-testid="Plugins-settings__submit-button" type="submit">
						{t("COMMON.SAVE")}
					</Button>
				</div>
			</Form>
		</>
	);
};
