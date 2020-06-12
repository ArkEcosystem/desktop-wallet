import React from "react";
import { images } from "app/assets/images";

const commonAssets = images.common;

export const NavBar = () => (
	<nav className="relative bg-white shadow-header-smooth">
		<div className="px-4 sm:px-6 lg:px-8">
			<div className="relative flex justify-between h-20 md:h-24">
				<div className="flex items-center flex-shrink-0">
					<div className="flex p-2 rounded-lg bg-logo">
						<img src={commonAssets.ARKLogo} className="h-6 md:h-8 lg:h-10" alt="ARK Logo" />
					</div>
				</div>
			</div>
		</div>
	</nav>
);
