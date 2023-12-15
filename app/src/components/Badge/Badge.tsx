import { Flex } from '@interlay/ui';
import { StyledBadge } from './Badge.style';
import { BITCOIN_NETWORK } from '../../utils/config';

const Badge = () => {
  if (BITCOIN_NETWORK === "testnet") {
    return (
      <Flex direction='column' justifyContent='center'>
        <StyledBadge>Testnet</StyledBadge>
      </Flex>
    );
  }
};

export { Badge };
