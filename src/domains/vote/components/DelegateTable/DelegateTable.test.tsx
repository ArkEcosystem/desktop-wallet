import { ReadOnlyWallet } from "@arkecosystem/platform-sdk-profiles";
import { translations } from "app/i18n/common/i18n";
import React from "react";
import { act, fireEvent, render } from "testing-library";
import { data } from "tests/fixtures/coins/ark/delegates-devnet.json";

import { DelegateTable } from "./DelegateTable";

let delegates: ReadOnlyWallet[];
let votes: ReadOnlyWallet[];

describe("DelegateTable", () => {
	beforeAll(() => {
		delegates = [0, 1, 2].map(
			(index) =>
				new ReadOnlyWallet({
					address: data[index].address,
					explorerLink: "",
					publicKey: data[index].publicKey,
					username: data[index].username,
					rank: data[index].rank,
				}),
		);

		votes = [
			new ReadOnlyWallet({
				address: data[0].address,
				explorerLink: "",
				publicKey: data[0].publicKey,
				username: data[0].username,
				rank: data[0].rank,
			}),
		];
	});

	it("should render", () => {
		const { container, asFragment } = render(<DelegateTable delegates={delegates} maxVotes={1} />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with empty list", () => {
		const { container, asFragment } = render(<DelegateTable delegates={[]} maxVotes={1} />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should select a delegate to vote", () => {
		const { asFragment, getByTestId } = render(<DelegateTable delegates={delegates} maxVotes={1} />);
		const selectButton = getByTestId("DelegateRow__toggle-0");

		act(() => {
			fireEvent.click(selectButton);
		});

		expect(getByTestId("DelegateTable__footer")).toBeTruthy();
		expect(getByTestId("DelegateTable__footer--votes")).toHaveTextContent("1");

		act(() => {
			fireEvent.click(selectButton);
		});

		expect(selectButton).toHaveTextContent(translations.SELECTED);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should unselect a delegate to vote", () => {
		const { asFragment, getByTestId } = render(<DelegateTable delegates={delegates} votes={votes} maxVotes={1} />);
		const selectButton = getByTestId("DelegateRow__toggle-1");

		act(() => {
			fireEvent.click(selectButton);
		});

		expect(getByTestId("DelegateTable__footer")).toBeTruthy();
		expect(getByTestId("DelegateTable__footer--votes")).toHaveTextContent("1");

		act(() => {
			fireEvent.click(selectButton);
		});

		expect(selectButton).toHaveTextContent(translations.SELECTED);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should select a delegate to unvote", () => {
		const { asFragment, getByTestId } = render(<DelegateTable delegates={delegates} votes={votes} maxVotes={1} />);
		const selectButton = getByTestId("DelegateRow__toggle-0");

		act(() => {
			fireEvent.click(selectButton);
		});

		expect(getByTestId("DelegateTable__footer")).toBeTruthy();
		expect(getByTestId("DelegateTable__footer--unvotes")).toHaveTextContent("1");

		act(() => {
			fireEvent.click(selectButton);
		});

		expect(selectButton).toHaveTextContent(translations.CURRENT);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should unselect a delegate to unvote", () => {
		const { asFragment, getByTestId } = render(<DelegateTable delegates={delegates} votes={votes} maxVotes={1} />);
		const selectUnvoteButton = getByTestId("DelegateRow__toggle-0");
		const selectVoteButton = getByTestId("DelegateRow__toggle-1");

		act(() => {
			fireEvent.click(selectUnvoteButton);
		});

		act(() => {
			fireEvent.click(selectVoteButton);
		});

		expect(getByTestId("DelegateTable__footer")).toBeTruthy();
		expect(getByTestId("DelegateTable__footer--unvotes")).toHaveTextContent("1");
		expect(getByTestId("DelegateTable__footer--votes")).toHaveTextContent("1");

		act(() => {
			fireEvent.click(selectUnvoteButton);
		});

		expect(selectUnvoteButton).toHaveTextContent(translations.CURRENT);
		expect(selectVoteButton).toHaveTextContent(translations.SELECTED);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should select a delegate to unvote/vote", () => {
		const { asFragment, getByTestId } = render(<DelegateTable delegates={delegates} votes={votes} maxVotes={1} />);
		const selectUnvoteButton = getByTestId("DelegateRow__toggle-0");
		const selectVoteButton = getByTestId("DelegateRow__toggle-1");

		act(() => {
			fireEvent.click(selectUnvoteButton);
		});

		act(() => {
			fireEvent.click(selectVoteButton);
		});

		expect(getByTestId("DelegateTable__footer")).toBeTruthy();
		expect(getByTestId("DelegateTable__footer--unvotes")).toHaveTextContent("1");
		expect(getByTestId("DelegateTable__footer--votes")).toHaveTextContent("1");

		expect(selectUnvoteButton).toHaveTextContent(translations.UNSELECTED);
		expect(selectVoteButton).toHaveTextContent(translations.SELECTED);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should select multiple delegates to unvote/vote", () => {
		const { asFragment, getByTestId } = render(<DelegateTable delegates={delegates} votes={votes} maxVotes={10} />);
		const selectButtons = [0, 1, 2].map((index) => getByTestId(`DelegateRow__toggle-${index}`));

		act(() => {
			fireEvent.click(selectButtons[0]);
		});

		act(() => {
			fireEvent.click(selectButtons[1]);
		});

		act(() => {
			fireEvent.click(selectButtons[2]);
		});

		expect(getByTestId("DelegateTable__footer")).toBeTruthy();
		expect(getByTestId("DelegateTable__footer--votes")).toHaveTextContent("2");
		expect(getByTestId("DelegateTable__footer--unvotes")).toHaveTextContent("1");
		expect(asFragment()).toMatchSnapshot();
	});

	it("should emit action on continue button to vote", () => {
		const delegateAddress = delegates[0].address()!;

		const onContinue = jest.fn();
		const { container, asFragment, getByTestId } = render(
			<DelegateTable delegates={delegates} maxVotes={1} onContinue={onContinue} />,
		);
		const selectButton = getByTestId("DelegateRow__toggle-0");

		act(() => {
			fireEvent.click(selectButton);
		});

		expect(getByTestId("DelegateTable__footer")).toBeTruthy();

		act(() => {
			fireEvent.click(getByTestId("DelegateTable__continue-button"));
		});

		expect(container).toBeTruthy();
		expect(onContinue).toHaveBeenCalledWith([], [delegateAddress]);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should emit action on continue button to unvote", () => {
		const delegateAddress = votes[0].address()!;

		const onContinue = jest.fn();
		const { container, asFragment, getByTestId } = render(
			<DelegateTable delegates={delegates} maxVotes={1} votes={votes} onContinue={onContinue} />,
		);
		const selectButton = getByTestId("DelegateRow__toggle-0");

		act(() => {
			fireEvent.click(selectButton);
		});

		expect(getByTestId("DelegateTable__footer")).toBeTruthy();

		act(() => {
			fireEvent.click(getByTestId("DelegateTable__continue-button"));
		});

		expect(container).toBeTruthy();
		expect(onContinue).toHaveBeenCalledWith([delegateAddress], []);
		expect(asFragment()).toMatchSnapshot();
	});
});
