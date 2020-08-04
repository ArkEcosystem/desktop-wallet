import { goToContacts } from "./common";

fixture`Contacts routing`.page`http://localhost:3000/`;

test("should navigate to contacts page", async (t) => await goToContacts(t));
