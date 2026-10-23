# Calendly Clone

```
backend/   Express + Prisma + Clerk  (http://localhost:4000)
frontend/  React + Vite + Tailwind + Zustand + Clerk  (http://localhost:5173)
```

## 1. Neon (قاعدة البيانات)

1. أنشئ مشروع في https://console.neon.tech
2. من **Connect** خذ رابطين:
   - **Pooled** (فيه `-pooler`) → `DATABASE_URL`
   - **Direct** (بدون `-pooler`) → `DIRECT_URL`

> للتجربة على Postgres محلي: حط نفس الرابط بالاثنين.

## 2. Clerk

1. أنشئ تطبيق في https://dashboard.clerk.com
2. من **API Keys** خذ `Publishable key` و `Secret key`.
3. (اختياري بالتطوير) **Webhooks → Add endpoint**:
   - URL: `https://<your-tunnel>/api/webhooks/clerk` (مثلاً عبر `ngrok http 4000`)
   - Events: `user.created`, `user.updated`, `user.deleted`
   - انسخ **Signing Secret** → `CLERK_WEBHOOK_SIGNING_SECRET`

> بدون webhook النظام يشتغل عادي: أول طلب من المستخدم المسجّل ينشئه بقاعدة البيانات تلقائياً
> (`ensureUserExists` في `requireAuth`). الـ webhook مهم بالإنتاج حتى تتزامن التعديلات والحذف.

## 3. Backend

```bash
cd backend
cp .env.example .env        # واملأ القيم
npm install
npx prisma migrate dev --name init
npm run dev
```

## 4. Frontend

```bash
cd frontend
cp .env.example .env        # VITE_CLERK_PUBLISHABLE_KEY + VITE_API_URL
npm install
npm run dev
```

## الصفحات

| Route | الوصف |
| --- | --- |
| `/dashboard` | أنواع الفعاليات (CRUD) |
| `/dashboard/availability` | ساعات العمل الأسبوعية + المنطقة الزمنية |
| `/dashboard/bookings` | الحجوزات (قادمة / سابقة / ملغاة) |
| `/dashboard/settings` | الاسم و الـ username |
| `/:username` | صفحة المزوّد العامة |
| `/:username/:slug` | صفحة الحجز (تقويم → أوقات → فورم) |
| `/booking/:id` | تأكيد الحجز + زر الإلغاء (الرابط يُرسل بالإيميل) |

## API

| Method | Route | Auth |
| --- | --- | --- |
| POST | `/api/webhooks/clerk` | Svix signature |
| GET / PUT | `/api/users/me` | ✓ |
| GET / PUT | `/api/users/availability` | ✓ |
| GET / POST | `/api/event-types` | ✓ |
| PUT / DELETE | `/api/event-types/:id` | ✓ |
| GET | `/api/bookings?status=upcoming\|past\|cancelled` | ✓ |
| PATCH | `/api/bookings/:id/cancel` | ✓ |
| GET | `/api/public/:username` | – |
| GET | `/api/public/:username/:slug` | – |
| GET | `/api/public/:username/:slug/slots?date=YYYY-MM-DD&timezone=X` | – |
| POST | `/api/public/bookings` | – |
| GET | `/api/public/bookings/:id` | – |
| POST | `/api/public/bookings/:id/cancel` | – |

## ملاحظات تقنية

- كل الأوقات تتخزن **UTC**. ساعات العمل تُفسَّر بالـ `timezone` مال المزوّد، والزائر يشوف الأوقات بالـ timezone ماله.
- محرك الأوقات: `backend/src/services/slots.service.ts` (`generateSlots` دالة pure بدون DB).
- منع الحجز المزدوج: `booking.service.ts` يستخدم transaction + `pg_advisory_xact_lock` على المزوّد،
  ثم يعيد تشغيل محرك الأوقات داخل الـ transaction قبل الحفظ.
- الإيميلات عبر Resend. إذا `RESEND_API_KEY` فارغ تنطبع بالـ console فقط.
