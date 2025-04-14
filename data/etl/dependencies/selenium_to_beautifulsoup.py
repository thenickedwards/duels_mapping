from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
# from selenium.webdriver.common.by import By
# from selenium.webdriver.support.ui import WebDriverWait
# from selenium.webdriver.support import expected_conditions as EC

'''
BeautifulSoup doesn't handle JavaScript, so Selenium is used to simulate a browser environment (headless) to load the page fully, including any dynamically loaded content. Rendered HTML can be passed to BeautifulSoup for parsing.
'''

def selenium_to_beautifulsoup(url):
    browser = webdriver.Chrome()
    browser.get(url)
    
    # TODO: 
    # Wait for the table to be present before fetching page source
    # try:
    #     WebDriverWait(browser, 10).until(
    #         EC.presence_of_element_located((By.ID, "stats_misc"))
    #     )
    # except:
    #     print("Error: Table with ID 'stats_misc' not found!")
    
    # Get the page source after JS executed
    html = browser.page_source
    # print(html)
    soup = BeautifulSoup(html, 'html.parser')
    # print(soup.prettify()[:1000])
    browser.quit()
    
    return soup

def selenium_to_beautifulsoup2(url):
    browser = webdriver.Chrome()
    browser.get(url)
    
    # Get the page source after JS executed
    html = browser.page_source
    # print(html)
    soup = BeautifulSoup(html, 'lxml')
    # print(soup.prettify()[:1000])
    browser.quit()
    
    return soup

# TODO: 
def selenium_to_BS_headless(url):
    # Chrome options to run headless
    # chrome_options = ChromeOptions()
    chrome_options = webdriver.ChromeOptions()
    chrome_options.add_argument("--headless=new")  # Run in headless mode (no GUI)
    # chrome_options.add_argument("--disable-gpu")  # Recommended for headless mode on some systems
    # chrome_options.add_argument("--window-size=1920x1080")  # Set a fixed window size (optional)
    # chrome_options.add_argument("--no-sandbox")  # Helps avoid certain issues (especially in Linux)
    # chrome_options.add_argument("--disable-dev-shm-usage")  # Prevents resource exhaustion issues
    
    browser = webdriver.Chrome(options=chrome_options)
    browser.get(url)
    
    # Wait for the table to be present before fetching page source
    # try:
    #     WebDriverWait(browser, 10).until(
    #         EC.presence_of_element_located((By.ID, "stats_misc"))
    #     )
    # except:
    #     print("Error: Table with ID 'stats_misc' not found!")
    
    # Get the page source after JS executed
    html = browser.page_source
    print(html)
    soup = BeautifulSoup(html, 'html.parser')
    
    browser.quit()
    
    return soup
