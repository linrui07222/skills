import { Link } from 'react-router-dom';
import { ArrowRight, Flame, Star, Users, BookOpen, Globe, Sparkles } from 'lucide-react';
import useAuthStore from '@/store/useAuthStore';

const greetings = [
  { text: 'Welcome', lang: '英语' },
  { text: 'ようこそ', lang: '日语' },
  { text: '환영합니다', lang: '韩语' },
];

const languages = [
  {
    name: '英语',
    nameEn: 'English',
    symbol: '🇬🇧',
    color: 'royal',
    coursesCount: 24,
    desc: '全球通用语言，开启无限可能',
    bgClass: 'bg-royal/10',
    borderClass: 'border-royal/30',
    textClass: 'text-royal',
  },
  {
    name: '日语',
    nameEn: '日本語',
    symbol: '🇯🇵',
    color: 'sakura',
    coursesCount: 18,
    desc: '探索和风文化，感受匠心之美',
    bgClass: 'bg-sakura/10',
    borderClass: 'border-sakura/30',
    textClass: 'text-sakura',
  },
  {
    name: '韩语',
    nameEn: '한국어',
    symbol: '🇰🇷',
    color: 'sky',
    coursesCount: 15,
    desc: '韩流文化，从语言开始',
    bgClass: 'bg-sky/10',
    borderClass: 'border-sky/30',
    textClass: 'text-sky',
  },
];

const recommendedCourses = [
  { id: 1, title: '英语日常会话', level: 'A1', students: 12453, color: 'bg-royal', lang: '英语' },
  { id: 2, title: '日语五十音入门', level: 'A1', students: 8921, color: 'bg-sakura', lang: '日语' },
  { id: 3, title: '韩语基础发音', level: 'A1', students: 6734, color: 'bg-sky', lang: '韩语' },
  { id: 4, title: '商务英语写作', level: 'B2', students: 5612, color: 'bg-royal', lang: '英语' },
  { id: 5, title: '日语N3备考', level: 'B1', students: 4523, color: 'bg-sakura', lang: '日语' },
  { id: 6, title: 'TOPIK韩语冲刺', level: 'B1', students: 3891, color: 'bg-sky', lang: '韩语' },
];

