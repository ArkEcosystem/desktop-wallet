import cn from "classnames";
import React from "react";
import tw, { css, styled } from "twin.macro";

const ControlButtonStyled = styled.div<{ isActive?: boolean; noBorder?: boolean; disabled?: boolean }>`
	${tw`flex items-center justify-center transition-colors duration-200 relative cursor-pointer py-2`}

	${({ noBorder }) => {
		if (!noBorder) {
			return tw`px-3`;
		}
	}}

	${({ isActive, noBorder, disabled }) => {
		if (disabled) {
			return tw`px-3 cursor-not-allowed text-theme-secondary-400 dark:text-theme-secondary-700`;
		}

		const styles: any[] = [];

		if (!noBorder) {
			styles.push(
				css`
					&:after {
						${tw`transition-opacity duration-200 absolute inset-x-0 bg-theme-primary-400 rounded opacity-0 group-hover:opacity-100`}
						content: "";
						height: 3px;
						bottom: -3px;
					}
				`,
			);
		}

		if (isActive) {
			styles.push(
				tw`text-theme-primary-600`,
				css`
					&:after {
						opacity: 1;
						${tw`bg-theme-primary-600`}
					}
				`,
			);
		} else {
			styles.push(tw`text-theme-primary-300 dark:text-theme-secondary-600 hover:text-theme-primary-400`);
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
				<div
					className={cn(
						"flex absolute right-0 justify-center items-center -mt-3 w-3 h-3 rounded-full transition-all duration-100 ease-linear bg-theme-background",
						props.noBorder ? "-mr-1" : "mr-2",
					)}
				>
					<div className="w-2 h-2 rounded-full bg-theme-primary-500" />
				</div>
			)}
			{children}
		</ControlButtonStyled>
	</div>
);
