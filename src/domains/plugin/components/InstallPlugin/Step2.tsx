import { prettyBytes } from "@arkecosystem/utils";
import { CircularProgressBar } from "app/components/CircularProgressBar";
import { Image } from "app/components/Image";
import React from "react";
import { useTranslation } from "react-i18next";

type Props = {
	plugin: any;
	downloadProgress: { percent?: number; transferredBytes?: number; totalBytes: number };
};

export const SecondStep = ({ plugin, downloadProgress }: Props) => {
	const { t } = useTranslation();

	const hasSize = plugin.size && plugin.size !== "0 B";

	return (
		<section data-testid="InstallPlugin__step--second">
			<div className="flex mt-4">
				<div className="flex-shrink-0 mr-6">
					<div className="overflow-hidden w-32 h-32 rounded-lg">
						{plugin.logo ? (
							<img
								data-testid="PluginCard__logo"
								src={plugin.logo}
								alt="Logo"
								className="w-full rounded-lg"
							/>
						) : (
							<Image name="PluginLogoPlaceholder" domain="plugin" />
						)}
					</div>
				</div>
				<div className="flex-1">
					<div className="flex flex-col justify-around h-full">
						<div>
							<p className="text-sm font-semibold text-theme-secondary-400">{t("COMMON.PLUGIN")}</p>
							<p className="text-lg font-semibold text-theme-black">{plugin.title}</p>
						</div>
						<div className="flex justify-between">
							<span>
								<p className="text-sm font-semibold text-theme-secondary-400">
									{t("COMMON.DOWNLOADING")}...
								</p>
								<p
									data-testid="InstallPlugin__step--second__progress"
									className="font-bold text-theme-secondary-text"
								>
									{prettyBytes(downloadProgress.transferredBytes ?? 0)} /{" "}
									{hasSize ? plugin.size : prettyBytes(downloadProgress.totalBytes)}
								</p>
							</span>
							<div className="mr-2">
								<CircularProgressBar
									value={(downloadProgress.percent ?? 0) * 100}
									size={50}
									strokeWidth={4}
									fontSize={0.8}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};
