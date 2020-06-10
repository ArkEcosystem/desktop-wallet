import React from "react";
import { images } from "app/assets/images";

const commonAssets = images.common;

export const NavBar = () => (
	<nav className="bg-white shadow-header-smooth relative">
		<div className="px-4 sm:px-6 lg:px-8">
			<div className="relative flex justify-between h-20 md:h-24">
				<div className="flex-shrink-0 flex items-center">
					<div className="flex rounded-lg p-2 bg-logo">
						<img src={commonAssets.ARKLogo} className="h-6 md:h-8 lg:h-10" alt="ARK Logo" />
					</div>
				</div>
			</div>
		</div>
	</nav>
);
