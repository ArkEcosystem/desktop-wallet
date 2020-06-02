import { computed, reactive } from "@vue/composition-api";

export function useTabContext(options: { initialId?: string | number; manual?: boolean }) {
	const state = reactive<{ currentId: string | number | undefined; manual: boolean }>({
		currentId: options?.initialId,
		manual: options?.manual || false
	});

	const setCurrentId = (id: string | number) => (state.currentId = id);

	const isIdActive = (id: string | number) => computed(() => state.currentId === id);

	return { state, setCurrentId, isIdActive };
}

export type TabContext = ReturnType<typeof useTabContext>;
export const TabContextSymbol = Symbol("[TabContext]");
