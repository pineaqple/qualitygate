import logging
import os

import telegram
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from telegram import Update
from telegram.ext import Updater, CommandHandler, MessageHandler, Filters, CallbackContext

# Enable logging
from tinydb import *
from datetime import datetime
import re
import tweepy
import traceback

# BOT_TOKEN = "1134678066:AAHCCKSuBDRvSDfzEoVgv-sPSPyk2Cq_j7o"
BOT_TOKEN = "5651827310:AAG9z0NDjoSAfRQTRDEc5-NwT4nNe9D8q7k"

client = tweepy.Client(
    "AAAAAAAAAAAAAAAAAAAAAHnFhgEAAAAANRATfPn%2FvWO%2F7ak0v0g2jQHmX%2FE%3DrvbYD7ucBKawm4hs17D25rVtOvfjaIsuBaf6vyNn4PYqqCQPTO")

api_key = "oVz2epO77CwJceSWyyCVdQU4I"
api_secret = "uY0HYMaASEUzHSPW3rpXikR91GfrHJwjulUWAOlFxwFhLkEIN9"
client_id = "VjhmemhvaFJkWWJ5NzlyV3lrMk06MTpjaQ"
client_secret = "mZjxQzewQIBInyrrQ0aYT1u1cnpW9L0x2HFsk7V3f8OXpXH4Z7"
user_token = "961988757376393216-bQtBY03tDF0slBXsXPkWUY1y0iPjNNd"
user_token_secret = "wHfwR8CXKYUvju1uNA70JDJaAt5SiIyhCoA8ClJjUkdN5"
bearer_token = "AAAAAAAAAAAAAAAAAAAAAGnaaAEAAAAA0QStxFThjEiD9AOw0el0bDKxqtg%3DmZI6PqonxIvSJh1sPQMOpRSbJxlGpPhdHwxrbXq8YNMsYoa2L7"

client2 = tweepy.Client(
    bearer_token=bearer_token,
    consumer_key=api_key, consumer_secret=api_secret,
    access_token=user_token, access_token_secret=user_token_secret,
    wait_on_rate_limit=True
)

logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO)

logger = logging.getLogger(__name__)
bot = telegram.Bot(token='5651827310:AAG9z0NDjoSAfRQTRDEc5-NwT4nNe9D8q7k')
db = TinyDB('db.json')
userTable = db.table('users')
linkTable = db.table('links')
tweetTable = db.table('tweets')
weekTable = db.table('week')
mapTable = db.table('map')
karmaTable = db.table('karma')


def findWholeWord(w):
    return re.compile(r'\b({0})\b'.format(w), flags=re.IGNORECASE).search


def start(update: Update, _: CallbackContext) -> None:
    """Send a message when the command /start is called."""
    try:
        if '-' not in str(update.effective_chat.id):
            update.message.reply_text("Привет 👀")
        else:
            print(update.effective_chat.id)
            update.message.reply_text("I'm watching you 👀")

    except Exception as ex:
        print(ex)


def processTextMessage(update: Update, context: CallbackContext) -> None:
    """Handles incoming text messages"""
    try:
        if str(update.effective_chat.id) != "-392509601" and str(update.effective_chat.id) != "-1001653524921":
            return
        else:
            user = update.effective_user
            checkUser = userTable.search(where('id') == user.id)
            if not checkUser:
                print("User not found in table.")
                userTable.insert({'id': user.id, 'photo': 0, 'link': 0, 'shill': 0, 'drop': 0, 'like': 0})

            if update.message and update.message.text:

                if 'twitter.com' in update.message.text.lower() or 't.co' in update.message.text.lower() or 'x.com' in update.message.text.lower():
                    link = userTable.search(where('id') == user.id)[0]['link']
                    userTable.update({'link': link + 1}, where('id') == user.id)
                if (
                        'twitter.com' in update.message.text.lower() or 't.co' in update.message.text.lower() or 'x.com' in update.message.text.lower()) and \
                        ('#shill' in update.message.text.lower() or '#drop' in update.message.text.lower()):
                    if '#shill' in update.message.text.lower():
                        shill = userTable.search(where('id') == user.id)[0]['shill']
                        userTable.update({'shill': shill + 1}, where('id') == user.id)
                    if '#drop' in update.message.text.lower():
                        drop = userTable.search(where('id') == user.id)[0]['drop']
                        userTable.update({'drop': drop + 1}, where('id') == user.id)

                    curr_time = datetime.now().strftime("%m/%d/%Y, %H:%M:%S")
                    url_extract_pattern = "[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_\\+.~#?&\\/=]*)"
                    url = re.findall(url_extract_pattern, update.message.text)[0]
                    linkTable.insert({'link': url, 'time': curr_time})

                    # tweet_id = re.search('/status/(\d+)', url).group(1)
                    # if tweet_id is not None:
                    #     tweet_user = client.get_tweet(id=tweet_id, expansions=['author_id']).data['author_id']
                    #     tweetTable.insert({'id': tweet_id, 'user': update.effective_user.id, 'time': curr_time, 'likeids': []})
                    #     if not mapTable.search(where('tweet_id') == tweet_user) and not mapTable.search(
                    #             where('id') == str(update.message.from_user.id)):
                    #         mapTable.insert({'tweet_id': tweet_user, 'id': str(update.message.from_user.id)})
                    #     try:
                    #         client2.like(int(tweet_id))
                    #     except Exception as e:
                    #         context.bot.send_message(chat_id=285564864, text=e.__str__())

                thanklist = ["спасибо", "спасиб", "спс", "спасибки", "спосяб", "сенкс", "благодарю", "сяп", "сяпки"]
                if update.message.reply_to_message is not None and \
                        update.message.reply_to_message.from_user.id != update.message.from_user.id:
                    for word in thanklist:
                        if word in update.message.text.lower() and findWholeWord(word)(
                                update.message.text.lower()) is not None:
                            if not karmaTable.search(
                                    where('user_id') == int(update.message.reply_to_message.from_user.id)):
                                karmaTable.insert(
                                    {'user_id': int(update.message.reply_to_message.from_user.id), 'karma': 1})
                            else:
                                karma = karmaTable.search(
                                    where('user_id') == int(update.message.reply_to_message.from_user.id))[0]['karma']
                                karmaTable.update(
                                    {'karma': karma + 1},
                                    where('user_id') == int(update.message.reply_to_message.from_user.id))
                            break


    except Exception as ex:
        print(ex)


