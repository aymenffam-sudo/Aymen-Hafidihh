# نظام إعادة ضبط مفاتيح FLOURITE - دليل الإعداد والتشغيل

## المتطلبات الأساسية

قبل البدء، تأكد من أن لديك المتطلبات التالية مثبتة على جهازك:

- **Node.js** (الإصدار 18 أو أحدث)
- **npm** أو **pnpm** (مدير الحزم)
- **MySQL** أو **TiDB** (قاعدة البيانات)

## خطوات التثبيت والإعداد

### 1. استخراج الملفات

قم بفك ضغط ملف ZIP في المجلد المطلوب:

```bash
unzip flourite_reset_system.zip
cd flourite_reset_system
```

### 2. تثبيت المتطلبات

قم بتثبيت جميع المكتبات المطلوبة:

```bash
pnpm install
```

### 3. إعداد متغيرات البيئة

أنشئ ملف `.env` في جذر المشروع وأضف المتغيرات التالية:

```env
# قاعدة البيانات
DATABASE_URL="mysql://username:password@localhost:3306/flourite_reset"

# Telegram Bot
TELEGRAM_API_ID=26481531
TELEGRAM_API_HASH=8d8ea2b8bde9b22bb7f4b6de905bd3f7
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_ADMIN_CHAT_ID=your_admin_chat_id

# OAuth (إذا كنت تستخدم Manus)
VITE_APP_ID=your_app_id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://auth.manus.im

# أخرى
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

### 4. إعداد قاعدة البيانات

قم بتطبيق التهجيرات على قاعدة البيانات:

```bash
pnpm db:push
```

هذا الأمر سيقوم بـ:
- إنشاء جداول قاعدة البيانات
- تطبيق جميع التهجيرات المطلوبة

### 5. تشغيل الخادم

#### في بيئة التطوير:

```bash
pnpm dev
```

سيتم تشغيل الخادم على `http://localhost:3000`

#### في بيئة الإنتاج:

```bash
pnpm build
pnpm start
```

## الميزات الرئيسية

### 1. نظام المصادقة

- **تسجيل دخول آمن**: باسم المستخدم وكلمة المرور
- **تسجيل حساب جديد**: مع التحقق من قوة كلمة المرور
- **تشفير bcrypt**: لحماية كلمات المرور
- **تتبع الجلسات**: مع سجلات تدقيق شاملة

### 2. لوحة التحكم الإدارية

- **إدارة المستخدمين**: إنشاء وحذف وتعديل الحسابات
- **التحكم في الصلاحيات**: تعيين أدوار المسؤول والمستخدم
- **عرض قائمة المستخدمين**: مع تفاصيل كاملة

### 3. نظام إعادة ضبط المفاتيح

- **إدخال آمن للمفاتيح**: مع التحقق من الصيغة
- **ربط Telegram Bot**: إرسال تلقائي للأوامر
- **عرض الردود**: مع تأثيرات جميلة وتنسيق احترافي

### 4. الحماية الأمنية

- **حماية SQL Injection**: تنظيف وتحقق من المدخلات
- **WAF (Web Application Firewall)**: حماية ضد الهجمات الشائعة
- **Rate Limiting**: حماية ضد هجمات DDoS
- **تصفية الطلبات المشبوهة**: كشف محاولات الاختراق
- **CORS و CSRF Protection**: حماية ضد الهجمات عبر الموقع

## هيكل المشروع

```
flourite_reset_system/
├── client/                 # واجهة المستخدم (React)
│   ├── src/
│   │   ├── pages/         # الصفحات الرئيسية
│   │   ├── components/    # المكونات المستخدمة
│   │   ├── lib/           # المكتبات والأدوات
│   │   └── App.tsx        # التطبيق الرئيسي
│   └── public/            # الملفات الثابتة
├── server/                # الخادم (Express + tRPC)
│   ├── auth.ts            # نظام المصادقة
│   ├── security.ts        # أدوات الحماية الأمنية
│   ├── telegram.ts        # تكامل Telegram Bot
│   ├── db.ts              # عمليات قاعدة البيانات
│   └── routers.ts         # مسارات tRPC
├── drizzle/               # قاعدة البيانات
│   ├── schema.ts          # تعريف الجداول
│   └── migrations/        # ملفات التهجير
└── package.json           # المتطلبات والأوامر
```

## الأوامر المتاحة

```bash
# التطوير
pnpm dev              # تشغيل الخادم في بيئة التطوير

# البناء والإنتاج
pnpm build            # بناء المشروع للإنتاج
pnpm start            # تشغيل النسخة المبنية

# قاعدة البيانات
pnpm db:push          # تطبيق التهجيرات على قاعدة البيانات

# الاختبار والتحقق
pnpm test             # تشغيل الاختبارات
pnpm check            # التحقق من أخطاء TypeScript

# التنسيق
pnpm format           # تنسيق الكود
```

## متغيرات البيئة المطلوبة

| المتغير | الوصف | مثال |
|---------|-------|------|
| `DATABASE_URL` | رابط قاعدة البيانات | `mysql://user:pass@localhost:3306/db` |
| `TELEGRAM_API_ID` | معرف Telegram API | `26481531` |
| `TELEGRAM_API_HASH` | مفتاح Telegram API | `8d8ea2b8bde9b22bb7f4b6de905bd3f7` |
| `TELEGRAM_BOT_TOKEN` | رمز البوت | `123456789:ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefg` |
| `TELEGRAM_ADMIN_CHAT_ID` | معرف المسؤول | `123456789` |
| `JWT_SECRET` | مفتاح JWT | `your_secret_key_here` |
| `NODE_ENV` | بيئة التشغيل | `development` أو `production` |

## الحسابات الافتراضية

عند التثبيت الأول، يمكنك إنشاء حسابات جديدة من خلال صفحة التسجيل.

## استكشاف الأخطاء

### مشكلة: فشل الاتصال بقاعدة البيانات

**الحل**: تأكد من:
- أن قاعدة البيانات تعمل بشكل صحيح
- أن بيانات الاتصال صحيحة في `DATABASE_URL`
- أن المستخدم لديه صلاحيات كافية

### مشكلة: عدم عمل Telegram Bot

**الحل**: تأكد من:
- أن `TELEGRAM_BOT_TOKEN` صحيح
- أن البوت مفعل في Telegram
- أن لديك اتصال إنترنت

### مشكلة: أخطاء TypeScript

**الحل**: قم بتشغيل:
```bash
pnpm check
```

## الدعم والمساعدة

للمزيد من المعلومات أو الإبلاغ عن مشاكل، يرجى التواصل مع فريق الدعم.

## الترخيص

جميع الحقوق محفوظة © 2026 FLOURITE Reset System
