import * as path from "path";
import { ClientFunction } from "testcafe";

export const getPageURL = () => path.resolve("build/index.html");

export const getLocation = ClientFunction(() => document.location.href);

export const scrollTo = ClientFunction((top: number, left = 0, behavior = "smooth") => {
	window.scrollTo({ top, left, behavior });
});

export const scrollToBottom = ClientFunction(() => window.scrollTo({ top: document.body.scrollHeight }));
