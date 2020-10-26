import { Dropdown, DropdownOption } from "app/components/Dropdown";
import { Icon } from "app/components/Icon";
import React from "react";
import tw, { styled } from "twin.macro";

type CardProps = {
	as?: React.ElementType;
	children: React.ReactNode;
	addonIcons?: React.ReactNode;
	actions?: DropdownOption[];
	onClick?: any;
	onSelect?: any;
	isSelected?: boolean;
	className?: string;
};

const Wrapper = styled.div<{ isSelected?: boolean; onClick?: any }>`
	${tw`bg-theme-background relative transition-all duration-200 p-6 border-2 rounded-lg`}
	${({ onClick }) => typeof onClick === "function" && tw`cursor-pointer hover:border-theme-background hover:shadow-xl`}
	${({ isSelected }) =>
		isSelected
			? tw`bg-theme-success-contrast border-theme-success-600 hover:border-theme-success-contrast`
			: tw`bg-theme-background border-theme-primary-contrast dark:border-theme-neutral-800`}
`;

export const Card = ({ children, addonIcons, actions, onClick, onSelect, isSelected, className }: CardProps) => (
	<Wrapper isSelected={isSelected} className={className} onClick={onClick} data-testid="Card">
		{children}
		<div className="absolute flex items-center m-4 space-x-1 -top-1 -right-1">
			{addonIcons}
			{actions && actions.length > 0 && (
				<Dropdown
					dropdownClass="top-0"
					options={actions}
					onSelect={onSelect}
					toggleContent={
						<div className="flex justify-center w-4 overflow-hidden">
							<Icon
								name="Settings"
								className="p-1 transition-colors duration-200 cursor-pointer text-theme-primary-300 dark:text-theme-neutral-600 hover:text-theme-danger-400"
							/>
						</div>
					}
				/>
			)}
		</div>
	</Wrapper>
);
