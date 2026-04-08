from bs4 import BeautifulSoup
from urllib.request import urlopen

'''
BeautifulSoup wasn't able to read the table with id='stats_misc', however urllib is able simulate a headless browser environment and load the page fully. Rendered HTML can be passed to BeautifulSoup for parsing.
'''

def urllib_to_beautifulsoup(url):
    with urlopen(url) as response:
        print(response.status)
        html = response.read()
    # print(html)

    soup = BeautifulSoup(html, 'html.parser')
    # print(soup)
    stats_misc_table = soup.find('table', id='stats_misc')
    print(stats_misc_table)
    return stats_misc_table
    # table = soup.find('table', id='stats_misc')
    # return table

# Test
url = "https://FBref.com/en/comps/22/misc/Major-League-Soccer-Stats"
soup = urllib_to_beautifulsoup(url)
# print(soup.prettify()[:1000])  # Just print first 1000 characters




