import { AvatarWrapper } from "app/components/Avatar";
import { Card } from "app/components/Card";
import { Dropdown } from "app/components/Dropdown";
import React from "react";
import { useTranslation } from "react-i18next";

interface ISettingsOptions {
	label: string;
	value: string | number;
}

type ProfileCardProps = {
	profile: any;
	actions?: ISettingsOptions[];
	onSelect?: any;
	handleClick?: any;
	showSettings?: boolean;
};

export const ProfileCard = ({ profile, actions, handleClick, onSelect, showSettings }: ProfileCardProps) => {
	const { t } = useTranslation();

	return (
		<Card handleClick={handleClick}>
			<div className="relative px-6 py-4 sm:flex sm:items-center">
				{showSettings && (
					<div className="absolute top-0 right-0 flex items-center justify-center w-6 h-6 p-1 mt-3 -mt-2 -mr-4 text-theme-neutral-light">
						<Dropdown toggleIcon="Settings" options={actions} onSelect={onSelect} />
					</div>
				)}

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
								className="rounded-full bg-theme-neutral-contrast w-11 h-11"
								data-testid="profile-card__user--avatarImage"
							>
								<img
									src={profile.avatar()}
									className="object-cover bg-center bg-no-repeat bg-cover rounded-full w-11 h-11"
									title={profile.name()}
									alt={profile.name()}
								/>
							</div>
						)}

						<div className="mt-4 text-center sm:mt-0 sm:ml-4 sm:text-left">
							<p className="text-sm font-semibold text-theme-neutral">{t("COMMON.NAME")}</p>
							<p className="font-semibold text-theme-neutral-dark" data-testid="profile-card__user--name">
								{profile.name()}
							</p>
						</div>
					</div>
					<div className="flex items-center">
						<div className="mt-4 text-center sm:mt-0 sm:ml-4 sm:text-right">
							<p className="text-sm font-semibold text-theme-neutral">{t("COMMON.TOTAL_BALANCE")}</p>
							<p
								className="font-semibold text-theme-neutral-dark"
								data-testid="profile-card__user--balance"
							>
								{profile.balance().toHuman(8)}
							</p>
						</div>
					</div>
				</div>
			</div>
		</Card>
	);
};

ProfileCard.defaultProps = {
	showSettings: true,
};
