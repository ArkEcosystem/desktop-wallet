import { CircularProgressBar } from "app/components/CircularProgressBar";
import Placeholder from "domains/plugin/images/placeholder.png";
import React from "react";
import { useTranslation } from "react-i18next";

export const SecondStep = () => {
	const { t } = useTranslation();

	return (
		<section data-testid="InstallPlugin__step--second">
			<div className="flex mt-4">
				<div className="flex-shrink-0 mr-6">
					<img className="w-32 h-32 rounded-xl" src={Placeholder} alt="Plugin Logo" />
				</div>
				<div className="flex-1">
					<div className="flex flex-col justify-around h-full">
						<div>
							<p className="text-sm font-semibold text-theme-secondary-400">{t("COMMON.PLUGIN")}</p>
							<p className="text-lg font-semibold text-theme-black">ARK Explorer</p>
						</div>
						<div className="flex justify-between">
							<span>
								<p className="text-sm font-semibold text-theme-secondary-400">
									{t("COMMON.DOWNLOADED")}
								</p>
								<p className="font-bold text-theme-secondary-text">154 KB / 154 KB</p>
							</span>
							<div className="mr-2">
								<CircularProgressBar value={78} size={50} strokeWidth={4} fontSize={0.8} />
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};
