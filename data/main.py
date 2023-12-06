import pandas as pd
import json

# Read the CSV file into a DataFrame
df = pd.read_csv('processed1.csv')

# Group by Platform and Genre
grouped_by_platform = df.groupby('Genre')

# Define a root name
root_name = 'root'

# Convert the grouped data to a nested JSON format with "children" attribute
result = {'name': root_name, 'children': []}
for platform, platform_group in grouped_by_platform:
    platform_data = {'name': platform, 'children': []}

    grouped_by_genre = platform_group.groupby('Publisher')
    for genre, genre_group in grouped_by_genre:
        genre_data = {'name': genre, 'children': genre_group.drop(['Platform', 'Genre'], axis=1).to_dict(orient='records')}
        platform_data['children'].append(genre_data)

    result['children'].append(platform_data)

# Save the result as a JSON file
with open('output_genre_publisher.json', 'w') as json_file:
    json.dump(result, json_file, indent=4)
