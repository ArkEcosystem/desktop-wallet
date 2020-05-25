import { StoreCommit } from "@/enums";

export default (store) => {
	store._IS_READY = false;
	store.subscribe((mutation) => {
		if (mutation.type === StoreCommit.RestoreMutation) {
			store._vm.$root.$emit("vuex-persist:ready");
			store._IS_READY = true;
		}
	});
};
