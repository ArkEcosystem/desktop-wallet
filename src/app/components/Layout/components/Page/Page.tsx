import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { NavigationBar } from "app/components/NavigationBar";
import React from "react";
import { useTranslation } from "react-i18next";
import { NavbarVariant } from "types";

interface PageProps {
	navbarVariant?: NavbarVariant;
	title?: string;
	isBackDisabled?: boolean;
	profile?: Contracts.IProfile;
	sidebar?: React.ReactNode;
	children: React.ReactNode;
}

export const Page = ({ navbarVariant, title, isBackDisabled, profile, sidebar, children }: PageProps) => {
	const { t } = useTranslation();

	const menu = [
		{
			title: t("COMMON.PORTFOLIO"),
			mountPath: (profileId: string) => `/profiles/${profileId}/dashboard`,
		},
		{
			title: t("COMMON.PLUGINS"),
			mountPath: (profileId: string) => `/profiles/${profileId}/plugins`,
		},
		{
			title: t("COMMON.EXCHANGE"),
			mountPath: (profileId: string) => `/profiles/${profileId}/exchange`,
		},
		{
			title: t("COMMON.NEWS"),
			mountPath: (profileId: string) => `/profiles/${profileId}/news`,
		},
	];

	const userActions = [
		{
			label: t("COMMON.CONTACTS"),
			value: "contacts",
			mountPath: (profileId: string) => `/profiles/${profileId}/contacts`,
		},
		{
			label: t("COMMON.VOTES"),
			value: "votes",
			mountPath: (profileId: string) => `/profiles/${profileId}/votes`,
		},
		{
			label: t("COMMON.SETTINGS"),
			value: "settings",
			mountPath: (profileId: string) => `/profiles/${profileId}/settings`,
		},
		{
			icon: "Redirect",
			isExternal: true,
			label: t("COMMON.SUPPORT"),
			value: "support",
			mountPath: () => "https://ark.io/contact",
		},
		{
			label: t("COMMON.SIGN_OUT"),
			value: "sign-out",
			mountPath: () => `/`,
		},
	];

	return (
		<div className="relative flex flex-col min-h-screen">
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
