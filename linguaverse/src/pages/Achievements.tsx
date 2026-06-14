import { useState } from 'react';
import { Trophy, Star, Flame, BookOpen, Target, Crown, Zap, Heart, MessageCircle, Globe, Medal, Rocket } from 'lucide-react';

interface Badge {
  id: number;
  icon: typeof Star;
  title: string;
  description: string;
  unlocked: boolean;
  progress: number;
  total: number;
  color: string;
}

const badges: Badge[] = [
  { id: 1, icon: Flame, title: '连续7天', description: '连续打卡7天', unlocked: true, progress: 7, total: 7, color: 'bg-orange-500' },
  { id: 2, icon: Star, title: '初学者', description: '完成第一节课', unlocked: true, progress: 1, total: 1, color: 'bg-emerald-600' },
  { id: 3, icon: BookOpen, title: '词汇达人', description: '学习100个单词', unlocked: true, progress: 100, total: 100, color: 'bg-royal' },
  { id: 4, icon: Target, title: '语法高手', description: '完成50道语法题', unlocked: false, progress: 35, total: 50, color: 'bg-gold-400' },
  { id: 5, icon: Zap, title: '闪电学习', description: '一天内学习3小时', unlocked: true, progress: 1, total: 1, color: 'bg-purple-500' },
  { id: 6, icon: Heart, title: '社区之星', description: '获得100个赞', unlocked: false, progress: 67, total: 100, color: 'bg-red-500' },
  { id: 7, icon: MessageCircle, title: '社交达人', description: '发布20条帖子', unlocked: false, progress: 8, total: 20, color: 'bg-sky' },
  { id: 8, icon: Globe, title: '多语种', description: '同时学习3种语言', unlocked: true, progress: 3, total: 3, color: 'bg-emerald-600' },
  { id: 9, icon: Crown, title: '月度冠军', description: '月度排行榜第一名', unlocked: false, progress: 0, total: 1, color: 'bg-gold-400' },
  { id: 10, icon: Rocket, title: '快速进步', description: '一周内升2级', unlocked: false, progress: 1, total: 2, color: 'bg-indigo-500' },
  { id: 11, icon: Medal, title: '完美主义', description: '一次课程全部正确', unlocked: true, progress: 1, total: 1, color: 'bg-emerald-600' },
  { id: 12, icon: Trophy, title: '传奇学者', description: '累计学习1000小时', unlocked: false, progress: 320, total: 1000, color: 'bg-gold-400' },
];

const leaderboardData = {
  weekly: [
    { rank: 1, username: 'GrammarMaster', xp: 4520, level: 22 },
    { rank: 2, username: 'Sakura', xp: 3890, level: 15 },
    { rank: 3, username: '语言达人', xp: 3450, level: 18 },
    { rank: 4, username: '小明', xp: 2980, level: 8 },
    { rank: 5, username: 'K-POP粉丝', xp: 2650, level: 4 },
    { rank: 6, username: '桜子', xp: 2340, level: 10 },
    { rank: 7, username: '韩语爱好者', xp: 2100, level: 6 },
    { rank: 8, username: 'Polyglot', xp: 1890, level: 20 },
  ],
  monthly: [
    { rank: 1, username: 'Sakura', xp: 18500, level: 15 },
    { rank: 2, username: 'GrammarMaster', xp: 16200, level: 22 },
    { rank: 3, username: '语言达人', xp: 14800, level: 18 },
    { rank: 4, username: 'Polyglot', xp: 12300, level: 20 },
    { rank: 5, username: '小明', xp: 11200, level: 8 },
    { rank: 6, username: '桜子', xp: 9800, level: 10 },
    { rank: 7, username: 'K-POP粉丝', xp: 8900, level: 4 },
    { rank: 8, username: '韩语爱好者', xp: 7600, level: 6 },
  ],
};

function BadgeCard({ badge }: { badge: Badge }) {
  const Icon = badge.icon;
  return (
    <div className={`relative group ${badge.unlocked ? '' : 'opacity-60'}`}>
      <div className={`hexagon w-28 h-28 mx-auto flex items-center justify-center ${
        badge.unlocked ? badge.color : 'bg-charcoal/20'
      } transition-all duration-300 group-hover:scale-105`}>
        <Icon className={`w-10 h-10 ${badge.unlocked ? 'text-white' : 'text-charcoal/30'}`} />
      </div>
      {badge.unlocked && (
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-gold-400 rounded-full flex items-center justify-center">
          <Star className="w-3 h-3 text-white fill-white" />
        </div>
      )}
      <div className="text-center mt-3">
        <h4 className="text-sm font-semibold text-charcoal">{badge.title}</h4>
        <p className="text-xs text-charcoal/40 mt-0.5">{badge.description}</p>
        {!badge.unlocked && (
          <div className="mt-2">
            <div className="w-full h-1.5 bg-charcoal/10 rounded-full overflow-hidden">
              <div className={`h-full ${badge.color} rounded-full transition-all`} style={{ width: `${(badge.progress / badge.total) * 100}%` }} />
            </div>
            <p className="text-xs text-charcoal/30 mt-1">{badge.progress}/{badge.total}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Achievements() {
  const [leaderboardTab, setLeaderboardTab] = useState<'weekly' | 'monthly'>('weekly');

  const data = leaderboardTab === 'weekly' ? leaderboardData.weekly : leaderboardData.monthly;

  return (
    <div className="min-h-screen bg-cream py-8 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-charcoal mb-2">成就中心</h1>
          <p className="text-charcoal/60">收集徽章，攀登排行榜</p>
        </div>

        {/* Badge Wall */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-charcoal/5 mb-8">
          <h2 className="font-display text-xl font-bold text-charcoal mb-6">徽章墙</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6">
            {badges.map((badge) => (
              <BadgeCard key={badge.id} badge={badge} />
            ))}
          </div>
          <div className="mt-6 text-center text-charcoal/40 text-sm">
            已解锁 {badges.filter((b) => b.unlocked).length} / {badges.length} 个徽章
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-charcoal/5">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-bold text-charcoal">排行榜</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setLeaderboardTab('weekly')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  leaderboardTab === 'weekly'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-charcoal/5 text-charcoal/50 hover:bg-charcoal/10'
                }`}
              >
                周榜
              </button>
              <button
                onClick={() => setLeaderboardTab('monthly')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  leaderboardTab === 'monthly'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-charcoal/5 text-charcoal/50 hover:bg-charcoal/10'
                }`}
              >
                月榜
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-charcoal/40 text-sm">
                  <th className="text-left py-3 px-4 font-medium">排名</th>
                  <th className="text-left py-3 px-4 font-medium">用户</th>
                  <th className="text-right py-3 px-4 font-medium">XP</th>
                  <th className="text-right py-3 px-4 font-medium">等级</th>
                </tr>
              </thead>
              <tbody>
                {data.map((user) => (
                  <tr key={user.rank} className="border-t border-charcoal/5 hover:bg-cream/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        user.rank === 1 ? 'bg-gold-400 text-white' :
                        user.rank === 2 ? 'bg-charcoal/20 text-charcoal' :
                        user.rank === 3 ? 'bg-orange-400 text-white' :
                        'bg-charcoal/5 text-charcoal/40'
                      }`}>
                        {user.rank}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs font-bold">
                          {user.username.charAt(0)}
                        </div>
                        <span className="font-medium text-charcoal text-sm">{user.username}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-gold-400 font-semibold text-sm">{user.xp.toLocaleString()}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-600/10 text-emerald-600">
                        Lv.{user.level}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
