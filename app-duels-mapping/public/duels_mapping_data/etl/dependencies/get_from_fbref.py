from pandas import DataFrame, option_context

from dependencies.selenium_to_beautifulsoup import selenium_to_beautifulsoup, selenium_to_beautifulsoup2
from dependencies.parse_rows import parse_row_by_element, parse_nations

def get_FBref_mls_player_misc_stats(year, url='https://FBref.com/en/comps/22/misc/Major-League-Soccer-Stats', verbose=1):
    '''
    This function accepts a URL from FBref's Major League Soccer Miscellaneous Stats page,
    parses the Player Miscellaneous Stats table, and
    return returns a DataFrame represenation with string (or None) values.
    '''
    if verbose>=2: print("Hello World from get_FBref_mls_player_misc_stats()")
    if verbose>=1: print(f"Sourcing stats from {url}")
    
    # Pass page source from Selenium to BeautifulSoup
    soup = selenium_to_beautifulsoup(url)
    
    stats_misc_table = soup.find('table', id='stats_misc')
    if verbose>=2: print('Found stats_misc_table: \n', stats_misc_table.prettify())

    stats_misc_table_rows = stats_misc_table.find_all('tr')
    # print("stats_misc_table_rows", stats_misc_table_rows)
    
    list_of_parsed_rows = [parse_row_by_element(row, element='td') for row in stats_misc_table_rows[2:]]
    # print(stats_misc_table_rows[0])   # 1st row is FBref formatting
    # print(stats_misc_table_rows[1])   # 2nd row is column headers
    # print(stats_misc_table_rows[2])   # actual data example
    # print(list_of_parsed_rows)
    
    misc_stats_df = DataFrame(list_of_parsed_rows)
    # print(misc_stats_df.head(), "\n#####\n", misc_stats_df.tail())
    
    # Remove Nation (all None due to nesting), Match Report and empty final column
    misc_stats_df = misc_stats_df.drop([1, 22, 23], axis=1)
    # Remove FBref's all None row (every 25 rows)
    misc_stats_df.dropna(how='all', inplace=True)
    
    # Nationality not captured because it is stored in a nested <span> and the parsed rows above (used to create the DataFrame) captured <td> elements.
    list_of_parsed_nations = parse_nations(stats_misc_table)
    misc_stats_df.insert(loc=1, column='nation', value=list_of_parsed_nations)    
    
    # Parse table column headers for df
    list_of_parsed_column_headers = parse_row_by_element(stats_misc_table_rows[1], element='th')
    # ['Rk', 'Player', 'Nation', 'Pos', 'Squad', 'Age', 'Born', '90s', 'CrdY', 'CrdR', '2CrdY', 'Fls', 'Fld', 'Off', 'Crs', 'Int', 'TklW', 'PKwon', 'PKcon', 'OG', 'Recov', 'Won', 'Lost', 'Won%', 'Matches']
    list_of_parsed_column_headers.remove('Rk')
    list_of_parsed_column_headers.remove('Won%')
    list_of_parsed_column_headers.remove('Matches')
    list_of_parsed_column_headers = [ch.lower() for ch in list_of_parsed_column_headers]
    # print('list_of_parsed_column_headers: \n', list_of_parsed_column_headers)
    # ['player', 'nation', 'pos', 'squad', 'age', 'born', '90s', 'crdy', 'crdr', '2crdy', 'fls', 'fld', 'off', 'crs', 'int', 'tklw', 'pkwon', 'pkcon', 'og', 'recov', 'won', 'lost']
    misc_stats_df.columns = list_of_parsed_column_headers
    misc_stats_df.insert(0, 'season', year)
    misc_stats_df['age'] = misc_stats_df['age'].str.extract(r'^(\d+)', expand=False).astype('Int64')  # Removes day values that are formatted as YY-DDD and converts to nullable integer type
    misc_stats_df = misc_stats_df.rename(columns={
                                            '90s': 'nineties', 
                                            '2crdy': 'second_crdy', 
                                            'int': 'intercept',
                                            'won': 'duels_won',
                                            'lost': 'duels_lost',
                                            })
    # Holding off on datatype changes bc of None values will err, all values passed as strings
    
    ##########  ##########  ##########
    if verbose>=1: print(misc_stats_df.head(), "\n#####\n", misc_stats_df.tail())
    if verbose>=2: 
        with option_context('display.max_rows', None, 'display.max_columns', None):
            print(misc_stats_df)
    ##########  ##########  ##########
    
    return misc_stats_df


if __name__ == "__main__":
    get_FBref_mls_player_misc_stats(
        year=2024, 
        FBref_2024_url=f'https://FBref.com/en/comps/22/{year}/misc/{year}-Major-League-Soccer-Stats')