import React from 'react';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import { CARS } from '../../lib/mockData';
import { LEAD_LEVELS } from '../../lib/constants';

function getRelativeTime(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'เมื่อกี้';
  if (diffMins < 60) return `${diffMins} นาทีก่อน`;
  if (diffHours < 24) return `${diffHours} ชม.ก่อน`;
  if (diffDays < 30) return `${diffDays} วันก่อน`;
  return `${Math.floor(diffDays / 30)} เดือนก่อน`;
}

export default function LeadListItem({ lead, onClick }) {
  const levelConfig = LEAD_LEVELS[lead.level] || LEAD_LEVELS.cool;
  const carName = CARS[lead.car]?.name || '';

  return (
    <div
      onClick={onClick}
      className="card-base cursor-pointer flex items-center gap-3"
    >
      {/* Avatar */}
      <Avatar initial={lead.init} color={lead.color} size="md" />

      {/* Middle */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-t1 truncate">{lead.name}</p>
        <p className="text-xs text-t2 truncate">{lead.source}</p>
        {carName && (
          <p className="text-xs text-t3 truncate">{carName}</p>
        )}
      </div>

      {/* Right */}
      <div className="flex flex-col items-end gap-1 shrink-0">
        <Badge level={lead.level}>{levelConfig.label}</Badge>
        <span className="text-[10px] text-t3">
          {getRelativeTime(lead.createdAt)}
        </span>
      </div>
    </div>
  );
}
