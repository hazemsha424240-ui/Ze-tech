// مكوّن StatsCards: بيعرض الإجمالي وعدد العملاء لكل حالة
import { STATUSES } from '../utils/constants';

export default function StatsCards({ stats }) {
  if (!stats) return <div className="stats" />;
  const items = [['Total', stats.total]].concat(STATUSES.map((s) => [s, stats[s]]));
  return (
    <div className="stats">
      {items.map(([label, value]) => (
        <div className="stat" key={label}><b>{value}</b><span>{label}</span></div>
      ))}
    </div>
  );
}
