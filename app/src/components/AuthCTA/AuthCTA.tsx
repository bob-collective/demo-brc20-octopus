import { CTA, CTAProps } from "@interlay/ui";

type AuthCTAProps = CTAProps;

const AuthCTA = ({
  onPress,
  onClick,
  disabled,
  children,
  type,
  ...props
}: AuthCTAProps) => {
  const btcAddress = "123";

  const authProps = btcAddress
    ? { onPress, onClick, disabled, children, type, ...props }
    : { onPress: () => open(), children: "Connect Wallet", ...props };

  return <CTA {...authProps} />;
};

export { AuthCTA };
