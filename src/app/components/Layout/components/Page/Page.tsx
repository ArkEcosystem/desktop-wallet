import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { NavigationBar } from "app/components/NavigationBar";
import React from "react";
import { useTranslation } from "react-i18next";
import { NavbarVariant } from "types";

interface PageProperties {
	navbarVariant?: NavbarVariant;
	title?: string;
	isBackDisabled?: boolean;
	profile?: Contracts.IProfile;
	sidebar?: React.ReactNode;
	children: React.ReactNode;
}

export const Page = ({ navbarVariant, title, isBackDisabled, profile, sidebar, children }: PageProperties) => {
	const { t } = useTranslation();

	const menu = [
		{
			mountPath: (profileId: string) => `/profiles/${profileId}/dashboard`,
			title: t("COMMON.PORTFOLIO"),
		},
		{
			mountPath: (profileId: string) => `/profiles/${profileId}/plugins`,
			title: t("COMMON.PLUGINS"),
		},
		{
			mountPath: (profileId: string) => `/profiles/${profileId}/exchange`,
			title: t("COMMON.EXCHANGE"),
		},
		{
			mountPath: (profileId: string) => `/profiles/${profileId}/news`,
			title: t("COMMON.NEWS"),
		},
	];

	const userActions = [
		{
			label: t("COMMON.CONTACTS"),
			mountPath: (profileId: string) => `/profiles/${profileId}/contacts`,
			value: "contacts",
		},
		{
			label: t("COMMON.VOTES"),
			mountPath: (profileId: string) => `/profiles/${profileId}/votes`,
			value: "votes",
		},
		{
			label: t("COMMON.SETTINGS"),
			mountPath: (profileId: string) => `/profiles/${profileId}/settings`,
			value: "settings",
		},
		{
			icon: "Redirect",
			isExternal: true,
			label: t("COMMON.SUPPORT"),
			mountPath: () => "https://ark.io/contact",
			value: "support",
		},
		{
			label: t("COMMON.SIGN_OUT"),
			mountPath: () => `/`,
			value: "sign-out",
		},
	];

	return (
		<div className="flex relative flex-col min-h-screen">
			<NavigationBar
				variant={navbarVariant}
				menu={menu}
				userActions={userActions}
				title={title}
				profile={profile}
				isBackDisabled={isBackDisabled}
			/>

			<div className="flex flex-col flex-1">
				{sidebar ? (
					<div className="flex flex-1">
						<div className="container flex mx-auto">
							<div className="px-12 my-8 border-r border-theme-primary-100 dark:border-theme-secondary-800">
								{sidebar}
							</div>

							<div className="w-full">{children}</div>
						</div>
					</div>
				) : (
					children
				)}
			</div>
		</div>
	);
};

Page.defaultProps = {
	navbarVariant: "full",
};
