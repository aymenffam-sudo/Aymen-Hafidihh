import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';
import { ArrowLeft, Plus, Trash2, Users } from 'lucide-react';
import { useAuth } from '@/_core/hooks/useAuth';

export default function AdminPanel() {
  const [, setLocation] = useLocation();
  const { user, logout } = useAuth();
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newName, setNewName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getUsersQuery = trpc.admin.getUsers.useQuery();
  const createUserMutation = trpc.admin.createUser.useMutation();
  const deleteUserMutation = trpc.admin.deleteUser.useMutation();
  const logoutMutation = trpc.auth.logout.useMutation();

  // Check if user is admin
  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Card className="border-red-700 bg-slate-800">
          <CardHeader>
            <CardTitle className="text-red-400">وصول مرفوض</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-300 mb-4">ليس لديك صلاحيات للوصول إلى لوحة التحكم الإدارية</p>
            <Button onClick={() => setLocation('/dashboard')}>العودة</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await createUserMutation.mutateAsync({
        username: newUsername,
        password: newPassword,
        name: newName,
      });

      toast.success('تم إنشاء المستخدم بنجاح');
      setNewUsername('');
      setNewPassword('');
      setNewName('');
      getUsersQuery.refetch();
    } catch (error) {
      toast.error('فشل إنشاء المستخدم');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (confirm('هل تريد حذف هذا المستخدم؟')) {
      try {
        await deleteUserMutation.mutateAsync({ userId });
        toast.success('تم حذف المستخدم بنجاح');
        getUsersQuery.refetch();
      } catch (error) {
        toast.error('فشل حذف المستخدم');
      }
    }
  };

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
          <button
            onClick={() => setLocation('/dashboard')}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            العودة
          </button>
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            لوحة التحكم الإدارية
          </h1>
          <Button
            onClick={handleLogout}
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-white"
          >
            تسجيل خروج
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Create User Section */}
        <Card className="border-slate-700 bg-slate-800 shadow-2xl mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-400">
              <Plus className="w-5 h-5" />
              إنشاء مستخدم جديد
            </CardTitle>
            <CardDescription className="text-slate-400">
              أضف مستخدم جديد إلى النظام
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-200">اسم المستخدم</label>
                  <Input
                    type="text"
                    placeholder="اسم المستخدم"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    disabled={isLoading}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-200">كلمة المرور</label>
                  <Input
                    type="password"
                    placeholder="كلمة المرور"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={isLoading}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-200">الاسم الكامل</label>
                  <Input
                    type="text"
                    placeholder="الاسم الكامل"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    disabled={isLoading}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>
              <Button
                type="submit"
                disabled={isLoading || !newUsername || !newPassword}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                {isLoading ? 'جاري الإنشاء...' : 'إنشاء المستخدم'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Users List */}
        <Card className="border-slate-700 bg-slate-800 shadow-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-400">
              <Users className="w-5 h-5" />
              قائمة المستخدمين
            </CardTitle>
            <CardDescription className="text-slate-400">
              {getUsersQuery.data?.length || 0} مستخدم في النظام
            </CardDescription>
          </CardHeader>
          <CardContent>
            {getUsersQuery.isLoading ? (
              <p className="text-slate-400">جاري التحميل...</p>
            ) : getUsersQuery.data && getUsersQuery.data.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-3 px-4 text-slate-300 font-semibold">اسم المستخدم</th>
                      <th className="text-left py-3 px-4 text-slate-300 font-semibold">الاسم الكامل</th>
                      <th className="text-left py-3 px-4 text-slate-300 font-semibold">الصلاحية</th>
                      <th className="text-left py-3 px-4 text-slate-300 font-semibold">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getUsersQuery.data.map((u: any) => (
                      <tr key={u.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                        <td className="py-3 px-4 text-white">{u.username}</td>
                        <td className="py-3 px-4 text-slate-300">{u.name}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            u.role === 'admin' 
                              ? 'bg-purple-500/20 text-purple-300' 
                              : 'bg-blue-500/20 text-blue-300'
                          }`}>
                            {u.role === 'admin' ? 'مسؤول' : 'مستخدم'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <Button
                            onClick={() => handleDeleteUser(u.id)}
                            disabled={u.id === user?.id}
                            size="sm"
                            variant="destructive"
                            className="bg-red-600 hover:bg-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-slate-400">لا توجد مستخدمين</p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
