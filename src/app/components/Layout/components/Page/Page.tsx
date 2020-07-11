import { images } from "app/assets/images";
import { Breadcrumbs } from "app/components/Breadcrumbs";
import { NavigationBar } from "app/components/NavigationBar";
import React from "react";

const commonAssets = images.common;

type PageProps = {
	navbarStyle?: string;
	crumbs?: any;
	children: React.ReactNode;
};

export const Page = ({ navbarStyle = "full", crumbs, children }: PageProps) => {
	return (
		<div className="relative flex flex-col min-h-screen bg-theme-neutral-contrast">
			{navbarStyle === "full" && <NavigationBar />}

			{navbarStyle === "logo-only" && (
				<div className="px-4 sm:px-6 lg:px-8 bg-theme-background">
					<div className="flex items-center flex-shrink-0 h-20 md:h-24">
						<div className="flex p-2 rounded-lg bg-logo">
							<img src={commonAssets.ARKLogo} className="h-6 md:h-8 lg:h-10" alt="ARK Logo" />
						</div>
					</div>
				</div>
			)}

			{crumbs?.length && <Breadcrumbs crumbs={crumbs} className="container py-5 mx-auto font-semibold px-14" />}

			<div className={`flex flex-col flex-1 space-y-5 ${!navbarStyle && !crumbs?.length ? "mt-5" : ""}`}>
				{children}
			</div>
		</div>
	);
};
