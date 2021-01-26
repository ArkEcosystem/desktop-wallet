import { DelegateMapper, ReadOnlyWallet } from "@arkecosystem/platform-sdk-profiles";
import React from "react";
import { render } from "testing-library";
import { TransactionFixture } from "tests/fixtures/transactions";

import { translations } from "../../../i18n";
import { TransactionRowRecipientLabel } from "./TransactionRowRecipientLabel";

describe("TransactionRowRecipientLabel", () => {
	it("should show address", () => {
		const { getByTestId } = render(<TransactionRowRecipientLabel transaction={TransactionFixture} />);
		expect(getByTestId("address__wallet-address")).toHaveTextContent("D8rr7B…s6YUYD");
	});

	it("should show label", () => {
		const { getByText } = render(
			<TransactionRowRecipientLabel transaction={{ ...TransactionFixture, type: () => "secondSignature" }} />,
		);
		expect(getByText(translations.TRANSACTION_TYPES.SECOND_SIGNATURE)).toBeTruthy();
	});

	it("should show a multipayment label", () => {
		const { getByText } = render(
			<TransactionRowRecipientLabel
				transaction={{
					...TransactionFixture,
					isTransfer: () => false,
					isMultiPayment: () => true,
					type: () => "multiPayment",
				}}
			/>,
		);
		expect(getByText(translations.TRANSACTION_TYPES.MULTI_PAYMENT)).toBeTruthy();
	});

	it("should show a business entity registration label", () => {
		const { getByText } = render(
			<TransactionRowRecipientLabel
				transaction={{
					...TransactionFixture,
					type: () => "businessEntityRegistration",
				}}
			/>,
		);
		expect(getByText(translations.TRANSACTION_TYPES.BUSINESS_ENTITY_REGISTRATION)).toBeTruthy();
	});

	it("should show a business entity resignation label", () => {
		const { getByText } = render(
			<TransactionRowRecipientLabel
				transaction={{
					...TransactionFixture,
					type: () => "businessEntityResignation",
				}}
			/>,
		);
		expect(getByText(translations.TRANSACTION_TYPES.BUSINESS_ENTITY_RESIGNATION)).toBeTruthy();
	});

	it("should show a business entity update label", () => {
		const { getByText } = render(
			<TransactionRowRecipientLabel
				transaction={{
					...TransactionFixture,
					type: () => "businessEntityUpdate",
				}}
			/>,
		);
		expect(getByText(translations.TRANSACTION_TYPES.BUSINESS_ENTITY_UPDATE)).toBeTruthy();
	});

	it("should show a product entity registration label", () => {
		const { getByText } = render(
			<TransactionRowRecipientLabel
				transaction={{
					...TransactionFixture,
					type: () => "productEntityRegistration",
				}}
			/>,
		);
		expect(getByText(translations.TRANSACTION_TYPES.PRODUCT_ENTITY_REGISTRATION)).toBeTruthy();
	});

	it("should show a product entity resignation label", () => {
		const { getByText } = render(
			<TransactionRowRecipientLabel
				transaction={{
					...TransactionFixture,
					type: () => "productEntityResignation",
				}}
			/>,
		);
		expect(getByText(translations.TRANSACTION_TYPES.PRODUCT_ENTITY_RESIGNATION)).toBeTruthy();
	});

	it("should show a product entity update label", () => {
		const { getByText } = render(
			<TransactionRowRecipientLabel
				transaction={{
					...TransactionFixture,
					type: () => "productEntityUpdate",
				}}
			/>,
		);
		expect(getByText(translations.TRANSACTION_TYPES.PRODUCT_ENTITY_UPDATE)).toBeTruthy();
	});

	it("should show a plugin entity registration label", () => {
		const { getByText } = render(
			<TransactionRowRecipientLabel
				transaction={{
					...TransactionFixture,
					type: () => "pluginEntityRegistration",
				}}
			/>,
		);
		expect(getByText(translations.TRANSACTION_TYPES.PLUGIN_ENTITY_REGISTRATION)).toBeTruthy();
	});

	it("should show a plugin entity resignation label", () => {
		const { getByText } = render(
			<TransactionRowRecipientLabel
				transaction={{
					...TransactionFixture,
					type: () => "pluginEntityResignation",
				}}
			/>,
		);
		expect(getByText(translations.TRANSACTION_TYPES.PLUGIN_ENTITY_RESIGNATION)).toBeTruthy();
	});

	it("should show a plugin entity update label", () => {
		const { getByText } = render(
			<TransactionRowRecipientLabel
				transaction={{
					...TransactionFixture,
					type: () => "pluginEntityUpdate",
				}}
			/>,
		);
		expect(getByText(translations.TRANSACTION_TYPES.PLUGIN_ENTITY_UPDATE)).toBeTruthy();
	});

	it("should show a module entity registration label", () => {
		const { getByText } = render(
			<TransactionRowRecipientLabel
				transaction={{
					...TransactionFixture,
					type: () => "moduleEntityRegistration",
				}}
			/>,
		);
		expect(getByText(translations.TRANSACTION_TYPES.MODULE_ENTITY_REGISTRATION)).toBeTruthy();
	});

	it("should show a module entity resignation label", () => {
		const { getByText } = render(
			<TransactionRowRecipientLabel
				transaction={{
					...TransactionFixture,
					type: () => "moduleEntityResignation",
				}}
			/>,
		);
		expect(getByText(translations.TRANSACTION_TYPES.MODULE_ENTITY_RESIGNATION)).toBeTruthy();
	});

	it("should show a module entity update label", () => {
		const { getByText } = render(
			<TransactionRowRecipientLabel
				transaction={{
					...TransactionFixture,
					type: () => "moduleEntityUpdate",
				}}
			/>,
		);
		expect(getByText(translations.TRANSACTION_TYPES.MODULE_ENTITY_UPDATE)).toBeTruthy();
	});

	describe("Votes", () => {
		jest.spyOn(DelegateMapper, "execute").mockImplementation((wallet, votes) =>
			votes.map(
				(vote: string, index: number) =>
					new ReadOnlyWallet({
						address: vote,
						username: `delegate-${index}`,
					}),
			),
		);

		it("should show a vote label", () => {
			const { getByTestId } = render(
				<TransactionRowRecipientLabel
					transaction={{
						...TransactionFixture,
						isTransfer: () => false,
						isVote: () => true,
						type: () => "vote",
						votes: () => ["+vote"],
					}}
				/>,
			);
			expect(getByTestId("TransactionRowVoteLabel")).toHaveTextContent(translations.TRANSACTION_TYPES.VOTE);
			expect(getByTestId("TransactionRowVoteLabel")).toHaveTextContent("delegate-0");
		});

		it("should show a vote label with counter", () => {
			const { getByTestId } = render(
				<TransactionRowRecipientLabel
					transaction={{
						...TransactionFixture,
						isTransfer: () => false,
						isVote: () => true,
						type: () => "vote",
						votes: () => ["+vote-1", "+vote-2"],
					}}
				/>,
			);
			expect(getByTestId("TransactionRowVoteLabel")).toHaveTextContent(translations.TRANSACTION_TYPES.VOTE);
			expect(getByTestId("TransactionRowVoteLabel")).toHaveTextContent("delegate-0");
			expect(getByTestId("TransactionRowVoteLabel")).toHaveTextContent("+1");
		});

		it("should show a unvote label", () => {
			const { getByTestId } = render(
				<TransactionRowRecipientLabel
					transaction={{
						...TransactionFixture,
						isTransfer: () => false,
						isUnvote: () => true,
						type: () => "unvote",
						unvotes: () => ["-vote"],
					}}
				/>,
			);
			expect(getByTestId("TransactionRowVoteLabel")).toHaveTextContent(translations.TRANSACTION_TYPES.UNVOTE);
			expect(getByTestId("TransactionRowVoteLabel")).toHaveTextContent("delegate-0");
		});

		it("should show a vote label with counter", () => {
			const { getByTestId } = render(
				<TransactionRowRecipientLabel
					transaction={{
						...TransactionFixture,
						isTransfer: () => false,
						isUnvote: () => true,
						type: () => "unvote",
						unvotes: () => ["-vote", "-vote-2"],
					}}
				/>,
			);
			expect(getByTestId("TransactionRowVoteLabel")).toHaveTextContent(translations.TRANSACTION_TYPES.UNVOTE);
			expect(getByTestId("TransactionRowVoteLabel")).toHaveTextContent("delegate-0");
			expect(getByTestId("TransactionRowVoteLabel")).toHaveTextContent("+1");
		});

		it("should show a vote combination label", () => {
			const { getByTestId } = render(
				<TransactionRowRecipientLabel
					transaction={{
						...TransactionFixture,
						isTransfer: () => false,
						isVoteCombination: () => true,
						isVote: () => true,
						isUnvote: () => true,
						type: () => "voteCombination",
						votes: () => ["-vote"],
						unvotes: () => ["-vote"],
					}}
				/>,
			);
			expect(getByTestId("TransactionRowVoteCombinationLabel")).toHaveTextContent(
				translations.TRANSACTION_TYPES.VOTE,
			);
			expect(getByTestId("TransactionRowVoteCombinationLabel")).toHaveTextContent(
				translations.TRANSACTION_TYPES.UNVOTE,
			);
		});

		it("should show a vote combination label with counter", () => {
			const { getByTestId } = render(
				<TransactionRowRecipientLabel
					transaction={{
						...TransactionFixture,
						isTransfer: () => false,
						isVoteCombination: () => true,
						isVote: () => true,
						isUnvote: () => true,
						type: () => "voteCombination",
						votes: () => ["+vote-1", "+vote-2"],
						unvotes: () => ["-vote-1", "-vote-2"],
					}}
				/>,
			);
			expect(getByTestId("TransactionRowVoteCombinationLabel")).toHaveTextContent(
				`${translations.TRANSACTION_TYPES.VOTE}2`,
			);
			expect(getByTestId("TransactionRowVoteCombinationLabel")).toHaveTextContent(
				`${translations.TRANSACTION_TYPES.UNVOTE}2`,
			);
		});
	});
});
