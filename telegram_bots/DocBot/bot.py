import logging
from aiogram import Bot, Dispatcher, executor, types
from aiogram.dispatcher import FSMContext
from aiogram.dispatcher.filters.state import State, StatesGroup
from aiogram.contrib.fsm_storage.memory import MemoryStorage
from db import BotDB

import random

bot = Bot(token="6177033505:AAFtO5vVOwrLFcZJgUT42KvpIeTCeXjW_gg")
dp = Dispatcher(bot, storage=MemoryStorage())
logging.basicConfig(level=logging.INFO)

BotDB = BotDB('database.db')

## 10м от дома, для родного района https://zelenka.guru/members/2782353/

menu_main_text = '1. Дивитись анкети\n2. Моя анкета\n3. Видалити анкету'
my_anketa_text = '1. Заповнити знову\n2. Змінити текст анкети\n3. Змінити фото\n4. Повернутись назад'


def show_anketa(name, age, city, text):
    return f'{name}\n{age}\n{city}\n{text}'


def get_random_anketa(list_of_anketi):
    anketa = list_of_anketi[random.randint(0, len(list_of_anketi) - 1)]
    a = anketa
    return [show_anketa(a[2], a[3], a[4], a[5]), BotDB.get_photo_id(a[1])]


class Wait(StatesGroup):
    choosing_gender = State()
    choosing_interest = State()
    name = State()
    age = State()
    city = State()
    text = State()
    photo = State()
    menu_answer = State()
    my_anketa_answer = State()
    change_text = State()
    change_photo = State()
    delete_confirm = State()
    anketa_reaction = State()


@dp.message_handler(commands="start", state="*")
async def anketa_start(message: types.Message):
    if (not BotDB.user_exists(message.from_user.id)):
        BotDB.add_user(message.from_user.id)

    if (BotDB.anketa_exists(message.from_user.id)):

        anketa = BotDB.get_anketa(message.from_user.id)
        a = anketa[0]
        caption = show_anketa(a[2], a[3], a[4], a[5])
        await bot.send_photo(photo=open(f"photos/{message.from_user.id}.jpg", "rb"), chat_id=message.from_user.id,
                             caption=caption)

        keyboard = types.ReplyKeyboardMarkup(resize_keyboard=True)
        buttons = ["1", "2", "3"]
        keyboard.add(*buttons)

        await message.answer(menu_main_text, reply_markup=keyboard)
        await Wait.menu_answer.set()

    else:

        keyboard = types.ReplyKeyboardMarkup(resize_keyboard=True)
        buttons = ["Хлопець", "Дівчина"]
        keyboard.add(*buttons)

        await message.answer("Заповнимо анкету!\nДля початку вибери свою стать",
                             reply_markup=keyboard)
        await Wait.choosing_gender.set()


@dp.message_handler(state=Wait.choosing_gender)
async def choose_gender(message: types.Message, state: FSMContext):
    if message.text not in ["Хлопець", "Дівчина"]:
        await message.answer("Вибери що робимо далі:")
        return
    await state.update_data(gender=message.text.lower())

    keyboard = types.ReplyKeyboardMarkup(resize_keyboard=True)
    buttons = ["Хлопці", "Дівчата"]
    keyboard.add(*buttons)
    await message.answer("Хто тебе цікавить? (окрім бограча)", reply_markup=keyboard)
    await Wait.choosing_interest.set()


@dp.message_handler(state=Wait.choosing_interest)
async def choose_interest(message: types.Message, state: FSMContext):
    if message.text == "Хлопці" or message.text == "Дівчата":
        await state.update_data(interest=message.text.lower())
        await message.answer("Напишии своє ім'я", reply_markup=types.ReplyKeyboardRemove())
        await Wait.name.set()
    else:
        await message.answer("Вибери кнопку")
        return


@dp.message_handler(state=Wait.name)
async def name(message: types.Message, state: FSMContext):
    if len(message.text) > 30:
        await message.answer("Надто довге ім'я(")
        return
    await state.update_data(name=message.text)
    await message.answer("Скільки вам років?")
    await Wait.age.set()


