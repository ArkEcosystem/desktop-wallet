import { useTranslation } from "react-i18next";

import { Action } from "./models";

export const useActionNameMap = () => {
	const { t } = useTranslation();

	const mapActionName = (actionName: string) => {
		const actionsMap: { [key: string]: Action } = {
			"Read Changelog": {
				label: t("COMMON.NOTIFICATIONS.ACTIONS.READ_CHANGELOG"),
				value: "changelog",
			},
			update: {
				label: t("COMMON.NOTIFICATIONS.ACTIONS.UPDATE"),
				value: "update",
			},
		};
		return actionsMap[actionName] || { label: actionName, value: actionName };
	};

	return { mapActionName };
};
