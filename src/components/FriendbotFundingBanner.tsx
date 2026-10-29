import React, { useState } from 'react';
import { FriendbotClientService } from '../services/friendbot-client.service';
import './FriendbotFundingBanner.css';

interface FriendbotFundingBannerProps {
  walletAddress?: string;
  balanceXlm?: string;
  onFunded?: () => void;
}

export const FriendbotFundingBanner: React.FC<FriendbotFundingBannerProps> = ({
  walletAddress,
  balanceXlm,
  onFunded,
}) => {
  const [isFunding, setIsFunding] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!walletAddress) return null;

  const currentBalance = parseFloat(balanceXlm || '0');
  // Only display if balance is low (< 20 XLM)
  if (currentBalance >= 20) return null;

  const handleFund = async () => {
    setIsFunding(true);
    setFeedback(null);
    const res = await FriendbotClientService.requestTestnetXlm(walletAddress);
    setIsFunding(false);

    if (res.success) {
      setFeedback('10,000 testnet XLM claimed successfully!');
      onFunded?.();
    } else {
      setFeedback(res.error || 'Failed to claim from Friendbot');
    }
  };

  return (
    <div className="friendbot-banner" role="alert">
      <div className="friendbot-content">
        <span className="friendbot-icon">🚰</span>
        <div className="friendbot-text">
          <strong>Low Testnet Balance ({currentBalance.toFixed(2)} XLM):</strong> Need funds for tournament entry fees or smart contract gas?
        </div>
      </div>
      <div className="friendbot-actions">
        {feedback ? (
          <span className="friendbot-feedback">{feedback}</span>
        ) : (
          <button
            className="friendbot-btn"
            onClick={handleFund}
            disabled={isFunding}
          >
            {isFunding ? 'Requesting XLM...' : '⚡ Get 10,000 Testnet XLM'}
          </button>
        )}
      </div>
    </div>
  );
};