def processPhotoMessage(update: Update, context: CallbackContext):
    """Handles incoming photos (separate handling due to caption object)"""
    try:
        if str(update.effective_chat.id) != "-392509601" and str(update.effective_chat.id) != "-1001653524921":
            return

        else:
            user = update.effective_user
            checkUser = userTable.search(where('id') == user.id)
            if not checkUser:
                print("User not found in table.")
                userTable.insert({'id': user.id, 'photo': 0, 'link': 0, 'shill': 0, 'drop': 0, 'like': 0})

            photo = userTable.search(where('id') == user.id)[0]['photo']
            userTable.update({'photo': photo + 1}, where('id') == user.id)

            if update.message and update.message.caption:

                if 'twitter.com' in update.message.caption.lower() or 't.co' in update.message.caption.lower() or 'x.com' in update.message.text.lower():
                    link = userTable.search(where('id') == user.id)[0]['link']
                    userTable.update({'link': link + 1}, where('id') == user.id)
                if (
                        'twitter.com' in update.message.caption.lower() or 't.co' in update.message.caption.lower() or 'x.com' in update.message.text.lower()) and \
                        ('#shill' in update.message.caption.lower() or '#drop' in update.message.caption.lower()):
                    if '#shill' in update.message.caption.lower():
                        shill = userTable.search(where('id') == user.id)[0]['shill']
                        userTable.update({'shill': shill + 1}, where('id') == user.id)
                    if '#drop' in update.message.caption.lower():
                        drop = userTable.search(where('id') == user.id)[0]['drop']
                        userTable.update({'drop': drop + 1}, where('id') == user.id)

                    curr_time = datetime.now().strftime("%m/%d/%Y, %H:%M:%S")
                    url = re.search("(?P<url>https?://[^\s]+)", update.message.caption).group("url")
                    linkTable.insert({'link': url, 'time': curr_time})
                    # tweet_id = re.search('/status/(\d+)', url).group(1)
                    # if tweet_id is not None:
                    #     tweet_user = client.get_tweet(id=tweet_id, expansions=['author_id']).data['author_id']
                    #     tweetTable.insert({'id': tweet_id, 'user': update.effective_user.id, 'time': curr_time, 'likeids': []})
                    #     if not mapTable.search(where('tweet_id') == tweet_user) and not mapTable.search(
                    #             where('id') == str(update.message.from_user.id)):
                    #         mapTable.insert({'tweet_id': tweet_user, 'id': str(update.message.from_user.id)})
                    #     try:
                    #         client2.like(int(tweet_id))
                    #     except Exception as e:
                    #         context.bot.send_message(chat_id=285564864, text=e.__str__())


    except Exception as ex:
        print(ex)


