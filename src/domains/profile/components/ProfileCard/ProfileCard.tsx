import { AvatarWrapper } from "app/components/Avatar";
import { Card } from "app/components/Card";
import { Dropdown } from "app/components/Dropdown";
import React from "react";

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

export const ProfileCard = ({ profile, actions, handleClick, onSelect, showSettings }: ProfileCardProps) => (
	<Card handleClick={handleClick}>
		<div className="relative px-6 py-4 sm:flex sm:items-center">
			{showSettings && (
				<div className="absolute top-0 right-0 flex items-center justify-center w-6 h-6 p-1 mt-3 -mt-2 -mr-4">
					<Dropdown toggleIcon="Settings" options={actions} onSelect={onSelect} />
				</div>
			)}

			<div className="flex flex-row justify-between w-full">
				<div className="flex items-center">
					<AvatarWrapper data-testid="profile-card__user--avatar" size="lg">
						<img
							alt={profile.name()}
							title={profile.name()}
							src={`data:image/svg+xml;utf8,${profile.avatar()}`}
						/>
					</AvatarWrapper>

					<div className="mt-4 text-center sm:mt-0 sm:ml-4 sm:text-left">
						<p className="text-sm font-semibold text-theme-neutral">Name</p>
						<p className="font-semibold text-theme-neutral-dark" data-testid="profile-card__user--name">
							{profile.name()}
						</p>
					</div>
				</div>
				<div className="flex items-center">
					<div className="mt-4 text-center sm:mt-0 sm:ml-4 sm:text-right">
						<p className="text-sm font-semibold text-theme-neutral">Total Balance</p>
						<p className="font-semibold text-theme-neutral-dark" data-testid="profile-card__user--balance">
							{profile.balance().toString()}
						</p>
					</div>
				</div>
			</div>
		</div>
	</Card>
);

ProfileCard.defaultProps = {
	showSettings: true,
};
