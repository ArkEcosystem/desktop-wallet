import { getPageURL } from "../../../utils/e2e-utils";
import { goToNews } from "./common";

fixture`News page filtering`.page(getPageURL());

test("should navigate to news page", goToNews);
