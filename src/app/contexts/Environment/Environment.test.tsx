import { ARK } from "@arkecosystem/platform-sdk-ark";
import { httpClient } from "app/services";
import React from "react";
import { StubStorage } from "tests/mocks";
import { act, env, fireEvent, render, renderWithRouter, waitFor } from "utils/testing-library";

import { EnvironmentProvider, useEnvironmentContext } from "./Environment";

describe("Environment Context", () => {
	let db: Storage;

	beforeEach(() => {
		db = new StubStorage();
	});

	it("should throw without provider", () => {
		jest.spyOn(console, "error").mockImplementation(() => null);
		const Test = () => {
			const { env } = useEnvironmentContext();
			return <p>{env.profiles().count()}</p>;
		};

		expect(() => renderWithRouter(<Test />, { withProviders: false })).toThrowError();
		console.error.mockRestore();
	});

	it("should render the wrapper properly", () => {
		env.reset({ coins: { ARK }, httpClient, storage: new StubStorage() });

		const { container, asFragment, getByText } = render(
			<EnvironmentProvider env={env}>
				<span>Provider testing</span>
			</EnvironmentProvider>,
		);

		expect(getByText("Provider testing")).toBeInTheDocument();

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should rerender components when env updates", async () => {
		const Details = () => {
			const context = useEnvironmentContext();
			const count = React.useMemo(() => context.env.profiles().count(), [context]);
			return <h1>Counter {count}</h1>;
		};

		const Create = () => {
			const { env, persist } = useEnvironmentContext();

			const handleClick = async () => {
				env.profiles().create("Test");
				await persist();
			};

			return <button onClick={handleClick}>Create</button>;
		};

		const App = () => {
			env.reset({ coins: { ARK }, httpClient, storage: db });

			return (
				<EnvironmentProvider env={env}>
					<Details />
					<Create />
				</EnvironmentProvider>
			);
		};

		const { getByRole } = render(<App />, { withProviders: false });

		act(() => {
			fireEvent.click(getByRole("button"));
		});

		await waitFor(() => expect(getByRole("heading")).toHaveTextContent("Counter 1"));

		const profiles = await db.get<any>("profiles");
		expect(Object.keys(profiles)).toHaveLength(1);
	});
});
