import { render } from "@testing-library/react";
import React from "react";

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
			itemLabelClass: "text-2xl font-semibold text-theme-neutral-dark",
			itemLabelDescriptionClass: "text-sm font-semibold text-neutral-dark",
			labelClass: "",
			value: "",
			itemValueClass: "",
			content: (
				<div className="flex flex-row mt-2">
					<div className="flex items-center justify-center w-24 h-24 mr-6 border-2 border-dashed rounded border-theme-neutral"></div>
					<div className="relative w-24 h-24 rounded bg-theme-neutral">
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
