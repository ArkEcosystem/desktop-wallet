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
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

type PluginsProps = {
	formConfig: any;
	onSubmit?: any;
};

const loadDemoPlugins = () => {
	const plugins = [];
	for (let i = 0; i < 4; i++) {
		plugins.push(
			{
				id: `ark-explorer-${i}`,
				name: "ARK Explorer",
				author: "ARK.io",
				category: "utility",
				rating: 4.2,
				version: "1.3.8",
				size: "4.2 MB",
				isInstalled: false,
				isOfficial: true,
			},
			{
				id: `ark-avatars-${i}`,
				name: "ARK Avatars",
				author: "ARK.io",
				category: "other",
				rating: 3.8,
				version: "1.3.8",
				size: "163 KB",
				isInstalled: true,
				isGrant: true,
			},
		);
	}

	return plugins;
};

export const Plugins = ({ formConfig, onSubmit }: PluginsProps) => {
	const [modalOpenListIsOpen, setModalOpenListIsOpen] = useState(false);
	const [modalAddPluginIsOpen, setModalAddPluginIsOpen] = useState(false);
	const [profilePlugins, setProfilePlugins] = useState<any>(loadDemoPlugins());
	const [blacklistedPlugins, setBlacklistedPlugins] = useState<any>([]);
	const activeProfile = useActiveProfile();
	const { t } = useTranslation();

	// TODO: Load real plugins instead of use demos
	useEffect(() => {
		const blacklistedPlugins = Array.from(activeProfile.plugins().blacklist());

		setBlacklistedPlugins(blacklistedPlugins);
	}, [activeProfile]);

	const addToBlackList = (pluginId: any) => {
		const updatedBlacklist = activeProfile.plugins().blacklist().add(pluginId);

		setBlacklistedPlugins(Array.from(updatedBlacklist));
	};

	const pluginItems = [
		{
			isFloatingLabel: true,
			label: t("SETTINGS.PLUGINS.APPLY_BLACKLIST.TITLE"),
			labelClass: "text-lg font-semibold text-theme-neutral-dark",
			labelDescription: t("SETTINGS.PLUGINS.APPLY_BLACKLIST.DESCRIPTION"),
			labelAddon: <Toggle />,
			wrapperClass: "pb-6",
			content: (
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
			),
		},
		{
			isFloatingLabel: true,
			label: t("SETTINGS.PLUGINS.PLUGIN_SOURCE.TITLE"),
			labelClass: "text-lg font-semibold text-theme-neutral-dark",
			labelDescription: t("SETTINGS.PLUGINS.PLUGIN_SOURCE.DESCRIPTION"),
			labelAddon: <Toggle />,
			wrapperClass: "pt-6",
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

			<BlacklistPlugins
				isOpen={modalOpenListIsOpen}
				onClose={() => setModalOpenListIsOpen(false)}
				plugins={profilePlugins}
				blacklisted={blacklistedPlugins}
			/>
			<AddBlacklistPlugin
				isOpen={modalAddPluginIsOpen}
				onClose={() => setModalAddPluginIsOpen(false)}
				handleBlacklist={addToBlackList}
				plugins={profilePlugins}
				blacklisted={blacklistedPlugins}
			/>
		</>
	);
};
