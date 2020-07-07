import "@testing-library/jest-dom/extend-expect";
import "mutationobserver-shim";

global.fetch = require("jest-fetch-mock");
