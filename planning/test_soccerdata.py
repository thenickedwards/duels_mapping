

url = 'https://fbref.com/en/comps/22/2025/misc/2025-Major-League-Soccer-Stats'

import soccerdata as sd

# Create scraper class instance
fbref = sd.FBref()

# avail_leagues = fbref.available_leagues()
# print(avail_leagues)


# Create scraper class instance filtering on specific leagues and seasons
fbref = sd.FBref(leagues='USA-Major-League-Soccer', seasons=2025)
# Retrieve data for the specified leagues and seasons
season_stats = fbref.read_team_season_stats(stat_type='misc')