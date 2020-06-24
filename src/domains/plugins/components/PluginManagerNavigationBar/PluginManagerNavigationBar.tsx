import React from "react";
import { useTranslation } from "react-i18next";

type PluginManagerNavigationBar = {
	selected: any;
	onChange?: any;
};

export const PluginManagerNavigationBar = ({ onChange, selected }: PluginManagerNavigationBar) => {
	const { t } = useTranslation();

	return (
		<div
			data-testid="PluginManagerNavigationBar"
			className="sticky top-20 h-20 bg-theme-neutral-900 shadow-md z-20 md:top-24"
		>
			<div className="flex justify-between h-full container mx-auto text-theme-neutral-400">
				<div className="flex h-full space-x-6">
					<div
						data-testid="PluginManagerNavigationBar__home"
						className={`flex items-center cursor-pointer border-b-3 ${
							selected === "home" ? "border-theme-primary-500" : "border-theme-neutral-900"
						}`}
						onClick={() => onChange("home")}
					>
						{t("PLUGINS.PAGE_PLUGIN_MANAGER.TYPE.HOME")}
					</div>

					<div className="flex items-center">
						<div className="bg-theme-neutral-700 w-px h-4" />
					</div>

					<div
						data-testid="PluginManagerNavigationBar__game"
						className={`flex items-center cursor-pointer border-b-3 ${
							selected === "game" ? "border-theme-primary-500" : "border-theme-neutral-900"
						}`}
						onClick={() => onChange("game")}
					>
						{t("PLUGINS.PAGE_PLUGIN_MANAGER.TYPE.GAME")}{" "}
						<span className="text-theme-neutral-700 ml-1">48</span>
					</div>

					<div className="flex items-center">
						<div className="bg-theme-neutral-700 w-px h-4" />
					</div>

					<div
						data-testid="PluginManagerNavigationBar__utility"
						className={`flex items-center cursor-pointer border-b-3 ${
							selected === "utility" ? "border-theme-primary-500" : "border-theme-neutral-900"
						}`}
						onClick={() => onChange("utility")}
					>
						{t("PLUGINS.PAGE_PLUGIN_MANAGER.TYPE.UTILITY")}{" "}
						<span className="text-theme-neutral-700 ml-1">264</span>
					</div>

					<div className="flex items-center">
						<div className="bg-theme-neutral-700 w-px h-4" />
					</div>

					<div
						data-testid="PluginManagerNavigationBar__themes"
						className={`flex items-center cursor-pointer border-b-3 ${
							selected === "themes" ? "border-theme-primary-500" : "border-theme-neutral-900"
						}`}
						onClick={() => onChange("themes")}
					>
						{t("PLUGINS.PAGE_PLUGIN_MANAGER.TYPE.THEMES")}{" "}
						<span className="text-theme-neutral-700 ml-1">96</span>
					</div>

					<div className="flex items-center">
						<div className="bg-theme-neutral-700 w-px h-4" />
					</div>

					<div
						data-testid="PluginManagerNavigationBar__other"
						className={`flex items-center cursor-pointer border-b-3 ${
							selected === "other" ? "border-theme-primary-500" : "border-theme-neutral-900"
						}`}
						onClick={() => onChange("other")}
					>
						{t("PLUGINS.PAGE_PLUGIN_MANAGER.TYPE.OTHER")}{" "}
						<span className="text-theme-neutral-700 ml-1">27</span>
					</div>
				</div>

				<div
					data-testid="PluginManagerNavigationBar__my-plugins"
					className={`flex items-center cursor-pointer border-b-3 ${
						selected === "my-plugins" ? "border-theme-primary-500" : "border-theme-neutral-900"
					}`}
					onClick={() => onChange("my-plugins")}
				>
					{t("PLUGINS.PAGE_PLUGIN_MANAGER.TYPE.MY_PLUGINS")}{" "}
					<span className="text-theme-neutral-700 ml-1">8</span>
				</div>
			</div>
		</div>
	);
};

PluginManagerNavigationBar.defaultProps = {
	selected: "home",
};
