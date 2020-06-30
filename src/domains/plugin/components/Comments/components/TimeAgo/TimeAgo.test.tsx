import { render } from "@testing-library/react";
import MockDate from "mockdate";
import React from "react";

import { TimeAgo } from "./TimeAgo";

beforeEach(() => MockDate.set(new Date("2020-07-01T00:00:00.000Z")));

afterEach(() => MockDate.reset());

describe("TimeAgo", () => {
	it("should render", () => {
		const date = "2020-06-19T14:48:00.000Z";

		const { asFragment } = render(<TimeAgo date={date} />);

		expect(asFragment()).toMatchSnapshot();
	});

	it.each([
		["years", "2000-07-01T00:00:00.000Z", "COMMON.DATETIME.YEARS_AGO"],
		["months", "2020-01-01T00:00:00.000Z", "COMMON.DATETIME.MONTHS_AGO"],
		["days", "2020-06-15T00:00:00.000Z", "COMMON.DATETIME.DAYS_AGO"],
		["hours", "2020-06-30T22:00:00.000Z", "COMMON.DATETIME.HOURS_AGO"],
		["minutes", "2020-06-30T23:55:00.000Z", "COMMON.DATETIME.MINUTES_AGO"],
	])("should render the difference in %s", (unit, date, value) => {
		const { getByTestId } = render(<TimeAgo date={date} />);

		expect(getByTestId("timeago")).toHaveTextContent(value);
	});

	it("should render the fallback if the difference is less than a minute", () => {
		const date = "2020-06-30T23:59:55.000Z";

		const { getByTestId } = render(<TimeAgo date={date} />);

		expect(getByTestId("timeago")).toHaveTextContent("COMMON.DATETIME.FEW_SECONDS_AGO");
	});
});
