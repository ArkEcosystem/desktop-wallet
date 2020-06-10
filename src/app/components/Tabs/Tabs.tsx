import React from "react";
import tw, { styled } from "twin.macro";
import { TabContext, useTab, TabId } from "./useTab";

type TabsProps = {
	children: React.ReactNode;
	activeId?: TabId;
	onChange?: (id: TabId) => void;
};

export function Tabs({ children, activeId, onChange }: TabsProps) {
	const context = useTab({ initialId: activeId });

	React.useEffect(() => {
		if (context.currentId) {
			onChange?.(context.currentId);
		}
	}, [context.currentId, onChange, context]);

	React.useEffect(() => {
		context.setCurrentId(activeId);
	}, [activeId]);

	return (
		<TabContext.Provider value={context}>
			<div>{children}</div>
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
    ${tw`inline-flex justify-start items-stretch rounded bg-theme-neutral-contrast px-3`}

    & > ${TabButton} {
        ${tw`px-5 py-4 border-b-3 border-transparent font-semibold text-theme-neutral-dark relative transition-colors ease-in-out duration-300`}

        &[aria-selected="true"] {
            ${tw`border-theme-primary text-theme-text`}
        }

        &:hover,
		&:focus {
			${tw`outline-none text-theme-text`};
        }

        & + ${TabButton}:after {
            content: "";
            width: 1px;
            ${tw`h-4 bg-theme-neutral-light absolute left-0 top-1/2 transform -translate-y-1/2 block`};
        }
    }
`;

type TabPanelProps = {
	children: React.ReactNode;
	tabId: string | number;
};

export const TabPanel = React.forwardRef<HTMLDivElement, TabProps>((props: TabPanelProps, ref) => {
	const context = React.useContext(TabContext);
	const isActive = context?.isIdActive(props.tabId);

	if (!isActive) {
		return <></>;
	}

	return (
		<div data-testid="tab-pabel__active-panel" ref={ref}>
			{props.children}
		</div>
	);
});
TabPanel.displayName = "TabPanel";
