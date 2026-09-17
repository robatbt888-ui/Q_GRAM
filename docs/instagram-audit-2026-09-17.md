# ممیزی دوم اینستاگرام — 2026-09-17

## صفحه اصلی

صفحه‌ی Home در حساب واردشده یک shell ثابت دارد: sidebar عمودی در سمت چپ با Instagram، Home، Reels، Messages، Search، Notifications، Create، Profile و More/Settings. محتوای اصلی در مرکز محدود و باریک است و ستون سمت راست حساب جاری و پیشنهادها را نشان می‌دهد. کارت پست قاب سنگین ندارد و ترتیب آن شامل header نویسنده/زمان/Follow/More، رسانه، ردیف Like/Comment/Repost/Share و Save، تعداد لایک، کپشن و زمان است.

## Reels

Reels یک تجربه‌ی عمودی تمام‌قد با چند آیتم پشت‌سرهم است. هر آیتم ویدیو، mute/unmute، avatar و username، عنوان audio، Follow، کپشن و هشتگ، Like/Comment/Repost/Share/Save/More دارد. دکمه‌های previous/next و نوار کناری برای تعاملات وجود دارند.

## Explore

Explore یک Search input در بالا و شبکه‌ای متراکم از محتوای Reel، Carousel و Post دارد؛ بعضی tileها بزرگ‌تر هستند و با click به محتوای اصلی می‌روند.

## Messages

Messages شامل account switcher، New message، Search، Notes، Requests، empty-state چت و Send message است. حالت فعال، محیطی بسیار خلوت و دو بخشی دارد.

## Profile

Profile شامل avatar، username، دسته/وضعیت حرفه‌ای، stats برای posts/followers/following، Edit profile، archive، Story highlight جدید، تب‌های Posts/Saved/Tagged و empty-state onboarding است.

## Settings

Settings واقعاً دو ستونه است: sidebar ثابت با گروه‌های Your account، How you use Instagram، Who can see your content، How others can interact، What you see، Your app and media، Family Center، For professionals و More info/support. سمت راست صفحه‌ی فعال را نشان می‌دهد.

صفحات بررسی‌شده: Edit profile، Notifications، Account privacy، Messages and story replies، Tags and mentions، Comments، Archiving and downloading، Language preferences و Account type and tools. Controls شامل switch، radio group، text input، textarea، link row و توضیح کوتاه زیر هر setting هستند.

## اقدام اصلاحی لازم برای کیو گرام

1. بازطراحی shell دسکتاپ و موبایل با sidebar/center/right rail واقعی و حذف قاب‌ها و سایه‌های سنگین.
2. بازسازی کارت فید با ترتیب کنترل‌های Instagram-like و actions واقعی.
3. ساخت Reels تمام‌صفحه با scroll snap، mute و navigation.
4. ساخت Settings دو ستونه با گروه‌ها و صفحات فعال قابل تغییر، radio و switch واقعی.
5. اتصال profile edit و privacy settings به state/API به‌جای toast یا placeholder.
