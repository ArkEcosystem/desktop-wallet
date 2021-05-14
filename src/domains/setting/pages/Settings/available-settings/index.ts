import { Export } from "./Export";
import { General } from "./General";
import { PasswordSettings as Password } from "./Password";

export const availableSettings: Record<string, any> = { General, Password, Export };
