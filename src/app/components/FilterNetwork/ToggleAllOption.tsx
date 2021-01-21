import { Badge } from "app/components/Badge";
import { Circle } from "app/components/Circle";
import React from "react";
import { useTranslation } from "react-i18next";

import { ToggleAllOptionProps } from "./";

export const ToggleAllOption = ({ onClick, isHidden = false, isSelected = false }: ToggleAllOptionProps) => {
	const { t } = useTranslation();

	if (isHidden) {
		return <></>;
	}

	return (
		<Circle
			size="lg"
			data-testid="network__viewall"
			className="relative mr-5 cursor-pointer border-theme-primary-100 dark:border-theme-secondary-800"
			onClick={onClick}
		>
			<div className="text-sm font-semibold text-theme-primary-700">{t("COMMON.ALL")}</div>

			<Badge
				className={`${
					isSelected
						? "bg-theme-primary-700 border-theme-primary-700 text-white"
						: "border-theme-primary-100 dark:border-theme-secondary-800 text-theme-primary-700"
				}`}
				icon="ChevronDown"
				iconClass={`transition-transform ${isSelected ? "transform rotate-180" : ""}`}
				iconWidth={8}
				iconHeight={5}
			/>
		</Circle>
	);
};
