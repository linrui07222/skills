import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Send, Globe } from 'lucide-react';
import useAuthStore from '@/store/useAuthStore';

interface Post {
  id: number;
  username: string;
  level: number;
  avatar: string;
  content: string;
  language: string;
  likes: number;
  liked: boolean;
  comments: number;
  time: string;
}

const mockPosts: Post[] = [
  { id: 1, username: '小明', level: 8, avatar: 'M', content: '今天终于把日语五十音全部记住了！分享一个小技巧：把平假名和片假名配对记忆，效率翻倍！🎉', language: 'ja', likes: 24, liked: false, comments: 5, time: '10分钟前' },
  { id: 2, username: 'Sakura', level: 15, avatar: 'S', content: 'Just finished my first English presentation at work! All those speaking exercises on LinguaVerse really paid off. Feel so proud! 💪', language: 'en', likes: 42, liked: true, comments: 8, time: '1小时前' },
  { id: 3, username: '韩语爱好者', level: 6, avatar: '韩', content: '有没有人一起组队学韩语？想找人练习日常对话，互相监督打卡！可以每天固定时间语音练习~', language: 'ko', likes: 18, liked: false, comments: 12, time: '2小时前' },
  { id: 4, username: 'GrammarMaster', level: 22, avatar: 'G', content: '虚拟语气真的是英语语法中最难的部分之一了。不过一旦理解了，就会发现它的逻辑其实很美。分享几个例句帮助大家理解：If I were a bird, I would fly to you.', language: 'en', likes: 35, liked: false, comments: 7, time: '3小时前' },
  { id: 5, username: '桜子', level: 10, avatar: '桜', content: '日本語の敬語は難しいですが、とても大切ですね。丁寧語と謙譲語の使い分け、みんなはどうやって覚えましたか？', language: 'ja', likes: 28, liked: false, comments: 9, time: '5小时前' },
  { id: 6, username: 'K-POP粉丝', level: 4, avatar: 'K', content: '通过听BLACKPINK的歌学韩语真的很有用！先听歌熟悉发音，再看歌词学单词，最后跟唱练习口语，一举三得！', language: 'ko', likes: 56, liked: true, comments: 15, time: '6小时前' },
];

const langFilters = [
  { key: 'all', label: '全部' },
  { key: 'en', label: '🇬🇧 英语' },
  { key: 'ja', label: '🇯🇵 日语' },
  { key: 'ko', label: '🇰🇷 韩语' },
];

function getLangColor(lang: string) {
  switch (lang) {
    case 'en': return 'bg-royal/10 text-royal';
    case 'ja': return 'bg-sakura/20 text-pink-600';
    case 'ko': return 'bg-sky/20 text-sky-700';
    default: return 'bg-charcoal/5 text-charcoal/50';
  }
}

export default function Community() {
  const { isAuthenticated } = useAuthStore();
  const [langFilter, setLangFilter] = useState('all');
  const [posts, setPosts] = useState(mockPosts);
  const [newPost, setNewPost] = useState('');
  const [showLoginHint, setShowLoginHint] = useState(false);

  const filtered = langFilter === 'all' ? posts : posts.filter((p) => p.language === langFilter);

  const handleLike = (id: number) => {
    if (!isAuthenticated) {
      setShowLoginHint(true);
      return;
    }
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p
      )
    );
  };

  const handlePost = () => {
    if (!isAuthenticated) {
      setShowLoginHint(true);
      return;
    }
    if (!newPost.trim()) return;
    const post: Post = {
      id: Date.now(),
      username: '我',
      level: 5,
      avatar: '我',
      content: newPost,
      language: 'en',
      likes: 0,
      liked: false,
      comments: 0,
      time: '刚刚',
    };
    setPosts([post, ...posts]);
    setNewPost('');
  };

  return (
    <div className="min-h-screen bg-cream py-8 px-4">
      <div className="container mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-charcoal mb-2">学习社区</h1>
          <p className="text-charcoal/60">和全球语言学习者交流心得，共同进步</p>
        </div>

        {/* Language Filter */}
        <div className="flex gap-2 mb-6">
          {langFilters.map((f) => (
            <button
              key={f.key}
              onClick={() => setLangFilter(f.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                langFilter === f.key
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-white text-charcoal/60 border border-charcoal/10 hover:border-emerald-600/30'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Post Input */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-charcoal/5 mb-6">
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            onFocus={() => !isAuthenticated && setShowLoginHint(true)}
            placeholder={isAuthenticated ? '分享你的学习心得...' : '登录后即可发帖...'}
            rows={3}
            className="w-full resize-none border-0 focus:ring-0 outline-none text-sm text-charcoal placeholder:text-charcoal/30"
          />
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-charcoal/5">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-charcoal/30" />
              <select className="text-xs text-charcoal/50 bg-transparent outline-none">
                <option value="en">英语</option>
                <option value="ja">日语</option>
                <option value="ko">韩语</option>
              </select>
            </div>
            <button
              onClick={handlePost}
              className="btn-capsule bg-emerald-600 text-white px-5 py-2 text-sm font-medium hover:bg-emerald-700 flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              发布
            </button>
          </div>
          {showLoginHint && !isAuthenticated && (
            <div className="mt-3 p-3 rounded-xl bg-gold-400/10 text-gold-500 text-sm flex items-center justify-between">
              <span>请先登录后再进行此操作</span>
              <Link to="/login" className="font-medium underline">去登录</Link>
            </div>
          )}
        </div>

        {/* Posts */}
        <div className="space-y-4">
          {filtered.map((post) => (
            <div key={post.id} className="bg-white rounded-2xl p-5 shadow-sm border border-charcoal/5">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {post.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-charcoal text-sm">{post.username}</span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-600/10 text-emerald-600">
                      Lv.{post.level}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getLangColor(post.language)}`}>
                      {post.language === 'en' ? '英语' : post.language === 'ja' ? '日语' : '韩语'}
                    </span>
                  </div>
                  <span className="text-charcoal/30 text-xs">{post.time}</span>
                </div>
              </div>
              <p className="text-charcoal/80 text-sm leading-relaxed mb-4 whitespace-pre-wrap">{post.content}</p>
              <div className="flex items-center gap-6 text-charcoal/40">
                <button
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center gap-1.5 text-sm transition-colors ${
                    post.liked ? 'text-red-500' : 'hover:text-red-400'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${post.liked ? 'fill-red-500' : ''}`} />
                  {post.likes}
                </button>
                <button className="flex items-center gap-1.5 text-sm hover:text-emerald-600 transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  {post.comments}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
