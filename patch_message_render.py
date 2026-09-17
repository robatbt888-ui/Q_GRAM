from pathlib import Path
p = Path('/home/ubuntu/qgram/client/src/pages/Home.tsx')
s = p.read_text()
s = s.replace('{"image" in conversation ? avatarUrl(conversation.image) : avatarUrl("photo-1494790108377-be9c29b29330")}', '{avatarUrl(conversation.image)}')
s = s.replace('{"name" in conversation ? conversation.name : `گفت‌وگوی ${conversation.conversationId}`}', '{conversation.name}')
s = s.replace('{"preview" in conversation ? conversation.preview : "گفت‌وگوی ذخیره‌شده"}', '{conversation.preview}')
p.write_text(s)
