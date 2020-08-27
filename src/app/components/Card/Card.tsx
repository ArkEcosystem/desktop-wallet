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
	${tw`relative transition-all duration-200 p-6 border-2 rounded-lg`}
	${({ onClick }) => typeof onClick === "function" && tw`cursor-pointer hover:shadow-xl`}
	${({ isSelected }) =>
		isSelected
			? tw`border-theme-success-300 hover:border-theme-success-contrast`
			: tw`border-theme-primary-contrast hover:border-theme-background`}
`;

export const Card = ({ children, addonIcons, actions, onClick, onSelect, isSelected, className }: CardProps) => (
	<Wrapper isSelected={isSelected} className={className} onClick={onClick} data-testid="Card">
		{children}
		<div className="flex items-center space-x-2 absolute right-0 top-0 m-2">
			{addonIcons}
			{actions && actions.length > 0 && (
				<Dropdown
					dropdownClass="top-0"
					options={actions}
					onSelect={onSelect}
					toggleContent={
						<Icon
							name="Settings"
							width={4}
							height={20}
							className="p-2 text-theme-neutral-400 hover:text-theme-neutral-500 cursor-pointer"
						/>
					}
				/>
			)}
		</div>
	</Wrapper>
);
