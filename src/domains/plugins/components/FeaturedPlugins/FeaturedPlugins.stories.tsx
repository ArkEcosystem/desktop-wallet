import { boolean } from "@storybook/addon-knobs";
import React from "react";

import { FeaturedPlugins } from "./FeaturedPlugins";

export default { title: "Plugins / Components / Featured Plugins" };

export const Default = () => <FeaturedPlugins isOpen={boolean("Is Open", true)} onClose={() => alert("closed")} />;
