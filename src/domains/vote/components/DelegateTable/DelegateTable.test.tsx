import { ReadOnlyWallet } from "@arkecosystem/platform-sdk-profiles";
import { translations } from "app/i18n/common/i18n";
import React from "react";
import { act, fireEvent, render } from "testing-library";
import { data } from "tests/fixtures/coins/ark/devnet/delegates.json";

import { DelegateTable } from "./DelegateTable";

const selectedWallet = "DC8ghUdhS8w8d11K8cFQ37YsLBFhL3Dq2P";

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
		const { container, asFragment } = render(
			<DelegateTable delegates={delegates} maxVotes={1} selectedWallet={selectedWallet} />,
		);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render loading state", () => {
		const { container, asFragment } = render(
			<DelegateTable delegates={[]} maxVotes={1} selectedWallet={selectedWallet} isLoading={true} />,
		);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render pagination", () => {
		const { container, asFragment } = render(
			<DelegateTable
				itemsPerPage={1}
				delegates={delegates}
				maxVotes={1}
				selectedWallet={selectedWallet}
				isLoading={false}
			/>,
		);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with empty list", () => {
		const { container, asFragment } = render(
			<DelegateTable delegates={[]} maxVotes={1} selectedWallet={selectedWallet} />,
		);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should select a delegate to vote", () => {
		const { asFragment, getByTestId } = render(
			<DelegateTable delegates={delegates} maxVotes={1} selectedWallet={selectedWallet} />,
		);
		const selectButton = getByTestId("DelegateRow__toggle-0");

		act(() => {
			fireEvent.click(selectButton);
		});

		expect(getByTestId("DelegateTable__footer")).toBeTruthy();
		expect(getByTestId("DelegateTable__footer--votes")).toHaveTextContent("1");

		act(() => {
			fireEvent.click(selectButton);
		});

		expect(selectButton).toHaveTextContent(translations.SELECT);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should unselect a delegate to vote", () => {
		const { asFragment, getByTestId } = render(
			<DelegateTable delegates={delegates} votes={votes} maxVotes={1} selectedWallet={selectedWallet} />,
		);
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
		const { asFragment, getByTestId } = render(
			<DelegateTable delegates={delegates} votes={votes} maxVotes={1} selectedWallet={selectedWallet} />,
		);
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
		const { asFragment, getByTestId } = render(
			<DelegateTable delegates={delegates} votes={votes} maxVotes={1} selectedWallet={selectedWallet} />,
		);
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
		const { asFragment, getByTestId } = render(
			<DelegateTable delegates={delegates} votes={votes} maxVotes={1} selectedWallet={selectedWallet} />,
		);
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
		const { asFragment, getByTestId } = render(
			<DelegateTable delegates={delegates} votes={votes} maxVotes={10} selectedWallet={selectedWallet} />,
		);
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
			<DelegateTable
				delegates={delegates}
				maxVotes={1}
				selectedWallet={selectedWallet}
				onContinue={onContinue}
			/>,
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

	it("should render with a delegate to vote", () => {
		const delegateAddress = delegates[0].address()!;

		const onContinue = jest.fn();
		const { container, asFragment, getByTestId } = render(
			<DelegateTable
				delegates={delegates}
				maxVotes={1}
				selectedVoteAddresses={[delegateAddress]}
				selectedWallet={selectedWallet}
				onContinue={onContinue}
			/>,
		);

		expect(getByTestId("DelegateTable__footer")).toBeTruthy();

		act(() => {
			fireEvent.click(getByTestId("DelegateTable__continue-button"));
		});

		expect(container).toBeTruthy();
		expect(onContinue).toHaveBeenCalledWith([], [delegateAddress]);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with a delegate to unvote", () => {
		const delegateAddress = delegates[0].address()!;

		const onContinue = jest.fn();
		const { container, asFragment, getByTestId } = render(
			<DelegateTable
				delegates={delegates}
				maxVotes={1}
				selectedUnvoteAddresses={[delegateAddress]}
				selectedWallet={selectedWallet}
				onContinue={onContinue}
			/>,
		);

		expect(getByTestId("DelegateTable__footer")).toBeTruthy();

		act(() => {
			fireEvent.click(getByTestId("DelegateTable__continue-button"));
		});

		expect(container).toBeTruthy();
		expect(onContinue).toHaveBeenCalledWith([delegateAddress], []);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with a delegate to unvote/vote", () => {
		const unvoteAddress = delegates[0].address()!;
		const voteAddress = delegates[1].address()!;

		const onContinue = jest.fn();
		const { container, asFragment, getByTestId } = render(
			<DelegateTable
				delegates={delegates}
				maxVotes={1}
				votes={votes}
				selectedUnvoteAddresses={[unvoteAddress]}
				selectedVoteAddresses={[voteAddress]}
				selectedWallet={selectedWallet}
				onContinue={onContinue}
			/>,
		);

		expect(getByTestId("DelegateTable__footer")).toBeTruthy();
		expect(getByTestId("DelegateTable__footer--unvotes")).toHaveTextContent("1");
		expect(getByTestId("DelegateTable__footer--votes")).toHaveTextContent("1");

		act(() => {
			fireEvent.click(getByTestId("DelegateTable__continue-button"));
		});

		expect(container).toBeTruthy();
		expect(onContinue).toHaveBeenCalledWith([unvoteAddress], [voteAddress]);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should emit action on continue button to unvote", () => {
		const delegateAddress = votes[0].address()!;

		const onContinue = jest.fn();
		const { container, asFragment, getByTestId } = render(
			<DelegateTable
				delegates={delegates}
				maxVotes={1}
				votes={votes}
				selectedWallet={selectedWallet}
				onContinue={onContinue}
			/>,
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

	it("should navigate on next and previous pages", () => {
		const { getByTestId } = render(
			<DelegateTable
				delegates={delegates}
				votes={votes}
				maxVotes={1}
				selectedWallet={selectedWallet}
				itemsPerPage={2}
			/>,
		);

		expect(getByTestId("DelegateRow__toggle-1")).toBeTruthy();

		act(() => {
			fireEvent.click(getByTestId("Pagination__next"));
		});

		expect(getByTestId("DelegateRow__toggle-0")).toBeTruthy();

		act(() => {
			fireEvent.click(getByTestId("Pagination__previous"));
		});

		expect(getByTestId("DelegateRow__toggle-1")).toBeTruthy();
	});
});
