import { Image } from "app/components/Image";
import { Page } from "app/components/Layout";
import { useActiveProfile, useQueryParams } from "app/hooks";
import { LaunchRender, usePluginManagerContext } from "plugins";
import React from "react";

export const PluginView = () => {
	const queryParams = useQueryParams();

	const profile = useActiveProfile();
	const { pluginManager } = usePluginManagerContext();

	const pluginId = queryParams.get("pluginId")!;
	const plugin = pluginManager.plugins().findById(pluginId);

	return (
		<Page profile={profile}>
			<div className="bg-theme-background px-4 sm:px-6 lg:px-10 py-4 -mt-5">
				<div className="flex justify-between items-center">
					<div className="flex items-center space-x-3">
						{plugin?.config().logo() ? (
							<img
								data-testid="PluginView__logo"
								src={plugin.config().logo()}
								alt="Logo"
								className="overflow-hidden w-6 h-6 rounded"
							/>
						) : (
							<Image name="PluginLogoPlaceholder" domain="plugin" className="w-6 h-6" />
						)}

						<div className="flex space-x-10 divide-x divide-theme-secondary-300 dark:divide-theme-secondary-700">
							<dl>
								<dd className="font-semibold text-theme-secondary-text dark:text-theme-text">
									{plugin?.config().title()}
								</dd>
							</dl>
						</div>
					</div>
				</div>
			</div>

			<div className="flex relative flex-1 w-full h-full">
				<LaunchRender
					manager={pluginManager}
					pluginId={pluginId}
					fallback={<h1>Plugin not loaded or enabled</h1>}
				/>
			</div>
		</Page>
	);
};
