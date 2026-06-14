import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Users, Search } from 'lucide-react';

const mockCourses = [
  { id: 1, title: '英语日常会话', description: '掌握日常交流必备的英语表达，从打招呼到购物全场景覆盖', language: 'en' as const, level: 'A1', studentsCount: 12453, progress: 30 },
  { id: 2, title: '商务英语精要', description: '职场英语必备：邮件写作、会议沟通、商务谈判技巧', language: 'en' as const, level: 'B2', studentsCount: 5612, progress: 0 },
  { id: 3, title: '英语听力突破', description: '从慢速到常速，循序渐进提升英语听力理解能力', language: 'en' as const, level: 'B1', studentsCount: 8234, progress: 15 },
  { id: 4, title: '日语五十音入门', description: '从零开始学习平假名和片假名，掌握日语发音基础', language: 'ja' as const, level: 'A1', studentsCount: 8921, progress: 60 },
  { id: 5, title: '日语N3备考', description: '系统备考JLPT N3，语法、词汇、阅读、听力全面覆盖', language: 'ja' as const, level: 'B1', studentsCount: 4523, progress: 0 },
  { id: 6, title: '日语会话进阶', description: '日常生活场景日语会话，提升实际交流能力', language: 'ja' as const, level: 'A2', studentsCount: 6712, progress: 45 },
  { id: 7, title: '韩语基础发音', description: '学习韩语字母和基本发音规则，打好韩语学习基础', language: 'ko' as const, level: 'A1', studentsCount: 6734, progress: 0 },
  { id: 8, title: 'TOPIK韩语冲刺', description: '针对TOPIK考试的强化训练，助你顺利通过考试', language: 'ko' as const, level: 'B1', studentsCount: 3891, progress: 20 },
  { id: 9, title: '韩语日常对话', description: '韩剧同款日常韩语，从点餐到旅行实用对话', language: 'ko' as const, level: 'A2', studentsCount: 5423, progress: 10 },
];

const langLabels = [
  { key: 'all', label: '全部' },
  { key: 'en', label: '英语' },
  { key: 'ja', label: '日语' },
  { key: 'ko', label: '韩语' },
];

const levels = ['全部', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

function getLangColor(lang: string) {
  switch (lang) {
    case 'en': return { bg: 'bg-royal', light: 'bg-royal/10', text: 'text-royal', border: 'border-royal/30' };
    case 'ja': return { bg: 'bg-sakura', light: 'bg-sakura/20', text: 'text-pink-600', border: 'border-sakura/30' };
    case 'ko': return { bg: 'bg-sky', light: 'bg-sky/20', text: 'text-sky-700', border: 'border-sky/30' };
    default: return { bg: 'bg-emerald-600', light: 'bg-emerald-600/10', text: 'text-emerald-600', border: 'border-emerald-600/30' };
  }
}

function getLangName(lang: string) {
  switch (lang) {
    case 'en': return '英语';
    case 'ja': return '日语';
    case 'ko': return '韩语';
    default: return '';
  }
}

export default function Courses() {
  const [searchParams] = useSearchParams();
  const initialLang = searchParams.get('lang') || 'all';
  const [langFilter, setLangFilter] = useState(initialLang);
  const [levelFilter, setLevelFilter] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = mockCourses.filter((c) => {
    if (langFilter !== 'all' && c.language !== langFilter) return false;
    if (levelFilter !== '全部' && c.level !== levelFilter) return false;
    if (searchQuery && !c.title.includes(searchQuery) && !c.description.includes(searchQuery)) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-cream py-8 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-charcoal mb-2">课程中心</h1>
          <p className="text-charcoal/60">探索丰富的多语种课程，找到适合你的学习路径</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-charcoal/5 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            {/* Search */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/30" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索课程..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-charcoal/10 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 outline-none transition-all text-sm"
              />
            </div>

            {/* Language Filter */}
            <div className="flex gap-2">
              {langLabels.map((l) => (
                <button
                  key={l.key}
                  onClick={() => setLangFilter(l.key)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    langFilter === l.key
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-charcoal/5 text-charcoal/60 hover:bg-charcoal/10'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>

            {/* Level Filter */}
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-charcoal/10 text-sm text-charcoal/70 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 outline-none"
            >
              {levels.map((l) => (
                <option key={l} value={l}>{l === '全部' ? '全部等级' : l}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((course) => {
            const colors = getLangColor(course.language);
            return (
              <Link
                key={course.id}
                to={`/courses/${course.id}/learn`}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-charcoal/5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex">
                  <div className={`w-2 ${colors.bg}`} />
                  <div className="flex-1 p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${colors.light} ${colors.text}`}>
                        {getLangName(course.language)}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-600/10 text-emerald-600">
                        {course.level}
                      </span>
                    </div>
                    <h3 className="font-display text-lg font-bold text-charcoal mb-2 group-hover:text-emerald-600 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-charcoal/50 text-sm mb-4 line-clamp-2">{course.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-charcoal/40 text-sm">
                        <Users className="w-4 h-4" />
                        <span>{course.studentsCount.toLocaleString()}</span>
                      </div>
                      {course.progress > 0 && (
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-charcoal/10 rounded-full overflow-hidden">
                            <div className={`h-full ${colors.bg} rounded-full`} style={{ width: `${course.progress}%` }} />
                          </div>
                          <span className="text-xs text-charcoal/40">{course.progress}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-charcoal/40 text-lg">没有找到匹配的课程</p>
            <p className="text-charcoal/30 text-sm mt-2">尝试调整筛选条件</p>
          </div>
        )}
      </div>
    </div>
  );
}