def processDocMessage(update: Update, context: CallbackContext):
    """Handles incoming GIFs (separate handling due to caption object)"""
    try:
        if str(update.effective_chat.id) != "-392509601" and str(update.effective_chat.id) != "-1001653524921":
            return

        else:
            user = update.effective_user
            checkUser = userTable.search(where('id') == user.id)
            if not checkUser:
                print("User not found in table.")
                userTable.insert({'id': user.id, 'photo': 0, 'link': 0, 'shill': 0, 'drop': 0, 'like': 0})

            if update.message and update.message.caption:

                if 'twitter.com' in update.message.caption.lower() or 't.co' in update.message.caption.lower() or 'x.com' in update.message.text.lower():
                    link = userTable.search(where('id') == user.id)[0]['link']
                    userTable.update({'link': link + 1}, where('id') == user.id)
                if (
                        'twitter.com' in update.message.caption.lower() or 't.co' in update.message.caption.lower() or 'x.com' in update.message.text.lower()) and \
                        ('#shill' in update.message.caption.lower() or '#drop' in update.message.caption.lower()):
                    if '#shill' in update.message.caption.lower():
                        shill = userTable.search(where('id') == user.id)[0]['shill']
                        userTable.update({'shill': shill + 1}, where('id') == user.id)
                    if '#drop' in update.message.caption.lower():
                        drop = userTable.search(where('id') == user.id)[0]['drop']
                        userTable.update({'drop': drop + 1}, where('id') == user.id)

                    curr_time = datetime.now().strftime("%m/%d/%Y, %H:%M:%S")
                    url = re.search("(?P<url>https?://[^\s]+)", update.message.caption).group("url")
                    linkTable.insert({'link': url, 'time': curr_time})
                    # tweet_id = re.search('/status/(\d+)', url).group(1)
                    # if tweet_id is not None:
                    #     tweet_user = client.get_tweet(id=tweet_id, expansions=['author_id']).data['author_id']
                    #     tweetTable.insert(
                    #         {'id': tweet_id, 'user': update.effective_user.id, 'time': curr_time, 'likeids': []})
                    #     if not mapTable.search(where('tweet_id') == tweet_user) and not mapTable.search(
                    #             where('id') == str(update.message.from_user.id)):
                    #         mapTable.insert({'tweet_id': tweet_user, 'id': str(update.message.from_user.id)})
                    #     try:
                    #         client2.like(int(tweet_id))
                    #     except Exception as e:
                    #         context.bot.send_message(chat_id=285564864, text=e.__str__())


    except Exception as ex:
        print(ex)


def dropTweets(update: Update, _: CallbackContext):
    try:
        if update.message.from_user.id == 285564864:
            tweetTable.truncate()
    except Exception as ex:
        print(ex)


def refreshLinks():
    """Delete all twitter links older then 5 hours"""

    try:
        curr_time = datetime.now()
        for entry in linkTable:
            diff = curr_time - datetime.strptime(entry['time'], "%m/%d/%Y, %H:%M:%S")
            diff_in_hours = round(diff.total_seconds() / 3600)
            if diff_in_hours >= 12:
                linkTable.remove(where('link') == entry['link'])

        # for entry in tweetTable:
        #     try:
        #         diff = curr_time - datetime.strptime(entry['time'], "%m/%d/%Y, %H:%M:%S")
        #         diff_in_hours = round(diff.total_seconds() / 3600)
        #         if diff_in_hours >= 24:
        #             tweetTable.remove(where('id') == entry['id'])
        #         else:
        #             user_list = client.get_liking_users(entry['id'])
        #             if user_list.data is None:
        #                 continue
        #             for user in user_list.data:
        #                 tweet_user = user['id']
        #                 res = mapTable.search(where('tweet_id') == tweet_user)
        #                 if res:
        #                     if entry['likeids'] is None:
        #                         continue
        #                     res1 = int(res[0]['id'])
        #                     if res1 not in entry['likeids']:
        #                         tweetTable.update({'likeids': entry['likeids'].append(res1)},
        #                                           where('id') == entry['id'])
        #                         like = userTable.search(where('id') == res1)
        #                         if like:
        #                             like1 = like[0]['like']
        #                             userTable.update({'like': like1 + 1}, where('id') == res1)
        #                         else:
        #                             userTable.insert(
        #                                 {'id': res1, 'photo': 0, 'link': 0, 'shill': 0, 'drop': 0, 'like': 1})
        #     except Exception as e:
        #         print(e)
        #         bot.send_message(chat_id=285564864, text="inner: " + e.__str__() + " - " + entry['id'])
        #         bot.send_message(chat_id=285564864, text=traceback.format_exc())

    except Exception as ex:
        print(ex)
        bot.send_message(chat_id=285564864, text="outer: " + ex.__str__())


def refreshTweets():
    """Delete all twitter like-related links older then one day"""

    try:
        curr_time = datetime.now()
        for entry in tweetTable:
            diff = curr_time - datetime.strptime(entry['time'], "%m/%d/%Y, %H:%M:%S")
            diff_in_hours = round(diff.total_seconds() / 3600)
            if diff_in_hours >= 12:
                user_list = client.get_liking_users(entry['id'])
                for user in user_list.data:
                    tweet_user = user['id']
                    res = mapTable.search(where('tweet_id') == tweet_user)
                    if res:
                        like = userTable.search(where('id') == int(res[0]['id']))[0]['like']
                        userTable.update({'like': like + 1}, where('id') == int(res[0]['id']))
                tweetTable.remove(where('id') == entry['id'])

    except Exception as ex:
        print(ex)
        bot.send_message(chat_id=285564864, text=traceback.format_exc())


