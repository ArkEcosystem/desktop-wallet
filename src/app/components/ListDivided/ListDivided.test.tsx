import React from "react";
import { render } from "testing-library";

import { ListDivided } from "./ListDivided";

describe("ListDivided", () => {
	it("should render an empty list divided", () => {
		const { getByTestId, asFragment } = render(<ListDivided />);

		expect(getByTestId("list-divided__empty")).toHaveTextContent("empty");
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render an list divided with items", () => {
		const item = {
			isFloatingLabel: true,
			label: "New Profile",
			labelDescription: "Select Profile Image",
			itemLabelClass: "text-2xl font-semibold text-theme-secondary-text",
			itemLabelDescriptionClass: "text-sm font-semibold text-theme-secondary-700",
			labelClass: "",
			value: "",
			itemValueClass: "",
			content: (
				<div className="flex flex-row mt-2">
					<div className="flex justify-center items-center mr-6 w-24 h-24 rounded border-2 border-dashed border-theme-secondary-500" />
					<div className="relative w-24 h-24 rounded bg-theme-secondary-500">
						<img
							src="https://randomuser.me/api/portraits/men/3.jpg"
							className="object-cover rounded"
							alt="random avatar"
						/>
					</div>
				</div>
			),
		};
		const { container, asFragment } = render(<ListDivided items={[item]} />);

		expect(container.querySelectorAll("li").length).toEqual(1);
		expect(asFragment()).toMatchSnapshot();
	});
});
