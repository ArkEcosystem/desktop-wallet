import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Environment, Storage } from "@arkecosystem/platform-sdk-profiles";
import { EnvironmentProvider, useEnvironmentContext } from "app/contexts";
import { httpClient } from "app/services";
import React from "react";
import { StubStorage } from "tests/mocks";
import { act, fireEvent, render, waitFor } from "utils/testing-library";

import { useStore } from "./use-store";

describe("useStore", () => {
	let db: Storage;

	beforeEach(() => {
		db = new StubStorage();
	});

	it("should rerender components when env updates", async () => {
		const Details = () => {
			const context = useEnvironmentContext();
			const count = React.useMemo(() => context.env.profiles().all().length, [context]);
			return <h1>Counter {count}</h1>;
		};

		const Create = () => {
			const { env } = useEnvironmentContext();

			const handleClick = () => {
				env.profiles().create("Test");
				env.persist();
			};

			return <button onClick={handleClick}>Create</button>;
		};

		const App = () => {
			const [storage, state, initialized] = useStore(db);
			const [env] = React.useState(() => new Environment({ coins: { ARK }, httpClient, storage }));

			return (
				<EnvironmentProvider env={env} state={state} initialized={initialized}>
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
