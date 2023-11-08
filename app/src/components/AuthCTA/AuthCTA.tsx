import { CTA, CTAProps } from "@interlay/ui";
// import { useAccount } from "../../hooks/useAccount";

type AuthCTAProps = CTAProps;

const AuthCTA = ({
  onPress,
  onClick,
  disabled,
  children,
  type,
  ...props
}: AuthCTAProps) => {
  // const { data: address } = useAccount();

  const btcAddress = "123";

  const authProps = btcAddress
    ? { onPress, onClick, disabled, children, type, ...props }
    : { onPress: () => open(), children: "Connect Wallet", ...props };

  return <CTA {...authProps} />;
};

export { AuthCTA };