function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-charcoal">
      {/* Decorative circles */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold-400/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-2xl" />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Floating greetings */}
        <div className="flex justify-center gap-6 mb-8">
          {greetings.map((g, i) => (
            <span
              key={g.lang}
              className="animate-float text-white/80 text-lg md:text-xl font-display"
              style={{ animationDelay: `${i * 0.5}s` }}
            >
              {g.text}
            </span>
          ))}
        </div>

        <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          探索语言的
          <span className="text-gold-400">无限宇宙</span>
        </h1>

        <p className="text-white/70 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
          沉浸式多语种学习体验，让英语、日语、韩语学习变得生动有趣。
          AI驱动的个性化学习路径，助你高效达成语言目标。
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/courses"
            className="btn-capsule bg-gold-400 text-charcoal px-8 py-3.5 text-lg font-semibold flex items-center gap-2 hover:bg-gold-500"
          >
            开始学习
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to="/register"
            className="btn-capsule bg-white/10 text-white px-8 py-3.5 text-lg font-medium border border-white/20 hover:bg-white/20"
          >
            免费注册
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-16 flex justify-center gap-8 md:gap-16">
          <div className="text-center">
            <div className="text-3xl font-bold text-white">50K+</div>
            <div className="text-white/50 text-sm mt-1">活跃学员</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white">57</div>
            <div className="text-white/50 text-sm mt-1">精品课程</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white">3</div>
            <div className="text-white/50 text-sm mt-1">语种支持</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function LanguageCards() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-charcoal mb-4">
            选择你的语言旅程
          </h2>
          <p className="text-charcoal/60 text-lg">三种语言，无限可能</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {languages.map((lang) => (
            <Link
              key={lang.name}
              to={`/courses?lang=${lang.color === 'royal' ? 'en' : lang.color === 'sakura' ? 'ja' : 'ko'}`}
              className={`group relative p-8 rounded-2xl border-2 ${lang.borderClass} ${lang.bgClass} transition-all duration-300 hover:-translate-y-2 hover:shadow-xl`}
            >
              <div className="text-5xl mb-4">{lang.symbol}</div>
              <h3 className={`font-display text-2xl font-bold ${lang.textClass} mb-1`}>
                {lang.name}
              </h3>
              <p className="text-charcoal/50 text-sm mb-3">{lang.nameEn}</p>
              <p className="text-charcoal/70 text-sm mb-4">{lang.desc}</p>
              <div className="flex items-center gap-2 text-sm text-charcoal/50">
                <BookOpen className="w-4 h-4" />
                <span>{lang.coursesCount} 门课程</span>
              </div>
              <ArrowRight className={`absolute bottom-8 right-8 w-5 h-5 ${lang.textClass} opacity-0 group-hover:opacity-100 transition-opacity`} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProgressOverview() {
  const { isAuthenticated, user } = useAuthStore();
  const todayProgress = 65;
  const streak = user?.streak ?? 7;
  const level = user?.level ?? 5;
  const xp = user?.xp ?? 2450;

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-cream to-white">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-charcoal mb-4">
            学习进度概览
          </h2>
          <p className="text-charcoal/60 text-lg">坚持每一天，进步看得见</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {/* Circular Progress */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-charcoal/5 text-center">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#E5E7EB" strokeWidth="10" />
                <circle
                  cx="60" cy="60" r="50" fill="none"
                  stroke="#0D9373" strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${todayProgress * 3.14} 314`}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-emerald-600">{todayProgress}%</span>
              </div>
            </div>
            <h4 className="font-semibold text-charcoal">今日目标</h4>
            <p className="text-charcoal/50 text-sm mt-1">已完成 {todayProgress}%</p>
          </div>

          {/* Streak */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-charcoal/5 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gold-400/20 flex items-center justify-center">
              <Flame className="w-10 h-10 text-gold-400" />
            </div>
            <div className="text-4xl font-bold text-gold-400 mb-1">{streak}</div>
            <h4 className="font-semibold text-charcoal">连续打卡</h4>
            <p className="text-charcoal/50 text-sm mt-1">天</p>
          </div>

          {/* Level & XP */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-charcoal/5 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-emerald-600/20 flex items-center justify-center">
              <Star className="w-10 h-10 text-emerald-600" />
            </div>
            <div className="text-4xl font-bold text-emerald-600 mb-1">Lv.{level}</div>
            <h4 className="font-semibold text-charcoal">当前等级</h4>
            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 h-2 bg-charcoal/10 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${(xp % 1000) / 10}%` }} />
              </div>
              <span className="text-xs text-charcoal/50">{xp} XP</span>
            </div>
          </div>
        </div>

        {!isAuthenticated && (
          <div className="text-center mt-8">
            <Link to="/login" className="text-emerald-600 hover:text-emerald-700 font-medium text-sm">
              登录查看完整进度 →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

function RecommendedCourses() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-charcoal mb-2">
              推荐课程
            </h2>
            <p className="text-charcoal/60">为你精心挑选的热门课程</p>
          </div>
          <Link
            to="/courses"
            className="hidden md:flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-medium"
          >
            查看全部
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedCourses.map((course) => (
            <Link
              key={course.id}
              to={`/courses/${course.id}/learn`}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-charcoal/5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`h-2 ${course.color}`} />
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    course.color === 'bg-royal' ? 'bg-royal/10 text-royal' :
                    course.color === 'bg-sakura' ? 'bg-sakura/20 text-pink-600' :
                    'bg-sky/20 text-sky-700'
                  }`}>
                    {course.lang}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-600/10 text-emerald-600">
                    {course.level}
                  </span>
                </div>
                <h3 className="font-display text-lg font-bold text-charcoal mb-2 group-hover:text-emerald-600 transition-colors">
                  {course.title}
                </h3>
                <div className="flex items-center gap-1.5 text-charcoal/40 text-sm">
                  <Users className="w-4 h-4" />
                  <span>{course.students.toLocaleString()} 人在学</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="md:hidden text-center mt-8">
          <Link to="/courses" className="text-emerald-600 hover:text-emerald-700 font-medium text-sm">
            查看全部课程 →
          </Link>
        </div>
      </div>
    </section>
  );
}

function FeatureBanner() {
  return (
    <section className="py-20 px-4 bg-emerald-600">
      <div className="container mx-auto text-center">
        <Sparkles className="w-12 h-12 text-gold-400 mx-auto mb-6" />
        <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
          AI 驱动的沉浸式学习
        </h2>
        <p className="text-white/70 text-lg max-w-2xl mx-auto mb-8">
          智能闪卡记忆、语法互动练习、口语跟读评分、听力沉浸训练——
          四大核心模块，让语言学习不再枯燥
        </p>
        <div className="flex flex-wrap justify-center gap-6">
          {[
            { icon: BookOpen, label: '智能闪卡' },
            { icon: Globe, label: '语法练习' },
            { icon: Sparkles, label: '口语跟读' },
            { icon: Users, label: '听力训练' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2 text-white/80">
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div>
      <HeroSection />
      <LanguageCards />
      <ProgressOverview />
      <RecommendedCourses />
      <FeatureBanner />
    </div>
  );
}
