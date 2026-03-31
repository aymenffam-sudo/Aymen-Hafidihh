import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';
import { ArrowLeft, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/_core/hooks/useAuth';

export default function ResetKey() {
  const [, setLocation] = useLocation();
  const { logout } = useAuth();
  const [keyCode, setKeyCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [response, setResponse] = useState('');

  const submitKeyMutation = trpc.flourite.submitKey.useMutation();
  const logoutMutation = trpc.auth.logout.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!keyCode.trim()) {
      toast.error('يرجى إدخال مفتاح FLOURITE');
      return;
    }

    setIsLoading(true);

    try {
      const result = await submitKeyMutation.mutateAsync({
        keyCode: keyCode.toUpperCase(),
      });

      if (result.success) {
        toast.success('تم إرسال المفتاح بنجاح');
        setSubmitted(true);
        setResponse('جاري معالجة طلبك... سيتم عرض الرد قريباً');
        
        // Simulate waiting for bot response
        setTimeout(() => {
          setResponse('✓ تم معالجة المفتاح بنجاح من قبل البوت');
        }, 3000);
      }
    } catch (error) {
      toast.error('فشل إرسال المفتاح. تحقق من صيغة المفتاح');
    } finally {
      setIsLoading(false);
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
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
            إعادة ضبط المفتاح
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
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-slate-700 p-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              مرحباً بك في نظام إعادة ضبط مفاتيح FLOURITE
            </h2>
            <p className="text-slate-300">
              أدخل مفتاح FLOURITE الخاص بك أدناه لبدء عملية الإعادة
            </p>
          </div>
        </div>

        {/* Input Form */}
        {!submitted ? (
          <Card className="border-slate-700 bg-slate-800 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-white">أدخل مفتاح FLOURITE</CardTitle>
              <CardDescription className="text-slate-400">
                يجب أن يكون المفتاح بصيغة 16 حرف/رقم (مثال: XYA0QWTP7ID34WP3)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-200">مفتاح FLOURITE</label>
                  <Input
                    type="text"
                    placeholder="XYA0QWTP7ID34WP3"
                    value={keyCode}
                    onChange={(e) => setKeyCode(e.target.value.toUpperCase())}
                    disabled={isLoading}
                    maxLength={16}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 text-center text-lg font-mono tracking-widest"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isLoading || keyCode.length !== 16}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold h-12"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {isLoading ? 'جاري الإرسال...' : 'إرسال المفتاح'}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          /* Response Section */
          <Card className="border-slate-700 bg-slate-800 shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-400">
                <CheckCircle className="w-6 h-6" />
                تم الإرسال بنجاح
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-6">
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-white font-semibold mb-1">رد البوت</h3>
                    <p className="text-slate-300">{response}</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                  <div className="text-sm text-blue-200">
                    <p className="font-semibold mb-1">معلومة مهمة</p>
                    <p>تم إرسال الأمر التالي إلى البوت:</p>
                    <code className="block bg-slate-800 p-2 rounded mt-2 text-blue-300 font-mono">
                      /reset {keyCode}
                    </code>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    setSubmitted(false);
                    setKeyCode('');
                    setResponse('');
                  }}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                >
                  إعادة ضبط مفتاح آخر
                </Button>
                <Button
                  onClick={() => setLocation('/dashboard')}
                  variant="outline"
                  className="flex-1 border-slate-600 text-slate-200 hover:bg-slate-700"
                >
                  العودة للوحة التحكم
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
