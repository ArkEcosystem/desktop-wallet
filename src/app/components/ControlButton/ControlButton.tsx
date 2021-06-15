import cn from "classnames";
import React from "react";
import tw, { css, styled } from "twin.macro";

const ControlButtonStyled = styled.button<{ noBorder?: boolean; disabled?: boolean }>`
	${tw`flex items-center justify-center font-semibold transition-colors duration-200 relative cursor-pointer py-2 text-theme-primary-300 dark:text-theme-secondary-600 border-t-2 border-b-2 border-transparent focus:outline-none`}
	${tw`disabled:(cursor-not-allowed text-theme-secondary-400 dark:text-theme-secondary-700)`}

	${({ noBorder }) => {
		if (!noBorder) {
			return tw`px-2.5 mx-0.5`;
		}
	}}

	${({ disabled }) => {
		if (!disabled) {
			return css`
				&:hover {
					color: var(--theme-color-primary-400);
				}
			`;
		}
	}}

	${({ noBorder, disabled }) => {
		if (!noBorder && !disabled) {
			return css`
				&:hover {
					border-bottom-color: var(--theme-color-primary-400);
					color: var(--theme-color-primary-400);
				}
				&.active {
					border-bottom-color: var(--theme-color-primary-600);
					color: var(--theme-color-primary-600);
				}
			`;
		}
	}}
`;

interface ControlButtonProps {
	className?: string;
	isChanged?: boolean;
	noBorder?: boolean;
	disabled?: boolean;
	children?: React.ReactNode;
	onClick?: any;
}

export const ControlButton = ({ isChanged, children, className, ...props }: ControlButtonProps) => (
	<div className="group">
		<ControlButtonStyled className={cn("group", className)} {...props}>
			{isChanged && (
				<div
					className={cn(
						"flex absolute right-0 justify-center items-center -mt-3 w-3 h-3 rounded-full transition-all duration-100 ease-linear bg-theme-background",
						props.noBorder ? "-mr-1.5" : "mr-1",
					)}
				>
					<div className="w-2 h-2 rounded-full bg-theme-primary-500" />
				</div>
			)}
			<div className="absolute inset-0 -mx-0.5 rounded group-focus-visible group-focus:ring-2 ring-theme-primary-400" />
			{children}
		</ControlButtonStyled>
	</div>
);
