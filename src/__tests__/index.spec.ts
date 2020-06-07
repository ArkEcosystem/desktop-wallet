jest.mock("react-dom", () => ({ render: jest.fn() }));
import ReactDOM from "react-dom";

describe("Application root", () => {
	it("should render without crashing", () => {
		const div = document.createElement("div");
		div.id = "root";
		document.body.appendChild(div);
		require("../index");
		expect(ReactDOM.render).toHaveBeenCalled();
		expect(ReactDOM.render).toMatchSnapshot();
	});
});
