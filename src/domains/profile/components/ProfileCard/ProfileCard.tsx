import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { Badge } from "app/components/Badge";
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
			<div className="relative">
				<ProfileAvatar profile={profile} size="2xl" />
				{profile.usesPassword() && (
					<Badge
						className="bg-theme-background border-theme-background text-theme-secondary-900 dark:text-theme-secondary-600 mr-2.5 mb-2.5"
						icon="Lock"
						iconWidth={13}
						iconHeight={18}
						size="lg"
						position="bottom-right"
					/>
				)}
			</div>

			<span className="mt-3 font-semibold text-theme-primary-text max-w-32 truncate">{profile.name()}</span>
		</div>
	</Card>
);

ProfileCard.defaultProps = {
	showSettings: true,
};
