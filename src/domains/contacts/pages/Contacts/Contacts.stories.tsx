import { action } from "@storybook/addon-actions";
import React from "react";

import { Contacts } from "./Contacts";

export default { title: "Contacts / Pages / Contacts" };

export const Default = () => {
  return (
    <div>
      <Contacts onSearch={action("onSearch")} onAddContact={action("onAddContact")} />
    </div>
  );
};
