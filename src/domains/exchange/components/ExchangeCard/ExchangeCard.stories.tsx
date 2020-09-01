import React from "react";

import { AddExchangeCard, BlankExchangeCard, ExchangeCard } from "./ExchangeCard";

export default { title: "Domains / Exchange / Components / ExchangeCards" };

export const Exchange = () => (
	<ExchangeCard exchange={{ id: "test-exchange", name: "Test Exchange" }} onClick={() => alert("clicked exchange")} />
);

export const AddExchange = () => <AddExchangeCard onAddExchange={() => alert("clicked add exchange")} />;

export const BlankExchange = () => <BlankExchangeCard />;
