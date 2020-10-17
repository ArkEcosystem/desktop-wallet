import { Avatar } from "app/components/Avatar";
import { Badge } from "app/components/Badge";
import React from "react";
import { useTranslation } from "react-i18next";

export const Signatures = () => {
	const { t } = useTranslation();

	return (
		<div>
			<h3 className="mb-0">{t("TRANSACTION.SIGNATURES")}</h3>

			<div className="flex">
				<div>
					<div className="mb-2 text-sm font-semibold text-theme-neutral">{t("COMMON.YOU")}</div>

					<div className="pr-4 mr-2 border-r border-theme-neutral-300 dark:border-theme-neutral-800">
						<Avatar address="test" noShadow>
							<Badge className="bg-theme-success-200 text-theme-success-500" icon="Checkmark" />
						</Avatar>
					</div>
				</div>

				<div>
					<div className="mb-2 ml-2 text-sm font-semibold text-theme-neutral">{t("COMMON.OTHER")}</div>
					<div className="flex ml-2 space-x-4">
						<Avatar address="test" noShadow>
							<Badge className="bg-theme-danger-contrast text-theme-danger-400" icon="StatusClock" />
						</Avatar>

						<Avatar address="test" noShadow>
							<Badge className="bg-theme-danger-contrast text-theme-danger-400" icon="StatusClock" />
						</Avatar>

						<Avatar address="test" noShadow>
							<Badge className="bg-theme-success-200 text-theme-success-500" icon="Checkmark" />
						</Avatar>

						<Avatar address="test" noShadow>
							<Badge className="bg-theme-danger-contrast text-theme-danger-400" icon="StatusClock" />
						</Avatar>
					</div>
				</div>
			</div>
		</div>
	);
};
