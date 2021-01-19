import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { AvatarWrapper } from "app/components/Avatar";
import React from "react";
import { Size } from "types";

type ProfileAvatarProps = {
	profile: Profile;
	size: Size;
};

export const ProfileAvatar = ({ profile, size }: ProfileAvatarProps) =>
	profile.avatar().endsWith("</svg>") ? (
		<AvatarWrapper size={size} data-testid="ProfileAvatar__svg">
			<img src={`data:image/svg+xml;utf8,${profile.avatar()}`} title={profile.name()} alt={profile.name()} />
			<span className="absolute font-semibold text-white">{profile.name().slice(0, 2).toUpperCase()}</span>
		</AvatarWrapper>
	) : (
		<AvatarWrapper size={size} data-testid="ProfileAvatar__image">
			<img
				src={profile.avatar()}
				className="object-cover w-20 h-20 bg-center bg-no-repeat bg-cover rounded-full"
				title={profile.name()}
				alt={profile.name()}
			/>
		</AvatarWrapper>
	);

ProfileAvatar.defaultProps = {
	size: "lg",
};
