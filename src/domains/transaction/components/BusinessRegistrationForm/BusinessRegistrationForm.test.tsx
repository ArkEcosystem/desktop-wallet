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
			const { asFragment, debug } = render(<Component form={result.current} onSubmit={() => void 0} />);

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

			const addLink = async (headerTitle: string, optionLabel: string, inputValue: string) => {
				const headerElement = screen.getByText(headerTitle, {
					selector: "[data-testid=LinkCollection__header] > span",
				});
				act(() => {
					fireEvent.click(headerElement);
				});

				const selectButton = screen.getByTestId("select-list__toggle-button");

				act(() => {
					fireEvent.click(selectButton);
				});

				act(() => {
					fireEvent.click(screen.getByText(optionLabel), { selector: ["role=option"] });
				});

				await waitFor(() => expect(selectButton).toHaveTextContent(optionLabel));

				act(() => {
					fireEvent.input(screen.getByTestId("LinkCollection__input-link"), {
						target: {
							value: inputValue,
						},
					});
				});

				act(() => {
					fireEvent.click(screen.getByTestId("LinkCollection__add-link"));
				});

				act(() => {
					fireEvent.click(headerElement);
				});
			};

			// Add source control link
			await addLink("Repository", "GitHub", "https://github.com/test");
			// Add source media link
			await addLink("Social Media", "Facebook", "https://facebook.com/test");
			await addLink("Social Media", "Instagram", "https://instagram.com/test");
			// Add media link
			await addLink("Photo and Video", "Imgur", "https://i.imgur.com/123456.png");
			await addLink("Photo and Video", "YouTube", "https://youtube.com/watch?v=123456");

			await waitFor(() =>
				expect(result.current.getValues({ nest: true })).toEqual({
					ipfsData: {
						meta: {
							displayName: "Test Entity Name",
							description: "Test Entity Description",
							website: "https://test.entity.com",
						},
						sourceControl: [
							{
								type: "github",
								value: "https://github.com/test",
							},
						],
						socialMedia: [
							{
								type: "facebook",
								value: "https://facebook.com/test",
							},
							{
								type: "instagram",
								value: "https://instagram.com/test",
							},
						],
						images: [
							{
								type: "image",
								value: "https://i.imgur.com/123456.png",
							},
						],
						videos: [
							{
								type: "video",
								value: "https://youtube.com/watch?v=123456",
							},
						],
					},
				}),
			);

			expect(asFragment()).toMatchSnapshot();
		});
	});
});
