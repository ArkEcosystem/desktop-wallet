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
	${({ onClick }) =>
		typeof onClick === "function" && tw`cursor-pointer hover:border-theme-background hover:shadow-xl`}
	${({ isSelected }) =>
		isSelected
			? tw`bg-theme-success-contrast border-theme-success-600 hover:border-theme-success-contrast`
			: tw`bg-theme-background border-theme-primary-contrast`}
`;

export const Card = ({ children, addonIcons, actions, onClick, onSelect, isSelected, className }: CardProps) => (
	<Wrapper isSelected={isSelected} className={className} onClick={onClick} data-testid="Card">
		{children}
		<div className="absolute top-0 right-0 flex items-center m-2 space-x-2">
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
							className="p-2 cursor-pointer text-theme-neutral-400 hover:text-theme-neutral-500"
						/>
					}
				/>
			)}
		</div>
	</Wrapper>
);
