import { FormEvent, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import {
  Bell,
  Bookmark,
  Check,
  ChevronLeft,
  Compass,
  Ellipsis,
  Heart,
  Home as HomeIcon,
  ImagePlus,
  Instagram,
  PlaySquare,
  UsersRound,
  LogOut,
  MessageCircle,
  MoreHorizontal,
  Plus,
  Search,
  Send,
  Settings,
  Sparkles,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { filterQgramPosts, getQgramLikeCount } from "@/lib/qgram";
import { trpc } from "@/lib/trpc";
import { ReferenceProfile, ReferenceSettings } from "@/components/ProfileReference";

type AuthMode = "login" | "signup";
type Tab = "home" | "explore" | "reels" | "messages" | "notifications" | "saved" | "profile" | "settings";

type Story = {
  name: string;
  image: string;
  avatar: string;
  mine?: boolean;
};

type Post = {
  id: number;
  name: string;
  username: string;
  avatar: string;
  location: string;
  image: string;
  caption: string;
  likes: number;
  comments: number;
  time: string;
  verified?: boolean;
};

const avatarUrl = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=160&q=85`;

const stories: Story[] = [
  {
    name: "استوری شما",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=85",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=160&q=85",
    mine: true,
  },
  {
    name: "نگار",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=85",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=85",
  },
  {
    name: "پارسا",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=85",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=160&q=85",
  },
  {
    name: "سارا",
    image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=900&q=85",
    avatar: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=160&q=85",
  },
  {
    name: "آرین",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=85",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=85",
  },
  {
    name: "مهسا",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=85",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=160&q=85",
  },
  {
    name: "کیان",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=85",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=85",
  },
];

const posts: Post[] = [
  {
    id: 1,
    name: "رها احمدی",
    username: "raha.ahmadi",
    avatar: avatarUrl("photo-1494790108377-be9c29b29330"),
    location: "کافه لِمیز، تهران",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=90",
    caption: "هر روز یک شروع تازه است؛ حتی اگر با یک فنجان قهوه شروع شود ☕️",
    likes: 284,
    comments: 18,
    time: "۲ ساعت پیش",
    verified: true,
  },
  {
    id: 2,
    name: "سینا نادری",
    username: "sina.n",
    avatar: avatarUrl("photo-1507003211169-0a1dd7228f2d"),
    location: "جاده چالوس",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=90",
    caption: "گاهی برای پیدا کردن مسیر، فقط باید کمی از شهر فاصله گرفت.",
    likes: 641,
    comments: 42,
    time: "۵ ساعت پیش",
  },
];

function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`flex items-center gap-2.5 ${compact ? "" : "justify-center"}`}>
      <div className="relative h-11 w-11 overflow-hidden rounded-[14px] bg-black shadow-[0_8px_24px_rgba(176,122,18,.32)]"><img src="/manus-storage/1000380923_785ebe1c.png" alt="لوگوی کیو گرام" className="h-full w-full object-cover" /></div>
      <span className="text-[25px] font-black tracking-[-.04em] text-[#17213f]">کیو گرام</span>
    </div>
  );
}

function Avatar({ src, alt, size = "md", ring = false }: { src: string; alt: string; size?: "sm" | "md" | "lg"; ring?: boolean }) {
  const sizes = { sm: "h-9 w-9", md: "h-11 w-11", lg: "h-16 w-16" };
  return (
    <div className={`${ring ? "rounded-full bg-gradient-to-tr from-[#ff8a65] via-[#e8548c] to-[#7c5cff] p-[2px]" : ""} shrink-0`}>
      <img src={src} alt={alt} className={`${sizes[size]} rounded-full border-2 border-white object-cover`} />
    </div>
  );
}

function AuthScreen({ mode, setMode, onDemoLogin }: { mode: AuthMode; setMode: (mode: AuthMode) => void; onDemoLogin: (event: FormEvent<HTMLFormElement>) => void }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main dir="rtl" className="relative min-h-screen overflow-hidden bg-[#fbfaf7] text-[#2a2113]">
      <div className="pointer-events-none absolute -right-32 -top-36 h-[470px] w-[470px] rounded-full bg-[#fff1c2] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-28 h-[430px] w-[430px] rounded-full bg-[#fff7df] blur-3xl" />
      <div className="relative mx-auto flex min-h-screen max-w-[1420px] items-center justify-center px-5 py-8 lg:px-12">
        <div className="grid w-full max-w-[1120px] overflow-hidden rounded-[34px] border border-white/80 bg-white/80 shadow-[0_30px_90px_rgba(38,59,130,.12)] backdrop-blur-xl lg:grid-cols-[.92fr_1.08fr]">
          <section className="relative hidden min-h-[680px] overflow-hidden bg-[#9a6a10] p-12 text-white lg:flex lg:flex-col lg:justify-between">
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full border border-white/10" />
            <div className="absolute -bottom-36 -left-32 h-[420px] w-[420px] rounded-full border-[44px] border-[#5067b5]/40" />
            <div className="relative z-10 flex items-center gap-2 text-white/85"><Sparkles size={17} /><span className="text-sm font-semibold">جایی برای دیده‌شدنِ واقعی</span></div>
            <div className="relative z-10 max-w-[360px]">
              <div className="mb-7 flex h-20 w-20 items-center justify-center rounded-[26px] border border-white/20 bg-white/10 text-5xl font-black shadow-2xl">q</div>
              <h1 className="text-5xl font-black leading-[1.2] tracking-[-.06em]">لحظه‌هایت را<br /><span className="text-[#f1c75b]">قاب بگیر.</span></h1>
              <p className="mt-6 max-w-[320px] text-[16px] leading-8 text-white/70">در کیو گرام، داستان‌های روزمره‌ات را با آدم‌هایی که دوستشان داری به اشتراک بگذار.</p>
            </div>
            <div className="relative z-10 flex items-center justify-between text-sm text-white/55"><span>نسخه‌ی فارسی شبکه‌ی اجتماعی شما</span><span>۰۱ / ۰۱</span></div>
          </section>

          <section className="flex min-h-[680px] flex-col justify-center px-6 py-10 sm:px-14 lg:px-16">
            <div className="mb-10 lg:hidden"><BrandMark /></div>
            <div className="mb-8">
              <p className="mb-3 text-sm font-bold text-[#ee815f]">خوش آمدی به جمع ما</p>
              <h2 className="text-[34px] font-black tracking-[-.05em] text-[#2a2113]">{mode === "login" ? "دوباره ببینیمت" : "به کیو گرام بپیوند"}</h2>
              <p className="mt-3 text-sm leading-7 text-[#7a8198]">{mode === "login" ? "برای ادامه وارد حساب کاربری‌ات شو." : "چند قدم ساده تا ساختن فضای شخصی تو."}</p>
            </div>

            <div className="mb-8 grid grid-cols-2 rounded-2xl bg-[#f8f1df] p-1.5">
              <button type="button" onClick={() => setMode("login")} className={`rounded-xl py-3 text-sm font-bold transition ${mode === "login" ? "bg-white text-[#9a6a10] shadow-sm" : "text-[#8b91a5]"}`}>ورود</button>
              <button type="button" onClick={() => setMode("signup")} className={`rounded-xl py-3 text-sm font-bold transition ${mode === "signup" ? "bg-white text-[#9a6a10] shadow-sm" : "text-[#8b91a5]"}`}>ثبت نام</button>
            </div>

            <form onSubmit={onDemoLogin} className="space-y-4">
              {mode === "signup" && <label className="block"><span className="mb-2 block text-xs font-bold text-[#646b82]">نام نمایشی</span><input required placeholder="مثلاً سارا محمدی" className="auth-input" /></label>}
              <label className="block"><span className="mb-2 block text-xs font-bold text-[#646b82]">ایمیل یا نام کاربری</span><input required name="identifier" type="text" placeholder="you@example.com" className="auth-input" /></label>
              <label className="block"><span className="mb-2 block text-xs font-bold text-[#646b82]">رمز عبور</span><div className="relative"><input required name="password" minLength={8} type={showPassword ? "text" : "password"} placeholder="حداقل ۸ کاراکتر" className="auth-input pl-20" /><button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#7c84a1]">{showPassword ? "مخفی کن" : "نمایش"}</button></div></label>
              {mode === "login" && <div className="flex items-center justify-between text-xs"><label className="flex items-center gap-2 text-[#70778d]"><input type="checkbox" className="accent-[#9a6a10]" /> مرا به خاطر بسپار</label><button type="button" onClick={() => toast("لینک بازیابی به ایمیل شما ارسال می‌شود.")} className="font-bold text-[#9a6a10]">رمز عبور را فراموش کردی؟</button></div>}
              <button type="submit" className="mt-3 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#9a6a10] text-sm font-extrabold text-white shadow-[0_12px_24px_rgba(38,59,130,.22)] transition hover:-translate-y-0.5 hover:bg-[#1e2f70] active:scale-[.98]">{mode === "login" ? "ورود به حساب" : "ساخت حساب کاربری"}<ChevronLeft size={18} /></button>
            </form>

            <div className="my-7 flex items-center gap-4 text-xs text-[#a0a5b5]"><div className="h-px flex-1 bg-[#e9ebf2]" /><span>یا ادامه بده با</span><div className="h-px flex-1 bg-[#e9ebf2]" /></div>
            <button type="button" onClick={() => startLogin()} className="flex h-13 w-full items-center justify-center gap-3 rounded-2xl border border-[#e0e3ed] bg-white text-sm font-bold text-[#38405c] transition hover:border-[#9a6a10] hover:bg-[#fafbff]"><span className="grid h-7 w-7 place-items-center rounded-full bg-[#f0f2fb] text-[#9a6a10]"><Users size={15} /></span> ورود با حساب مانوس</button>
            <p className="mt-8 text-center text-xs leading-6 text-[#9a9fb0]">با ورود به کیو گرام، <span className="font-bold text-[#616983]">قوانین استفاده</span> و <span className="font-bold text-[#616983]">حریم خصوصی</span> را می‌پذیری.</p>
          </section>
        </div>
      </div>
    </main>
  );
}

function NavItem({ active, icon, label, onClick }: { active: boolean; icon: React.ReactNode; label: string; onClick: () => void }) {
  return <button type="button" onClick={onClick} className={`group flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-right text-sm font-bold transition ${active ? "bg-[#fff2c9] text-[#9a6a10]" : "text-[#82899e] hover:bg-[#f8f1df] hover:text-[#9a6a10]"}`}><span className={`${active ? "text-[#9a6a10]" : "text-[#a3a8b8] group-hover:text-[#9a6a10]"}`}>{icon}</span><span>{label}</span>{active && <span className="mr-auto h-1.5 w-1.5 rounded-full bg-[#e0a62a]" />}</button>;
}


function SecondaryPage({ tab, onTab, displayName, isAuthenticated }: { tab: Tab; onTab: (tab: Tab) => void; displayName: string; isAuthenticated: boolean }) {
  const [userSearch, setUserSearch] = useState("");
  const [settingsSection, setSettingsSection] = useState("profile");
  const [reelsMuted, setReelsMuted] = useState(true);
  const [privateAccount, setPrivateAccount] = useState(false);
  const [allowComments, setAllowComments] = useState(true);
  const [followedUsers, setFollowedUsers] = useState<number[]>([]);
  const [likedReels, setLikedReels] = useState<number[]>([]);
  const [savedReels, setSavedReels] = useState<number[]>([]);
  const [profileUsername, setProfileUsername] = useState("mina.qgram");
  const [profileBio, setProfileBio] = useState("عاشق قاب‌های ساده، سفرهای کوتاه و آدم‌های خوش‌قلب.");
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
  const [messageDraft, setMessageDraft] = useState("");
  const { data: searchedUsers } = trpc.social.searchUsers.useQuery({ query: userSearch }, { enabled: tab === "explore" && userSearch.trim().length > 1 });
  const { data: liveNotifications } = trpc.social.notifications.useQuery(undefined, { enabled: tab === "notifications" && isAuthenticated });
  const { data: liveSettings } = trpc.social.settings.useQuery(undefined, { enabled: tab === "settings" && isAuthenticated });
  const { data: liveConversations } = trpc.social.conversations.useQuery(undefined, { enabled: tab === "messages" && isAuthenticated });
  const { data: liveMessages } = trpc.social.messages.useQuery({ conversationId: selectedConversationId || 0 }, { enabled: tab === "messages" && isAuthenticated && selectedConversationId !== null });
  const settingsMutation = trpc.social.updateSettings.useMutation();
  const profileMutation = trpc.social.updateProfile.useMutation();
  const notificationReadMutation = trpc.social.markNotificationsRead.useMutation();
  const sendMessageMutation = trpc.social.sendMessage.useMutation({ onSuccess: () => setMessageDraft("") });
  const followMutation = trpc.social.follow.useMutation({ onSuccess: (following, variables) => setFollowedUsers((current) => following ? Array.from(new Set([...current, variables.userId])) : current.filter((id) => id !== variables.userId)) });
  useEffect(() => {
    if (!liveSettings) return;
    setPrivateAccount(Boolean(liveSettings.privateAccount));
    setAllowComments(Boolean(liveSettings.allowComments));
  }, [liveSettings]);
  const page = {
    reels: { title: "ویدیوهای کوتاه", subtitle: "چیزهایی که حال تو را بهتر می‌کنند", icon: <PlaySquare size={21} /> },
    messages: { title: "پیام‌ها", subtitle: "گفت‌وگوهای تو در یک نگاه", icon: <MessageCircle size={21} /> },
    notifications: { title: "اعلان‌ها", subtitle: "از اتفاق‌های تازه باخبر شو", icon: <Bell size={21} /> },
    settings: { title: "تنظیمات", subtitle: "کیو گرام را مطابق سلیقه‌ات تنظیم کن", icon: <Settings size={21} /> },
    explore: { title: "کاوش", subtitle: "چیزهایی که شاید دوست داشته باشی", icon: <Compass size={21} /> },
  }[tab as "reels" | "messages" | "notifications" | "settings" | "explore"];
  const videos = [
    { image: "photo-1516035069371-29a1b244cc32", title: "نور، قاب و یک لحظه‌ی آرام", user: "niloofar.visual" },
    { image: "photo-1511497584788-876760111969", title: "یک قدم نزدیک‌تر به طبیعت", user: "amin.outdoor" },
    { image: "photo-1500530855697-b586d89ba3ee", title: "صبح‌های الهام‌بخش", user: "sara.daily" },
    { image: "photo-1529156069898-49953e39b3ac", title: "آدم‌ها، قصه‌ها و لبخندها", user: "people.of.q" },
  ];
  const exploreCards = [
    "photo-1500534623283-312aade485b7", "photo-1470252649378-9c29740c9fa8", "photo-1501785888041-af3ef285b470", "photo-1441974231531-c6227db76b6e", "photo-1493246507139-91e8fad9978e", "photo-1464822759023-fed622ff2c3b", "photo-1511497584788-876760111969", "photo-1529156069898-49953e39b3ac", "photo-1517248135467-4c7edcad34c4", "photo-1500530855697-b586d89ba3ee", "photo-1516035069371-29a1b244cc32", "photo-1494790108377-be9c29b29330",
  ];
  const messages = [
    { name: "نگار رضایی", text: "این قاب خیلی قشنگ شده، آدرس کافه رو می‌فرستی؟", time: "۲ دقیقه پیش", image: "photo-1534528741775-53994a69daeb" },
    { name: "پارسا نادری", text: "استوری جدیدت رو دیدم 👋", time: "۱ ساعت پیش", image: "photo-1506794778202-cad84cf45f1d" },
    { name: "سارا محمدی", text: "فردا برای عکاسی آماده‌ای؟", time: "دیروز", image: "photo-1488426862026-3ee34a7d66df" },
  ];
  const notificationItems = liveNotifications?.length ? liveNotifications.map(({ notification, actor }) => ({ text: `${actor?.name || actor?.username || "یک کاربر"} ${notification.kind === "like" ? "پست تو را پسندید" : notification.kind === "comment" ? "برای پستت دیدگاه گذاشت" : notification.kind === "follow" ? "شروع به دنبال‌کردن تو کرد" : "یک فعالیت جدید برایت دارد"}.`, time: "تازه" })) : ["الهام رضایی پست تو را پسندید.", "ماهان کریمی شروع به دنبال‌کردن تو کرد.", "یک استوری جدید از نگار منتشر شد.", "پست تو ۱۰ نظر تازه دریافت کرد."].map((text, index) => ({ text, time: `${index + 1} ساعت پیش` }));
  const conversationItems: Array<{ conversationId: number; name: string; preview: string; image: string }> = isAuthenticated && liveConversations?.length
    ? (liveConversations as Array<{ conversationId: number }>).map((conversation) => ({ conversationId: conversation.conversationId, name: `گفت‌وگوی ${conversation.conversationId}`, preview: "گفت‌وگوی ذخیره‌شده", image: "photo-1494790108377-be9c29b29330" }))
    : messages.map((message, index) => ({ conversationId: index + 1, name: message.name, preview: message.text, image: message.image }));
  return <div dir="rtl" className="min-h-screen bg-[#fbfaf7] pb-24 text-[#2a2113]">
    <header className="sticky top-0 z-30 border-b border-[#eceef5] bg-white/90 px-3 py-3 backdrop-blur-xl sm:px-5 sm:py-4"><div className="mx-auto flex max-w-[760px] items-center justify-between"><BrandMark compact /><button type="button" onClick={() => onTab("home")} className="rounded-xl bg-[#f1f3fb] px-4 py-2 text-xs font-black text-[#9a6a10]">بازگشت به فید</button></div></header>
    <main className="mx-auto max-w-[760px] px-3 pb-24 pt-5 sm:px-6 sm:py-8"><div className="mb-7 flex items-start gap-4"><div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#fff2c9] text-[#9a6a10]">{page.icon}</div><div><h1 className="text-2xl font-black tracking-[-.04em]">{page.title}</h1><p className="mt-1 text-sm text-[#9299aa]">{page.subtitle}</p></div></div>
      {tab === "explore" && <><div className="mb-5 relative"><Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a0a6b9]" /><input value={userSearch} onChange={(event) => setUserSearch(event.target.value)} placeholder="جست‌وجو در آدم‌ها، هشتگ‌ها و مکان‌ها" className="h-12 w-full rounded-2xl border border-[#eef0f6] bg-white pr-11 pl-4 text-sm outline-none focus:ring-2 focus:ring-[#ead7a2]" />{searchedUsers && searchedUsers.length > 0 && <div className="absolute inset-x-0 top-14 z-10 rounded-2xl border border-[#eef0f6] bg-white p-2 shadow-xl">{searchedUsers.map((person) => <div key={person.id} className="flex items-center gap-3 rounded-xl p-2 text-right hover:bg-[#fbfaf7]"><Avatar src={person.avatarUrl || avatarUrl("photo-1494790108377-be9c29b29330")} alt={person.name || "کاربر"} size="sm" /><span className="min-w-0 flex-1"><b className="block truncate text-xs">{person.name || "کاربر کیو گرام"}</b><small className="text-[10px] text-[#9da3b2]">@{person.username || "qgram"}</small></span><button type="button" disabled={followMutation.isPending} onClick={() => followMutation.mutate({ userId: person.id })} className="rounded-lg bg-[#111] px-3 py-2 text-[10px] font-bold text-white disabled:opacity-50">{followedUsers.includes(person.id) ? "دنبال می‌کنی" : "دنبال کن"}</button></div>)}</div>}</div><div className="grid grid-cols-3 gap-1.5 sm:gap-3">{exploreCards.map((image, index) => <button type="button" key={image} onClick={() => toast("برای بازکردن پست، یک محتوای فید را انتخاب کن.")} className={`group relative overflow-hidden bg-[#dfe3f2] ${index % 7 === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-square"}`}><img src={`https://images.unsplash.com/${image}?auto=format&fit=crop&w=700&q=85`} alt="محتوای کاوش" className="h-full w-full object-cover transition duration-300 group-hover:scale-105" /><span className="absolute bottom-2 right-2 rounded-lg bg-black/50 px-2 py-1 text-[10px] font-bold text-white">{index % 2 ? "ویدیو" : "پست"}</span></button>)}</div></>}
      {tab === "reels" && <section className="relative mx-auto max-w-[430px]"><div className="h-[min(72vh,680px)] snap-y snap-mandatory space-y-4 overflow-y-auto rounded-[18px] bg-[#080b14] p-2 shadow-[0_20px_60px_rgba(8,11,20,.18)]">{videos.concat(videos.slice(0, 2)).map((video, index) => <article key={`${video.title}-${index}`} className="relative h-[min(68vh,640px)] snap-start overflow-hidden rounded-[14px] bg-[#151a29]"><img src={`https://images.unsplash.com/${video.image}?auto=format&fit=crop&w=1000&q=90`} alt={video.title} className="h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/10" /><button type="button" onClick={() => setReelsMuted((value) => !value)} className="absolute left-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-black/45 text-white text-xs font-black">{reelsMuted ? "صدا" : "بی‌صدا"}</button><div className="absolute bottom-5 right-5 left-16 text-white"><div className="mb-3 flex items-center gap-3"><Avatar src={avatarUrl(video.image)} alt={video.user} size="md" ring /><b className="text-sm">@{video.user}</b><button type="button" onClick={() => setFollowedUsers((current) => current.includes(index) ? current.filter((id) => id !== index) : [...current, index])} className="rounded-lg border border-white/50 px-3 py-1 text-[10px] font-bold">{followedUsers.includes(index) ? "دنبال می‌کنی" : "دنبال کن"}</button></div><p className="text-sm font-bold leading-7">{video.title} · لحظه‌های کوتاه برای دیدن و به اشتراک گذاشتن</p><div className="mt-4 flex items-center gap-4 text-xs font-bold"><button type="button" onClick={() => setLikedReels((current) => current.includes(index) ? current.filter((id) => id !== index) : [...current, index])} className={likedReels.includes(index) ? "text-[#ff6b81]" : ""}>{likedReels.includes(index) ? "♥" : "♡"} ۲۴۸K</button><button type="button" onClick={() => toast("برای این ریلز دیدگاهی ثبت نشده است.")}>◯ ۸۶۱</button><button type="button" onClick={() => { navigator.clipboard?.writeText(window.location.href); toast("لینک ریلز کپی شد."); }}>↗ اشتراک</button><button type="button" onClick={() => setSavedReels((current) => current.includes(index) ? current.filter((id) => id !== index) : [...current, index])} className={savedReels.includes(index) ? "text-[#ffd166]" : ""}>{savedReels.includes(index) ? "★" : "☆"} ذخیره</button></div></div></article>)}</div><p className="mt-3 text-center text-[11px] text-[#9ba1b1]">برای دیدن ویدیوی بعدی اسکرول کن · صدا: {reelsMuted ? "خاموش" : "روشن"}</p></section>}
      {tab === "messages" && <section className="grid min-h-[calc(100vh-150px)] overflow-hidden rounded-[16px] border border-[#e8e8e8] bg-white md:grid-cols-[240px_1fr]" dir="ltr"><div className="border-b border-[#eeeeee] md:border-b-0 md:border-r"><div className="flex items-center justify-between border-b border-[#eeeeee] p-4"><b className="text-sm" dir="rtl">پیام‌ها</b><button type="button" onClick={() => toast(isAuthenticated ? "برای شروع، یک کاربر را از کاوش دنبال کن و گفتگو بساز." : "برای پیام‌دادن وارد حساب شو.")} className="text-lg">＋</button></div><div className="p-3"><input placeholder="جست‌وجو در پیام‌ها" className="h-9 w-full rounded-lg bg-[#f5f5f5] px-3 text-xs outline-none" dir="rtl" /></div>{conversationItems.map((conversation) => <button type="button" key={conversation.conversationId} onClick={() => setSelectedConversationId(conversation.conversationId)} className={`flex w-full items-center gap-2 px-3 py-3 text-left hover:bg-[#fafafa] ${selectedConversationId === conversation.conversationId ? "bg-[#f5f5f5]" : ""}`}><Avatar src={avatarUrl(conversation.image)} alt={conversation.name} size="sm" ring /><span className="min-w-0"><b className="block truncate text-xs">{conversation.name}</b><span className="block truncate text-[10px] text-[#8e95a8]">{conversation.preview}</span></span></button>)}</div><div className="hidden flex-col p-6 md:flex" dir="rtl">{selectedConversationId && liveMessages ? <><div className="flex-1 space-y-3 overflow-y-auto">{liveMessages.map((message) => <div key={message.id} className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm ${message.senderId === liveMessages?.[0]?.senderId ? "mr-auto bg-[#111] text-white" : "ml-auto bg-[#f2f2f2] text-[#222]"}`}>{message.body}<small className="mt-1 block text-[10px] opacity-60">{new Date(message.createdAt).toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" })}</small></div>)}</div><form onSubmit={(event) => { event.preventDefault(); if (messageDraft.trim() && selectedConversationId) sendMessageMutation.mutate({ conversationId: selectedConversationId, body: messageDraft.trim() }); }} className="mt-4 flex gap-2"><input value={messageDraft} onChange={(event) => setMessageDraft(event.target.value)} placeholder="پیامت را بنویس…" className="h-11 flex-1 rounded-full border border-[#ddd] px-4 text-sm outline-none" /><button type="submit" disabled={!messageDraft.trim() || sendMessageMutation.isPending} className="rounded-full bg-[#111] px-5 text-xs font-bold text-white disabled:opacity-40">ارسال</button></form></> : <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center"><div className="grid h-16 w-16 place-items-center rounded-full border border-[#222]"><Send size={26} /></div><h2 className="text-xl font-bold">پیام‌های شما</h2><p className="text-xs text-[#8e95a8]">یک گفت‌وگو را انتخاب کن تا پیام‌هایت را ببینی.</p></div>}</div></section>}
      {tab === "notifications" && <section className="space-y-3"><div className="flex items-center justify-between"><span className="text-xs text-[#999]">{liveNotifications?.filter(({ notification }) => !notification.readAt).length || 0} اعلان خوانده‌نشده</span><button type="button" onClick={() => { if (isAuthenticated) notificationReadMutation.mutate(); toast("اعلان‌ها خوانده شدند."); }} className="text-xs font-bold text-[#111]">علامت‌گذاری همه به‌عنوان خوانده‌شده</button></div>{notificationItems.map(({ text, time }, index) => <button type="button" key={text} onClick={() => { if (isAuthenticated) notificationReadMutation.mutate(); toast("اعلان خوانده شد."); }} className="flex w-full items-center gap-3 rounded-2xl border border-[#eef0f6] bg-white p-4 text-right transition hover:-translate-y-0.5 hover:shadow-sm"><div className="grid h-10 w-10 place-items-center rounded-xl bg-[#fff0e8] text-[#ef815f]"><Bell size={18} /></div><span className="flex-1 text-sm font-bold text-[#4d5670]">{text}<small className="mt-1 block text-[10px] font-normal text-[#a2a8b6]">{time}</small></span><ChevronLeft size={17} className="text-[#aab0bf]" /></button>)}</section>}
      {tab === "settings" && <ReferenceSettings onBack={() => onTab("home")} onTab={onTab} />} 
    </main>
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-[68px] items-center justify-around border-t border-[#eceef5] bg-white/95 px-3 backdrop-blur-xl"><button type="button" onClick={() => onTab("home")} className="text-[#a2a8ba]"><HomeIcon size={21} /></button><button type="button" onClick={() => onTab("explore")} className="text-[#a2a8ba]"><Compass size={21} /></button><button type="button" onClick={() => onTab("reels")} className={`grid h-11 w-11 place-items-center rounded-2xl ${tab === "reels" ? "bg-[#9a6a10] text-white" : "text-[#a2a8ba]"}`}><PlaySquare size={21} /></button><button type="button" onClick={() => onTab("messages")} className={tab === "messages" ? "text-[#9a6a10]" : "text-[#a2a8ba]"}><MessageCircle size={21} /></button><button type="button" onClick={() => onTab("profile")} className="text-[#a2a8ba]"><UserRound size={21} /></button></nav>
  </div>;
}

export default function Home() {
  const { user, isAuthenticated, logout } = useAuth();
  const [demoUser, setDemoUser] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [activeTab, setActiveTab] = useState<Tab>("home");

  const [search, setSearch] = useState("");
  const [liked, setLiked] = useState<number[]>([]);
  const [saved, setSaved] = useState<number[]>([]);
  const [showComposer, setShowComposer] = useState(false);
  const [showStory, setShowStory] = useState<Story | null>(null);
  const [commentPostId, setCommentPostId] = useState<number | null>(null);
  const [commentText, setCommentText] = useState("");
  const [postText, setPostText] = useState("");
  const [postFile, setPostFile] = useState<File | null>(null);
  const [postPreview, setPostPreview] = useState("");
  const socialUtils = trpc.useUtils();
  const { data: liveFeed } = trpc.social.feed.useQuery(
    { limit: 20, offset: 0 },
    { enabled: isAuthenticated },
  );
  const { data: liveSaved } = trpc.social.saved.useQuery(undefined, { enabled: isAuthenticated && activeTab === "saved" });
  const likeMutation = trpc.social.toggleLike.useMutation({
    onSuccess: () => socialUtils.social.feed.invalidate(),
  });
  const saveMutation = trpc.social.toggleSave.useMutation({
    onSuccess: () => socialUtils.social.feed.invalidate(),
  });
  const uploadMutation = trpc.social.uploadMedia.useMutation();
  const commentMutation = trpc.social.comment.useMutation({
    onSuccess: () => {
      socialUtils.social.feed.invalidate();
      setCommentText("");
      setCommentPostId(null);
      toast("دیدگاهت ثبت شد.");
    },
  });
  const createPostMutation = trpc.social.createPost.useMutation({
    onSuccess: () => {
      socialUtils.social.feed.invalidate();
      toast("پست تو با موفقیت منتشر شد.");
    },
  });

  useEffect(() => {
    if (isAuthenticated) setDemoUser(true);
  }, [isAuthenticated]);

  const signedIn = demoUser || isAuthenticated;
  const displayName = user?.name || "مینا حیدری";
  const handleDemoLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const identifier = String(form.get("identifier") || "").trim();
    const password = String(form.get("password") || "");
    if (identifier.length < 3) { toast("ایمیل یا نام کاربری معتبر وارد کن."); return; }
    if (password.length < 8) { toast("رمز عبور باید حداقل ۸ کاراکتر باشد."); return; }
    setDemoUser(true);
    toast(authMode === "login" ? "خوش آمدی؛ فیدت آماده است." : "حساب کیو گرام تو ساخته شد.");
  };
  const activeServerRows = activeTab === "saved" && isAuthenticated ? liveSaved : liveFeed;
  const displayPosts: Post[] = activeServerRows
    ? activeServerRows.map(({ post, author, likes, comments: commentCount, isLiked, isSaved }) => ({
        id: post.id,
        name: author.name || author.username || "کاربر کیو گرام",
        username: author.username || "qgram-user",
        avatar: author.avatarUrl || avatarUrl("photo-1494790108377-be9c29b29330"),
        location: post.location || "کیو گرام",
        image: post.mediaUrl,
        caption: post.caption || "",
        likes: Number(likes),
        comments: Number(commentCount),
        time: new Date(post.createdAt).toLocaleDateString("fa-IR"),
        verified: false,
        serverLiked: Boolean(isLiked),
        serverSaved: Boolean(isSaved),
      }))
    : posts;
  const toggleLike = (id: number) => {
    if (isAuthenticated && liveFeed?.some(({ post }) => post.id === id)) {
      likeMutation.mutate({ postId: id });
      return;
    }
    setLiked((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };
  const toggleSave = (id: number) => {
    if (isAuthenticated && liveFeed?.some(({ post }) => post.id === id)) {
      saveMutation.mutate({ postId: id });
      return;
    }
    setSaved((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
    toast(saved.includes(id) ? "از ذخیره‌ها حذف شد." : "پست در ذخیره‌ها قرار گرفت.");
  };
  const publishPost = async () => {
    if (!postText.trim() && !postFile) return;
    if (!isAuthenticated) {
      setShowComposer(false);
      setPostText("");
      setPostFile(null);
      setPostPreview("");
      toast("برای انتشار دائمی، ابتدا با حساب واقعی وارد شو.");
      return;
    }
    let mediaUrl = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=90";
    let mediaType: "image" | "video" = "image";
    if (postFile) {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = reject;
        reader.readAsDataURL(postFile);
      });
      const uploaded = await uploadMutation.mutateAsync({ dataUrl, fileName: postFile.name, mimeType: postFile.type });
      mediaUrl = uploaded.url;
      mediaType = uploaded.mediaType;
    }
    await createPostMutation.mutateAsync({ caption: postText || undefined, mediaUrl, mediaType });
    setShowComposer(false);
    setPostText("");
    setPostFile(null);
    setPostPreview("");
  };
  const choosePostFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setPostFile(file);
    setPostPreview(URL.createObjectURL(file));
  };

  const filteredPosts = useMemo(
    () => filterQgramPosts(displayPosts, search, saved, activeTab === "saved"),
    [activeTab, displayPosts, saved, search],
  );

  if (!signedIn) return <AuthScreen mode={authMode} setMode={setAuthMode} onDemoLogin={handleDemoLogin} />;
  if (["explore", "reels", "messages", "notifications", "settings"].includes(activeTab)) return <SecondaryPage tab={activeTab} onTab={setActiveTab} displayName={displayName} isAuthenticated={isAuthenticated} />;

  return (
    <div dir="rtl" className="min-h-screen bg-white text-[#2a2113]">
      <header className="sticky top-0 z-30 border-b border-[#eceef5] bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-[1420px] items-center justify-between gap-5 px-5 lg:px-10">
          <BrandMark compact />
          <div className="hidden max-w-[360px] flex-1 md:block"><div className="relative"><Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a0a6b9]" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="جست‌وجو در کیو گرام" className="h-11 w-full rounded-2xl bg-[#f8f1df] pr-11 pl-4 text-sm outline-none transition placeholder:text-[#a1a7b8] focus:bg-white focus:ring-2 focus:ring-[#ead7a2]" /></div></div>
          <div className="flex items-center gap-2 sm:gap-4"><button type="button" onClick={() => toast("اعلان جدیدی نداری.")} className="relative grid h-10 w-10 place-items-center rounded-xl text-[#68718d] transition hover:bg-[#f8f1df]"><Bell size={20} /><span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-[#ff896d]" /></button><button type="button" onClick={() => setShowComposer(true)} className="hidden items-center gap-2 rounded-xl bg-[#9a6a10] px-4 py-2.5 text-xs font-extrabold text-white shadow-[0_7px_18px_rgba(38,59,130,.18)] transition hover:bg-[#744d08] sm:flex"><Plus size={16} /> پست جدید</button><Avatar src={avatarUrl("photo-1494790108377-be9c29b29330")} alt={displayName} size="sm" ring /></div>
        </div>
      </header>

      <div dir="ltr" className="mx-auto grid max-w-[1420px] grid-cols-1 gap-4 px-3 pb-24 pt-4 sm:gap-7 sm:px-4 sm:py-7 lg:grid-cols-[230px_minmax(0,1fr)_280px] lg:px-10">
        <aside dir="rtl" className="hidden lg:block"><div className="sticky top-[104px] space-y-7"><nav className="space-y-1"><NavItem active={activeTab === "home"} onClick={() => setActiveTab("home")} icon={<HomeIcon size={20} />} label="خانه" /><NavItem active={activeTab === "explore"} onClick={() => setActiveTab("explore")} icon={<Compass size={20} />} label="کاوش" /><NavItem active={activeTab === "reels"} onClick={() => setActiveTab("reels")} icon={<PlaySquare size={20} />} label="ویدیوهای کوتاه" /><NavItem active={activeTab === "messages"} onClick={() => setActiveTab("messages")} icon={<MessageCircle size={20} />} label="پیام‌ها" /><NavItem active={false} onClick={() => setActiveTab("notifications")} icon={<Bell size={20} />} label="اعلان‌ها" /><NavItem active={activeTab === "saved"} onClick={() => setActiveTab("saved")} icon={<Bookmark size={20} />} label="ذخیره‌ها" /></nav><div className="h-px bg-[#eceef4]" /><nav className="space-y-1"><NavItem active={activeTab === "profile"} onClick={() => setActiveTab("profile")} icon={<UserRound size={20} />} label="پروفایل من" /><NavItem active={false} onClick={() => setActiveTab("settings")} icon={<Settings size={20} />} label="تنظیمات" /></nav><button type="button" onClick={() => { if (isAuthenticated) logout(); setDemoUser(false); }} className="flex items-center gap-4 px-4 py-3 text-sm font-bold text-[#b0a0a9] transition hover:text-[#dd6e6e]"><LogOut size={20} /> خروج از حساب</button></div></aside>

        <main dir="rtl" className="mx-auto w-full max-w-[700px] min-w-0">
          <div className="mb-4 flex items-end justify-between sm:mb-6"><div><p className="mb-1 text-xs font-bold text-[#c98916]">{activeTab === "home" ? "جمعه، ۲۷ شهریور" : "فضای شخصی تو"}</p><h1 className="text-[29px] font-black tracking-[-.05em] text-[#2a2113]">{activeTab === "home" ? `صبح بخیر، ${displayName.split(" ")[0]} 👋` : activeTab === "saved" ? "ذخیره‌های من" : activeTab === "profile" ? "پروفایل من" : "چیزهای تازه برای تو"}</h1></div><button type="button" onClick={() => toast("فید با آخرین پست‌ها به‌روزرسانی شد.")} className="hidden items-center gap-2 rounded-xl border border-[#e3e6f0] bg-white px-3 py-2 text-xs font-bold text-[#727a91] transition hover:border-[#cfd5ee] sm:flex"><Sparkles size={15} className="text-[#f09a73]" /> برای تو</button></div>

          {activeTab !== "profile" && <section className="mb-7 rounded-[26px] border border-[#eef0f6] bg-white p-4 shadow-[0_12px_40px_rgba(35,49,92,.04)]"><div className="mb-3 flex items-center justify-between"><h2 className="text-sm font-black">استوری‌ها</h2><button type="button" onClick={() => toast("همه استوری‌ها را دیدی.")} className="text-xs font-bold text-[#9a6a10]">مشاهده همه</button></div><div className="flex gap-4 overflow-x-auto pb-1 scrollbar-none">{stories.map((story) => <button type="button" key={story.name} onClick={() => story.mine ? setShowComposer(true) : setShowStory(story)} className="group min-w-[66px] text-center"><div className="relative mx-auto mb-2 w-fit"><Avatar src={story.avatar} alt={story.name} size="lg" ring={!story.mine} /><span className={`absolute bottom-0 left-0 grid h-5 w-5 place-items-center rounded-full border-2 border-white ${story.mine ? "bg-[#9a6a10] text-white" : "hidden"}`}><Plus size={11} /></span></div><span className="block max-w-[66px] truncate text-[11px] font-semibold text-[#737a90] group-hover:text-[#9a6a10]">{story.name}</span></button>)}</div></section>}

          {activeTab === "profile" ? <ReferenceProfile displayName={displayName} avatar={avatarUrl("photo-1494790108377-be9c29b29330")} onSettings={() => setActiveTab("settings")} onCreate={() => setShowComposer(true)} />: <div className="space-y-6">{filteredPosts.length === 0 ? <div className="rounded-[26px] border border-dashed border-[#dfe3ef] bg-white px-6 py-16 text-center"><Bookmark size={26} className="mx-auto mb-4 text-[#b1b7c9]" /><h3 className="font-black text-[#4c5570]">هنوز چیزی اینجا نیست</h3><p className="mt-2 text-sm text-[#9ba1b1]">وقتی پستی را ذخیره کنی، اینجا پیدایش می‌کنی.</p></div> : filteredPosts.map((post) => <article key={post.id} className="overflow-hidden rounded-[12px] border border-[#eeeeee] bg-white"><div className="flex items-center gap-3 px-5 py-4"><Avatar src={post.avatar} alt={post.name} size="md" ring /><div className="min-w-0"><div className="flex items-center gap-1.5"><h3 className="truncate text-sm font-black text-[#28304b]">{post.name}</h3>{post.verified && <span className="grid h-4 w-4 place-items-center rounded-full bg-[#b4811c] text-white"><Check size={10} strokeWidth={4} /></span>}</div><p className="mt-0.5 truncate text-xs text-[#969cad]">{post.location}</p></div><button type="button" onClick={() => toast("گزینه‌های پست باز شد.")} className="mr-auto text-[#a3a8b8] hover:text-[#9a6a10]"><MoreHorizontal size={20} /></button></div><img src={post.image} alt={post.caption} className="aspect-[1.08] w-full object-cover sm:aspect-[1.32]" /><div className="px-5 py-4"><div className="mb-3 flex items-center gap-4"><button type="button" aria-label="لایک" onClick={() => toggleLike(post.id)} className={`transition hover:scale-110 ${(liked.includes(post.id) || (post as Post & { serverLiked?: boolean }).serverLiked) ? "text-[#ee626c]" : "text-[#5f6882]"}`}><Heart size={22} fill={(liked.includes(post.id) || (post as Post & { serverLiked?: boolean }).serverLiked) ? "currentColor" : "none"} /></button><button type="button" onClick={() => setCommentPostId(post.id)} className="text-[#5f6882] transition hover:scale-110"><MessageCircle size={22} /></button><button type="button" onClick={() => toast("لینک پست کپی شد.")} className="text-[#5f6882] transition hover:scale-110"><Send size={21} /></button><button type="button" aria-label="ذخیره" onClick={() => toggleSave(post.id)} className={`mr-auto transition hover:scale-110 ${(saved.includes(post.id) || (post as Post & { serverSaved?: boolean }).serverSaved) ? "text-[#9a6a10]" : "text-[#5f6882]"}`}><Bookmark size={22} fill={(saved.includes(post.id) || (post as Post & { serverSaved?: boolean }).serverSaved) ? "currentColor" : "none"} /></button></div><p className="text-sm font-black text-[#38405b]">{getQgramLikeCount(post.likes, liked.includes(post.id) || Boolean((post as Post & { serverLiked?: boolean }).serverLiked))} پسندیده</p><p className="mt-2 text-sm leading-7 text-[#525a71]"><span className="ml-1 font-black text-[#28304b]">{post.username}</span>{post.caption}</p><button type="button" onClick={() => setCommentPostId(post.id)} className="mt-2 text-xs font-semibold text-[#a1a6b5]">مشاهده‌ی {post.comments} دیدگاه</button><p className="mt-3 text-[10px] font-bold text-[#b1b5c2]">{post.time}</p></div></article>)}</div>}
        </main>

        <aside dir="rtl" className="hidden lg:block"><div className="sticky top-[104px] space-y-5"><section className="rounded-[26px] border border-[#eef0f6] bg-white p-5 shadow-[0_12px_40px_rgba(35,49,92,.04)]"><div className="flex items-center gap-3"><Avatar src={avatarUrl("photo-1494790108377-be9c29b29330")} alt={displayName} size="md" ring /><div className="min-w-0"><h2 className="truncate text-sm font-black">{displayName}</h2><p className="mt-1 text-xs text-[#9ba1b1]">@mina.qgram</p></div><button type="button" onClick={() => setActiveTab("profile")} className="mr-auto text-xs font-black text-[#9a6a10]">نمایش</button></div><div className="mt-5 grid grid-cols-3 border-t border-[#eef0f5] pt-4 text-center"><div><b className="block text-base text-[#313a59]">۳۶</b><span className="text-[10px] text-[#9ca2b2]">پست</span></div><div><b className="block text-base text-[#313a59]">۱۲۸</b><span className="text-[10px] text-[#9ca2b2]">دنبال‌کننده</span></div><div><b className="block text-base text-[#313a59]">۲۸۴</b><span className="text-[10px] text-[#9ca2b2]">دنبال‌شونده</span></div></div></section><section className="rounded-[26px] border border-[#eef0f6] bg-white p-5 shadow-[0_12px_40px_rgba(35,49,92,.04)]"><div className="mb-4 flex items-center justify-between"><h2 className="text-sm font-black">پیشنهاد برای تو</h2><button type="button" onClick={() => toast("پیشنهادهای بیشتری به‌زودی می‌بینی.")} className="text-[11px] font-bold text-[#9a6a10]">همه</button></div>{[{ name: "الهام رضایی", user: "elham.r", img: "photo-1544005313-94ddf0286df2" }, { name: "ماهان کریمی", user: "mahan.k", img: "photo-1506794778202-cad84cf45f1d" }, { name: "نیکی صالحی", user: "niki.s", img: "photo-1531123897727-8f129e1688ce" }].map((person) => <div key={person.user} className="mb-4 flex items-center gap-3 last:mb-0"><Avatar src={avatarUrl(person.img)} alt={person.name} size="sm" /><div className="min-w-0"><p className="truncate text-xs font-black text-[#454d68]">{person.name}</p><p className="mt-0.5 text-[10px] text-[#a0a6b5]">{person.user}</p></div><button type="button" onClick={() => toast(`درخواست دنبال‌کردن برای ${person.name} ارسال شد.`)} className="mr-auto text-[11px] font-black text-[#9a6a10]">دنبال کن</button></div>)}</section><p className="px-2 text-[10px] leading-6 text-[#b0b4c0]">درباره‌ی ما · راهنما · قوانین · حریم خصوصی<br />© ۱۴۰۳ کیو گرام</p></div></aside>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-30 flex h-[68px] items-center justify-around border-t border-[#eceef5] bg-white/95 px-3 backdrop-blur-xl lg:hidden"><button type="button" onClick={() => setActiveTab("home")} className={activeTab === "home" ? "text-[#9a6a10]" : "text-[#a2a8ba]"}><HomeIcon size={21} /></button><button type="button" onClick={() => setActiveTab("explore")} className={activeTab === "explore" ? "text-[#9a6a10]" : "text-[#a2a8ba]"}><Compass size={21} /></button><button type="button" onClick={() => setShowComposer(true)} className="grid h-11 w-11 place-items-center rounded-2xl bg-[#9a6a10] text-white shadow-[0_8px_18px_rgba(38,59,130,.25)]"><Plus size={22} /></button><button type="button" onClick={() => setActiveTab("saved")} className={activeTab === "saved" ? "text-[#9a6a10]" : "text-[#a2a8ba]"}><Bookmark size={21} /></button><button type="button" onClick={() => setActiveTab("profile")} className={activeTab === "profile" ? "text-[#9a6a10]" : "text-[#a2a8ba]"}><UserRound size={21} /></button></nav>

      {showComposer && <div className="fixed inset-0 z-50 grid place-items-center bg-[#2a2113]/45 p-4 backdrop-blur-sm"><div className="w-full max-w-[520px] rounded-[28px] bg-white p-6 shadow-2xl"><div className="mb-6 flex items-center justify-between"><div><h2 className="text-xl font-black">پست جدید</h2><p className="mt-1 text-xs text-[#9ba1b1]">چیزی که امروز در ذهنت می‌گذرد را به اشتراک بگذار.</p></div><button type="button" onClick={() => setShowComposer(false)} className="grid h-9 w-9 place-items-center rounded-xl bg-[#f4f5f9] text-[#7d8499]"><X size={17} /></button></div><div className="flex items-start gap-3"><Avatar src={avatarUrl("photo-1494790108377-be9c29b29330")} alt={displayName} size="md" /><div className="min-w-0 flex-1"><textarea value={postText} onChange={(event) => setPostText(event.target.value)} autoFocus rows={5} placeholder="امروز چه خبر؟" className="min-h-[150px] w-full resize-none rounded-2xl bg-[#f7f8fb] p-4 text-sm leading-7 outline-none ring-0 placeholder:text-[#adb2bf] focus:bg-[#f2f4fc]" /><div className="mt-2 flex flex-wrap gap-1.5">{["✨","😊","😂","❤️","🔥","👏","🌱","📍"].map((emoji) => <button type="button" key={emoji} onClick={() => setPostText((current) => current + emoji)} className="grid h-8 w-8 place-items-center rounded-lg bg-white text-base shadow-sm hover:bg-[#fff2c9]">{emoji}</button>)}</div></div>{postPreview && <img src={postPreview} alt="پیش‌نمایش رسانه" className="h-20 w-20 rounded-xl object-cover" />}</div><div className="mt-5 flex items-center justify-between border-t border-[#eef0f5] pt-4"><label className="flex cursor-pointer items-center gap-2 text-xs font-bold text-[#68718b]"><ImagePlus size={19} className="text-[#d7961a]" /> افزودن تصویر یا ویدیو<input type="file" accept="image/*,video/*" onChange={choosePostFile} className="hidden" /></label><button type="button" onClick={publishPost} disabled={uploadMutation.isPending || createPostMutation.isPending} className="rounded-xl bg-[#9a6a10] px-5 py-3 text-xs font-extrabold text-white transition hover:bg-[#744d08] disabled:cursor-wait disabled:opacity-60">{uploadMutation.isPending || createPostMutation.isPending ? "در حال انتشار…" : "انتشار پست"}</button></div></div></div>}
      {commentPostId !== null && <div className="fixed inset-0 z-50 grid place-items-center bg-[#2a2113]/45 p-4 backdrop-blur-sm"><div className="w-full max-w-[520px] rounded-[28px] bg-white p-6 shadow-2xl"><div className="mb-5 flex items-center justify-between"><div><h2 className="text-xl font-black">دیدگاه‌ها</h2><p className="mt-1 text-xs text-[#9ba1b1]">نظرت را درباره‌ی این پست بنویس.</p></div><button type="button" onClick={() => setCommentPostId(null)} className="grid h-9 w-9 place-items-center rounded-xl bg-[#f4f5f9] text-[#7d8499]"><X size={17} /></button></div><textarea value={commentText} onChange={(event) => setCommentText(event.target.value)} autoFocus rows={4} placeholder="یک دیدگاه محترمانه بنویس…" className="w-full resize-none rounded-2xl bg-[#f7f8fb] p-4 text-sm leading-7 outline-none focus:bg-[#f2f4fc]" /><button type="button" disabled={!commentText.trim() || commentMutation.isPending} onClick={() => { if (isAuthenticated) commentMutation.mutate({ postId: commentPostId, body: commentText }); else { toast("برای ثبت دیدگاه با حساب واقعی وارد شو."); setCommentPostId(null); } }} className="mt-4 w-full rounded-xl bg-[#9a6a10] py-3 text-xs font-extrabold text-white disabled:opacity-50">{commentMutation.isPending ? "در حال ثبت…" : "ثبت دیدگاه"}</button></div></div>}
      {showStory && <div className="fixed inset-0 z-50 grid place-items-center bg-[#10172e]/75 p-4 backdrop-blur-sm"><div className="relative h-[min(720px,88vh)] w-full max-w-[410px] overflow-hidden rounded-[30px] bg-black shadow-2xl"><img src={showStory.image} alt={showStory.name} className="h-full w-full object-cover opacity-90" /><div className="absolute inset-x-0 top-0 flex items-center gap-3 bg-gradient-to-b from-black/60 to-transparent p-5 text-white"><Avatar src={showStory.avatar} alt={showStory.name} size="sm" ring /><span className="text-sm font-black">{showStory.name}</span><button type="button" onClick={() => setShowStory(null)} className="mr-auto"><X size={21} /></button></div><div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-white"><p className="text-sm font-semibold">یک قاب ساده از امروز ✨</p></div></div></div>}
    </div>
  );
}
