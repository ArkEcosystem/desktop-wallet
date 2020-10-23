import { boolean } from "@storybook/addon-knobs";
import React from "react";
import { TransactionFixture } from "tests/fixtures/transactions";

import { IpfsDetail } from "./IpfsDetail";

export default { title: "Domains / Transaction / Components / IPFSDetail" };

export const Default = () => (
  <IpfsDetail
    isOpen={boolean("Is Open", true)}
    transaction={TransactionFixture}
    wallet={TransactionFixture.wallet()}
    onClose={() => alert("closed")}
  />
);
