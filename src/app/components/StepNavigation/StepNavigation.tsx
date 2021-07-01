import { Button } from "app/components/Button";
import React from "react";
import { useTranslation } from "react-i18next";
import tw, { styled } from "twin.macro";

interface StepNavigationProperties {
  onBackClick: any;
  onBackToWalletClick: any;
  onContinueClick: any;
  isSubmitting: boolean;
  isValid: boolean;
  activeIndex: number;
  size: number;
}

const StepNavigationWrapper = styled.div`
  ${tw`flex justify-end mt-8 space-x-3`}
`;

export const StepNavigation: React.FC<StepNavigationProperties> = ({
  onBackClick,
  onBackToWalletClick,
  onContinueClick,
  isSubmitting,
  isValid,
  activeIndex,
  size,
}: StepNavigationProperties) => {
  const { t } = useTranslation();

  const showBack = activeIndex < size;
  const showBackToWallet = activeIndex === size;
  const showContinue = activeIndex < size - 1;
  const showSend = activeIndex === size - 1;

  return (
    <StepNavigationWrapper>
      {showBack && (
        <Button
          disabled={isSubmitting}
          data-testid="StepNavigation__back-button"
          variant="secondary"
          onClick={onBackClick}
        >
          {t("COMMON.BACK")}
        </Button>
      )}

      {showBackToWallet && (
        <Button
          data-testid="StepNavigation__back-to-wallet-button"
          variant="secondary"
          onClick={onBackToWalletClick}
        >
          {t("COMMON.BACK_TO_WALLET")}
        </Button>
      )}

      {showContinue && (
        <Button
          data-testid="StepNavigation__continue-button"
          disabled={!isValid || isSubmitting}
          isLoading={isSubmitting}
          onClick={onContinueClick}
        >
          {t("COMMON.CONTINUE")}
        </Button>        
      )}

      {showSend && (
        <Button
          type="submit"
          data-testid="StepNavigation__send-button"
          disabled={!isValid || isSubmitting}
          isLoading={isSubmitting}
          icon="Send"
          iconWidth={16}
          iconHeight={16}
          iconPosition="right"
        >
          <span>{t("COMMON.SEND")}</span>
        </Button>
      )}
    </StepNavigationWrapper>
  );
};
