import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, UserPlus, AlertCircle } from 'lucide-react';
import useAuthStore from '@/store/useAuthStore';

function getPasswordStrength(password: string): { level: number; label: string; color: string } {
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { level: 1, label: '弱', color: 'bg-red-400' };
  if (score <= 2) return { level: 2, label: '较弱', color: 'bg-orange-400' };
  if (score <= 3) return { level: 3, label: '中等', color: 'bg-yellow-400' };
  if (score <= 4) return { level: 4, label: '较强', color: 'bg-emerald-500' };
  return { level: 5, label: '强', color: 'bg-emerald-600' };
}

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuthStore();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }
    if (password.length < 6) {
      setError('密码至少需要6个字符');
      return;
    }

    setLoading(true);
    try {
      await register(username, email, password);
      navigate('/');
    } catch (err) {
      setError((err as Error).message || '注册失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-gold-400/5 via-cream to-emerald-600/5">
      <div className="w-full max-w-md">
        <div className="glass rounded-3xl p-8 md:p-10 shadow-xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gold-400 flex items-center justify-center">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h1 className="font-display text-3xl font-bold text-charcoal">创建账号</h1>
            <p className="text-charcoal/50 mt-2">开启你的 LinguaVerse 之旅</p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-charcoal/70 mb-1.5">用户名</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal/30" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="你的昵称"
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-charcoal/10 bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 outline-none transition-all text-charcoal placeholder:text-charcoal/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal/70 mb-1.5">邮箱</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal/30" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-charcoal/10 bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 outline-none transition-all text-charcoal placeholder:text-charcoal/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal/70 mb-1.5">密码</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal/30" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="至少6个字符"
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-charcoal/10 bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 outline-none transition-all text-charcoal placeholder:text-charcoal/30"
                />
              </div>
              {password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-full transition-all ${
                          i <= strength.level ? strength.color : 'bg-charcoal/10'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-charcoal/40">密码强度: {strength.label}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal/70 mb-1.5">确认密码</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal/30" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="再次输入密码"
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-charcoal/10 bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 outline-none transition-all text-charcoal placeholder:text-charcoal/30"
                />
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="mt-1 text-xs text-red-500">密码不一致</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-capsule bg-emerald-600 text-white py-3.5 font-semibold text-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '注册中...' : '注册'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-charcoal/50">
            已有账号？
            <Link to="/login" className="text-emerald-600 hover:text-emerald-700 font-medium ml-1">
              去登录
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
