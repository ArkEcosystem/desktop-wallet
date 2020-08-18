import { RouteProps } from "react-router-dom";

import { PluginAPI } from "./api.models";

enum ColorMode {
	Light = "Light",
	Dark = "Dark",
}

export interface ThemeConfig {
	name: string;
	colors: Record<string, string>;
	colorMode: ColorMode;
}

export interface LanguageConfig {
	language: string;
	messages: Record<string, string>;
}

export interface Plugin {
	registerRoutes?: () => RouteProps[];
	registerThemes?: () => ThemeConfig[];
	registerLanguage?: () => LanguageConfig;
	activate?: (pluginAPI: PluginAPI) => void;
	deactivate?: () => void;
}

export interface PluginManifest {
	name: string;
	description: string;
	permissions: string[];
	config: Record<string, unknown>;
}

export enum PluginPermission {
	Http = "HTTP",
	Profile = "PROFILE",
	Theme = "THEME",
	Language = "LANGUAGE",
}

export enum PluginSetting {
	URLs = "urls",
}
