# Global Demographic Trends Visualization 🌍📊  
**Interactive Data Visualization Project | Data Visualization & Systems Programming (IST, 2023–2024)**  

An interactive web-based visualization of **global demographic and development indicators (1960–2016)** using **D3.js**, **JavaScript**, and **HTML/CSS**.  
The project explores the relationships between fertility rates, life expectancy, HDI, and replacement rates through **animated maps, line charts, and Sankey diagrams**.

---

## 🎬 Demo GIF

![Project Demo](/resources/demo_git.gif)

> *(Animated demo of the interactive dashboard — click “Raw” above to view in full size if it doesn’t auto-play.)*

---

## Table of Contents
- [Overview](#overview)
- [Data & Objectives](#data--objectives)
- [Visualization Components](#visualization-components)
- [Interactivity & Features](#interactivity--features)
- [Resources & Requirements](#resources--requirements)
- [Implementation Details](#implementation-details)
- [Results & Insights](#results--insights)
- [Technologies](#technologies)
- [Team & Course](#team--course)
- [References](#references)

---

## Overview

This project visualizes demographic and development trends across countries from **1960 to 2016**, using data from the **World Bank Open Data** platform.  
It highlights correlations between fertility rates, life expectancy, and development levels, revealing global population shifts and socio-economic patterns.

**Main goals:**
- Investigate the relationship between rising life expectancy and declining fertility rates.  
- Identify countries with fertility rates consistently above replacement levels.  
- Differentiate demographic patterns between developed and developing regions.  
- Provide interactive, comparative, and animated visual exploration.

---

## Data & Objectives

- **Dataset source:** World Bank Open Data  
- **Period covered:** 1960–2016  
- **Indicators visualized:**  
  - Fertility rate  
  - Life expectancy  
  - Human Development Index (HDI)  
  - Natural rate  
  - Replacement rate  

**Key analytical questions:**
1. How are life expectancy and fertility rates correlated across time and regions?  
2. Which countries remain above replacement fertility rates?  
3. How do trends differ between continents and HDI levels?  
4. What are the demographic implications of declining fertility (e.g., population aging)?  

---

## Visualization Components

### 🗺️ Choropleth Map  
A **bivariate choropleth** showing two attributes simultaneously (e.g., fertility vs. life expectancy).  
- Hover to display country data (tooltip with all indicators).  
- Grey indicates missing data.  
- Colors encode two-dimensional gradients for easy comparison.

![Choropleth Map](/resources/map.png)

---

### 📈 Line Chart  
Displays the **temporal evolution** of indicators across time.  
- X-axis: years (1960–2016)  
- Y-axis: selected indicator (e.g., life expectancy or fertility rate)  
- Color-coded by continent  
- Interactive **slider** for filtering year range  
- Red bar indicates current year position during animation  

![Line Chart](/resources/linechart.png)

---

### 🔀 Sankey Plot  
Visualizes **flows between attributes** (e.g., HDI ↔ Fertility ↔ Life Expectancy).  
- Interactive node highlighting  
- Supports single or dual attribute display  
- Dynamic filtering by continent  
- Built from scratch using the D3 Sankey library and custom extensions  

![Sankey Diagram](/resources/sanky.png)

---

## Interactivity & Features

- **Search & Explore:** Find and highlight specific countries.  
- **Compare:** Filter by continent or HDI level to contrast regions.  
- **Animate:** Watch demographic evolution from 1960–2016 using play controls.  
- **Hover tooltips:** Detailed demographic information per country/year.  
- **Dynamic filtering:** Interactive attribute selection and timeline control.  

---

## Resources & Requirements

| Component | Version / Notes |
|------------|----------------|
| **Browser** | Chrome, Firefox, or Edge (latest version recommended) |
| **JavaScript** | ES6+ |
| **Libraries** | D3.js v7, noUiSlider |
| **Data** | World Bank Indicators (CSV, cleaned via Pandas) |
| **Python (optional)** | v3.10+ for preprocessing |
| **Memory requirement** | < 200 MB |

Data files required:

```
data/
├── life_expectancy.csv
├── fertility_rate.csv
├── hdi.csv
└── replacement_rate.csv
```

---

## Implementation Details

- **Frontend:** HTML5 + CSS3 + D3.js  
- **Visualization idioms:** Choropleth map, Line chart, Sankey plot  
- **Data processing:** Pandas (Python) for CSV cleaning, pivoting, and merging  
- **Interactivity:** Custom D3 sliders and event listeners  
- **Performance:** Efficient handling of >1,300 KB of cleaned CSV data  

**Key development challenges:**
- Unifying heterogeneous CSV formats from different sources  
- Handling missing and non-standardized country-year data  
- Implementing a **three-layer Sankey** and **custom 3-cursor slider**  
- Maintaining responsiveness across browsers and resolutions  

---

## Results & Insights

| Metric | Value |
|--------|-------:|
| Data period | 1960–2016 |
| Countries covered | 180+ |
| Indicators analyzed | 5 |
| Total processed data | ~1.3 MB |
| Implemented charts | 3 (choropleth, line, sankey) |
| Custom interactive elements | 4 (slider, filters, tooltips, play controls) |

**Key findings:**
- Clear negative correlation between fertility rate and life expectancy.  
- Fertility rates steadily declined below replacement level in most regions.  
- Developing countries show sharper fertility decline with HDI improvement.  
- Interactive exploration enables identification of regional outliers and anomalies.

---

## Technologies

- **Languages:** JavaScript (D3.js), HTML5, CSS3, Python (data preprocessing)  
- **Libraries:** D3.js, noUiSlider, Pandas  
- **Data Source:** [World Bank Open Data](https://data.worldbank.org/)  
- **Visualization Tools:** Bivariate choropleth, Line chart, Sankey diagram  

---

## Team & Course

**Team Members:**  
- Rassene M’Sadaa — [@Enessar](https://github.com/Enessar)  
- Cherilyn Christen — [@Cherie000](https://github.com/Cherie000)  
- Zeineb Mellouli — [@zaynebmellouli](https://github.com/zaynebmellouli)

**Course:** *Data Visualization Project*  
**Institution:** *Instituto Superior Técnico (IST), Lisbon*  
**Year:** 2023–2024  
**Instructors:** Prof. Luís Veiga & Prof. João P. Barreto  

---

## References

- [World Bank Data](https://data.worldbank.org/)  
- [D3 Choropleth Map Example](https://bl.ocks.org/LemoNode/5a64865728c6059ed89388b5f83d6b67)  
- [D3 Line Chart Gallery](https://d3-graph-gallery.com/graph/line_basic.html)  
- [Sankey Diagram Library](https://github.com/topics/sankey-diagram?l=javascript)  
- [noUiSlider](https://refreshless.com/nouislider/)

---

📄 *Full report available:* [`Project-Report.pdf`](./FinalSubmission/Project-Report.pdf)
