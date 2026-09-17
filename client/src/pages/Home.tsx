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

type AuthMode = "login" | "signup";
type Tab = "home" | "explore" | "saved" | "profile";

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
      <div className="relative grid h-10 w-10 place-items-center rounded-[14px] bg-[#263b82] text-white shadow-[0_8px_20px_rgba(38,59,130,.22)]">
        <span className="text-[20px] font-black tracking-[-.08em]">q</span>
        <span className="absolute bottom-[8px] left-[9px] h-1.5 w-1.5 rounded-full bg-[#ffb580]" />
      </div>
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
    <main dir="rtl" className="relative min-h-screen overflow-hidden bg-[#f7f8fc] text-[#18213c]">
      <div className="pointer-events-none absolute -right-32 -top-36 h-[470px] w-[470px] rounded-full bg-[#e8eaff] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-28 h-[430px] w-[430px] rounded-full bg-[#fff0e6] blur-3xl" />
      <div className="relative mx-auto flex min-h-screen max-w-[1420px] items-center justify-center px-5 py-8 lg:px-12">
        <div className="grid w-full max-w-[1120px] overflow-hidden rounded-[34px] border border-white/80 bg-white/80 shadow-[0_30px_90px_rgba(38,59,130,.12)] backdrop-blur-xl lg:grid-cols-[.92fr_1.08fr]">
          <section className="relative hidden min-h-[680px] overflow-hidden bg-[#263b82] p-12 text-white lg:flex lg:flex-col lg:justify-between">
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full border border-white/10" />
            <div className="absolute -bottom-36 -left-32 h-[420px] w-[420px] rounded-full border-[44px] border-[#5067b5]/40" />
            <div className="relative z-10 flex items-center gap-2 text-white/85"><Sparkles size={17} /><span className="text-sm font-semibold">جایی برای دیده‌شدنِ واقعی</span></div>
            <div className="relative z-10 max-w-[360px]">
              <div className="mb-7 flex h-20 w-20 items-center justify-center rounded-[26px] border border-white/20 bg-white/10 text-5xl font-black shadow-2xl">q</div>
              <h1 className="text-5xl font-black leading-[1.2] tracking-[-.06em]">لحظه‌هایت را<br /><span className="text-[#ffb580]">قاب بگیر.</span></h1>
              <p className="mt-6 max-w-[320px] text-[16px] leading-8 text-white/70">در کیو گرام، داستان‌های روزمره‌ات را با آدم‌هایی که دوستشان داری به اشتراک بگذار.</p>
            </div>
            <div className="relative z-10 flex items-center justify-between text-sm text-white/55"><span>نسخه‌ی فارسی شبکه‌ی اجتماعی شما</span><span>۰۱ / ۰۱</span></div>
          </section>

          <section className="flex min-h-[680px] flex-col justify-center px-6 py-10 sm:px-14 lg:px-16">
            <div className="mb-10 lg:hidden"><BrandMark /></div>
            <div className="mb-8">
              <p className="mb-3 text-sm font-bold text-[#ee815f]">خوش آمدی به جمع ما</p>
              <h2 className="text-[34px] font-black tracking-[-.05em] text-[#18213c]">{mode === "login" ? "دوباره ببینیمت" : "به کیو گرام بپیوند"}</h2>
              <p className="mt-3 text-sm leading-7 text-[#7a8198]">{mode === "login" ? "برای ادامه وارد حساب کاربری‌ات شو." : "چند قدم ساده تا ساختن فضای شخصی تو."}</p>
            </div>

            <div className="mb-8 grid grid-cols-2 rounded-2xl bg-[#f4f5fa] p-1.5">
              <button type="button" onClick={() => setMode("login")} className={`rounded-xl py-3 text-sm font-bold transition ${mode === "login" ? "bg-white text-[#263b82] shadow-sm" : "text-[#8b91a5]"}`}>ورود</button>
              <button type="button" onClick={() => setMode("signup")} className={`rounded-xl py-3 text-sm font-bold transition ${mode === "signup" ? "bg-white text-[#263b82] shadow-sm" : "text-[#8b91a5]"}`}>ثبت نام</button>
            </div>

            <form onSubmit={onDemoLogin} className="space-y-4">
              {mode === "signup" && <label className="block"><span className="mb-2 block text-xs font-bold text-[#646b82]">نام نمایشی</span><input required placeholder="مثلاً سارا محمدی" className="auth-input" /></label>}
              <label className="block"><span className="mb-2 block text-xs font-bold text-[#646b82]">ایمیل یا نام کاربری</span><input required type="text" placeholder="you@example.com" className="auth-input" /></label>
              <label className="block"><span className="mb-2 block text-xs font-bold text-[#646b82]">رمز عبور</span><div className="relative"><input required type={showPassword ? "text" : "password"} placeholder="حداقل ۸ کاراکتر" className="auth-input pl-20" /><button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#7c84a1]">{showPassword ? "مخفی کن" : "نمایش"}</button></div></label>
              {mode === "login" && <div className="flex items-center justify-between text-xs"><label className="flex items-center gap-2 text-[#70778d]"><input type="checkbox" className="accent-[#263b82]" /> مرا به خاطر بسپار</label><button type="button" onClick={() => toast("لینک بازیابی به ایمیل شما ارسال می‌شود.")} className="font-bold text-[#263b82]">رمز عبور را فراموش کردی؟</button></div>}
              <button type="submit" className="mt-3 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#263b82] text-sm font-extrabold text-white shadow-[0_12px_24px_rgba(38,59,130,.22)] transition hover:-translate-y-0.5 hover:bg-[#1e2f70] active:scale-[.98]">{mode === "login" ? "ورود به حساب" : "ساخت حساب کاربری"}<ChevronLeft size={18} /></button>
            </form>

            <div className="my-7 flex items-center gap-4 text-xs text-[#a0a5b5]"><div className="h-px flex-1 bg-[#e9ebf2]" /><span>یا ادامه بده با</span><div className="h-px flex-1 bg-[#e9ebf2]" /></div>
            <button type="button" onClick={() => startLogin()} className="flex h-13 w-full items-center justify-center gap-3 rounded-2xl border border-[#e0e3ed] bg-white text-sm font-bold text-[#38405c] transition hover:border-[#263b82] hover:bg-[#fafbff]"><span className="grid h-7 w-7 place-items-center rounded-full bg-[#f0f2fb] text-[#263b82]"><Users size={15} /></span> ورود با حساب مانوس</button>
            <p className="mt-8 text-center text-xs leading-6 text-[#9a9fb0]">با ورود به کیو گرام، <span className="font-bold text-[#616983]">قوانین استفاده</span> و <span className="font-bold text-[#616983]">حریم خصوصی</span> را می‌پذیری.</p>
          </section>
        </div>
      </div>
    </main>
  );
}