def refreshDaily():
    try:
        for entry in userTable:
            res = weekTable.search(where('id') == entry['id'])
            if not res:
                weekTable.insert(entry)
            else:
                like = res[0]['like']
                drop = res[0]['drop']
                link = res[0]['link']
                shill = res[0]['shill']
                photo = res[0]['photo']
                weekTable.update({'like': like + entry['like'], 'drop': drop + entry['drop'],
                                  'shill': shill + entry['shill'], 'link': link + entry['link'],
                                  'photo': photo + entry['photo']}, where('id') == entry['id'])
        userTable.truncate()
    except Exception as ex:
        print(ex)
        bot.send_message(chat_id=285564864, text=traceback.format_exc())
        userTable.truncate()


def testTweets(update: Update, context: CallbackContext):
    try:
        for entry in tweetTable:
            user_list = client.get_liking_users(entry['id'])
            for user in user_list.data:
                tweet_user = user['id']
                res = mapTable.search(where('tweet_id') == tweet_user)
                if res:
                    like = userTable.search(where('id') == int(res[0]['id']))[0]['like']
                    userTable.update({'like': like + 1}, where('id') == int(res[0]['id']))
            tweetTable.remove(where('id') == entry['id'])
    except Exception as ex:
        print(ex)
        context.bot.send_message(chat_id=285564864, text=ex.__str__())


def dropUsers(update: Update, _: CallbackContext):
    """Reset the stats"""

    try:
        if update.message.from_user.id == 285564864:
            userTable.truncate()
    except Exception as ex:
        print(ex)


def dropWeekly(update: Update, _: CallbackContext):
    """Reset the stats"""

    try:
        if update.message.from_user.id == 285564864:
            weekTable.truncate()
    except Exception as ex:
        print(ex)


def stat(update: Update, _: CallbackContext):
    """Display the stats for the caller.
    In case command is called in a reply to message, display the stats for the person in the reply."""
    if str(update.effective_chat.id) != "-392509601" and str(update.effective_chat.id) != "-1001653524921":
        return

    try:
        if update.message.reply_to_message:
            user = update.message.reply_to_message.from_user
        else:
            user = update.effective_user

        checkUser = userTable.search(where('id') == user.id)
        if not checkUser:
            print("User not found in table.")
            userTable.insert({'id': user.id, 'photo': 0, 'link': 0, 'shill': 0, 'drop': 0, 'like': 0})

        photos = userTable.search(where('id') == user.id)[0]['photo']
        links = userTable.search(where('id') == user.id)[0]['link']
        shills = userTable.search(where('id') == user.id)[0]['shill']
        drops = userTable.search(where('id') == user.id)[0]['drop']
        likes = userTable.search(where('id') == user.id)[0]['like']

        msg = "<b>Showing info for user @{0}:</b>\nPhotos: {1}\nLinks: {2}\nShills: {3}\nDrops: {4}\nLikes: {5}" \
            .format(user.username, photos, links, shills, drops, likes)
        update.message.reply_text(text=msg, parse_mode='HTML')
    except Exception as ex:
        print(ex)


def getlinks(update: Update, context: CallbackContext):
    try:
        if '-' in str(update.effective_chat.id):
            update.message.reply_text("Работает только в личных сообщениях с ботом, чтобы не засорять чат.")
            return

        lst = []
        for entry in linkTable:
            lst.append(entry['link'])

        counter = 1
        msg = "<b>All shill links for the last 12 hours:</b>\n"
        for e in lst:
            msg += "{0}. {1}\n\n".format(counter, e)
            counter += 1
        if len(msg) >= 4090:
            midpoint = len(msg) // 2
            part1 = msg[:midpoint]
            part2 = msg[midpoint:]
            update.message.reply_text(text=part1, parse_mode='HTML', disable_web_page_preview=True)
            update.message.reply_text(text=part2, parse_mode='HTML', disable_web_page_preview=True)
        else:
            update.message.reply_text(text=msg, parse_mode='HTML', disable_web_page_preview=True)
    except Exception as ex:
        print(ex)
        context.bot.send_message(chat_id=285564864, text=ex.__str__())


def allphoto(update: Update, context: CallbackContext):
    """Display all stats based on photo count."""
    if str(update.effective_chat.id) != "-392509601" and str(update.effective_chat.id) != "-1001653524921":
        return

    try:

        if update.message.reply_to_message:
            user = update.message.reply_to_message.from_user
        else:
            user = update.effective_user
        checkUser = userTable.search(where('id') == user.id)
        if not checkUser:
            print("User not found in table.")
            userTable.insert({'id': user.id, 'photo': 0, 'link': 0, 'shill': 0, 'drop': 0, 'like': 0})

        lst = []
        for entry in userTable:
            try:
                usr = update.effective_chat.get_member(int((entry['id']))).user
                first_name = usr.first_name if usr.first_name is not None else ""
                last_name = usr.last_name if usr.last_name is not None else ""
                name = first_name + " " + last_name
                lst.append([entry['photo'], name])
            except Exception as e:
                continue
        msg = "<b>Top photo-senders:</b>\n"
        counter = 1
        for e in sorted(lst, key=lambda x: x[0], reverse=True):
            msg += "{0}. {1} - {2}\n".format(counter, e[1], e[0])
            counter += 1
            if counter > 15:
                break

        update.message.reply_text(text=msg, parse_mode='HTML')

    except Exception as ex:
        print(ex)
        context.bot.send_message(chat_id=285564864, text=ex.__str__())


