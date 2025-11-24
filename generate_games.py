import os
import re
import json

def filename_to_display_name(filename):
    """PascalCase/camelCase → "Tic Tac Toe" 변환"""
    name = filename.replace('.js', '')
    # Uppercase 앞에 space 삽입
    name = re.sub(r'([a-z0-9])([A-Z])', r'\1 \2', name)
    # 각 단어 Capitalize
    return ' '.join(word.capitalize() for word in name.split())

game_dir = 'game'
games_data = {}

if os.path.exists(game_dir):
    js_files = [f for f in os.listdir(game_dir) if f.endswith('.js') and not f.startswith('_')]
    for filename in sorted(js_files):
        key = filename.replace('.js', '').lower()  # URL key: tictactoe
        display_name = filename_to_display_name(filename)  # Display: Tic Tac Toe
        games_data[key] = {
            'name': display_name,
            'file': f"../game/{filename}"  # script.js 기준 상대경로
        }

# js/games.js 생성 (ESM export 형식)
output = f"export const games = {json.dumps(games_data, indent=4)};\n"
with open('js/games.js', 'w', encoding='utf-8') as f:
    f.write(output)

print("✅ js/games.js 생성 완료!")
print("발견된 게임:", ', '.join(games_data.keys()))
for key, data in games_data.items():
    print(f"  {key} → '{data['name']}' ({data['file']})")