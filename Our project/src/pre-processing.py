import pandas as pd

# Cleaning Country_population
pop_df = pd.read_csv("Our project\src\Initial_data\country_population.csv", encoding='latin1', delimiter=',')
pop_df.drop(["Indicator Name","Indicator Code"], axis=1, inplace=True)
pop_df.rename(columns={'ï»¿"Country Name"': 'Country name'}, inplace=True)
pop_df.to_csv('Our project\src\country_pop.csv', index=False, header=True)

# cleaning birth rate
birth_df = pd.read_csv("Our project\src\Initial_data\Crude birth rate (births per 1,000 population).csv", encoding='latin1', delimiter=';')
birth_df.drop(["Variant"], axis=1, inplace=True)
birth_df.rename(columns={'Country or Area': 'Country name'}, inplace=True)
birth_df.to_csv('Our project/src/birth_rate.csv', index=False, header=True)

# Cleaning HDI
HDI_df = pd.read_csv("Our project\src\Initial_data\GDL-Subnational-HDI-data.csv", encoding='latin1', delimiter=',')
HDI_df.drop(['Continent','ISO_Code','Level','GDLCODE','Region'], axis=1, inplace=True)
HDI_df.rename(columns={'Country': 'Country name'}, inplace=True)
HDI_df.to_csv('Our project/src/HDI.csv', index=False, header=True)

# Cleaning reporduction rate
NRR_df = pd.read_csv("Our project/src/Initial_data/NET reproduction rate.csv", encoding='latin1', delimiter=';')
NRR_df.drop(['Variant'], axis=1, inplace=True)
for i in range(1950, 1960):
    NRR_df.drop([str(i)], axis=1, inplace=True)
NRR_df.rename(columns={'Country or Area': 'Country name'}, inplace=True)
NRR_df.to_csv('Our project/src/NRR.csv', index=False, header=True)

# replacement rate
replacement_df = birth_df.merge(NRR_df[['Country name','1960','1961','1962','1963','1964',
        '1965','1966','1967','1968','1969','1970','1971','1972','1973','1974','1975','1976',
        '1977','1978','1979','1980','1981','1982','1983','1984','1985','1986','1987','1988','1989',
        '1990', '1991', '1992', '1993', '1994', '1995', '1996',
       '1997', '1998', '1999', '2000', '2001', '2002', '2003', '2004', '2005',
       '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014',
       '2015', '2016']], left_on='Country name', right_on='Country name', how='inner')
for i in range(1960,2017):
    replacement_df[str(i)] = replacement_df[str(i) + '_x'] / replacement_df[str(i) + '_y']
    replacement_df.drop([str(i) + '_x' , str(i) + '_y'], axis=1, inplace=True)
replacement_df.to_csv('Our project/src/replacement_rate.csv', index=False, header=True)