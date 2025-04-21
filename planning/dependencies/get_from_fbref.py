from selenium import webdriver
import requests
from bs4 import BeautifulSoup
from pandas import DataFrame

from selenium_to_beautifulsoup import selenium_to_beautifulsoup, selenium_to_beautifulsoup2
from parse_rows import parse_row_by_element, parse_row_by_element_class, parse_row_by_element_style, parse_nations


#TODO: stash varaibles elsewhere
# febRef_cur_url='https://fbref.com/en/comps/22/misc/Major-League-Soccer-Stats#all_stats_misc'

febRef_2024_url='https://fbref.com/en/comps/22/2024/misc/2024-Major-League-Soccer-Stats'

def get_fbref_mls_player_misc_stats(url=febRef_2024_url):
    print("Hello World from get_fbref_mls_player_misc_stats()")
    
    # Pass page source from Selenium to BeautifulSoup
    soup = selenium_to_beautifulsoup(url)
    
    stats_misc_table = soup.find('table', id='stats_misc')
    # print(stats_misc_table.prettify())

    stats_misc_table_rows = stats_misc_table.find_all('tr')
    # print("stats_misc_table_rows", stats_misc_table_rows)
    
    list_of_parsed_rows = [parse_row_by_element(row, element='td') for row in stats_misc_table_rows[2:]]
    # print(stats_misc_table_rows[0])   # 1st row is fbRef formatting
    # print(stats_misc_table_rows[1])   # 2nd row is column headers
    # print(stats_misc_table_rows[2])   # actual data example
    # print(list_of_parsed_rows)
    
    misc_stats_df = DataFrame(list_of_parsed_rows)
    # print(misc_stats_df.head(), "\n#####\n", misc_stats_df.tail())
    
    # Remove Nation (all None), Match Report and empty final column
    misc_stats_df = misc_stats_df.drop([1, 22, 23], axis=1)
    # Remove fbRef's all 'None' row (every 25 rows)
    misc_stats_df.dropna(how='all', inplace=True)
    
    # Nationality not captured because it is stored in a nested <span> and the parsed rows above (used to create the DataFrame) captured <td> elements.
    list_of_parsed_nations = parse_nations(stats_misc_table)
    misc_stats_df.insert(loc=1, column="nation", value=list_of_parsed_nations)    
    
    # Parse table column headers for df
    list_of_parsed_column_headers = parse_row_by_element(stats_misc_table_rows[1], element='th')
    # ['Rk', 'Player', 'Nation', 'Pos', 'Squad', 'Age', 'Born', '90s', 'CrdY', 'CrdR', '2CrdY', 'Fls', 'Fld', 'Off', 'Crs', 'Int', 'TklW', 'PKwon', 'PKcon', 'OG', 'Recov', 'Won', 'Lost', 'Won%', 'Matches']
    list_of_parsed_column_headers.remove('Rk')
    list_of_parsed_column_headers.remove('Won%')
    list_of_parsed_column_headers.remove('Matches')
    list_of_parsed_column_headers = [ch.lower() for ch in list_of_parsed_column_headers]
    misc_stats_df.columns = list_of_parsed_column_headers
    
    ##########  ##########  ##########
    # print(misc_stats_df.head(), "\n#####\n", misc_stats_df.tail())
    # print(team_fixtures_df)
    ##########  ##########  ##########
    
    return misc_stats_df


if __name__ == "__main__":
    get_fbref_mls_player_misc_stats()