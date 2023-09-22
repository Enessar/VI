import pandas as pd

#Cleaning fertility_rate
fertility_df = pd.read_csv("Our project/src/Initial_data/fertility_rate.csv", encoding='latin1', delimiter=',')
fertility_df.drop(["Indicator Name","Indicator Code"], axis=1, inplace=True)
fertility_df.rename(columns={'ï»¿"Country Name"' : 'Country name'}, inplace=True)
fertility_df.to_csv('Our project/src/fertility_pop.csv', index=False, header=True)

#Cleaning life_expectancy
life_df = pd.read_csv("Our project/src/Initial_data/life_expectancy.csv", encoding='latin1', delimiter=',')
life_df.drop(["Indicator Name","Indicator Code"], axis=1, inplace=True)
life_df.rename(columns={'ï»¿"Country Name"' : 'Country name'}, inplace=True)
life_df.to_csv('Our project/src/life_pop.csv', index=False, header=True)

# Create death_rate.csv
death_df = pd.read_csv("Our project/src/life_pop.csv", encoding='latin1', delimiter=',')
for year in range(1960, 2017):
    death_df[str(year)] = 1 / death_df[str(year)]
death_df.to_csv("death_rate.csv", index=False, header=True)

# Create population_growth.csv
death_rate_df = pd.read_csv("Our project/src/death_rate.csv", encoding='latin1', delimiter=',')
birth_rate_df = pd.read_csv("_rate.csv", encoding='latin1', delimiter=',')
migration_rate_df = pd.read_csv("net_migration_rate.csv", encoding='latin1', delimiter=',')




#Cleaning net migration
migration_df= pd.read_csv("Our project/src/Initial_data/net_migration_rate.csv", encoding='latin1', delimiter=',')
migration_df.drop(["Variant"], axis=1, inplace=True)
for i in range(1950,1960):
    migration_df.drop(str(i), axis=1, inplace=True)
migration_df.rename(columns={'Country or Area' : 'Country name'}, inplace=True)
migration_df.to_csv('Our project/src/migration_pop.csv', index=False, header=True)