function NavItem({ active, icon, label, onClick }: { active: boolean; icon: React.ReactNode; label: string; onClick: () => void }) {
  return <button type="button" onClick={onClick} className={`group flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-right text-sm font-bold transition ${active ? "bg-[#eef0ff] text-[#263b82]" : "text-[#82899e] hover:bg-[#f5f6fa] hover:text-[#263b82]"}`}><span className={`${active ? "text-[#263b82]" : "text-[#a3a8b8] group-hover:text-[#263b82]"}`}>{icon}</span><span>{label}</span>{active && <span className="mr-auto h-1.5 w-1.5 rounded-full bg-[#ff9771]" />}</button>;
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
  const [postText, setPostText] = useState("");

  useEffect(() => {
    if (isAuthenticated) setDemoUser(true);
  }, [isAuthenticated]);

  const signedIn = demoUser || isAuthenticated;
  const displayName = user?.name || "مینا حیدری";
  const handleDemoLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setDemoUser(true);
    toast(authMode === "login" ? "خوش آمدی؛ فیدت آماده است." : "حساب کیو گرام تو ساخته شد.");
  };
  const toggleLike = (id: number) => setLiked((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const toggleSave = (id: number) => {
    setSaved((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
    toast(saved.includes(id) ? "از ذخیره‌ها حذف شد." : "پست در ذخیره‌ها قرار گرفت.");
  };
  const publishPost = () => {
    if (!postText.trim()) return;
    setShowComposer(false);
    setPostText("");
    toast("پست تو با موفقیت منتشر شد.");
  };

  const filteredPosts = useMemo(
    () => filterQgramPosts(posts, search, saved, activeTab === "saved"),
    [activeTab, saved, search],
  );

  if (!signedIn) return <AuthScreen mode={authMode} setMode={setAuthMode} onDemoLogin={handleDemoLogin} />;

  return (
    <div dir="rtl" className="min-h-screen bg-[#f8f9fc] text-[#202844]">
      <header className="sticky top-0 z-30 border-b border-[#eceef5] bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-[1420px] items-center justify-between gap-5 px-5 lg:px-10">
          <BrandMark compact />
          <div className="hidden max-w-[360px] flex-1 md:block"><div className="relative"><Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a0a6b9]" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="جست‌وجو در کیو گرام" className="h-11 w-full rounded-2xl bg-[#f5f6fa] pr-11 pl-4 text-sm outline-none transition placeholder:text-[#a1a7b8] focus:bg-white focus:ring-2 focus:ring-[#dfe3fa]" /></div></div>
          <div className="flex items-center gap-2 sm:gap-4"><button type="button" onClick={() => toast("اعلان جدیدی نداری.")} className="relative grid h-10 w-10 place-items-center rounded-xl text-[#68718d] transition hover:bg-[#f5f6fa]"><Bell size={20} /><span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-[#ff896d]" /></button><button type="button" onClick={() => setShowComposer(true)} className="hidden items-center gap-2 rounded-xl bg-[#263b82] px-4 py-2.5 text-xs font-extrabold text-white shadow-[0_7px_18px_rgba(38,59,130,.18)] transition hover:bg-[#1d2f70] sm:flex"><Plus size={16} /> پست جدید</button><Avatar src={avatarUrl("photo-1494790108377-be9c29b29330")} alt={displayName} size="sm" ring /></div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1420px] grid-cols-1 gap-7 px-4 py-7 lg:grid-cols-[230px_minmax(0,1fr)_280px] lg:px-10">
        <aside className="hidden lg:block"><div className="sticky top-[104px] space-y-7"><nav className="space-y-1"><NavItem active={activeTab === "home"} onClick={() => setActiveTab("home")} icon={<HomeIcon size={20} />} label="خانه" /><NavItem active={activeTab === "explore"} onClick={() => setActiveTab("explore")} icon={<Compass size={20} />} label="کاوش" /><NavItem active={false} onClick={() => toast("پیام‌ها به‌زودی در دسترس است.")} icon={<MessageCircle size={20} />} label="پیام‌ها" /><NavItem active={false} onClick={() => toast("اعلان‌ها به‌زودی در دسترس است.")} icon={<Bell size={20} />} label="اعلان‌ها" /><NavItem active={activeTab === "saved"} onClick={() => setActiveTab("saved")} icon={<Bookmark size={20} />} label="ذخیره‌ها" /></nav><div className="h-px bg-[#eceef4]" /><nav className="space-y-1"><NavItem active={activeTab === "profile"} onClick={() => setActiveTab("profile")} icon={<UserRound size={20} />} label="پروفایل من" /><NavItem active={false} onClick={() => toast("تنظیمات شخصی‌سازی به‌زودی اضافه می‌شود.")} icon={<Settings size={20} />} label="تنظیمات" /></nav><button type="button" onClick={() => { if (isAuthenticated) logout(); setDemoUser(false); }} className="flex items-center gap-4 px-4 py-3 text-sm font-bold text-[#b0a0a9] transition hover:text-[#dd6e6e]"><LogOut size={20} /> خروج از حساب</button></div></aside>

        <main className="mx-auto w-full max-w-[700px] min-w-0">
          <div className="mb-6 flex items-end justify-between"><div><p className="mb-1 text-xs font-bold text-[#ff8c6d]">{activeTab === "home" ? "جمعه، ۲۷ شهریور" : "فضای شخصی تو"}</p><h1 className="text-[29px] font-black tracking-[-.05em] text-[#202844]">{activeTab === "home" ? `صبح بخیر، ${displayName.split(" ")[0]} 👋` : activeTab === "saved" ? "ذخیره‌های من" : activeTab === "profile" ? "پروفایل من" : "چیزهای تازه برای تو"}</h1></div><button type="button" onClick={() => toast("فید با آخرین پست‌ها به‌روزرسانی شد.")} className="hidden items-center gap-2 rounded-xl border border-[#e3e6f0] bg-white px-3 py-2 text-xs font-bold text-[#727a91] transition hover:border-[#cfd5ee] sm:flex"><Sparkles size={15} className="text-[#f09a73]" /> برای تو</button></div>

          {activeTab !== "profile" && <section className="mb-7 rounded-[26px] border border-[#eef0f6] bg-white p-4 shadow-[0_12px_40px_rgba(35,49,92,.04)]"><div className="mb-3 flex items-center justify-between"><h2 className="text-sm font-black">استوری‌ها</h2><button type="button" onClick={() => toast("همه استوری‌ها را دیدی.")} className="text-xs font-bold text-[#263b82]">مشاهده همه</button></div><div className="flex gap-4 overflow-x-auto pb-1 scrollbar-none">{stories.map((story) => <button type="button" key={story.name} onClick={() => story.mine ? setShowComposer(true) : setShowStory(story)} className="group min-w-[66px] text-center"><div className="relative mx-auto mb-2 w-fit"><Avatar src={story.avatar} alt={story.name} size="lg" ring={!story.mine} /><span className={`absolute bottom-0 left-0 grid h-5 w-5 place-items-center rounded-full border-2 border-white ${story.mine ? "bg-[#263b82] text-white" : "hidden"}`}><Plus size={11} /></span></div><span className="block max-w-[66px] truncate text-[11px] font-semibold text-[#737a90] group-hover:text-[#263b82]">{story.name}</span></button>)}</div></section>}

          {activeTab === "profile" ? <section className="space-y-6"><div className="rounded-[28px] bg-[#263b82] p-6 text-white shadow-[0_20px_50px_rgba(38,59,130,.2)]"><div className="flex items-center gap-4"><Avatar src={avatarUrl("photo-1494790108377-be9c29b29330")} alt={displayName} size="lg" /><div><h2 className="text-xl font-black">{displayName}</h2><p className="mt-1 text-sm text-white/60">@mina.qgram</p></div><button type="button" onClick={() => toast("ویرایش پروفایل به‌زودی فعال می‌شود.")} className="mr-auto rounded-xl bg-white/10 px-3 py-2 text-xs font-bold text-white transition hover:bg-white/20">ویرایش پروفایل</button></div><p className="mt-6 max-w-[420px] text-sm leading-7 text-white/70">عاشق قاب‌های ساده، سفرهای کوتاه و آدم‌های خوش‌قلب.</p><div className="mt-6 flex gap-8 border-t border-white/10 pt-5 text-sm"><span><b className="ml-1 text-lg text-white">۱۲۸</b> دنبال‌کننده</span><span><b className="ml-1 text-lg text-white">۲۸۴</b> دنبال‌شونده</span><span><b className="ml-1 text-lg text-white">۳۶</b> پست</span></div></div><div className="grid grid-cols-3 gap-2">{["photo-1493246507139-91e8fad9978e","photo-1470252649378-9c29740c9fa8","photo-1500534623283-312aade485b7","photo-1501785888041-af3ef285b470","photo-1470770841072-f978cf4d019e","photo-1441974231531-c6227db76b6e"].map((id) => <img key={id} src={`https://images.unsplash.com/${id}?auto=format&fit=crop&w=500&q=85`} alt="پست پروفایل" className="aspect-square w-full rounded-xl object-cover" />)}</div></section> : <div className="space-y-6">{filteredPosts.length === 0 ? <div className="rounded-[26px] border border-dashed border-[#dfe3ef] bg-white px-6 py-16 text-center"><Bookmark size={26} className="mx-auto mb-4 text-[#b1b7c9]" /><h3 className="font-black text-[#4c5570]">هنوز چیزی اینجا نیست</h3><p className="mt-2 text-sm text-[#9ba1b1]">وقتی پستی را ذخیره کنی، اینجا پیدایش می‌کنی.</p></div> : filteredPosts.map((post) => <article key={post.id} className="overflow-hidden rounded-[26px] border border-[#eef0f6] bg-white shadow-[0_12px_40px_rgba(35,49,92,.04)]"><div className="flex items-center gap-3 px-5 py-4"><Avatar src={post.avatar} alt={post.name} size="md" ring /><div className="min-w-0"><div className="flex items-center gap-1.5"><h3 className="truncate text-sm font-black text-[#28304b]">{post.name}</h3>{post.verified && <span className="grid h-4 w-4 place-items-center rounded-full bg-[#5c74d9] text-white"><Check size={10} strokeWidth={4} /></span>}</div><p className="mt-0.5 truncate text-xs text-[#969cad]">{post.location}</p></div><button type="button" onClick={() => toast("گزینه‌های پست باز شد.")} className="mr-auto text-[#a3a8b8] hover:text-[#263b82]"><MoreHorizontal size={20} /></button></div><img src={post.image} alt={post.caption} className="aspect-[1.32] w-full object-cover" /><div className="px-5 py-4"><div className="mb-3 flex items-center gap-4"><button type="button" aria-label="لایک" onClick={() => toggleLike(post.id)} className={`transition hover:scale-110 ${liked.includes(post.id) ? "text-[#ee626c]" : "text-[#5f6882]"}`}><Heart size={22} fill={liked.includes(post.id) ? "currentColor" : "none"} /></button><button type="button" onClick={() => toast("بخش دیدگاه‌ها به‌زودی فعال می‌شود.")} className="text-[#5f6882] transition hover:scale-110"><MessageCircle size={22} /></button><button type="button" onClick={() => toast("لینک پست کپی شد.")} className="text-[#5f6882] transition hover:scale-110"><Send size={21} /></button><button type="button" aria-label="ذخیره" onClick={() => toggleSave(post.id)} className={`mr-auto transition hover:scale-110 ${saved.includes(post.id) ? "text-[#263b82]" : "text-[#5f6882]"}`}><Bookmark size={22} fill={saved.includes(post.id) ? "currentColor" : "none"} /></button></div><p className="text-sm font-black text-[#38405b]">{getQgramLikeCount(post.likes, liked.includes(post.id))} پسندیده</p><p className="mt-2 text-sm leading-7 text-[#525a71]"><span className="ml-1 font-black text-[#28304b]">{post.username}</span>{post.caption}</p><button type="button" onClick={() => toast("دیدگاه‌ها به‌زودی در دسترس است.")} className="mt-2 text-xs font-semibold text-[#a1a6b5]">مشاهده‌ی {post.comments} دیدگاه</button><p className="mt-3 text-[10px] font-bold text-[#b1b5c2]">{post.time}</p></div></article>)}</div>}
        </main>

        <aside className="hidden lg:block"><div className="sticky top-[104px] space-y-5"><section className="rounded-[26px] border border-[#eef0f6] bg-white p-5 shadow-[0_12px_40px_rgba(35,49,92,.04)]"><div className="flex items-center gap-3"><Avatar src={avatarUrl("photo-1494790108377-be9c29b29330")} alt={displayName} size="md" ring /><div className="min-w-0"><h2 className="truncate text-sm font-black">{displayName}</h2><p className="mt-1 text-xs text-[#9ba1b1]">@mina.qgram</p></div><button type="button" onClick={() => setActiveTab("profile")} className="mr-auto text-xs font-black text-[#263b82]">نمایش</button></div><div className="mt-5 grid grid-cols-3 border-t border-[#eef0f5] pt-4 text-center"><div><b className="block text-base text-[#313a59]">۳۶</b><span className="text-[10px] text-[#9ca2b2]">پست</span></div><div><b className="block text-base text-[#313a59]">۱۲۸</b><span className="text-[10px] text-[#9ca2b2]">دنبال‌کننده</span></div><div><b className="block text-base text-[#313a59]">۲۸۴</b><span className="text-[10px] text-[#9ca2b2]">دنبال‌شونده</span></div></div></section><section className="rounded-[26px] border border-[#eef0f6] bg-white p-5 shadow-[0_12px_40px_rgba(35,49,92,.04)]"><div className="mb-4 flex items-center justify-between"><h2 className="text-sm font-black">پیشنهاد برای تو</h2><button type="button" onClick={() => toast("پیشنهادهای بیشتری به‌زودی می‌بینی.")} className="text-[11px] font-bold text-[#263b82]">همه</button></div>{[{ name: "الهام رضایی", user: "elham.r", img: "photo-1544005313-94ddf0286df2" }, { name: "ماهان کریمی", user: "mahan.k", img: "photo-1506794778202-cad84cf45f1d" }, { name: "نیکی صالحی", user: "niki.s", img: "photo-1531123897727-8f129e1688ce" }].map((person) => <div key={person.user} className="mb-4 flex items-center gap-3 last:mb-0"><Avatar src={avatarUrl(person.img)} alt={person.name} size="sm" /><div className="min-w-0"><p className="truncate text-xs font-black text-[#454d68]">{person.name}</p><p className="mt-0.5 text-[10px] text-[#a0a6b5]">{person.user}</p></div><button type="button" onClick={() => toast(`درخواست دنبال‌کردن برای ${person.name} ارسال شد.`)} className="mr-auto text-[11px] font-black text-[#263b82]">دنبال کن</button></div>)}</section><p className="px-2 text-[10px] leading-6 text-[#b0b4c0]">درباره‌ی ما · راهنما · قوانین · حریم خصوصی<br />© ۱۴۰۳ کیو گرام</p></div></aside>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-30 flex h-[68px] items-center justify-around border-t border-[#eceef5] bg-white/95 px-3 backdrop-blur-xl lg:hidden"><button type="button" onClick={() => setActiveTab("home")} className={activeTab === "home" ? "text-[#263b82]" : "text-[#a2a8ba]"}><HomeIcon size={21} /></button><button type="button" onClick={() => setActiveTab("explore")} className={activeTab === "explore" ? "text-[#263b82]" : "text-[#a2a8ba]"}><Compass size={21} /></button><button type="button" onClick={() => setShowComposer(true)} className="grid h-11 w-11 place-items-center rounded-2xl bg-[#263b82] text-white shadow-[0_8px_18px_rgba(38,59,130,.25)]"><Plus size={22} /></button><button type="button" onClick={() => setActiveTab("saved")} className={activeTab === "saved" ? "text-[#263b82]" : "text-[#a2a8ba]"}><Bookmark size={21} /></button><button type="button" onClick={() => setActiveTab("profile")} className={activeTab === "profile" ? "text-[#263b82]" : "text-[#a2a8ba]"}><UserRound size={21} /></button></nav>

      {showComposer && <div className="fixed inset-0 z-50 grid place-items-center bg-[#18213c]/45 p-4 backdrop-blur-sm"><div className="w-full max-w-[520px] rounded-[28px] bg-white p-6 shadow-2xl"><div className="mb-6 flex items-center justify-between"><div><h2 className="text-xl font-black">پست جدید</h2><p className="mt-1 text-xs text-[#9ba1b1]">چیزی که امروز در ذهنت می‌گذرد را به اشتراک بگذار.</p></div><button type="button" onClick={() => setShowComposer(false)} className="grid h-9 w-9 place-items-center rounded-xl bg-[#f4f5f9] text-[#7d8499]"><X size={17} /></button></div><div className="flex items-start gap-3"><Avatar src={avatarUrl("photo-1494790108377-be9c29b29330")} alt={displayName} size="md" /><textarea value={postText} onChange={(event) => setPostText(event.target.value)} autoFocus rows={5} placeholder="امروز چه خبر؟" className="min-h-[150px] flex-1 resize-none rounded-2xl bg-[#f7f8fb] p-4 text-sm leading-7 outline-none ring-0 placeholder:text-[#adb2bf] focus:bg-[#f2f4fc]" /></div><div className="mt-5 flex items-center justify-between border-t border-[#eef0f5] pt-4"><button type="button" onClick={() => toast("انتخاب تصویر در نسخه‌ی بعدی فعال می‌شود.")} className="flex items-center gap-2 text-xs font-bold text-[#68718b]"><ImagePlus size={19} className="text-[#ff8b6c]" /> افزودن تصویر</button><button type="button" onClick={publishPost} className="rounded-xl bg-[#263b82] px-5 py-3 text-xs font-extrabold text-white transition hover:bg-[#1d2f70]">انتشار پست</button></div></div></div>}
      {showStory && <div className="fixed inset-0 z-50 grid place-items-center bg-[#10172e]/75 p-4 backdrop-blur-sm"><div className="relative h-[min(720px,88vh)] w-full max-w-[410px] overflow-hidden rounded-[30px] bg-black shadow-2xl"><img src={showStory.image} alt={showStory.name} className="h-full w-full object-cover opacity-90" /><div className="absolute inset-x-0 top-0 flex items-center gap-3 bg-gradient-to-b from-black/60 to-transparent p-5 text-white"><Avatar src={showStory.avatar} alt={showStory.name} size="sm" ring /><span className="text-sm font-black">{showStory.name}</span><button type="button" onClick={() => setShowStory(null)} className="mr-auto"><X size={21} /></button></div><div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-white"><p className="text-sm font-semibold">یک قاب ساده از امروز ✨</p></div></div></div>}
    </div>
  );
}
