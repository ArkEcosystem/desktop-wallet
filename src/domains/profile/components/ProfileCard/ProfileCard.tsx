import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { AvatarWrapper } from "app/components/Avatar";
import { Card } from "app/components/Card";
import { DropdownOption } from "app/components/Dropdown";
import React from "react";
import tw, { styled } from "twin.macro";

type ProfileCardProps = {
	profile: Profile;
	actions?: DropdownOption[];
	onSelect?: any;
	onClick?: any;
	showSettings?: boolean;
};

const ProfileNameWrapper = styled.span`
	${tw`block truncate`}
	max-width: 250px;
`;

export const ProfileCard = ({ profile, actions, onClick, onSelect, showSettings }: ProfileCardProps) => (
	<Card
		className="w-40 h-40 m-2.5"
		onClick={onClick}
		actions={showSettings ? actions : undefined}
		onSelect={onSelect}
	>
		<div className="flex flex-col items-center justify-center">
			{profile.avatar().endsWith("</svg>") ? (
				<AvatarWrapper size="2xl" data-testid="profile-card__user--avatar">
					<img
						src={`data:image/svg+xml;utf8,${profile.avatar()}`}
						title={profile.name()}
						alt={profile.name()}
					/>
					<span className="absolute font-semibold text-theme-background">
						{profile.name().slice(0, 2).toUpperCase()}
					</span>
				</AvatarWrapper>
			) : (
				<div
					className="w-11 h-11 rounded-full bg-theme-secondary-100"
					data-testid="profile-card__user--avatarImage"
				>
					<img
						src={profile.avatar()}
						className="object-cover w-20 h-20 bg-center bg-no-repeat bg-cover rounded-full"
						title={profile.name()}
						alt={profile.name()}
					/>
				</div>
			)}

			<span className="font-semibold text-theme-secondary-700 mt-3 max-w-32 truncate">{profile.name()}</span>
		</div>
	</Card>
);

ProfileCard.defaultProps = {
	showSettings: true,
};
