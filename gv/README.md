# Golden Voice — Backend (Starter / Modular Monolith)

هذا الباكيند المبدئي مبني وفق البنية المحددة في `Golden Voice.md`:
**Modular Monolith** واحد، بتقسيم داخلي واضح لكل دومين (وليس Microservices).

## Stack

- **Node.js + TypeScript + Express** — الطبقة الأساسية للـ API.
- **Prisma + PostgreSQL** — طبقة قاعدة البيانات (migrations، schema، type-safety جاهزة بدون إعادة اختراع أدوات).
- **Zod** — التحقق من صحة المدخلات (DTOs) بشكل صريح وواضح.
- **JWT + bcrypt** — المصادقة (auth module فقط، بدون تسريب المنطق لباقي الموديولات).

## البنية

```
src/
├── app/                  → تجميع الـ Express app + نقطة تشغيل السيرفر (لا منطق عمل هنا)
├── database/             → Prisma client موحّد يُستخدم من كل الـ repositories
├── shared/               → أخطاء، middleware، config — أشياء مشتركة فعليًا فقط
└── modules/
    ├── auth/             → تسجيل / دخول / إصدار التوكن
    ├── users/             → بروفايل المستخدم
    ├── works/             → الكيان المركزي (Work) — كل الموديولات الثانية تُبنى عليه
    ├── dubbed/            → نسخ الدبلجة + الحلقات، مرتبطة بـ Work
    ├── translated/        → نسخ الترجمة، مرتبطة بـ Work
    └── writing/           → السكربتات، مرتبطة بـ Work
```

كل موديول يتبع نفس التسلسل دائمًا:

```
Route → Controller → Service → Repository → Database
```

بدون اختصارات (لا Controller يلمس قاعدة البيانات مباشرة).

## التشغيل محليًا

```bash
cp .env.example .env
# عدّل DATABASE_URL و JWT_SECRET في .env

npm install
npm run prisma:migrate   # ينشئ الجداول في قاعدة البيانات
npm run dev              # يشغّل السيرفر مع إعادة تحميل تلقائي
```

السيرفر يشتغل افتراضيًا على `http://localhost:4000`.

## نقاط النهاية الأساسية (API v1)

| Method | Path | الوصف | الصلاحية |
|---|---|---|---|
| POST | `/api/v1/auth/register` | تسجيل مستخدم جديد | عام |
| POST | `/api/v1/auth/login` | تسجيل الدخول | عام |
| GET | `/api/v1/users/me` | بروفايل المستخدم الحالي | مسجّل دخول |
| PATCH | `/api/v1/users/me` | تعديل البروفايل | مسجّل دخول |
| GET | `/api/v1/works` | قائمة الأعمال (فلترة بـ `type` + cursor pagination) | عام |
| GET | `/api/v1/works/:workId` | تفاصيل عمل واحد | عام |
| POST | `/api/v1/works` | إنشاء عمل جديد | EDITOR/ADMIN |
| PATCH | `/api/v1/works/:workId` | تعديل عمل | EDITOR/ADMIN |
| DELETE | `/api/v1/works/:workId` | حذف عمل | ADMIN |
| GET | `/api/v1/dubbed/work/:workId` | نسخ الدبلجة لعمل معيّن | عام |
| POST | `/api/v1/dubbed` | إضافة نسخة دبلجة | EDITOR/ADMIN |
| POST | `/api/v1/dubbed/episodes` | إضافة حلقة | EDITOR/ADMIN |
| GET | `/api/v1/translated/work/:workId` | نسخ الترجمة لعمل معيّن | عام |
| POST | `/api/v1/translated` | إضافة نسخة ترجمة | EDITOR/ADMIN |
| GET | `/api/v1/scripts/work/:workId` | سكربتات عمل معيّن | عام |
| POST | `/api/v1/scripts` | إضافة سكربت | EDITOR/ADMIN |

جميع نقاط الكتابة (POST/PATCH/DELETE) في works/dubbed/translated/scripts محمية بـ JWT + دور (role)، بحيث الزوّار يقدرون يستعرضون المحتوى فقط دون تعديله.

## الحالة الحالية وما بقي


## ما لم يُبنَ بعد (نقاط توسّع متوقعة)

- **رفع الملفات/الميديا الفعلية**: `Asset` أصبح مسؤولًا عن metadata للملفات؛ الرفع الفعلي إلى Object Storage لم يُوصل بعد.
- **Voice actors / Characters / Credits** المذكورة كمسؤوليات محتملة لموديول dubbed — لسا مو مضافة كجداول، لتبسيط النسخة المبدئية.
- **رفع الملفات/الميديا الفعلية**: `Asset` أصبح مسؤولًا عن metadata للملفات؛ الرفع الفعلي إلى Object Storage لم يُوصل بعد.
- **Controller App (لوحة التحكم)**: هذا الريبو backend فقط؛ تطبيق الإدارة (React) مشروع منفصل يستهلك نفس الـ API.
- **Content/File management**: لم يُبنَ بعد نظام File ID / Content ID / parent / location الذي سيقود لوحة التحكم والمحتوى ديناميكيًا.

## Data layer update

The backend now separates structured content metadata from large media files:

- `Asset` stores file metadata (`storageKey`, MIME type, size, checksum, type, status, version).
- Large binaries are expected to live in object storage such as S3-compatible storage; PostgreSQL stores the metadata and relationship.
- `AuditLog` records create/update/publish/delete actions performed by authenticated users.
- Work listings use cursor pagination (`limit` + `cursor`) and return `{ items, nextCursor }`.
- Database indexes cover the main content lookup paths.
- Work mutations use Prisma transactions so the data mutation and audit record commit or roll back together.

### Asset API

`POST /api/v1/assets` creates asset metadata after validating its content parent.
`GET /api/v1/assets/:assetId` reads an asset (editor/admin only).
`PATCH /api/v1/assets/:assetId` updates asset status (editor/admin only).
`DELETE /api/v1/assets/:assetId` removes asset metadata (admin only).

The actual file upload is intentionally kept separate from this metadata API so an object-storage provider can be introduced without coupling the database layer to a specific vendor.
