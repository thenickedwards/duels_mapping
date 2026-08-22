import requests
from bs4 import BeautifulSoup
import pandas as pd

url = 'https://fbref.com/en/comps/22/2025/misc/2025-Major-League-Soccer-Stats'

response = requests.get(url)
    
html_uncommented = response.text.replace('', '')
    
soup = BeautifulSoup(html_uncommented, 'html.parser')

output_html = soup.prettify()

with open("planning/output_page.html", "w", encoding='utf-8') as file:
    file.write(output_html)


# stats_misc_table = soup.find('table', {'id': 'stats_misc'}) 
    
# stats_misc_table_rows = stats_misc_table.find_all('tr')