import { Contracts } from "@arkecosystem/platform-sdk";
import { DataRepository } from "@arkecosystem/platform-sdk-profiles";
import { HttpClient } from "app/services/HttpClient";

import { PluginManager } from "./core";
import { PluginHooks } from "./core/internals/plugin-hooks";
import { PluginController } from "./core/plugin-controller";

export type WithPluginManager<T> = T & { manager: PluginManager };

export interface PluginAPI {
	launch(): {
		render(children: React.ReactNode): void;
	};
	http(): {
		create: () => HttpClient;
		decorate: (key: string, callback: <T = any>(arg: T) => T) => void;
		get: (url: string, query?: object) => Promise<Contracts.HttpResponse>;
		post: (url: string, data?: object) => Promise<Contracts.HttpResponse>;
	};
	filesystem(): {
		askUserToSaveFile(content: string, suggestedFileName?: string): Promise<void>;
		askUserToOpenFile(): Promise<string | undefined>;
	};
	events(): {
		on: (channel: string, callback: () => void) => void;
	};
	profile(): {
		wallets: () => Record<string, any>[];
	};
	store(): {
		data: () => DataRepository;
		persist: () => void;
	};
	theme(): {
		decorate: <T = any>(key: string, callback: (Component: T, props: Record<string, any>) => T) => void;
	};
	timers(): {
		clearInterval: (handle: number) => void;
		clearTimeout: (handle: number) => void;
		setInterval: (handler: Function, timeout: number) => number;
		setTimeout: (handler: Function, timeout: number) => number;
	};
}

export interface PluginRawInstance {
	config: Record<string, any>;
	sourcePath: string;
	source: string;
	dir: string;
}

export enum PluginServiceIdentifier {
	Events = "EVENTS",
	FileSystem = "FILESYSTEM",
	HTTP = "HTTP",
	Launch = "LAUNCH",
	Profile = "PROFILE",
	Store = "STORE",
	Theme = "THEME",
	Timers = "TIMERS",
}

export interface PluginServiceConfig {
	id: string;
	accessor: string;
}

export interface PluginService {
	config: () => PluginServiceConfig;
	api: (plugin: PluginController) => Record<string, Function>;
	boot?: (context: { hooks: PluginHooks }) => void;
}
