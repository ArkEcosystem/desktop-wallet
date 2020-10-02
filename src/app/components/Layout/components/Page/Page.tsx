import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { Breadcrumbs, Crumb } from "app/components/Breadcrumbs";
import { NavigationBar } from "app/components/NavigationBar";
import React from "react";
import { NavbarVariant } from "types";

type PageProps = {
	navbarVariant?: NavbarVariant;
	profile?: Profile;
	crumbs?: Crumb[];
	sidebar?: React.ReactNode;
	children: React.ReactNode;
};

export const Page = ({ navbarVariant = "full", profile, crumbs, sidebar, children }: PageProps) => (
	<div className="relative flex flex-col min-h-screen bg-theme-neutral-contrast">
		{<NavigationBar variant={navbarVariant} profile={profile} />}

		{crumbs?.length && <Breadcrumbs crumbs={crumbs} className="container py-5 mx-auto font-semibold px-14" />}

		<div className={`flex flex-col flex-1 ${navbarVariant === "full" && !crumbs?.length ? "mt-5" : ""}`}>
			{sidebar ? (
				<div className="flex flex-1 bg-theme-background">
					<div className="container flex mx-auto">
						<div className="px-10 my-16 border-r-1 border-theme-primary-contrast">{sidebar}</div>

						<div className="w-full ml-16">{children}</div>
					</div>
				</div>
			) : (
				children
			)}
		</div>
	</div>
);
