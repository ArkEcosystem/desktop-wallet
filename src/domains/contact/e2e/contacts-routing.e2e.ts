import { createFixture } from "../../../utils/e2e-utils";
import { goToContacts } from "./common";

createFixture(`Contacts routing`);

test("should navigate to contacts page", async (t) => await goToContacts(t));
