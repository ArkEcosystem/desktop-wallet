import { computed, InjectionKey, reactive } from "@vue/composition-api";

export function useTabContext(options: { initialId?: string | number }) {
	const state = reactive<{ currentId: string | number | undefined }>({
		currentId: options?.initialId,
	});

	const setCurrentId = (id: string | number) => (state.currentId = id);

	const isIdActive = (id: string | number) => computed(() => state.currentId === id);

	return { state, setCurrentId, isIdActive };
}

export type TabContext = ReturnType<typeof useTabContext>;
export const TabContextSymbol: InjectionKey<TabContext> = Symbol("TabContext");
