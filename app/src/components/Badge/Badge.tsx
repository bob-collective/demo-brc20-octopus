import { Flex } from '@interlay/ui';
import { StyledBadge } from './Badge.style';

const Badge = () => {
  return (
    <Flex direction='column' justifyContent='center'>
      <StyledBadge>Testnet</StyledBadge>
    </Flex>
  );
};

export { Badge };
