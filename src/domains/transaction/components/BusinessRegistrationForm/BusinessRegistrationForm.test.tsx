import { Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { renderHook } from "@testing-library/react-hooks";
import { Form } from "app/components/Form";
import React from "react";
import { useForm } from "react-hook-form";
import { act, env, fireEvent, getDefaultProfileId, render, screen, waitFor } from "utils/testing-library";

import { BusinessRegistrationForm } from "./BusinessRegistrationForm";

describe("BusinessRegistrationForm", () => {
	let profile: Profile;
	let wallet: ReadWriteWallet;
	let feeOptions: Record<string, string>;

	beforeAll(() => {
		const profile = env.profiles().findById(getDefaultProfileId());
		wallet = profile.wallets().first();
		feeOptions = {
			last: (2 * 1e8).toFixed(0),
			min: "0",
			max: (10 * 1e8).toFixed(0),
			average: (1.354 * 1e8).toFixed(0),
		};
	});

	describe("Form", () => {
		const Component = ({ form, onSubmit }: { form: ReturnType<typeof useForm>; onSubmit: () => void }) => (
			<Form context={form} onSubmit={onSubmit}>
				<BusinessRegistrationForm.component activeTab={2} feeOptions={feeOptions} wallet={wallet} />
			</Form>
		);

		it("should render 2nd step", async () => {
			const { result } = renderHook(() => useForm());
			const { asFragment, getByTestId } = render(<Component form={result.current} onSubmit={() => void 0} />);

			await waitFor(() => expect(getByTestId("BusinessRegistrationForm__step--second")).toBeTruthy());
			expect(asFragment()).toMatchSnapshot();
		});

		it("should fill data", async () => {
			const { result } = renderHook(() => useForm());
			const { asFragment } = render(<Component form={result.current} onSubmit={() => void 0} />);

			act(() => {
				fireEvent.input(screen.getByTestId("BusinessRegistrationForm__name"), {
					target: {
						value: "Test Entity Name",
					},
				});
			});

			act(() => {
				fireEvent.input(screen.getByTestId("BusinessRegistrationForm__description"), {
					target: {
						value: "Test Entity Description",
					},
				});
			});

			act(() => {
				fireEvent.input(screen.getByTestId("BusinessRegistrationForm__website"), {
					target: {
						value: "https://test.entity.com",
					},
				});
			});

			const addLink = (index: number, value: string) => {
				const linkCollectionHeaders = screen.getAllByTestId("LinkCollection__header");

				act(() => {
					fireEvent.click(linkCollectionHeaders[index]);
				});

				act(() => {
					fireEvent.click(screen.getAllByTestId("select-list__toggle-button")[0]);
				});

				act(() => {
					fireEvent.click(screen.getAllByTestId("select-list__toggle-option-1")[0]);
				});

				act(() => {
					fireEvent.change(screen.getAllByTestId("LinkCollection__input-link")[0], {
						target: {
							value,
						},
					});
				});

				act(() => {
					fireEvent.click(screen.getAllByTestId("LinkCollection__add-link")[0]);
				});

				act(() => {
					fireEvent.click(linkCollectionHeaders[index]);
				});
			};

			// Add source control link
			addLink(0, "https://github.com/test");
			// Add source media link
			addLink(1, "https://twitter.com/test");

			await waitFor(() =>
				expect(result.current.getValues()).toEqual({
					"ipfsData.meta.displayName": "Test Entity Name",
					"ipfsData.meta.description": "Test Entity Description",
					"ipfsData.meta.website": "https://test.entity.com",
					"ipfsData.sourceControl": [
						{
							type: "github",
							value: "https://github.com/test",
						},
					],
					"ipfsData.socialMedia": [
						{
							type: "twitter",
							value: "https://twitter.com/test",
						},
					],
				}),
			);

			expect(asFragment()).toMatchSnapshot();
		});
	});
});
