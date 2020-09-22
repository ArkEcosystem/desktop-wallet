// TODO: add i18n
import { Action } from "./models";

export const mapNotificationAction = (actionName: string) => {
	const actionsMap: { [key: string]: Action } = {
		"Read Changelog": {
			value: "changelog",
			label: "Read Changelog'",
		},
		update: {
			label: "Update now",
			value: "update",
		},
	};

	return actionsMap[actionName] || { value: actionName, label: actionName };
};
