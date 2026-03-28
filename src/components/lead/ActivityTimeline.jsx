import React from 'react';

const typeColors = {
  call: '#4D96FF',
  meeting: '#FFD93D',
  note: '#A8A8A8',
  booking: '#10B981',
};

const THAI_MONTHS = [
  'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
  'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.',
];

function formatThaiTime(dateStr) {
  const d = new Date(dateStr);
  const day = d.getDate();
  const month = THAI_MONTHS[d.getMonth()];
  const hours = String(d.getHours()).padStart(2, '0');
  const mins = String(d.getMinutes()).padStart(2, '0');
  return `${day} ${month} ${hours}:${mins}`;
}

export default function ActivityTimeline({ activities = [] }) {
  if (activities.length === 0) {
    return (
      <p className="text-xs text-t3 text-center py-4">ยังไม่มีกิจกรรม</p>
    );
  }

  return (
    <div className="mt-2">
      {activities.map((activity, index) => {
        const isLast = index === activities.length - 1;
        const dotColor = typeColors[activity.type] || typeColors.note;

        return (
          <div key={activity.id} className="flex gap-[10px] py-[10px] border-b border-border last:border-0">
            {/* Left: dot */}
            <div className="flex flex-col items-center pt-1">
              <div
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: dotColor }}
              />
              {!isLast && (
                <div className="w-0.5 flex-1 bg-border mt-1" />
              )}
            </div>

            {/* Right: content */}
            <div className="flex-1">
              <p className="text-[12px] font-bold text-t1">{activity.title}</p>
              {activity.content && (
                <p className="text-[11px] text-t2 mt-0.5">{activity.content}</p>
              )}
              <p className="text-[10px] text-t3 mt-1">
                {formatThaiTime(activity.time)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