def allshill(update: Update, context: CallbackContext):
    """Display all stats based on shill count."""
    if str(update.effective_chat.id) != "-392509601" and str(update.effective_chat.id) != "-1001653524921":
        return

    try:

        if update.message.reply_to_message:
            user = update.message.reply_to_message.from_user
        else:
            user = update.effective_user
        checkUser = userTable.search(where('id') == user.id)
        if not checkUser:
            print("User not found in table.")
            userTable.insert({'id': user.id, 'photo': 0, 'link': 0, 'shill': 0, 'drop': 0, 'like': 0})

        lst = []
        for entry in userTable:
            try:
                usr = update.effective_chat.get_member(int((entry['id']))).user
                first_name = usr.first_name if usr.first_name is not None else ""
                last_name = usr.last_name if usr.last_name is not None else ""
                name = first_name + " " + last_name
                lst.append([entry['shill'], name])
            except Exception as e:
                continue

        msg = "<b>Top #shill users:</b>\n"
        counter = 1
        for e in sorted(lst, key=lambda x: x[0], reverse=True):
            msg += "{0}. {1} - {2}\n".format(counter, e[1], e[0])
            counter += 1
            if counter > 15:
                break

        update.message.reply_text(text=msg, parse_mode='HTML')

    except Exception as ex:
        print(ex)
        context.bot.send_message(chat_id=285564864, text=ex.__str__())


def alllink(update: Update, _: CallbackContext):
    """Display all stats based on link count."""
    if str(update.effective_chat.id) != "-392509601" and str(update.effective_chat.id) != "-1001653524921":
        return

    try:

        if update.message.reply_to_message:
            user = update.message.reply_to_message.from_user
        else:
            user = update.effective_user
        checkUser = userTable.search(where('id') == user.id)
        if not checkUser:
            print("User not found in table.")
            userTable.insert({'id': user.id, 'photo': 0, 'link': 0, 'shill': 0, 'drop': 0, 'like': 0})

        lst = []
        for entry in userTable:
            try:
                usr = update.effective_chat.get_member(int((entry['id']))).user
                first_name = usr.first_name if usr.first_name is not None else ""
                last_name = usr.last_name if usr.last_name is not None else ""
                name = first_name + " " + last_name
                lst.append([entry['link'], name])
            except Exception as e:
                continue

        msg = "<b>Top Twitter link senders:</b>\n"
        counter = 1
        for e in sorted(lst, key=lambda x: x[0], reverse=True):
            msg += "{0}. {1} - {2}\n".format(counter, e[1], e[0])
            counter += 1
            if counter > 15:
                break

        update.message.reply_text(text=msg, parse_mode='HTML')

    except Exception as ex:
        print(ex)


def alldrop(update: Update, _: CallbackContext):
    """Display all stats based on drop count."""
    if str(update.effective_chat.id) != "-392509601" and str(update.effective_chat.id) != "-1001653524921":
        return

    try:

        if update.message.reply_to_message:
            user = update.message.reply_to_message.from_user
        else:
            user = update.effective_user
        checkUser = userTable.search(where('id') == user.id)
        if not checkUser:
            print("User not found in table.")
            userTable.insert({'id': user.id, 'photo': 0, 'link': 0, 'shill': 0, 'drop': 0, 'like': 0})

        lst = []
        for entry in userTable:
            try:
                usr = update.effective_chat.get_member(int((entry['id']))).user
                first_name = usr.first_name if usr.first_name is not None else ""
                last_name = usr.last_name if usr.last_name is not None else ""
                name = first_name + " " + last_name
                lst.append([entry['drop'], name])
            except Exception as e:
                continue

        msg = "<b>Top #drop users:</b>\n"
        counter = 1
        for e in sorted(lst, key=lambda x: x[0], reverse=True):
            msg += "{0}. {1} - {2}\n".format(counter, e[1], e[0])
            counter += 1
            if counter > 15:
                break

        update.message.reply_text(text=msg, parse_mode='HTML')

    except Exception as ex:
        print(ex)


def alllikes(update: Update, context: CallbackContext):
    # if str(update.effective_chat.id) != "-392509601" and str(update.effective_chat.id) != "-1001653524921":
    #    return

    try:

        if update.message.reply_to_message:
            user = update.message.reply_to_message.from_user
        else:
            user = update.effective_user
        checkUser = userTable.search(where('id') == user.id)
        if not checkUser:
            print("User not found in table.")
            userTable.insert({'id': user.id, 'photo': 0, 'link': 0, 'shill': 0, 'drop': 0, 'like': 0})

        lst = []
        chat = context.bot.get_chat(-1001653524921)
        for entry in userTable:
            try:
                usr = chat.get_member(int((entry['id']))).user
                first_name = usr.first_name if usr.first_name is not None else ""
                last_name = usr.last_name if usr.last_name is not None else ""
                name = first_name + " " + last_name
                lst.append([entry['like'], name])
            except Exception as e:
                continue

        msg = "<b>Top tweet likers ❤:</b>\n"
        counter = 1
        for e in sorted(lst, key=lambda x: x[0], reverse=True):
            msg += "{0}. {1} - {2}\n".format(counter, e[1], e[0])
            counter += 1
            if counter > 15:
                break

        update.message.reply_text(text=msg, parse_mode='HTML')

    except Exception as ex:
        print(ex)
        context.bot.send_message(chat_id=285564864, text=ex.__str__())