@dp.message_handler(state=Wait.age)
async def age(message: types.Message, state: FSMContext):
    try:
        if 10 > int(message.text) or int(message.text) > 100:
            await message.answer("Тобі не стільки(")
            return
    except(TypeError, ValueError):
        await message.answer("Тобі не стільки(")
        return
    await state.update_data(age=message.text)
    await message.answer("Напиши свій район")
    await Wait.city.set()


@dp.message_handler(state=Wait.city)
async def city(message: types.Message, state: FSMContext):
    if len(message.text) > 30:
        await message.answer("Не  бреши.")
        return

    await state.update_data(city=message.text)

    keyboard = types.ReplyKeyboardMarkup(resize_keyboard=True)
    keyboard.add("Залишити пустим")

    await message.answer("Напиши щось про себе (лише не про радванку)",
                         reply_markup=keyboard)
    await Wait.text.set()


@dp.message_handler(state=Wait.text)
async def text(message: types.Message, state: FSMContext):
    if message.text == "Залишити пустим":
        await state.update_data(text='')
    else:
        if len(message.text) > 200:
            await message.answer("До 200 символів!")
            return
        await state.update_data(text=message.text)

    await message.answer("Завантажити своє фото", reply_markup=types.ReplyKeyboardRemove())
    await Wait.photo.set()


@dp.message_handler(state=Wait.photo, content_types=["photo"])
async def download_photo(message: types.Message, state: FSMContext):
    await message.photo[-1].download(destination_file=f"photos/{message.from_user.id}.jpg")

    data = await state.get_data()
    d = list(data.values())
    print(d)

    BotDB.add_anketa(message.from_user.id, d[0], d[1], d[2], d[3], d[4], d[5])
    caption = show_anketa(d[2], d[3], d[4], d[5])
    await message.answer("Вот ваша анкета: ")
    await bot.send_photo(photo=open(f"photos/{message.from_user.id}.jpg", "rb"), caption=caption,
                         chat_id=message.from_user.id)

    keyboard = types.ReplyKeyboardMarkup(resize_keyboard=True)
    buttons = ["1", "2", "3"]
    keyboard.add(*buttons)

    await message.answer(menu_main_text, reply_markup=keyboard)
    await Wait.menu_answer.set()


@dp.message_handler(state=Wait.menu_answer)
async def menu_answer(message: types.Message, state: FSMContext):
    if message.text == "1":
        anketa = BotDB.get_anketa(message.from_user.id)
        a = anketa[0]
        caption = show_anketa(a[2], a[3], a[4], a[5])

        list_of_anketi = BotDB.find_anketi(message.from_user.id, a[7], a[4], a[3])

        try:
            get_random_anketa(list_of_anketi)
        except ValueError:
            await message.answer(
                "Нікого не знайшов\nМожливо ваш район спить / не правильний")

            await bot.send_photo(photo=open(f"photos/{message.from_user.id}.jpg", "rb"), caption=caption,
                                 chat_id=message.from_user.id)

            keyboard = types.ReplyKeyboardMarkup(resize_keyboard=True)
            buttons = ["1", "2", "3", "4"]
            keyboard.add(*buttons)

            await message.answer(my_anketa_text, reply_markup=keyboard)
            await Wait.my_anketa_answer.set()

        keyboard = types.ReplyKeyboardMarkup(resize_keyboard=True)
        buttons = ["Лайк", "Скіп", "Повернутись"]
        keyboard.add(*buttons)

        anketa = get_random_anketa(list_of_anketi)

        caption = anketa[0]
        photo_id = anketa[1]

        await state.update_data(liked_id=photo_id)

        await bot.send_photo(photo=open(f"photos/{photo_id}.jpg", "rb"), caption=caption, chat_id=message.from_user.id,
                             reply_markup=keyboard)

        await Wait.anketa_reaction.set()

    elif message.text == "2":

        """ Show form (anketa) in 4 strings """

        anketa = BotDB.get_anketa(message.from_user.id)
        a = anketa[0]
        caption = show_anketa(a[2], a[3], a[4], a[5])

        await bot.send_photo(photo=open(f"photos/{message.from_user.id}.jpg", "rb"), caption=caption,
                             chat_id=message.from_user.id)

        keyboard = types.ReplyKeyboardMarkup(resize_keyboard=True)
        buttons = ["1", "2", "3", "4"]
        keyboard.add(*buttons)

        await message.answer(my_anketa_text, reply_markup=keyboard)
        await Wait.my_anketa_answer.set()

    elif message.text == "3":
        keyboard = types.ReplyKeyboardMarkup(resize_keyboard=True)
        buttons = ["Да", "Ні"]
        keyboard.add(*buttons)
        await message.answer("Точно видаляти?", reply_markup=keyboard)
        await Wait.delete_confirm.set()

    else:
        await message.answer("Вибери кнопку")
        return


