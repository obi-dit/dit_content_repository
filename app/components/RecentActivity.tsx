'use client';

export interface ActivityItem {
  action: string;
  item: string;
  time: string;
  icon: string;
}

interface RecentActivityProps {
  activities?: ActivityItem[];
  title?: string;
  maxItems?: number;
}

const defaultActivities: ActivityItem[] = [
  {
    action: 'Published',
    item: 'Getting Started with Next.js',
    time: '2 hours ago',
    icon: '✅',
  },
  {
    action: 'Updated',
    item: 'API Best Practices',
    time: '5 hours ago',
    icon: '✏️',
  },
  {
    action: 'Created',
    item: 'Design System Guide',
    time: '1 day ago',
    icon: '📄',
  },
  {
    action: 'Archived',
    item: 'Technical Documentation',
    time: '3 days ago',
    icon: '📦',
  },
];

export default function RecentActivity({
  activities = defaultActivities,
  title = 'Recent Activity',
  maxItems,
}: RecentActivityProps) {
  const displayActivities = maxItems
    ? activities.slice(0, maxItems)
    : activities;

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-6">
      <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
        {title}
      </h2>
      <div className="space-y-4">
        {displayActivities.length === 0 ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center py-8">
            No recent activity
          </p>
        ) : (
          displayActivities.map((activity, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
            >
              <span className="text-xl">{activity.icon}</span>
              <div className="flex-1">
                <p className="text-sm text-zinc-900 dark:text-zinc-50">
                  <span className="font-semibold">{activity.action}</span>{' '}
                  {activity.item}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  {activity.time}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}





