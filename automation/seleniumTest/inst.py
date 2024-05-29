import json
from pathlib import Path

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import time

# Replace these with your actual Instagram credentials
USERNAME = 'pointless.streetpics'
PASSWORD = 'Inst_0084'

# Initialize the WebDriver
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))


def login(username, password):

    driver.get('https://www.instagram.com/accounts/login/')
    if Path('cookies.json').exists():
        for cookie in json.loads(Path('cookies.json').read_text()):
            driver.add_cookie(cookie)
    time.sleep(7)

    # Enter the username and password
    username_input = driver.find_element(By.NAME, 'username')
    password_input = driver.find_element(By.NAME, 'password')

    username_input.send_keys(username)
    password_input.send_keys(password)
    password_input.send_keys(Keys.RETURN)
    time.sleep(20)

    Path('cookies.json').write_text(
                json.dumps(driver.get_cookies(), indent=2)
            )




def scroll_followers():
    driver.get(f'https://www.instagram.com/{USERNAME}/followers/')
    time.sleep(10)

    followers_popup = driver.find_element(By.XPATH, "//div[@role='dialog']//ul")
    last_height = driver.execute_script("return arguments[0].scrollHeight", followers_popup)

    while True:
        driver.execute_script('arguments[0].scrollTop = arguments[0].scrollHeight', followers_popup)
        time.sleep(5)
        new_height = driver.execute_script("return arguments[0].scrollHeight", followers_popup)
        if new_height == last_height:
            break
        last_height = new_height


def add_to_best_friends():
    followers = driver.find_elements(By.XPATH, "//div[@role='dialog']//ul//li")

    for follower in followers:
        ActionChains(driver).move_to_element(follower).perform()
        follower.click()
        time.sleep(5)

        # Assuming there's an option to add to Best Friends in the user profile popup
        # This part is hypothetical as the exact implementation will vary
        best_friends_button = driver.find_element(By.XPATH, "//button[text()='Add to Best Friends']")
        best_friends_button.click()
        time.sleep(5)

        # Close the profile popup
        close_button = driver.find_element(By.XPATH, "//button[text()='Close']")
        close_button.click()
        time.sleep(5)


try:
    login(USERNAME, PASSWORD)
    scroll_followers()
    add_to_best_friends()
finally:
    driver.quit()