def likesfull(update: Update, context: CallbackContext):
    # if str(update.effective_chat.id) != "-392509601" and str(update.effective_chat.id) != "-1001653524921":
    #    return

    try:

        if update.message.reply_to_message:
            user = update.message.reply_to_message.from_user
        else:
            user = update.effective_user
        checkUser = userTable.search(where('id') == user.id)
        if not checkUser:
            print("User not found in table.")
            userTable.insert({'id': user.id, 'photo': 0, 'link': 0, 'shill': 0, 'drop': 0, 'like': 0})

        lst = []
        chat = context.bot.get_chat(-1001653524921)
        for entry in userTable:
            try:
                usr = chat.get_member(int((entry['id']))).user
                first_name = usr.first_name if usr.first_name is not None else ""
                last_name = usr.last_name if usr.last_name is not None else ""
                name = first_name + " " + last_name
                lst.append([entry['like'], name])
            except Exception as e:
                continue

        msg = "<b>Top tweet likers ❤:</b>\n"
        counter = 1
        for e in sorted(lst, key=lambda x: x[0], reverse=True):
            msg += "{0}. {1} - {2}\n".format(counter, e[1], e[0])
            counter += 1

        update.message.reply_text(text=msg, parse_mode='HTML')

    except Exception as ex:
        print(ex)
        context.bot.send_message(chat_id=285564864, text=ex.__str__())


def droplikes(update: Update, context: CallbackContext):
    try:
        if update.message.from_user.id == 285564864:
            for entry in userTable:
                userTable.update({'like': 0}, where('id') == entry['id'])
    except Exception as ex:
        print(ex)


def test(update: Update, context: CallbackContext):
    save_links()


def likesweekly(update: Update, context: CallbackContext):
    try:

        if update.message.reply_to_message:
            user = update.message.reply_to_message.from_user
        else:
            user = update.effective_user
        checkUser = userTable.search(where('id') == user.id)
        if not checkUser:
            print("User not found in table.")
            userTable.insert({'id': user.id, 'photo': 0, 'link': 0, 'shill': 0, 'drop': 0, 'like': 0})

        lst = []
        chat = context.bot.get_chat(-1001653524921)
        for entry in weekTable:
            try:
                usr = chat.get_member(int((entry['id']))).user
                first_name = usr.first_name if usr.first_name is not None else ""
                last_name = usr.last_name if usr.last_name is not None else ""
                name = first_name + " " + last_name
                lst.append([entry['like'], name])
            except Exception as e:
                continue

        msg = "<b>Top weekly tweet likers ❤:</b>\n"
        counter = 1
        for e in sorted(lst, key=lambda x: x[0], reverse=True):
            msg += "{0}. {1} - {2}\n".format(counter, e[1], e[0])
            counter += 1
            if counter > 15:
                break

        update.message.reply_text(text=msg, parse_mode='HTML')

    except Exception as ex:
        print(ex)
        context.bot.send_message(chat_id=285564864, text=ex.__str__())


def weeklyphoto(update: Update, context: CallbackContext):
    if str(update.effective_chat.id) != "-392509601" and str(update.effective_chat.id) != "-1001653524921":
        return

    try:

        if update.message.reply_to_message:
            user = update.message.reply_to_message.from_user
        else:
            user = update.effective_user
        checkUser = userTable.search(where('id') == user.id)
        if not checkUser:
            print("User not found in table.")
            userTable.insert({'id': user.id, 'photo': 0, 'link': 0, 'shill': 0, 'drop': 0, 'like': 0})

        lst = []
        for entry in weekTable:
            try:
                usr = update.effective_chat.get_member(int((entry['id']))).user
                first_name = usr.first_name if usr.first_name is not None else ""
                last_name = usr.last_name if usr.last_name is not None else ""
                name = first_name + " " + last_name
                lst.append([entry['photo'], name])
            except Exception as e:
                continue
        msg = "<b>Top weekly photo-senders:</b>\n"
        counter = 1
        for e in sorted(lst, key=lambda x: x[0], reverse=True):
            msg += "{0}. {1} - {2}\n".format(counter, e[1], e[0])
            counter += 1
            if counter > 15:
                break

        update.message.reply_text(text=msg, parse_mode='HTML')

    except Exception as ex:
        print(ex)
        context.bot.send_message(chat_id=285564864, text=ex.__str__())


