import "./styles/app.css";

import { App } from "app";
import { ConfirmationModal } from "app/components/ConfirmationModal";
import React, { useCallback, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { HashRouter } from "react-router-dom";

// Based on https://github.com/fvilers/disable-react-devtools.
if (process.env.NODE_ENV && ["development", "production"].includes(process.env.NODE_ENV)) {
	const isFunction = (value: unknown): boolean => typeof value == "function" || false;
	const isObject = (value: unknown): boolean => typeof value === "function" || (typeof value === "object" && !!value);

	// @ts-ignore
	if (isObject(window.__REACT_DEVTOOLS_GLOBAL_HOOK__)) {
		// @ts-ignore
		for (const property in window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
			// @ts-ignore
			window.__REACT_DEVTOOLS_GLOBAL_HOOK__[property] = isFunction(
				// @ts-ignore
				window.__REACT_DEVTOOLS_GLOBAL_HOOK__[property],
			)
				? Function.prototype
				: null;
		}
	}
}

export const AppRouter = ({ children }: { children: React.ReactNode }) => {
	const [isOpen, setIsOpen] = useState(false);

	const confirmationFunctionReference = useRef<(allowNavigate: boolean) => void>();

	const onCancel = () => {
		confirmationFunctionReference.current?.(false);
		setIsOpen(false);
	};

	const onConfirm = () => {
		confirmationFunctionReference.current?.(true);
		setIsOpen(false);
	};

	const getUserConfirmation = useCallback((_, callback) => {
		confirmationFunctionReference.current = callback;
		setIsOpen(true);
	}, []);

	return (
		<HashRouter getUserConfirmation={getUserConfirmation}>
			{children}
			<ConfirmationModal isOpen={isOpen} onCancel={onCancel} onConfirm={onConfirm} />
		</HashRouter>
	);
};

ReactDOM.render(
	<AppRouter>
		<App />
	</AppRouter>,
	document.querySelector("#root"),
);
