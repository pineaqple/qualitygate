import re
import traceback
from telethon import functions
from telethon.sync import TelegramClient, events
from telethon.tl.functions.messages import ImportChatInviteRequest
from pymongo import MongoClient

mongo = MongoClient('mongodb://localhost:27017/')
db = mongo['telegram']
collection = db['channel_subscriptions']

api_id = 1193801
api_hash = 'ed44acfa3ce72b417a12cd20885810ef'
phone = '+4915237036039'

global channel_id
with TelegramClient(phone, api_id, api_hash) as client:
    @client.on(events.NewMessage)
    async def my_event_handler(event):
        if event.is_private:
            try:
                if "http" in event.raw_text:
                    url_start = event.raw_text.find('http')
                    channel_link = event.raw_text[url_start:]
                    pattern = r'https://t\.me/\+([A-Za-z0-9-_]+)'
                    match = re.search(pattern, channel_link)

                    if match:
                        code = match.group(1)
                        result = await client(ImportChatInviteRequest(code))
                        channel_id = result.chats[0].id
                    else:
                        result = await client(functions.channels.JoinChannelRequest(channel=channel_link))
                        channel_id = result.chats[0].id

                    user_id = event.message.sender_id
                    existing = collection.find_one({"user_id": user_id})
                    if existing:
                        collection.update_one({"user_id": user_id}, {'$push': {'channel_id': channel_id}})
                    else:
                        collection.insert_one({"user_id": user_id, "channel_id": [channel_id]})
            except:
                traceback.print_exc()
                await event.reply("An error has occured, channel cannot be subscribed to.")


    @client.on(events.NewMessage)
    async def handler2(event1):
        try:
            if event1.is_channel:
                if hasattr(event1.message, "text"):
                    text = event1.message.text
                elif hasattr(event1.message, "caption"):
                    text = event1.message.caption
                else:
                    text = None
                if text is not None:
                    links = re.findall(r'(https?://\S+)', text)

                    if not links:
                        chat_id = event1.message.peer_id.channel_id
                        user_ids = []

                        results = collection.find({"channel_id": {"$in": [chat_id]}})
                        for result in results:
                            user_ids.append(result["user_id"])

                        for userid in user_ids:
                            await event1.forward_to(userid)
        except:
            traceback.print_exc()

    client.start()
    client.run_until_disconnected()
