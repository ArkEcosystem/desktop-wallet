import React from "react";

export type TabId = string | number | undefined;

export function useTab({ initialId }: { initialId: TabId }) {
	const [currentId, setCurrentId] = React.useState<TabId>(initialId);

	const isIdActive = React.useCallback((id: TabId) => currentId === id, [currentId]);

	return { currentId, isIdActive, setCurrentId };
}

export const TabContext = React.createContext<ReturnType<typeof useTab> | undefined>(undefined);
