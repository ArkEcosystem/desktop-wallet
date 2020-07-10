import { Button } from "app/components/Button";
import { Divider } from "app/components/Divider";
import { Form, FormField, FormLabel } from "app/components/Form";
import { Header } from "app/components/Header";
import { ListDivided } from "app/components/ListDivided";
import { Select } from "app/components/SelectDropdown";
import { Toggle } from "app/components/Toggle";
import { AddBlacklistPlugin } from "domains/plugin/components/AddBlacklistPlugin";
import { BlacklistPlugins } from "domains/plugin/components/BlacklistPlugins";
import React, { useState } from "react";

type PluginsProps = {
	formConfig: any;
	onSubmit?: any;
};

export const Plugins = ({ formConfig, onSubmit }: PluginsProps) => {
	const [modalOpenListIsOpen, setModalOpenListIsOpen] = useState(false);
	const [modalAddPluginIsOpen, setModalAddPluginIsOpen] = useState(false);

	const pluginItems = [
		{
			isFloatingLabel: true,
			label: "Apply Blacklist",
			labelClass: "text-lg font-semibold text-theme-neutral-dark",
			wrapperClass: "pb-6",
			content: (
				<>
					<div className="flex flex-row justify-between">
						<span className="text-sm text-theme-neutral">
							This list is selected safely by ARK Ecosystem. You can view it and add to the list of
							plugins that you find suspicious.
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
							Open List
						</Button>
						<Button
							variant="plain"
							onClick={() => setModalAddPluginIsOpen(true)}
							data-testid="plugins__add-plugin"
						>
							Add Plugin
						</Button>
					</div>

					<BlacklistPlugins isOpen={modalOpenListIsOpen} onClose={() => setModalOpenListIsOpen(false)} />
					<AddBlacklistPlugin isOpen={modalAddPluginIsOpen} onClose={() => setModalAddPluginIsOpen(false)} />
				</>
			),
		},
		{
			isFloatingLabel: true,
			label: "Plugin Source",
			labelClass: "text-lg font-semibold text-theme-neutral-dark",
			wrapperClass: "pt-6",
			content: (
				<>
					<div className="flex flex-row justify-between mb-5">
						<span className="text-sm text-theme-neutral">
							Turn this feature on, you can upload plugins to your wallet from third-party sources.
						</span>
						<div className="-mt-7">
							<Toggle />
						</div>
					</div>
					<FormField name="load-plugins">
						<FormLabel>Load plugins from</FormLabel>
						<Select placeholder="Select" options={[{ label: "Github", value: "github" }]} />
					</FormField>
				</>
			),
		},
	];

	return (
		<>
			<Header title="Plugin Settings" subtitle="Customize your wallet to suit your needs." />

			<Form id="plugin-settings__form" context={formConfig.context} onSubmit={onSubmit} className="mt-8">
				<ListDivided items={pluginItems} />
				<Divider dashed />
				<div className="flex justify-end w-full pt-2">
					<Button>Save</Button>
				</div>
			</Form>
		</>
	);
};
