import * as Sentry from "@sentry/react";
import React from "react";
import { render, screen } from "utils/testing-library";

import { SentryProvider, useSentryContext } from "./SentryProvider";

describe("SentryProvider", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it("should capture message", () => {
		const captureMessageSpy = jest.spyOn(Sentry, "captureMessage").mockImplementation();
		const Component = () => {
			const context = useSentryContext();
			context.captureMessage("My info message");
			return <span>Hello</span>;
		};
		render(
			<SentryProvider>
				<Component />
			</SentryProvider>,
		);

		expect(screen.getByText("Hello")).toBeInTheDocument();
		expect(captureMessageSpy).toHaveBeenCalledWith("My info message");
	});

	it("should capture exception", () => {
		const captureExceptionSpy = jest.spyOn(Sentry, "captureException").mockImplementation();
		const Component = () => {
			const context = useSentryContext();
			context.captureException(new Error("Failed"));
			return <span>Hello</span>;
		};
		render(
			<SentryProvider>
				<Component />
			</SentryProvider>,
		);

		expect(screen.getByText("Hello")).toBeInTheDocument();
		expect(captureExceptionSpy).toHaveBeenCalledWith(new Error("Failed"));
	});
});