@dp.message_handler(state=Wait.anketa_reaction)
async def anketa_reaction(message: types.Message, state: FSMContext):
    if message.text == "Лайк":

        data = await state.get_data()

        d = list(data.values())

        anketa = BotDB.get_anketa(message.from_user.id)
        a = anketa[0]

        caption = show_anketa(a[2], a[3], a[4], a[5])

        list_of_anketi = BotDB.find_anketi(message.from_user.id, a[7], a[4], a[3])

        liked_id = data["liked_id"]
        print(liked_id)

        # Initialize the dictionary to store user's liked profiles
        if "liked_profiles" not in data:
            data["liked_profiles"] = {}

        # Check if the user has not liked this profile before
        if liked_id not in data["liked_profiles"].get(message.from_user.id, []):
            await bot.send_message(text=f"Ви сподобались цій людині:", chat_id=liked_id)
            await bot.send_photo(photo=open(f"photos/{message.from_user.id}.jpg", "rb"), chat_id=liked_id,
                                 caption=caption)
            await bot.send_message(text=f"Починай спілкуватись - @{message.from_user.username}",
                                   chat_id=liked_id)
            # Add liked_id to the user's liked profiles
            if message.from_user.id in data["liked_profiles"]:
                data["liked_profiles"][message.from_user.id].append(liked_id)
            else:
                data["liked_profiles"][message.from_user.id] = [liked_id]
            await state.set_data(data)

        keyboard = types.ReplyKeyboardMarkup(resize_keyboard=True)
        buttons = ["Лайк", "Скіп", "Повернутись"]
        keyboard.add(*buttons)

        anketa = get_random_anketa(list_of_anketi)
        caption = anketa[0]
        photo_id = anketa[1]
        await state.update_data(liked_id=photo_id)
        await bot.send_photo(photo=open(f"photos/{photo_id}.jpg", "rb"), caption=caption, chat_id=message.from_user.id)
        await Wait.anketa_reaction.set()

@dp.message_handler(state=Wait.delete_confirm)
async def delete_confirm(message: types.Message, state: FSMContext):
    if message.text == "Да":
        BotDB.delete_anketa(message.from_user.id)
        BotDB.delete_user(message.from_user.id)
        await message.answer("Ваша анкета видалена!\nБудемо чекати на ваше повернення. /start",
                             reply_markup=types.ReplyKeyboardRemove())
    elif message.text == "Ні":
        anketa = BotDB.get_anketa(message.from_user.id)
        a = anketa[0]
        caption = show_anketa(a[2], a[3], a[4], a[5])

        await bot.send_photo(photo=open(f"photos/{message.from_user.id}.jpg", "rb"), caption=caption,
                             chat_id=message.from_user.id)

        keyboard = types.ReplyKeyboardMarkup(resize_keyboard=True)
        buttons = ["1", "2", "3", "4"]
        keyboard.add(*buttons)

        await message.answer(my_anketa_text, reply_markup=keyboard)
        await Wait.my_anketa_answer.set()
    else:
        await message.answer("Вибери кнопку")
        return


