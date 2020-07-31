jest.mock("react-dom", () => ({ render: jest.fn() }));

describe("Application root", () => {
	it("should render without crashing", () => {
		const ReactDOM = require("react-dom");
		const div = document.createElement("div");
		div.id = "root";
		document.body.appendChild(div);
		require("./index");

		expect(ReactDOM.render).toHaveBeenCalled();
		expect(ReactDOM.render).toMatchSnapshot();
	});
});
