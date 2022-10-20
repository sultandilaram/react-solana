import React from 'react';
import { StakingContext } from '../contexts/contexts';
export default function useStaking() {
  const context = React.useContext(StakingContext);
  if (!context) throw new Error("useStaking must be used inside StakingProvider");
  return context;
}