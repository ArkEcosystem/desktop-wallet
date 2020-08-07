import { getPageURL } from "../../../utils/e2e-utils";
import { goToContacts } from "./common";

fixture`Contacts routing`.page(getPageURL());

test("should navigate to contacts page", async (t) => await goToContacts(t));
