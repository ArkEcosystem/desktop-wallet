import * as Sentry from "@sentry/react";
import { ApplicationError } from "domains/error/pages";
import React from "react";

export const SentryErrorBoundary = ({ children }: { children: React.ReactNode }) => (
	<Sentry.ErrorBoundary fallback={ApplicationError}>{children}</Sentry.ErrorBoundary>
);
