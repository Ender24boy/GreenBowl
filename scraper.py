import requests
from bs4 import BeautifulSoup
import datetime
import uuid
import os
import json

def fetch_data(url):
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise an error for bad responses
        return BeautifulSoup(response.text, 'html.parser')
    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")
        return None
    

if __name__ == "__main__":
    x = 1

    while x < 9252:
        url = f"https://j-archive.com/showgame.php?game_id={x}"
        data = fetch_data(url)
        if not data:
            break

        try:
            title = data.select_one('div#game_title h1').get_text(strip=True)
            title_date = title.split(' - ')[-1]
            dt = datetime.datetime.strptime(title_date, '%A, %B %d, %Y')

            show = {
                'title': title,
                'date': {
                    'day':   dt.day,
                    'month': dt.strftime('%B'),
                    'year':  dt.year
                },
                'clues': []
            }

            # Define the two rounds you want to scrape
            rounds = [
                ("jeopardy_round",       "Jeopardy"),
                ("double_jeopardy_round","Double Jeopardy"),
            ]

            for div_id, round_name in rounds:
                table = data.select_one(f"div#{div_id} table.round")
                if not table:
                    continue

                # pull out the 6 category names
                name_cells = table.select('td.category_name')
                categories = [
                    cell.get_text(strip=True).strip('"\'' )
                    for cell in name_cells
                ]

                # pull out every clue cell in this round
                for cell in table.select('td.clue'):
                    clue_td = cell.find('td', class_='clue_text')
                    if not clue_td:
                        continue

                    clue_id = clue_td['id']
                    position = int(clue_id.split('_')[2])
                    text     = clue_td.get_text(strip=True)

                    resp_td = cell.find(id=f"{clue_id}_r")
                    answer  = resp_td.find('em', class_='correct_response').get_text(strip=True)

                    show['clues'].append({
                        'category': categories[position - 1],
                        'text':     text,
                        'answer':   answer
                    })

            # write out as before
            uid      = uuid.uuid4()
            filename = f"{uid}.json"
            folder   = os.path.join('.', 'Jeopardy_Repo', 'shows')
            os.makedirs(folder, exist_ok=True)
            filepath = os.path.join(folder, filename)

            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(show, f, ensure_ascii=False, indent=2)

            print(f"Wrote file: {filepath} for show {x}")
            x += 1

        except Exception as e:
            print(f"Error: {e}")
            break