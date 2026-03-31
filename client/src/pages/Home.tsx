import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";
import { ArrowRight, Lock, Zap, Shield, Key } from "lucide-react";

export default function Home() {
  const { isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-white text-xl">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-700 bg-slate-800/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
            FLOURITE Reset
          </div>
          <div className="flex gap-3">
            {isAuthenticated ? (
              <>
                <Button
                  onClick={() => setLocation('/dashboard')}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                >
                  لوحة التحكم
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => setLocation('/login')}
                  variant="outline"
                  className="border-slate-600 text-slate-200 hover:bg-slate-700"
                >
                  تسجيل الدخول
                </Button>
                <Button
                  onClick={() => setLocation('/register')}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                >
                  إنشاء حساب
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-6 mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
            مرحباً بك في نظام إعادة ضبط
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              {" "}مفاتيح FLOURITE
            </span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            نظام آمن وموثوق لإعادة ضبط مفاتيح FLOURITE الخاصة بك مع تأثيرات متقدمة وحماية عالية
          </p>
          {!isAuthenticated && (
            <div className="flex gap-4 justify-center pt-4">
              <Button
                onClick={() => setLocation('/register')}
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold h-12 px-8"
              >
                ابدأ الآن
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                onClick={() => setLocation('/login')}
                size="lg"
                variant="outline"
                className="border-slate-600 text-slate-200 hover:bg-slate-700 font-semibold h-12 px-8"
              >
                تسجيل الدخول
              </Button>
            </div>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-slate-700 rounded-lg p-6 hover:border-blue-500/50 transition-colors">
            <Key className="w-10 h-10 text-blue-400 mb-4" />
            <h3 className="text-white font-semibold mb-2">إعادة ضبط آمنة</h3>
            <p className="text-slate-400 text-sm">
              إعادة ضبط آمنة وسريعة لمفاتيح FLOURITE مع تشفير عالي
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-slate-700 rounded-lg p-6 hover:border-purple-500/50 transition-colors">
            <Shield className="w-10 h-10 text-purple-400 mb-4" />
            <h3 className="text-white font-semibold mb-2">حماية عالية</h3>
            <p className="text-slate-400 text-sm">
              حماية ضد هجمات SQL Injection و DDoS مع نظام WAF متقدم
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-slate-700 rounded-lg p-6 hover:border-green-500/50 transition-colors">
            <Zap className="w-10 h-10 text-green-400 mb-4" />
            <h3 className="text-white font-semibold mb-2">سرعة عالية</h3>
            <p className="text-slate-400 text-sm">
              معالجة فورية للطلبات مع استجابة سريعة من البوت
            </p>
          </div>

          <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-slate-700 rounded-lg p-6 hover:border-orange-500/50 transition-colors">
            <Lock className="w-10 h-10 text-orange-400 mb-4" />
            <h3 className="text-white font-semibold mb-2">خصوصية تامة</h3>
            <p className="text-slate-400 text-sm">
              بيانات آمنة مشفرة مع سياسة خصوصية صارمة
            </p>
          </div>
        </div>

        {/* How it Works */}
        <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-slate-700 rounded-lg p-8 mb-20">
          <h2 className="text-3xl font-bold text-white mb-8">كيفية الاستخدام</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 border border-blue-500/50 flex items-center justify-center mb-4">
                <span className="text-blue-400 font-bold text-lg">1</span>
              </div>
              <h3 className="text-white font-semibold mb-2">إنشاء حساب</h3>
              <p className="text-slate-400">
                أنشئ حساباً جديداً أو سجل دخولك إلى النظام
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center mb-4">
                <span className="text-cyan-400 font-bold text-lg">2</span>
              </div>
              <h3 className="text-white font-semibold mb-2">أدخل المفتاح</h3>
              <p className="text-slate-400">
                أدخل مفتاح FLOURITE الخاص بك (16 حرف/رقم)
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-purple-500/20 border border-purple-500/50 flex items-center justify-center mb-4">
                <span className="text-purple-400 font-bold text-lg">3</span>
              </div>
              <h3 className="text-white font-semibold mb-2">احصل على النتيجة</h3>
              <p className="text-slate-400">
                استقبل رد البوت مع تأثيرات جميلة وتنسيق احترافي
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        {!isAuthenticated && (
          <div className="text-center bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-slate-700 rounded-lg p-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              جاهز للبدء؟
            </h2>
            <p className="text-slate-300 mb-8 max-w-xl mx-auto">
              انضم إلى آلاف المستخدمين الذين يستخدمون نظام FLOURITE Reset لإعادة ضبط مفاتيحهم بأمان
            </p>
            <Button
              onClick={() => setLocation('/register')}
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold h-12 px-8"
            >
              إنشاء حساب مجاني
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-800/50 backdrop-blur mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-slate-400">
          <p>&copy; 2026 FLOURITE Reset System. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  );
}
