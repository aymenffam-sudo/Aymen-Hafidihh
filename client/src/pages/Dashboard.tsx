import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { LogOut, Key, Users } from 'lucide-react';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const logoutMutation = trpc.auth.logout.useMutation();

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    logout();
    setLocation('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-800/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              FLOURITE Reset System
            </h1>
            <p className="text-slate-400 text-sm">مرحباً بك في نظام إعادة ضبط المفاتيح</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-slate-600 text-slate-200 hover:bg-slate-700"
          >
            <LogOut className="w-4 h-4 mr-2" />
            تسجيل خروج
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-slate-700 p-8">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <h2 className="text-4xl font-bold text-white mb-2">
                مرحباً بك في موقع إعادة ضبط مفاتيح FLOURITE
              </h2>
              <p className="text-slate-300 text-lg">
                استخدم هذا النظام لإعادة ضبط مفاتيح FLOURITE الخاصة بك بشكل آمن وسريع
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card className="border-slate-700 bg-slate-800 hover:border-blue-500/50 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-400">
                <Key className="w-5 h-5" />
                إعادة ضبط مفتاح
              </CardTitle>
              <CardDescription className="text-slate-400">
                أدخل مفتاح FLOURITE الخاص بك لإعادة ضبطه
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => setLocation('/reset-key')}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
              >
                ابدأ الآن
              </Button>
            </CardContent>
          </Card>

          {user?.role === 'admin' && (
            <Card className="border-slate-700 bg-slate-800 hover:border-purple-500/50 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-400">
                  <Users className="w-5 h-5" />
                  لوحة التحكم الإدارية
                </CardTitle>
                <CardDescription className="text-slate-400">
                  إدارة المستخدمين والحسابات
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => setLocation('/admin')}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  الدخول للإدارة
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* User Info */}
        <Card className="border-slate-700 bg-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-200">معلومات الحساب</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-slate-700">
                <span className="text-slate-400">اسم المستخدم:</span>
                <span className="text-white font-medium">{user?.username}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-700">
                <span className="text-slate-400">الاسم الكامل:</span>
                <span className="text-white font-medium">{user?.name}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-slate-400">الصلاحية:</span>
                <span className={`font-medium ${user?.role === 'admin' ? 'text-purple-400' : 'text-blue-400'}`}>
                  {user?.role === 'admin' ? 'مسؤول' : 'مستخدم'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
