import requests
from bs4 import BeautifulSoup
import pandas as pd
import time

data = []

# Loop dari halaman 1 sampai 250
for page in range(1, 251):
    print(f"Scraping halaman {page}...")
    url = f"https://catalog.data.gov/dataset?page={page}"
    headers = {"User-Agent": "Mozilla/5.0"}
    
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.text, "html.parser")
    
    datasets = soup.find_all("div", class_="dataset-content")
    
    # Kalau gak nemu data, break aja
    if not datasets:
        print("Ga nemu dataset, berhenti.")
        break

    for item in datasets:
        title = item.find("h3", class_="dataset-heading").text.strip()
        description = item.find("div", class_="notes").text.strip()
        link = "https://catalog.data.gov" + item.find("a")["href"]

        data.append({
            "Judul Dataset": title,
            "Deskripsi": description,
            "Link": link
        })

    time.sleep(1)  # biar ga ke-detect spam sama server

# Simpan ke Excel
df = pd.DataFrame(data)
df.to_excel("5000_datasets_datagov.xlsx", index=False)

print(f"Selesai! Total dataset: {len(df)}. Disimpan ke '5000_datasets_datagov.xlsx'")
