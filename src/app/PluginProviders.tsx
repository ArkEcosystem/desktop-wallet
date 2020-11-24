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
];

export const PluginProviders = ({ children }: Props) => (
	<PluginManagerProvider
		manager={pluginManager}
		/* istanbul ignore next */
		services={isTest ? [] : services}
	>
		<HttpPluginProvider manager={pluginManager}>{children}</HttpPluginProvider>
	</PluginManagerProvider>
);
