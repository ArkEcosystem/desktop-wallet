import { Profile, ProfileSetting } from "@arkecosystem/platform-sdk-profiles";
import { Amount } from "app/components/Amount";
import { AvatarWrapper } from "app/components/Avatar";
import { Card } from "app/components/Card";
import { DropdownOption } from "app/components/Dropdown";
import React from "react";
import { useTranslation } from "react-i18next";
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

export const ProfileCardContent = ({ profile }: { profile: Profile }) => {
	const { t } = useTranslation();

	return (
		<div className="flex flex-row justify-between w-full">
			<div className="flex items-center">
				{profile.avatar().endsWith("</svg>") ? (
					<AvatarWrapper size="lg" data-testid="profile-card__user--avatar">
						<img
							src={`data:image/svg+xml;utf8,${profile.avatar()}`}
							title={profile.name()}
							alt={profile.name()}
						/>
						<span className="absolute text-sm font-semibold text-theme-background">
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
							className="object-cover w-11 h-11 bg-center bg-no-repeat bg-cover rounded-full"
							title={profile.name()}
							alt={profile.name()}
						/>
					</div>
				)}

				<div className="mt-4 text-center sm:mt-0 sm:ml-4 sm:text-left">
					<p className="text-sm font-semibold text-theme-secondary-700">{t("COMMON.NAME")}</p>
					<p className="font-semibold text-theme-text" data-testid="profile-card__user--name">
						<ProfileNameWrapper>{profile.name()}</ProfileNameWrapper>
					</p>
				</div>
			</div>
			<div className="flex items-center">
				<div className="mt-4 text-center sm:mt-0 sm:ml-4 sm:text-right">
					<p className="text-sm font-semibold text-theme-secondary-700">{t("COMMON.TOTAL_BALANCE")}</p>
					{profile.usesPassword() ? (
						<span className="font-semibold text-theme-secondary-700">{t("COMMON.NOT_AVAILABLE")}</span>
					) : (
						<Amount
							className="font-semibold text-theme-text"
							data-testid="profile-card__user--balance"
							value={profile.convertedBalance()}
							ticker={profile.settings().get<string>(ProfileSetting.ExchangeCurrency, "")!}
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export const ProfileCard = ({ profile, actions, onClick, onSelect, showSettings }: ProfileCardProps) => (
	<div data-testid="ProfileCard">
		<Card onClick={onClick} actions={showSettings ? actions : undefined} onSelect={onSelect}>
			<div className="relative p-2 sm:flex sm:items-center">
				<ProfileCardContent profile={profile} />
			</div>
		</Card>
	</div>
);

ProfileCard.defaultProps = {
	showSettings: true,
};