def weeklyshill(update: Update, context: CallbackContext):
    if str(update.effective_chat.id) != "-392509601" and str(update.effective_chat.id) != "-1001653524921":
        return

    try:

        if update.message.reply_to_message:
            user = update.message.reply_to_message.from_user
        else:
            user = update.effective_user
        checkUser = userTable.search(where('id') == user.id)
        if not checkUser:
            print("User not found in table.")
            userTable.insert({'id': user.id, 'photo': 0, 'link': 0, 'shill': 0, 'drop': 0, 'like': 0})

        lst = []
        for entry in weekTable:
            try:
                usr = update.effective_chat.get_member(int((entry['id']))).user
                first_name = usr.first_name if usr.first_name is not None else ""
                last_name = usr.last_name if usr.last_name is not None else ""
                name = first_name + " " + last_name
                lst.append([entry['shill'], name])
            except Exception as e:
                continue

        msg = "<b>Top weekly #shill users:</b>\n"
        counter = 1
        for e in sorted(lst, key=lambda x: x[0], reverse=True):
            msg += "{0}. {1} - {2}\n".format(counter, e[1], e[0])
            counter += 1
            if counter > 15:
                break

        update.message.reply_text(text=msg, parse_mode='HTML')

    except Exception as ex:
        print(ex)
        context.bot.send_message(chat_id=285564864, text=ex.__str__())


def weeklylink(update: Update, context: CallbackContext):
    if str(update.effective_chat.id) != "-392509601" and str(update.effective_chat.id) != "-1001653524921":
        return

    try:

        if update.message.reply_to_message:
            user = update.message.reply_to_message.from_user
        else:
            user = update.effective_user
        checkUser = userTable.search(where('id') == user.id)
        if not checkUser:
            print("User not found in table.")
            userTable.insert({'id': user.id, 'photo': 0, 'link': 0, 'shill': 0, 'drop': 0, 'like': 0})

        lst = []
        for entry in weekTable:
            try:
                usr = update.effective_chat.get_member(int((entry['id']))).user
                first_name = usr.first_name if usr.first_name is not None else ""
                last_name = usr.last_name if usr.last_name is not None else ""
                name = first_name + " " + last_name
                lst.append([entry['link'], name])
            except Exception as e:
                continue

        msg = "<b>Top weekly Twitter link senders:</b>\n"
        counter = 1
        for e in sorted(lst, key=lambda x: x[0], reverse=True):
            msg += "{0}. {1} - {2}\n".format(counter, e[1], e[0])
            counter += 1
            if counter > 15:
                break

        update.message.reply_text(text=msg, parse_mode='HTML')

    except Exception as ex:
        print(ex)


def weeklydrop(update: Update, context: CallbackContext):
    if str(update.effective_chat.id) != "-392509601" and str(update.effective_chat.id) != "-1001653524921":
        return

    try:

        if update.message.reply_to_message:
            user = update.message.reply_to_message.from_user
        else:
            user = update.effective_user
        checkUser = userTable.search(where('id') == user.id)
        if not checkUser:
            print("User not found in table.")
            userTable.insert({'id': user.id, 'photo': 0, 'link': 0, 'shill': 0, 'drop': 0, 'like': 0})

        lst = []
        for entry in weekTable:
            try:
                usr = update.effective_chat.get_member(int((entry['id']))).user
                first_name = usr.first_name if usr.first_name is not None else ""
                last_name = usr.last_name if usr.last_name is not None else ""
                name = first_name + " " + last_name
                lst.append([entry['drop'], name])
            except Exception as e:
                continue

        msg = "<b>Top #drop users:</b>\n"
        counter = 1
        for e in sorted(lst, key=lambda x: x[0], reverse=True):
            msg += "{0}. {1} - {2}\n".format(counter, e[1], e[0])
            counter += 1
            if counter > 15:
                break

        update.message.reply_text(text=msg, parse_mode='HTML')

    except Exception as ex:
        print(ex)


def likesweeklyfull(update: Update, context: CallbackContext):
    try:

        if update.message.reply_to_message:
            user = update.message.reply_to_message.from_user
        else:
            user = update.effective_user
        checkUser = userTable.search(where('id') == user.id)
        if not checkUser:
            print("User not found in table.")
            userTable.insert({'id': user.id, 'photo': 0, 'link': 0, 'shill': 0, 'drop': 0, 'like': 0})

        lst = []
        chat = context.bot.get_chat(-1001653524921)
        for entry in weekTable:
            try:
                usr = chat.get_member(int((entry['id']))).user
                first_name = usr.first_name if usr.first_name is not None else ""
                last_name = usr.last_name if usr.last_name is not None else ""
                name = first_name + " " + last_name
                lst.append([entry['like'], name])
            except Exception as e:
                continue

        msg = "<b>Top tweet likers ❤:</b>\n"
        counter = 1
        for e in sorted(lst, key=lambda x: x[0], reverse=True):
            msg += "{0}. {1} - {2}\n".format(counter, e[1], e[0])
            counter += 1

        update.message.reply_text(text=msg, parse_mode='HTML')

    except Exception as ex:
        print(ex)
        context.bot.send_message(chat_id=285564864, text=ex.__str__())


