import { PluginManager } from "plugins/core";
import React from "react";
import { ErrorBoundary } from "react-error-boundary";

export const withThemeDecorator = <T extends {}>(
	hookName: string,
	Component: React.ComponentType<T>,
	manager: PluginManager,
) => {
	const Wrapper = React.forwardRef((properties: T, reference) => {
		const Result = manager.plugins().applyFilters<any>("service.theme", hookName, Component, properties);
		const fallback = React.createElement(Component, { ...properties, ref: reference });

		return (
			<ErrorBoundary fallback={fallback}>
				<Result ref={reference} {...properties} />
			</ErrorBoundary>
		);
	});

	Wrapper.displayName = `withThemeDecorator(${Component.displayName})`;
	return Wrapper;
};
