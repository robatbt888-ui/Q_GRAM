# ممیزی قابلیت‌های عمومی اینستاگرام

این یادداشت فقط خلاصه‌ی قابلیت‌ها و الگوهای محصولیِ قابل مشاهده است؛ هیچ CSS، HTML، جاوااسکریپت اختصاصی یا محتوای خصوصی استخراج یا کپی نشده است.

## منابع بررسی‌شده

- https://www.instagram.com/
- https://www.instagram.com/reels/
- https://www.instagram.com/explore/
- https://www.instagram.com/direct/inbox/
- https://www.instagram.com/bc95game/
- https://www.instagram.com/accounts/edit/

## یافته‌ها

صفحه‌ی فید شامل ناوبری Home، Reels، Messages، Search، Notifications، New post، Profile و More/Settings است. کارت پست دارای پروفایل نویسنده، زمان، Follow، More options، رسانه، Like، Comment، Repost، Share، Save، نام نویسنده، کپشن و ادامه‌ی متن است. ستون کناری پیشنهاد دنبال‌کردن و لینک پروفایل را ارائه می‌کند.

صفحه‌ی Reels یک تجربه‌ی تمام‌قد ویدیو محور با پخش خودکار، صدای mute/unmute، پروفایل و Follow، کپشن و هشتگ، Like، Comment، Repost، Share، Save، More و حرکت به ویدیوی قبلی/بعدی دارد.

صفحه‌ی Explore شامل جست‌وجو و شبکه‌ای از Reel، Carousel و Post است. صفحه‌ی Messages شامل حساب جاری، New message، Search، Note، Requests، فهرست چت و empty state برای شروع گفت‌وگو است.

صفحه‌ی Profile شامل Note، عکس پروفایل، username، وضعیت حرفه‌ای، آمار posts/followers/following، Edit profile، View archive، افزودن Story، تب‌های Posts/Saved/Tagged و empty-state onboarding است.

صفحه‌ی Settings شامل Accounts Center، Edit profile، Notifications، Account privacy، Close Friends، Blocked، Story and location، Messages and story replies، Tags and mentions، Comments، Sharing and reuse، Restricted accounts، Hidden Words، Muted accounts، Content preferences، Like and share counts، Creator subscriptions، Archiving and downloading، Accessibility، Language، Website permissions، Account type and tools، Help، Privacy Center و Account Status است.

## پیاده‌سازی مستقل در کیو گرام

برای کیو گرام جدول‌ها و APIهای مستقل posts، postLikes، postSaves، comments، follows، conversations، conversationParticipants، messages و notifications اضافه شد. قابلیت‌های backend شامل feed، saved، searchUsers، updateProfile، createPost، uploadMedia، toggleLike، toggleSave، comment، follow، notifications، conversations، createConversation، messages و sendMessage است. migration دیتابیس اجرا شده و تست‌ها و build موفق هستند.
