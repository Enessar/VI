import pandas as pd

# Cleaning Country_population
pop_df = pd.read_csv("Our porject\src\Initial_data\country_population.csv", encoding='latin1', delimiter=',')
pop_df.drop(["Indicator Name","Indicator Code"], axis=1, inplace=True)
pop_df.to_csv('Our porject\src\country_pop.csv', index=False, header=True)