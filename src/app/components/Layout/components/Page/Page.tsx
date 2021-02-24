import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { Breadcrumbs, Crumb } from "app/components/Breadcrumbs";
import { NavigationBar } from "app/components/NavigationBar";
import React from "react";
import { NavbarVariant } from "types";

type PageProps = {
	navbarVariant?: NavbarVariant;
	title?: string;
	profile?: Profile;
	crumbs?: Crumb[];
	sidebar?: React.ReactNode;
	children: React.ReactNode;
};

export const Page = ({ navbarVariant, title, profile, crumbs, sidebar, children }: PageProps) => (
	<div className="flex relative flex-col min-h-screen">
		{<NavigationBar variant={navbarVariant} title={title} profile={profile} />}

		{crumbs?.length && <Breadcrumbs crumbs={crumbs} className="container py-5 px-14 mx-auto font-semibold" />}

		<div className="flex flex-col flex-1">
			{sidebar ? (
				<div className="flex flex-1">
					<div className="container flex mx-auto">
						<div className="px-10 my-16 border-r border-theme-primary-100 dark:border-theme-secondary-800">
							{sidebar}
						</div>

						<div className="ml-16 w-full">{children}</div>
					</div>
				</div>
			) : (
				children
			)}
		</div>
	</div>
);

Page.defaultProps = {
	navbarVariant: "full",
};
