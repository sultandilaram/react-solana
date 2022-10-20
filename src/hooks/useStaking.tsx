import React from 'react'
import { StakingContext, IStakingContext } from '../contexts/contexts';

export default function useStaking() {
  const context: IStakingContext | undefined = React.useContext(StakingContext);
  if (!context) throw new Error("useStaking must be used inside StakingProvider");
  return context
}
