import { Avatar } from "app/components/Avatar";
import { Dropdown } from "app/components/Dropdown";
import React from "react";

import { UserInfoProps } from "../../NavigationBar.contract";

export const UserInfo = ({ onUserAction, avatarImage, userActions, userInitials }: UserInfoProps) => (
	<Dropdown
		onSelect={onUserAction}
		options={userActions}
		dropdownClass="mt-8"
		toggleContent={(isOpen: boolean) => (
			<div
				className="relative items-center justify-center align-middle rounded-full cursor-pointer"
				data-testid="navbar__useractions"
			>
				<Avatar size="lg" highlight={isOpen}>
					{avatarImage?.endsWith("</svg>") ? (
						<>
							<img alt="Profile Avatar" src={`data:image/svg+xml;utf8,${avatarImage}`} />
							<span className="absolute text-sm font-semibold text-theme-background dark:text-theme-text">
								{userInitials}
							</span>
						</>
					) : (
						<img
							alt="Profile Avatar"
							className="object-cover bg-center bg-no-repeat bg-cover rounded-full w-11 h-11"
							src={avatarImage}
						/>
					)}
				</Avatar>
			</div>
		)}
	/>
);
