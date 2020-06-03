import { createStore } from "vuex";

export const store = createStore({
	strict: process.env.NODE_ENV !== "production",
});
