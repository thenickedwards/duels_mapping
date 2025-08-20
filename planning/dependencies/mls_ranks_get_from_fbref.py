import requests
from bs4 import BeautifulSoup
from pandas import DataFrame

from parse_rows import parse_row_by_element, parse_row_by_element_attribute


def get_FBref_mls_team_fixture_results(verbose=0):
    response = requests.get(
        url="https://FBref.com/en/squads/6218ebd4/2016/Seattle-Sounders-FC-Stats")

    soup = BeautifulSoup(response.content, 'html.parser')

    fixtures_table = soup.find(id='matchlogs_for')
    if verbose >= 1:
        print("The fixtures_table found with id='matchlogs_for'!", fixtures_table)
    fixtures_table_rows = fixtures_table.find_all('tr')

    list_of_parsed_rows = [parse_row_by_element(row, element='td') for row in fixtures_table_rows[1:]]

    team_fixtures_df = DataFrame(list_of_parsed_rows)
    
    # Date not captured because it is stored in a <th> and the parsed rows above (used to create the DataFrame) captured <td> elements.
    list_of_parsed_dates = [parse_row_by_element(row, element='th') for row in fixtures_table_rows[1:]]
    list_of_parsed_dates = [date[0] for date in list_of_parsed_dates]

    # Time was initially captured in the DataFrame as None due to html nesting.
    list_of_parsed_times = [parse_row_by_element_attribute(row, element='span', attribute='venuetime') for row in fixtures_table_rows[1:]]
    list_of_parsed_times = [time[0] for time in list_of_parsed_times]

    # Insert dates
    team_fixtures_df.insert(loc=0, column="Date", value=list_of_parsed_dates)
    # Replace None with venue start times
    team_fixtures_df[0] = list_of_parsed_times

    # Initially I planned to capture parse and set the column headers from the html. However, on second thought, I wanted some slight changes and the string transformations would've been labor intensive. Instead they have been hardcoded, though I have left the FBref columns below so the startegy can be documented.
    # list_of_parsed_column_headers = parse_row_by_element(fixtures_table_rows[0], element='th')
    # print(list_of_parsed_column_headers)
    # ['Date', 'Time', 'Comp', 'Round', 'Day', 'Venue', 'Result', 'GF', 'GA', 'Opponent', 'Poss', 'Attendance', 'Captain', 'Formation', 'Referee', 'Match Report', 'Notes']
    list_of_parsed_column_headers = ['date', 'time', 'competition', 'round', 'day', 'venue', 'result', 'goals_for', 'goals_against', 'opponent', 'possession', 'attendance', 'captain', 'formation', 'referee', 'match_report', 'notes']

    team_fixtures_df.columns = list_of_parsed_column_headers

    team_fixtures_df = team_fixtures_df.drop('match_report', axis=1)
    
    # Testing checks
    if verbose >= 1:
        print("team_fixtures_df.head()")
    if verbose >= 2:
        print(team_fixtures_df.head(), "\n#####\n", team_fixtures_df.tail())
    if verbose >= 3:
        print(team_fixtures_df)

if __name__ == "__main__":
    get_FBref_mls_team_fixture_results()