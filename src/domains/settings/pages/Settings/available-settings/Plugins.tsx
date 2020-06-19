import { Button } from "app/components/Button";
import { Form, FormField, FormLabel } from "app/components/Form";
import { Header } from "app/components/Header";
import { ListDivided } from "app/components/ListDivided";
import { Select } from "app/components/Select";
import { Toggle } from "app/components/Toggle";
import React from "react";

type PluginsProps = {
	formConfig: any;
	onSubmit?: any;
};

export const Plugins = ({ formConfig, onSubmit }: PluginsProps) => {
	const pluginItems = [
		{
			isFloatingLabel: true,
			label: "Apply Blacklist",
			labelClass: "text-xl font-bold text-theme-neutral-dark",
			content: (
				<>
					<div className="flex flex-row justify-between">
						<span className="w-3/4 text-sm text-theme-neutral-dark">
							This list is selected safely by ARK Ecosystem. You can view it and add to the list of
							plugins that you find suspicious.
						</span>
						<div className="-mt-2">
							<Toggle />
						</div>
					</div>
					<div className="flex flex-col py-6 space-x-3 md:flex-row">
						<Button color="primary" variant="plain" className="w-full">
							Open List
						</Button>
						<Button color="primary" variant="plain" className="w-full mt-2 md:mt-0">
							Add Plugin
						</Button>
					</div>
				</>
			),
		},
		{
			isFloatingLabel: true,
			label: "Plugin Source",
			labelClass: "text-xl font-bold text-theme-neutral-dark",
			content: (
				<>
					<div className="flex flex-row justify-between">
						<span className="w-3/4 text-sm text-theme-neutral-dark">
							Turn this feature on, you can upload plugins to your wallet from third-party sources.
						</span>
						<div className="-mt-2">
							<Toggle />
						</div>
					</div>
					<FormField name="load-plugins" className="mt-5">
						<FormLabel>Load plugins from</FormLabel>
						<Select>
							<option value="">Select</option>
							<option value="github">GitHub</option>
						</Select>
					</FormField>
				</>
			),
		},
	];

	return (
		<>
			<Header title="Plugin Settings" subtitle="Customize your wallet to suit your needs." />
			<Form id="plugin-settings__form" context={formConfig.context} onSubmit={onSubmit}>
				<ListDivided items={pluginItems} />
				<div className="float-right">
					<Button color="primary" variant="solid" size="large">
						Save
					</Button>
				</div>
			</Form>
		</>
	);
};
