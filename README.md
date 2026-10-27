# FAME-X
FAME X 

## إضافة مشروع حقيقي لقسم المشاريع

1. أضف صورة شاشة للمشروع بالمقاس الطولي المناسب للموبايل داخل `public/projects/`، مثل `public/projects/my-store.webp`.
2. أضف المشروع إلى مصفوفة `projects` في `components/Projects.tsx`؛ سيظهر تلقائيًا في معاينة الصفحة الرئيسية وصفحة `/projects`:

```tsx
{
  id: "my-store",
  title: "متجر إلكتروني",
  label: "متجر",
  description: "وصف مختصر للمشروع.",
  Icon: Blocks,
  previewImage: "/projects/my-store.webp",
  url: "https://your-live-project.com",
}
```

تظهر الصورة داخل شاشة الموبايل، ويضيف `url` رابطًا يفتح الموقع الحقيقي في تبويب جديد. المشاريع التجريبية الحالية تستخدم نماذج العرض المدمجة؛ وأي مشروع جديد بلا `previewImage` يظهر له تنبيه بدل تصميم تجريبي غير متعلق به.

## إعدادات الإنتاج والنشر

### متغيرات البيئة

انسخ `.env.example` إلى `.env.local` للتطوير المحلي، وأضف المتغيرات نفسها في إعدادات Vercel لكل بيئة مطلوبة. لا ترفع `.env.local` أو مفاتيح الخدمات إلى Git.

- `NEXT_PUBLIC_FIREBASE_*`: إعدادات Firebase العامة التي يحتاجها تطبيق المتصفح؛ هذه القيم ليست أسرارًا، ويجب حماية البيانات بقواعد Firestore.
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` و`CLOUDINARY_API_KEY` و`CLOUDINARY_API_SECRET`: إعدادات Cloudinary. المفتاح السري يبقى على الخادم فقط.
- `CLOUDINARY_ADMIN_UID`: UID حساب Firebase الإداري المسموح له برفع الصور وحذفها.
- `UPSTASH_REDIS_REST_URL` و`UPSTASH_REDIS_REST_TOKEN`: حد الطلبات الموزع لواجهات Cloudinary. الواجهات ترفض الطلبات إذا لم تتوفر بيانات Redis.

رفع الصور موقّع على الخادم ولا يحتاج إلى unsigned upload preset. الحد الأقصى للملف 4 ميجابايت، والصيغ المسموحة AVIF وJPEG وPNG وWebP.

### Firebase

يستخدم [firestore.rules](./firestore.rules) صلاحية custom claim باسم `admin: true` لعمليات الإدارة، مع السماح بإنشاء آراء العملاء بحالة `pending` فقط. عيّن الـclaim للحساب الإداري من بيئة موثوقة تستخدم Firebase Admin SDK، ولا تضع service-account key في تطبيق المتصفح أو المستودع. اجعل قيمة `CLOUDINARY_ADMIN_UID` هي UID نفسه.

انشر القواعد بعد اختيار مشروع Firebase:

```sh
firebase use <firebase-project-id>
firebase deploy --only firestore:rules
```

### Vercel وCSP

اضبط Runtime على Node.js 20 أو أحدث، وأضف متغيرات البيئة في إعدادات المشروع قبل النشر. إعدادات CSP وبقية HTTP headers موجودة في [middleware.ts](./middleware.ts) و[next.config.ts](./next.config.ts). تستخدم CSP nonce للـscripts؛ في Next.js 15 يتطلب ذلك عرضًا ديناميكيًا للصفحات، لذلك لا تكون HTML الصفحات قابلة للتخزين كـstatic output. أما ملفات `/_next/static` والوسائط العامة فلها سياسات التخزين المؤقت الخاصة بها.
