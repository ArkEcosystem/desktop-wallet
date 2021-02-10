import React from "react";
import tw, { styled } from "twin.macro";

import { TabContext, TabId, useTab } from "./useTab";

type TabsProps = {
	children: React.ReactNode;
	activeId?: TabId;
	className?: string;
	onChange?: (id: TabId) => void;
};

export function Tabs({ children, activeId, className, onChange }: TabsProps) {
	const context = useTab({ initialId: activeId });
	const { currentId, setCurrentId } = context;

	React.useEffect(() => {
		if (currentId) {
			onChange?.(currentId);
		}
	}, [currentId, onChange]);

	React.useEffect(() => {
		setCurrentId(activeId);
	}, [setCurrentId, activeId]);

	return (
		<TabContext.Provider value={context}>
			<div className={className}>{children}</div>
		</TabContext.Provider>
	);
}

type TabProps = {
	children: React.ReactNode;
	tabId: string | number;
};

const TabButton = styled.button``;

export const Tab = React.forwardRef<HTMLButtonElement, TabProps>((props: TabProps, ref) => {
	const context = React.useContext(TabContext);
	const isActive = context?.isIdActive(props.tabId);

	return (
		<TabButton
			data-testid={`tabs__tab-button-${props.tabId}`}
			ref={ref}
			aria-selected={isActive}
			onClick={() => context?.setCurrentId(props.tabId)}
		>
			{props.children}
		</TabButton>
	);
});
Tab.displayName = "Tab";

export const TabList = styled.div`
	${tw`inline-flex justify-start items-stretch rounded bg-theme-secondary-100 dark:bg-theme-secondary-background px-3`}

	& > ${TabButton} {
		${tw`px-8 py-6 border-b-3 border-transparent font-semibold text-theme-secondary-text relative transition-colors ease-in-out duration-300`}

		&[aria-selected="true"] {
			${tw`border-theme-primary-600 text-theme-text`}
		}

		&:hover,
		&:focus {
			${tw`outline-none text-theme-text`};
		}

		& + ${TabButton}:after {
			content: "";
			width: 1px;
			${tw`h-4 bg-theme-secondary-400 dark:bg-theme-secondary-700 absolute left-0 top-1/2 transform -translate-y-1/2 block`};
		}
	}
`;

type TabPanelProps = {
	children: React.ReactNode;
	tabId: string | number;
} & React.HTMLProps<any>;

export const TabPanel = React.forwardRef<HTMLDivElement, TabProps>(
	({ tabId, children, ...props }: TabPanelProps, ref) => {
		const context = React.useContext(TabContext);
		const isActive = context?.isIdActive(tabId);

		if (!isActive) {
			return <></>;
		}

		return (
			<div data-testid="tab-pabel__active-panel" ref={ref} {...props}>
				{children}
			</div>
		);
	},
);

TabPanel.displayName = "TabPanel";
