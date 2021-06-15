import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import React, { useMemo } from "react";
import { NavLink } from "react-router-dom";

export const renderMenu = (profile, menu) => {
	if (!profile?.id()) {
		return null;
	}

	return menu.map((menuItem: any, index: number) => (
		<li key={index} className="flex">
			<NavLink
				to={menuItem.mountPath(profile.id())}
				title={menuItem.title}
				className="relative flex items-center font-semibold transition-colors duration-200 focus:outline-none text-md text-theme-secondary-text group"
			>
				<div className="absolute inset-0 -mx-2 rounded group-focus-visible group-focus:ring-2 ring-theme-primary-400" />
				{menuItem.title}
			</NavLink>
		</li>
	));
};

export const getUserInitials = (profile) => {
	const name = profile?.settings().get(Contracts.ProfileSetting.Name);
	return name ? (name as string).slice(0, 2).toUpperCase() : undefined;
};

export const getWallets = (profile) => {
	const profileWalletsCount = profile?.wallets().count();

	return useMemo(() => {
		if (!profile) {
			return [];
		}

		if (profile?.settings().get(Contracts.ProfileSetting.UseTestNetworks)) {
			return profile?.wallets().values();
		}

		return profile
			?.wallets()
			.values()
			.filter((wallet) => wallet.network().isLive());
	}, [profile, profileWalletsCount]); // eslint-disable-line react-hooks/exhaustive-deps
}
