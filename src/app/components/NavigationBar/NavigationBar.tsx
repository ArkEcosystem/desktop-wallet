import { images } from "app/assets/images";
import { useScroll } from "app/hooks";
import React from "react";

import { renderBackButton, renderWalletSearch } from "./NavigationBar.blocks";
import { NavigationBarProps } from "./NavigationBar.contract";
import { renderMenu } from "./NavigationBar.helpers";
import { LogoContainer, NavWrapper } from "./NavigationBar.styles";

const { ARKLogo } = images.common;

const NavigationBar = (props: NavigationBarProps) => {
	const scroll = useScroll();

	return (
		<NavWrapper
			aria-labelledby="main menu"
			noBorder={noBorder !== undefined ? noBorder : variant !== "full"}
			noShadow={noShadow}
			scroll={scroll}
		>
			<div className="relative flex h-21">
				{renderBackButton(props)}

				<div className={`flex flex-1 px-8 ${variant !== "full" ? "ml-12" : ""}`}>
					<div className="flex items-center my-auto">
						<LogoContainer>
							<ARKLogo width={44} />
						</LogoContainer>

						{title && <span className="text-2xl font-bold">{title}</span>}
					</div>

					{renderMenu(props)}
				</div>
			</div>

			{renderWalletSearch(props)}
		</NavWrapper>
	);
};

NavigationBar.defaultProps = {
	variant: "full",
	menu: [],
	userActions: [],
};

export { NavigationBar };
