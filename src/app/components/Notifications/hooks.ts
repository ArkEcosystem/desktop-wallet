import { useTranslation } from "react-i18next";

import { Action } from "./models";

export const useActionNameMap = () => {
	const { t } = useTranslation();

	const mapActionName = (actionName: string) => {
		const actionsMap: { [key: string]: Action } = {
			"Read Changelog": {
				value: "changelog",
				label: t("COMMON.NOTIFICATIONS.ACTIONS.READ_CHANGELOG"),
			},
			update: {
				label: t("COMMON.NOTIFICATIONS.ACTIONS.UPDATE"),
				value: "update",
			},
		};
		return actionsMap[actionName] || { value: actionName, label: actionName };
	};

	return { mapActionName };
};
