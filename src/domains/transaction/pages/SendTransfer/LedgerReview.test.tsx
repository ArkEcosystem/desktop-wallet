import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { renderHook } from "@testing-library/react-hooks";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { env, getDefaultProfileId, render, screen } from "utils/testing-library";

import { TransferLedgerReview } from "./LedgerReview";

describe("TransferLedgerReview", () => {
  let profile: Contracts.IProfile;
  let wallet: Contracts.IReadWriteWallet;

  beforeEach(() => {
    profile = env.profiles().findById(getDefaultProfileId());
    wallet = profile.wallets().first();
  });

  it("should render", () => {
    const { result } = renderHook(() =>
      useForm({
        defaultValues: {
          fee: "0",
          recipients: [],
        },
      }),
    );

    result.current.register("fee");
    result.current.register("recipients");

    const { container } = render(
      <FormProvider {...result.current}>
        <TransferLedgerReview wallet={wallet} estimatedExpiration={123} />
      </FormProvider>,
    );

    expect(screen.getByText(123)).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it("should render skeleton while loading expiration", () => {
    const { result } = renderHook(() =>
      useForm({
        defaultValues: {
          fee: "0",
          recipients: [],
        },
      }),
    );

    result.current.register("fee");
    result.current.register("recipients");

    const { container } = render(
      <FormProvider {...result.current}>
        <TransferLedgerReview wallet={wallet} estimatedExpiration={undefined} />
      </FormProvider>,
    );

    expect(screen.getByTestId("TransferLedgerReview__expiration-skeleton")).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});
