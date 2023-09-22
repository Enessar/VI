import pandas as pd

# Cleaning Country_population
pop_df = pd.read_csv("Our porject\src\Initial_data\country_population.csv", encoding='latin1', delimiter=',')
pop_df.drop(["Indicator Name","Indicator Code"], axis=1, inplace=True)
pop_df.to_csv('Our porject\src\country_pop.csv', index=False, header=True)

#Cleaning fertility_rate
fertility_df = pd.read_csv("Our porject/src/Initial_data/fertility_rate.csv", encoding='latin1', delimiter=',')
fertility_df.drop(["Indicator Name","Indicator Code"], axis=1, inplace=True)
fertility_df.to_csv('Our porject/src/fertility_pop.csv', index=False, header=True)

#Cleaning life_expectancy
life_df = pd.read_csv("Our porject/src/Initial_data/life_expectancy.csv", encoding='latin1', delimiter=',')
pop_df.drop(["Indicator Name","Indicator Code"], axis=1, inplace=True)
pop_df.to_csv('Our porject/src/life_pop.csv', index=False, header=True)


