import { Export } from "./Export";
import { General } from "./General";
import { PasswordSettings as Password } from "./Password";
import { Peer } from "./Peer";
import { Plugins } from "./Plugins";

export const availableSettings: Record<string, any> = { General, Password, Peer, Plugins, Export };
