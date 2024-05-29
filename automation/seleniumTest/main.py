"""
Project : Twitter Login
Author : Ajeet
Date : August 7, 2023
"""
import os
import random
import time
import pickle
import paramiko as paramiko
from selenium import webdriver
from selenium.webdriver import ChromeOptions, Keys, ActionChains
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.wait import WebDriverWait


hostname = '51.83.134.135'
username = 'ubuntu'
password = 'CrgDvYq9WQwp'
file_path = '/home/ubuntu/links.txt'


client = paramiko.SSHClient()


client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
file_contents = []
strings = []
def login_twitter(username: str, password: str) -> None:
    """
    Log in to Twitter using the provided username and password.

    This function automates the login process on Twitter using Selenium WebDriver.
    It opens the Twitter login page, enters the provided username and password, and submits the form.

    Parameters:
    username (str): The Twitter username to log in with.
    password (str): The Twitter password for the specified username.

    Returns:
    None
    """

    user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.5735.289 Safari/537.36"

    options = ChromeOptions()
    options.add_argument("--start-maximized")
    options.add_argument(f"user-agent={user_agent}")
    options.add_experimental_option("excludeSwitches", ["enable-automation"])
    driver = webdriver.Chrome(options=options)



    # Open the Twitter login page
    url = "https://twitter.com/i/flow/login"
    driver.get(url)

    if os.path.exists("cookies.pkl"):
        cookies = pickle.load(open("cookies.pkl", "rb"))
        for cookie in cookies:
            driver.add_cookie(cookie)

    # Find and input the username
    username_input = WebDriverWait(driver, 20).until(
        EC.visibility_of_element_located((By.CSS_SELECTOR, 'input[autocomplete="username"]')))
    username_input.send_keys(username)
    username_input.send_keys(Keys.ENTER)

    # Find and input the password
    password_input = WebDriverWait(driver, 10).until(
        EC.visibility_of_element_located((By.CSS_SELECTOR, 'input[name="password"]')));
    password_input.send_keys(password)
    password_input.send_keys(Keys.ENTER)

    # Wait for a short period (e.g., 10 seconds) to ensure the login process completes
    time.sleep(random.randint(5, 9))

    if not os.path.exists("cookies.pkl"):
        pickle.dump(driver.get_cookies(), open("cookies.pkl", "wb"))

    time.sleep(random.randint(4, 8))
    for link in strings:
        try:
            print(link)
            driver.get(link)

            time.sleep(random.randint(5, 9))

            driver.find_element(By.CSS_SELECTOR, 'div[data-testid="like"]').click()

            time.sleep(random.randint(8, 13))
        except:
            time.sleep(random.randint(3, 7))


if __name__ == "__main__":

    your_username = "ururu_art"
    your_password = "Ururu_0084"

    # Create SSH client
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

    # Connect to the remote server
    client.connect(hostname=hostname, username=username, password=password, port=22)

    # Open SSH session
    ssh = client.get_transport().open_session()

    # Read file into a list line-by-line
    command = f"cat {file_path}"
    ssh.exec_command(command)
    file_contents = ssh.recv(1024).decode().rstrip()

    current_string = ""

    for char in file_contents:
        if char == "\n":
            strings.append(current_string)
            current_string = ""
        else:
            current_string += char

    if current_string:
        strings.append(current_string)

    # Delete the file

    # command = f"rm {file_path}"
    # ssh.exec_command(command)


    # Close SSH session
    ssh.close()

    # Close SSH connection
    client.close()



    # Call the login_twitter function with your Twitter credentials
    login_twitter(your_username, your_password)
