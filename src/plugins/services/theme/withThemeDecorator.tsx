import { PluginManager } from "plugins/core";
import React from "react";
import { ErrorBoundary } from "react-error-boundary";

export const withThemeDecorator = <T extends {}>(
	hookName: string,
	Component: React.ComponentType<T>,
	manager: PluginManager,
) => {
	const Wrapper = React.forwardRef((props: T, ref) => {
		const Result = manager.plugins().applyFilters<any>("service.theme", hookName, Component, props);
		const fallback = React.createElement(Component, { ...props, ref });

		return (
			<ErrorBoundary fallback={fallback}>
				<Result ref={ref} {...props} />
			</ErrorBoundary>
		);
	});

	Wrapper.displayName = `withThemeDecorator(${Component.displayName})`;
	return Wrapper;
};
