import { Profile } from "@arkecosystem/platform-sdk-profiles";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import React, { useCallback, useContext, useRef } from "react";

import { SentryErrorBoundary } from "./SentryErrorBoundary";

const SentryContext = React.createContext<any>(undefined);

const useSentry = () => {
	const initializedProfileRef = useRef<Profile>();

	const initSentry = useCallback((profile: Profile) => {
		if (initializedProfileRef.current?.id() === profile.id()) {
			return;
		}

		initializedProfileRef.current = profile;

		Sentry.init({
			dsn: process.env.REACT_APP_SENTRY_DSN,
			integrations: [new Integrations.BrowserTracing()],
			tracesSampleRate: 1.0,
		});

		Sentry.setContext("profile", {
			id: profile.id(),
		});
	}, []);

	const stopSentry = useCallback(() => {
		Sentry.init({
			dsn: undefined,
		});
	}, []);

	const captureMessage = useCallback((message) => {
		Sentry.captureMessage(message);
	}, []);

	const captureException = useCallback((err: Error) => {
		Sentry.captureException(err);
	}, []);

	return {
		captureException,
		captureMessage,
		initSentry,
		stopSentry,
	};
};

export const SentryProvider = ({ children }: { children: React.ReactNode }) => {
	const context = useSentry();

	return (
		<SentryContext.Provider value={context}>
			<SentryErrorBoundary>{children}</SentryErrorBoundary>
		</SentryContext.Provider>
	);
};

export const useSentryContext = (): ReturnType<typeof useSentry> => useContext(SentryContext);