def showkarma(update: Update, context: CallbackContext):
    try:

        if update.message.reply_to_message:
            user = update.message.reply_to_message.from_user
        else:
            user = update.effective_user
        checkUser = userTable.search(where('id') == user.id)
        if not checkUser:
            print("User not found in table.")
            userTable.insert({'id': user.id, 'photo': 0, 'link': 0, 'shill': 0, 'drop': 0, 'like': 0})

        lst = []
        chat = context.bot.get_chat(-1001653524921)
        for entry in karmaTable:
            try:
                usr = chat.get_member(int((entry['user_id']))).user
                first_name = usr.first_name if usr.first_name is not None else ""
                last_name = usr.last_name if usr.last_name is not None else ""
                name = first_name + " " + last_name
                lst.append([entry['karma'], name])
            except Exception as e:
                continue

        msg = "<b>Top 15 karma users 😇:</b>\n"
        counter = 1
        for e in sorted(lst, key=lambda x: x[0], reverse=True):
            msg += "{0}. {1} - {2}\n".format(counter, e[1], e[0])
            counter += 1
            if counter > 15:
                break

        update.message.reply_text(text=msg, parse_mode='HTML')

    except Exception as ex:
        print(ex)
        context.bot.send_message(chat_id=285564864, text=ex.__str__())


def save_links():
    urls = []
    for entry in linkTable:
        urls.append('https://' + entry['link'])

    file_path = "/home/ubuntu/links.txt"

    existing_urls = set()
    if os.path.exists(file_path):
        with open(file_path, "r") as file:
            for line in file:
                existing_urls.add(line.strip())
        os.remove(file_path)

    urls_to_save = [url for url in urls if url not in existing_urls]

    existing_urls.difference_update(urls_to_save)

    with open(file_path, "w") as file:
        for url in existing_urls.union(urls_to_save):
            if "twitter.com" or "x.com" in url:
                file.write(f"{url}\n")


def main() -> None:
    """Initialise and start the bot."""
    try:

        # Create the Updater and pass it your bot's token.
        updater = Updater(BOT_TOKEN)

        # Get the dispatcher to register handlers
        dispatcher = updater.dispatcher

        # on different commands - answer in Telegram
        dispatcher.add_handler(CommandHandler("start", start))
        dispatcher.add_handler(CommandHandler("links", getlinks))
        dispatcher.add_handler(CommandHandler("stat", stat))
        dispatcher.add_handler(CommandHandler("dropusers", dropUsers))
        dispatcher.add_handler(CommandHandler("photos", allphoto))
        dispatcher.add_handler(CommandHandler("shills", allshill))
        # dispatcher.add_handler(CommandHandler("tweetlinks", alllink))
        # dispatcher.add_handler(CommandHandler("drops", alldrop))
        # dispatcher.add_handler(CommandHandler("likes", alllikes))
        # dispatcher.add_handler(CommandHandler("likesfull", likesfull))
        # dispatcher.add_handler(CommandHandler("weeklylikes", likesweekly))
        # dispatcher.add_handler(CommandHandler("weeklylikesfull", likesweeklyfull))
        # dispatcher.add_handler(CommandHandler("weeklyphotos", weeklyphoto))
        # dispatcher.add_handler(CommandHandler("weeklyshills", weeklyshill))
        # dispatcher.add_handler(CommandHandler("weeklylinks", weeklylink))
        # dispatcher.add_handler(CommandHandler("weeklydrops", weeklydrop))
        # dispatcher.add_handler(CommandHandler("droptweets", dropTweets))
        # dispatcher.add_handler(CommandHandler("dropweekly", dropWeekly))
        # dispatcher.add_handler(CommandHandler("testtweets", testTweets))
        # dispatcher.add_handler(CommandHandler("droplikes", droplikes))
        # dispatcher.add_handler(CommandHandler("karma", showkarma))
        dispatcher.add_handler(CommandHandler("test", test))

        dispatcher.add_handler(MessageHandler(Filters.text & ~Filters.command, processTextMessage))

        dispatcher.add_handler(MessageHandler(Filters.photo, processPhotoMessage))

        dispatcher.add_handler(MessageHandler(Filters.animation or Filters.document, processDocMessage))

        scheduler = BackgroundScheduler(timezone="Europe/Kiev")
        scheduler.add_job(refreshLinks, 'interval', hours=1)
        scheduler.add_job(save_links, 'interval', days=1)

        # scheduler.add_job(refreshDaily, 'interval', days=1, minutes=7)
        # scheduler.add_job(refreshTweets, 'interval', minutes=30)
        scheduler.start()

        # Start the Bot
        updater.start_polling()

        # Run the bot until you press Ctrl-C or the process receives SIGINT,
        # SIGTERM or SIGABRT. This should be used most of the time, since
        # start_polling() is non-blocking and will stop the bot gracefully.
        updater.idle()
    except Exception as ex:
        print(ex)


if __name__ == '__main__':
    main()
