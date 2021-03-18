import tw, { css, styled } from "twin.macro";

export const ControlButton = styled.div<{ isActive?: boolean; isChanged?: boolean }>`
	${tw`flex items-center justify-center transition-colors duration-200 relative w-11 h-9 cursor-pointer`}

	&:after {
		${tw`transition-opacity duration-200 absolute inset-x-0 bg-theme-danger-100 dark:bg-theme-danger-700 rounded opacity-0 group-hover:opacity-100`}
		content: "";
		height: 3px;
		bottom: -3px;
	}

	${({ isActive }) =>
		isActive
			? [
					tw`text-theme-danger-400`,
					css`
						&:after {
							opacity: 100;
						}
					`,
			  ]
			: tw`text-theme-primary-300 dark:text-theme-secondary-600 hover:text-theme-danger-400`};

	${({ isChanged }) =>
		isChanged && [
			tw`text-theme-danger-400 dark:text-theme-danger-400`,
			css`
				&:before {
					${tw`transition-opacity duration-200 absolute inset-x-0 bg-theme-danger-400 dark:bg-theme-danger-700 rounded opacity-0 group-hover:opacity-100 w-2 h-2 rounded-full block right-0 top-0 mt-1 mr-2 left-auto`}
					content: "";
					opacity: 100;
				}
			`,
		]};
`;
