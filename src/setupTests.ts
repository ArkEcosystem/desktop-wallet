import "@testing-library/jest-dom/extend-expect";
import jestFetchMock from "jest-fetch-mock";

global.fetch = jestFetchMock;
