import { Icon } from "app/components/Icon";
import React from "react";

import { useActionNameMap } from "./hooks";
import { NotificationItemProps } from "./models";

export const NotificationItem = ({ name, body, icon, image, action: actionName, onAction }: NotificationItemProps) => {
	const { mapActionName } = useActionNameMap();
	const action = mapActionName(actionName as string);

	return (
		<tr data-testid="NotificationItem">
			<td className="w-8">
				{icon && (
					<div className="w-full h-jull p-2 mr-4 rounded-lg">
						<Icon name={icon} width={32} height={32} />
					</div>
				)}

				{image && (
					<div className="w-full h-jull p-2 mr-4 rounded-lg">
						<img src={image} alt={name} />
					</div>
				)}
			</td>
			<td>
				<span className="font-bold text-md text-theme-neutral-600">{name}</span>
				<span className="text-md text-theme-neutral-600"> {body}</span>
			</td>
			<td>
				{action && action.label && (
					<div
						data-testid="NotificationItem__action"
						className="font-bold text-right cursor-pointer text-md text-theme-primary-500"
						onClick={() => onAction?.(action.value)}
					>
						{action.label}
					</div>
				)}
			</td>
		</tr>
	);
};