@dp.message_handler(state=Wait.my_anketa_answer)
async def my_anketa_answer(message: types.Message, state: FSMContext):
    if message.text == "1":
        BotDB.delete_anketa(message.from_user.id)

        keyboard = types.ReplyKeyboardMarkup(resize_keyboard=True)
        buttons = ["Хлопець", "Дівчина"]
        keyboard.add(*buttons)

        await message.answer("Для початку вибери свою стать",
                             reply_markup=keyboard)
        await Wait.choosing_gender.set()
    # Enter new text
    elif message.text == "2":
        keyboard = types.ReplyKeyboardMarkup(resize_keyboard=True)
        keyboard.add("Залишити пустим")
        await message.answer("Пиши новий текст", reply_markup=keyboard)
        await Wait.change_text.set()

    elif message.text == "3":
        await message.answer("Завантажте нове фото", reply_markup=types.ReplyKeyboardRemove())
        await Wait.change_photo.set()

    elif message.text == "4":
        anketa = BotDB.get_anketa(message.from_user.id)
        a = anketa[0]
        caption = show_anketa(a[2], a[3], a[4], a[5])

        await bot.send_photo(photo=open(f"photos/{message.from_user.id}.jpg", "rb"), caption=caption,
                             chat_id=message.from_user.id)
        keyboard = types.ReplyKeyboardMarkup(resize_keyboard=True)
        buttons = ["1", "2", "3"]
        keyboard.add(*buttons)

        await message.answer(menu_main_text, reply_markup=keyboard)
        await Wait.menu_answer.set()
    else:
        await message.answer("Вибери кнопку")
        return


@dp.message_handler(state=Wait.change_text)
async def change_text(message: types.Message, state: FSMContext):
    if message.text == "Залишити пустим":
        BotDB.update_text(message.from_user.id, '')

        anketa = BotDB.get_anketa(message.from_user.id)
        a = anketa[0]
        caption = show_anketa(a[2], a[3], a[4], a[5])

        await bot.send_photo(photo=open(f"photos/{message.from_user.id}.jpg", "rb"), caption=caption,
                             chat_id=message.from_user.id)

        keyboard = types.ReplyKeyboardMarkup(resize_keyboard=True)
        buttons = ["1", "2", "3", "4"]
        keyboard.add(*buttons)

        await message.answer(my_anketa_text, reply_markup=keyboard)
        await Wait.my_anketa_answer.set()
    else:
        if len(message.text) > 200:
            await message.answer("До 200 символів!")
            return
        BotDB.update_text(message.from_user.id, message.text)

        anketa = BotDB.get_anketa(message.from_user.id)
        a = anketa[0]
        caption = show_anketa(a[2], a[3], a[4], a[5])

        await bot.send_photo(photo=open(f"photos/{message.from_user.id}.jpg", "rb"), caption=caption,
                             chat_id=message.from_user.id)

        keyboard = types.ReplyKeyboardMarkup(resize_keyboard=True)
        buttons = ["1", "2", "3"]
        keyboard.add(*buttons)

        await message.answer(menu_main_text, reply_markup=keyboard)
        await Wait.menu_answer.set()


@dp.message_handler(state=Wait.change_photo, content_types=["photo"])
async def change_photo(message: types.Message, state: FSMContext):
    await message.photo[-1].download(destination_file=f"photos/{message.from_user.id}.jpg")

    anketa = BotDB.get_anketa(message.from_user.id)
    a = anketa[0]
    caption = show_anketa(a[2], a[3], a[4], a[5])

    await message.answer("Вот ваша анкета: ")
    await bot.send_photo(photo=open(f"photos/{message.from_user.id}.jpg", "rb"), caption=caption,
                         chat_id=message.from_user.id)

    keyboard = types.ReplyKeyboardMarkup(resize_keyboard=True)
    buttons = ["1", "2", "3"]
    keyboard.add(*buttons)

    await message.answer(menu_main_text, reply_markup=keyboard)
    await Wait.menu_answer.set()


if __name__ == "__main__":
    executor.start_polling(dp, skip_updates=True)