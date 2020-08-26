import {Selector } from "testcafe";

import { getPageURL, scrollToTop } from "../../../utils/e2e-utils";
import { goToSettings } from "./common";

fixture`Settings routing`.page(getPageURL());

test("should navigate to settings page", async (t) => await goToSettings(t));
