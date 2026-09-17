from pathlib import Path
p=Path('/home/ubuntu/qgram/client/src/pages/Home.tsx')
s=p.read_text()
s=s.replace('import { trpc } from "@/lib/trpc";','import { trpc } from "@/lib/trpc";\nimport { ReferenceProfile, ReferenceSettings } from "@/components/ProfileReference";')
s=s.replace('  const [activeTab, setActiveTab] = useState<Tab>("home");','  const [activeTab, setActiveTab] = useState<Tab>("home");\n',1)
# Replace only the current profile branch in the main return.
start=s.index('{activeTab === "profile" ? <section')
end=s.index(': <div className="space-y-6">',start)
s=s[:start]+'{activeTab === "profile" ? <ReferenceProfile displayName={displayName} avatar={avatarUrl("photo-1494790108377-be9c29b29330")} onSettings={() => setActiveTab("settings")} onCreate={() => setShowComposer(true)} />'+s[end:]
# Replace the settings branch line in SecondaryPage.
lines=s.splitlines()
idx=next(i for i,l in enumerate(lines) if '{tab === "settings" && <section' in l)
lines[idx]='      {tab === "settings" && <ReferenceSettings onBack={() => onTab("home")} onTab={onTab} />} '
p.write_text('\n'.join(lines)+'\n')
