import { Breadcrumbs } from "app/components/Breadcrumbs";
import { NavigationBar } from "app/components/NavigationBar";
import React from "react";

type PageProps = {
	hideNavigation?: boolean;
	crumbs?: any;
	children: React.ReactNode;
};

export const Page = ({ hideNavigation, crumbs, children }: PageProps) => {
	return (
		<div className="flex flex-col min-h-screen bg-theme-neutral-contrast">
			{!hideNavigation && <NavigationBar />}

			{crumbs?.length && <Breadcrumbs crumbs={crumbs} className="container mx-auto py-5 px-14 font-semibold" />}

			<div className={`flex flex-col flex-1 space-y-5 ${!hideNavigation && !crumbs?.length ? "mt-5" : ""}`}>
				{children}
			</div>
		</div>
	);
};
