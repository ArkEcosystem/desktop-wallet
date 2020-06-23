import React from "react";

import { AddExchangeCard, BlankCard, ExchangeCard } from "./ExchangeCard";

export default { title: "Exchange / Components / Exchange Cards" };

export const Exchange = () => (
	<ExchangeCard exchange={{ id: "test-exchange", name: "Test Exchange" }} onClick={() => alert("clicked exchange")} />
);

export const AddExchange = () => <AddExchangeCard />;

export const BlankExchange = () => <BlankCard />;
