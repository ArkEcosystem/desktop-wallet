import { createFixture } from "../../../utils/e2e-utils";
import { goToSettings } from "./common";

createFixture(`Settings routing`);

test("should navigate to settings page", async (t) => await goToSettings(t));
