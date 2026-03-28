import React from 'react';

const badgeConfig = {
  hot: { className: 'badge-hot', emoji: '\uD83D\uDD25' },
  warm: { className: 'badge-warm', emoji: '\uD83C\uDF21\uFE0F' },
  cool: { className: 'badge-cool', emoji: '\u2744\uFE0F' },
  won: { className: 'badge-won', emoji: '\u2713' },
  avail: { className: 'badge-avail', emoji: '' },
  transit: { className: 'badge-transit', emoji: '' },
};

export default function Badge({ level, children }) {
  const config = badgeConfig[level] || badgeConfig.cool;

  return (
    <span className={config.className}>
      {config.emoji && <span className="mr-1">{config.emoji}</span>}
      {children}
    </span>
  );
}
