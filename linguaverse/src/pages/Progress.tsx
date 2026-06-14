import { Flame, Star, Clock, Zap, BookOpen } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const weeklyData = [
  { day: '周一', minutes: 45 },
  { day: '周二', minutes: 30 },
  { day: '周三', minutes: 60 },
  { day: '周四', minutes: 25 },
  { day: '周五', minutes: 50 },
  { day: '周六', minutes: 75 },
  { day: '周日', minutes: 40 },
];

const skillData = [
  { subject: '听力', value: 72 },
  { subject: '口语', value: 58 },
  { subject: '阅读', value: 85 },
  { subject: '写作', value: 65 },
];

const recentActivities = [
  { id: 1, type: 'vocabulary', title: '英语日常会话 - 单元3', xp: 50, time: '2小时前' },
  { id: 2, type: 'grammar', title: '日语N3备考 - 语法练习', xp: 80, time: '5小时前' },
  { id: 3, type: 'speaking', title: '韩语基础发音 - 口语跟读', xp: 60, time: '昨天' },
  { id: 4, type: 'listening', title: '英语听力突破 - 听力训练', xp: 45, time: '昨天' },
  { id: 5, type: 'vocabulary', title: '日语五十音 - 复习', xp: 30, time: '2天前' },
];

function getActivityIcon(type: string) {
  switch (type) {
    case 'vocabulary': return BookOpen;
    case 'grammar': return Star;
    case 'speaking': return Zap;
    case 'listening': return Clock;
    default: return BookOpen;
  }
}

function CalendarHeatmap() {
  const days = 30;
  const today = new Date();
  const cells = Array.from({ length: days }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (days - 1 - i));
    const intensity = Math.random();
    let colorClass = 'bg-charcoal/5';
    if (intensity > 0.8) colorClass = 'bg-emerald-600';
    else if (intensity > 0.6) colorClass = 'bg-emerald-600/60';
    else if (intensity > 0.3) colorClass = 'bg-emerald-600/30';
    else if (intensity > 0.1) colorClass = 'bg-emerald-600/10';
    return { date: d, colorClass, minutes: Math.floor(intensity * 90) };
  });

  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        {cells.map((cell, i) => (
          <div
            key={i}
            className={`w-7 h-7 rounded-md ${cell.colorClass} transition-colors`}
            title={`${cell.date.getMonth() + 1}/${cell.date.getDate()} - ${cell.minutes}分钟`}
          />
        ))}
      </div>
      <div className="flex items-center gap-2 mt-3 text-xs text-charcoal/40">
        <span>少</span>
        <div className="w-4 h-4 rounded-sm bg-charcoal/5" />
        <div className="w-4 h-4 rounded-sm bg-emerald-600/10" />
        <div className="w-4 h-4 rounded-sm bg-emerald-600/30" />
        <div className="w-4 h-4 rounded-sm bg-emerald-600/60" />
        <div className="w-4 h-4 rounded-sm bg-emerald-600" />
        <span>多</span>
      </div>
    </div>
  );
}

export default function Progress() {
  const stats = [
    { icon: Zap, label: '总 XP', value: '12,450', color: 'text-gold-400', bg: 'bg-gold-400/20' },
    { icon: Star, label: '当前等级', value: 'Lv.12', color: 'text-emerald-600', bg: 'bg-emerald-600/20' },
    { icon: Flame, label: '连续打卡', value: '7天', color: 'text-orange-500', bg: 'bg-orange-500/20' },
    { icon: Clock, label: '学习天数', value: '45天', color: 'text-royal', bg: 'bg-royal/20' },
  ];

  return (
    <div className="min-h-screen bg-cream py-8 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-charcoal mb-2">学习进度</h1>
          <p className="text-charcoal/60">追踪你的学习旅程，见证每一步成长</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-sm border border-charcoal/5">
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div className="text-2xl font-bold text-charcoal">{stat.value}</div>
                <div className="text-charcoal/40 text-sm">{stat.label}</div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Weekly Study Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-charcoal/5">
            <h3 className="font-display text-lg font-bold text-charcoal mb-4">最近7天学习时长</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="day" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} unit="分" />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)' }}
                  formatter={(value: number) => [`${value} 分钟`, '学习时长']}
                />
                <Line
                  type="monotone"
                  dataKey="minutes"
                  stroke="#0D9373"
                  strokeWidth={3}
                  dot={{ fill: '#0D9373', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Skill Radar */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-charcoal/5">
            <h3 className="font-display text-lg font-bold text-charcoal mb-4">技能雷达图</h3>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={skillData}>
                <PolarGrid stroke="#E5E7EB" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#6B7280', fontSize: 12 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#9CA3AF', fontSize: 10 }} />
                <Radar
                  name="技能水平"
                  dataKey="value"
                  stroke="#0D9373"
                  fill="#0D9373"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Calendar Heatmap */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-charcoal/5 mb-8">
          <h3 className="font-display text-lg font-bold text-charcoal mb-4">学习日历</h3>
          <CalendarHeatmap />
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-charcoal/5">
          <h3 className="font-display text-lg font-bold text-charcoal mb-4">最近活动</h3>
          <div className="space-y-3">
            {recentActivities.map((activity) => {
              const Icon = getActivityIcon(activity.type);
              return (
                <div key={activity.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-cream transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600/10 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-charcoal truncate">{activity.title}</p>
                    <p className="text-xs text-charcoal/40">{activity.time}</p>
                  </div>
                  <span className="text-gold-400 text-sm font-semibold">+{activity.xp} XP</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
