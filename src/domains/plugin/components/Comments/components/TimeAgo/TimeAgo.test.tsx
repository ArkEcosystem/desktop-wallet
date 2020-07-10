import { translations } from "app/i18n/common/i18n";
import React from "react";
import { render } from "testing-library";

import { TimeAgo } from "./TimeAgo";

describe("TimeAgo", () => {
	it("should render", () => {
		const date = "2020-06-19T14:48:00.000Z";

		const { asFragment } = render(<TimeAgo date={date} />);

		expect(asFragment()).toMatchSnapshot();
	});

	it.each([
		["years", "2019-07-01T00:00:00.000Z", "YEARS_AGO"],
		["months", "2020-06-01T00:00:00.000Z", "MONTHS_AGO"],
		["days", "2020-06-30T00:00:00.000Z", "DAYS_AGO"],
		["hours", "2020-06-30T23:00:00.000Z", "HOURS_AGO"],
		["minutes", "2020-06-30T23:59:00.000Z", "MINUTES_AGO"],
	])("should render the difference in %s", (unit, date, key) => {
		const { getByTestId } = render(<TimeAgo date={date} />);

		expect(getByTestId("timeago")).toHaveTextContent(translations.DATETIME[key]);
	});

	it("should render the fallback if the difference is less than a minute", () => {
		const date = "2020-06-30T23:59:59.000Z";

		const { getByTestId } = render(<TimeAgo date={date} />);

		expect(getByTestId("timeago")).toHaveTextContent(translations.DATETIME.FEW_SECONDS_AGO);
	});
});
