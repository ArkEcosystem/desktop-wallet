import React from "react";
import tw, { css, styled } from "twin.macro";

const ControlButtonStyled = styled.div<{ isActive?: boolean; noBorder?: boolean; disabled?: boolean }>`
	${tw`flex items-center justify-center transition-colors duration-200 relative cursor-pointer py-2`}

	${({ isActive, noBorder, disabled }) => {
		if (disabled) {
			return tw`cursor-not-allowed text-theme-secondary-400 dark:text-theme-secondary-700`;
		}

		let styles: any[] = [];

		if (!noBorder) {
			styles = [
				...styles,
				tw`px-3`,
				css`
					&:after {
						${tw`transition-opacity duration-200 absolute inset-x-0 bg-theme-danger-100 dark:bg-theme-danger-700 rounded opacity-0 group-hover:opacity-100`}
						content: "";
						height: 3px;
						bottom: -3px;
					}
				`,
			];
		}

		if (isActive) {
			styles = [
				...styles,
				tw`text-theme-danger-400`,
				css`
					&:after {
						opacity: 100;
					}
				`,
			];
		} else {
			styles = [...styles, tw`text-theme-primary-300 dark:text-theme-secondary-600 hover:text-theme-danger-400`];
		}

		return styles;
	}}
`;

type ControlButtonProps = {
	isActive?: boolean;
	isChanged?: boolean;
	noBorder?: boolean;
	disabled?: boolean;
	children?: React.ReactNode;
	onClick?: any;
};

export const ControlButton = ({ isChanged, children, ...props }: ControlButtonProps) => (
	<div className="group">
		<ControlButtonStyled {...props}>
			{isChanged && (
				<div className="flex absolute right-0 justify-center items-center mr-2 -mt-3 w-3 h-3 rounded-full transition-all duration-100 ease-linear bg-theme-background">
					<div className="w-2 h-2 rounded-full bg-theme-danger-500" />
				</div>
			)}
			{children}
		</ControlButtonStyled>
	</div>
);
