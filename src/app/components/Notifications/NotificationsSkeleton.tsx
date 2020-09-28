import { Icon } from "app/components/Icon";
import React from "react";

import { NotificationsSkeletonProps, NotificationsWrapper } from "./";

export const NotificationsSkeleton = ({ title }: NotificationsSkeletonProps) => (
	<NotificationsWrapper>
		<div className="p-6 mb-5 border-2 border-theme-neutral-200 text-md rounded-xl text-theme-neutral-dark">
			{title}
		</div>
		<div>
			<Icon name="Placeholder" width={200} height={80} />
		</div>
		<div className="my-3 border-2 border-b border-theme-neutral-contrast" />
		<div>
			<Icon name="Placeholder" width={200} height={80} />
		</div>
	</NotificationsWrapper>
);
