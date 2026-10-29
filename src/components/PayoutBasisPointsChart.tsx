import React from 'react';
import { PayoutDistributionModel } from '../types/payout-distribution';
import './PayoutBasisPointsChart.css';

interface PayoutBasisPointsChartProps {
  distribution: PayoutDistributionModel;
}

export const PayoutBasisPointsChart: React.FC<PayoutBasisPointsChartProps> = ({ distribution }) => {
  const size = 180;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <div className="payout-chart-container" role="figure" aria-label="Prize Pool Payout Distribution">
      <div className="chart-svg-wrapper">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="payout-donut-svg">
          {distribution.tiers.map((tier, idx) => {
            const percent = tier.basisPoints / 10000;
            const strokeDasharray = `${percent * circumference} ${circumference}`;
            const strokeDashoffset = -accumulatedPercent * circumference;
            accumulatedPercent += percent;

            return (
              <circle
                key={idx}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={tier.color}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="donut-segment"
              />
            );
          })}
        </svg>
        <div className="donut-center-label">
          <span className="donut-total-amount">{distribution.totalPrizePoolXlm} XLM</span>
          <span className="donut-total-caption">Total Pool</span>
        </div>
      </div>

      <div className="payout-legend">
        {distribution.tiers.map((tier, idx) => {
          const payoutXlm = (distribution.totalPrizePoolXlm * tier.basisPoints) / 10000;
          return (
            <div key={idx} className="legend-row">
              <span className="legend-color-dot" style={{ background: tier.color }} />
              <span className="legend-label">{tier.label}</span>
              <span className="legend-bps">({tier.basisPoints / 100}%)</span>
              <strong className="legend-amount">{payoutXlm.toFixed(1)} XLM</strong>
            </div>
          );
        })}
      </div>
    </div>
  );
};
