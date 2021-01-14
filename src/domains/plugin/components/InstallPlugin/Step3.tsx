import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import Placeholder from "domains/plugin/images/placeholder.png";
import React from "react";
import { useTranslation } from "react-i18next";

export const ThirdStep = () => {
	const { t } = useTranslation();

	return (
		<section data-testid="InstallPlugin__step--third">
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
								<p className="font-bold text-theme-secondary-text">{t("COMMON.COMPLETED")}</p>
							</span>
							<div className="">
								<Circle
									size="lg"
									className="relative z-10 bg-theme-background border-theme-secondary-300 dark:border-theme-secondary-800"
								>
									<span className="text-theme-success-600">
										<Icon name="Checkmark" width={28} height={28} />
									</span>
								</Circle>
								<Circle
									size="lg"
									className="relative z-0 -ml-1 bg-theme-background border-theme-success-600"
								>
									<span className="text-xs font-semibold text-theme-success-600">100%</span>
								</Circle>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};
