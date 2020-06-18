import { Card } from "app/components/Card";
import { Dropdown } from "app/components/Dropdown";
import React from "react";

interface ISettingsOptions {
	label: string;
	value: string | number;
}

type ProfileCardProps = {
	avatar?: string;
	name?: string;
	balance?: string;
	actions?: ISettingsOptions[];
	showSettings?: boolean;
	onSelect?: any;
};

export const ProfileCard = ({ avatar, name, balance, actions, showSettings, onSelect }: ProfileCardProps) => (
	<Card>
		<div className="relative px-6 py-4 sm:flex sm:items-center">
			{showSettings && (
				<div className="absolute top-0 right-0 flex items-center justify-center w-6 h-6 p-1 mt-3 -mt-2 -mr-4">
					<Dropdown toggleIcon="Settings" options={actions} onSelect={onSelect} />
				</div>
			)}

			<div className="flex flex-row justify-between w-full">
				<div className="flex items-center">
					<div className="block w-12 h-12 mx-auto rounded-full sm:mx-0 sm:flex-shrink-0">
						<img
							className="rounded-full"
							src={avatar}
							alt="User Avatar"
							data-testid="profile-card__user--avatar"
						/>
					</div>
					<div className="mt-4 text-center sm:mt-0 sm:ml-4 sm:text-left">
						<p className="text-sm font-semibold text-theme-neutral">Name</p>
						<p className="font-semibold text-theme-neutral-dark" data-testid="profile-card__user--name">
							{name}
						</p>
					</div>
				</div>
				<div className="flex items-center">
					<div className="mt-4 text-center sm:mt-0 sm:ml-4 sm:text-right">
						<p className="text-sm font-semibold text-theme-neutral">Total Balance</p>
						<p className="font-semibold text-theme-neutral-dark" data-testid="profile-card__user--balance">
							{balance}
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
