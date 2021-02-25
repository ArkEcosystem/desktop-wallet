import * as Sentry from "@sentry/react";
import { ApplicationError } from "domains/error/pages";
import React from "react";

export const SentryErrorBoundary = ({ children }: { children: React.ReactNode }) => (
	// @ts-ignore
	<Sentry.ErrorBoundary fallback={(errorData) => <ApplicationError resetErrorBoundary={errorData.resetError} />}>
		{children}
	</Sentry.ErrorBoundary>
);
