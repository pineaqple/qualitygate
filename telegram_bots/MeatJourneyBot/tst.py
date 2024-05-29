import tweepy
import os

# read keys from .env
api_key = "P5wlHk7eh5Vwq6RhBMKBdVB0d"
api_secret = "sr8EDjS5mDgmqLLa6PNJpWF4fNiSa0j8eo8rI14xnYAHYJMf90"

# prepare OAuthHandler
auth = tweepy.OAuth1UserHandler(api_key, api_secret)
print(auth.get_authorization_url())

# Enter that PIN to continue
verifier = input("PIN (oauth_verifier= parameter): ")

# Complete authenthication
auth.get_access_token(verifier)

# store these tokens in .env file:
print(f"access-token={auth.access_token}")
print(f"access-token-secret={auth.access_token_secret}")