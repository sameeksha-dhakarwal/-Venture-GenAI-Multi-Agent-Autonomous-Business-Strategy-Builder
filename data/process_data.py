import pandas as pd

def clean_startup_data():
    df = pd.read_csv("data/raw/startup_investments.csv", encoding="latin1")

    print("Columns:", df.columns)

    # Try common column names
    df = df.rename(columns={
        'company_name': 'name',
        'category': 'category_list',
        'industry': 'category_list'
    })

    # Keep only available columns
    available_cols = [col for col in ['name', 'category_list', 'funding_total_usd', 'country_code'] if col in df.columns]
    df = df[available_cols]

    df = df.dropna()

    df["text"] = df.apply(lambda x: f"""
    Company: {x.get('name', '')}
    Industry: {x.get('category_list', '')}
    Funding: {x.get('funding_total_usd', '')}
    Country: {x.get('country_code', '')}
    """, axis=1)

    df.to_csv("data/processed/clean_startups.csv", index=False)

    print("✅ Clean dataset created!")

if __name__ == "__main__":
    clean_startup_data()