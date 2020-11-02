import Transport from "@ledgerhq/hw-transport";
import React, { createContext, useContext } from "react";

import { useLedgerConnection } from "./hooks/connection";

type Props = { transport: typeof Transport; children: React.ReactNode };

const LedgerContext = createContext<any>(undefined);

export const LedgerProvider = ({ transport, children }: Props) => {
	const ledger = useLedgerConnection(transport);
	return <LedgerContext.Provider value={ledger}>{children}</LedgerContext.Provider>;
};

/* istanbul ignore next */
export const useLedgerContext = (): ReturnType<typeof useLedgerConnection> => useContext(LedgerContext);
