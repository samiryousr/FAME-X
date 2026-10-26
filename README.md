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
