"""
Generate a sample hiring_data.csv with 100 rows and intentional bias for testing.

Bias patterns introduced:
  - Gender: Males are hired at ~70%, Females at ~45%
  - Race: White candidates hired at ~72%, others at ~40-50%
  - Age: Younger candidates (<35) have higher hire rates
"""

import csv
import random
import os

random.seed(42)  # Reproducible results

GENDERS = ["Male", "Female"]
RACES = ["White", "Black", "Hispanic", "Asian"]
ROWS = 100

OUTPUT_PATH = os.path.join(os.path.dirname(__file__), "hiring_data.csv")


def generate_hired(age, gender, race, experience):
    """
    Determine hiring outcome with intentional bias.
    Higher base rate for males, White candidates, and younger age.
    """
    base_probability = 0.5

    # Gender bias: +20% for Male
    if gender == "Male":
        base_probability += 0.20
    else:
        base_probability -= 0.05

    # Race bias: +12% for White, slight penalty for others
    if race == "White":
        base_probability += 0.12
    elif race == "Asian":
        base_probability += 0.02
    elif race == "Black":
        base_probability -= 0.10
    elif race == "Hispanic":
        base_probability -= 0.05

    # Age bias: slight preference for younger candidates
    if age < 30:
        base_probability += 0.08
    elif age > 45:
        base_probability -= 0.10

    # Experience helps but doesn't fully offset bias
    base_probability += experience * 0.015

    # Clamp and decide
    base_probability = max(0.05, min(0.95, base_probability))
    return 1 if random.random() < base_probability else 0


def main():
    rows = []
    for _ in range(ROWS):
        age = random.randint(22, 58)
        gender = random.choice(GENDERS)
        race = random.choice(RACES)
        experience = random.randint(0, 20)
        hired = generate_hired(age, gender, race, experience)

        rows.append({
            "age": age,
            "gender": gender,
            "race": race,
            "experience_years": experience,
            "hired": hired,
        })

    with open(OUTPUT_PATH, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["age", "gender", "race", "experience_years", "hired"])
        writer.writeheader()
        writer.writerows(rows)

    # Print summary statistics
    total = len(rows)
    hired_count = sum(r["hired"] for r in rows)
    print(f"Generated {total} rows → {OUTPUT_PATH}")
    print(f"Overall hire rate: {hired_count}/{total} ({hired_count/total*100:.1f}%)")
    print()

    for gender in GENDERS:
        subset = [r for r in rows if r["gender"] == gender]
        h = sum(r["hired"] for r in subset)
        print(f"  {gender}: {h}/{len(subset)} hired ({h/len(subset)*100:.1f}%)")

    print()
    for race in RACES:
        subset = [r for r in rows if r["race"] == race]
        h = sum(r["hired"] for r in subset)
        print(f"  {race}: {h}/{len(subset)} hired ({h/len(subset)*100:.1f}%)")


if __name__ == "__main__":
    main()
