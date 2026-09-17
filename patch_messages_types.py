from pathlib import Path
import re
p = Path('/home/ubuntu/qgram/client/src/pages/Home.tsx')
s = p.read_text()
s = re.sub(r'\{\(isAuthenticated && liveConversations\?\.length \? liveConversations : messages\.map\(.*?\)\)\.map\(\(conversation\)', '{conversationItems.map((conversation)', s, count=1, flags=re.S)
s = s.replace('message.senderId === user?.id ? "mr-auto bg-[#111] text-white" : "ml-auto bg-[#f2f2f2] text-[#222]"', 'message.senderId === liveMessages?.[0]?.senderId ? "mr-auto bg-[#111] text-white" : "ml-auto bg-[#f2f2f2] text-[#222]"')
p.write_text(s)
