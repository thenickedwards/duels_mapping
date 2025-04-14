import os
from selenium import webdriver
from bs4 import BeautifulSoup
import chromedriver_mac_x64

### https://chatgpt.com/c/6713ff22-8d28-8000-8124-b0c90835a6bc 

browser = webdriver.Chrome()
browser.get('https://FBref.com/en/comps/22/misc/Major-League-Soccer-Stats#all_stats_misc')


# Get the page source after JavaScript has been executed
html = browser.page_source

# Pass the page source to BeautifulSoup
soup = BeautifulSoup(html, 'html.parser')

# Find the specific table with id 'stats_misc'
stats_misc_table = soup.find('table', id='stats_misc')

# Print or process the table
print(stats_misc_table.prettify())

# Don't forget to close the browser window
browser.quit()


# # Initialize WebDriver (make sure to provide relative path to the chromedriver executable)
# # driver = webdriver.Chrome(executable_path='/path/to/chromedriver')
# # chromedriver_path = os.path.join(os.pardir, 'chromedriver_mac_x64', 'chromedriver')
# # print("Hey there!", chromedriver_path)

# # Initialize the WebDriver using the relative path
# driver = webdriver.Chrome(executable_path='/chromedriver_mac_x64/chromedriver')

# # Open the page in a browser
# driver.get('https://FBref.com/en/comps/22/misc/Major-League-Soccer-Stats#all_stats_misc')

# # Get the page source after JavaScript has been executed
# html = driver.page_source

# # Pass the page source to BeautifulSoup
# soup = BeautifulSoup(html, 'html.parser')

# # Find the specific table with id 'stats_misc'
# stats_misc_table = soup.find('table', id='stats_misc')

# # Print or process the table
# print(stats_misc_table.prettify())

# # Don't forget to close the browser window
# driver.quit()
