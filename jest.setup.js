import MockDate from "mockdate";

jest.mock("react-router-dom", () => ({
	...jest.requireActual("react-router-dom"),
	useParams: () => ({
		profileId: "bli",
		walletId: "bleh",
	}),
}));

beforeEach(() => {
	MockDate.set(new Date("2020-07-01T00:00:00.000Z"));
});

afterEach(() => {
	MockDate.reset();
});
