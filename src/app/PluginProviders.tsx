import {
	EventsPluginService,
	FileSystemPluginService,
	HttpPluginProvider,
	HttpPluginService,
	LaunchPluginService,
	PluginManager,
	PluginManagerProvider,
	ProfilePluginService,
	StorePluginService,
	ThemePluginService,
	TimersPluginService,
} from "plugins";
import React from "react";

type Props = {
	children: React.ReactNode;
};

const isTest = process.env.NODE_ENV === "test";
export const pluginManager = new PluginManager();

export const services = [
	new EventsPluginService(),
	new FileSystemPluginService(),
	new HttpPluginService(),
	new LaunchPluginService(),
	new ProfilePluginService(),
	new StorePluginService(),
	new ThemePluginService(),
	new TimersPluginService(),
];

export const PluginProviders = ({ children }: Props) => {
	/* istanbul ignore next */
	const servicesData = isTest ? [] : services;
	return (
		<PluginManagerProvider manager={pluginManager} services={servicesData}>
			<HttpPluginProvider manager={pluginManager}>{children}</HttpPluginProvider>
		</PluginManagerProvider>
	);
};
