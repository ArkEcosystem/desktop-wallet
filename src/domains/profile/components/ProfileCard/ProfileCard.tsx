import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { Card } from "app/components/Card";
import { DropdownOption } from "app/components/Dropdown";
import { ProfileAvatar } from "domains/profile/components/ProfileAvatar";
import React from "react";

type ProfileCardProps = {
	profile: Profile;
	actions?: DropdownOption[];
	onSelect?: any;
	onClick?: any;
	showSettings?: boolean;
};

export const ProfileCard = ({ profile, actions, onClick, onSelect, showSettings }: ProfileCardProps) => (
	<Card
		className="w-40 h-40 m-2.5"
		onClick={onClick}
		actions={showSettings ? actions : undefined}
		onSelect={onSelect}
	>
		<div className="flex flex-col justify-center items-center">
			<ProfileAvatar profile={profile} size="2xl" />

			<span className="mt-3 font-semibold text-theme-secondary-700 max-w-32 truncate">{profile.name()}</span>
		</div>
	</Card>
);

ProfileCard.defaultProps = {
	showSettings: true,
};
