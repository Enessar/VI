var filteredData = null;

function updateChoroplethMap(attr = false){
    const mapGroup = d3.select("#choropleth").select("svg").select("g");
    attributes = Array.from(setButtons);
    if(!attr){
        filteredData = filteredDataByRange.filter((element) => element.Year === curYear);
    } else {
        // Create a color scale for the incomeperperson values
        colorScaleMap1 = d3
            .scaleLinear()
            .domain([
            d3.min(filteredDataByRange, (d) => d[attributes[0]]),
            d3.max(filteredDataByRange, (d) => d[attributes[0]]),
            ])
            .range([0,1]);

        if (attributes.length == 2){

            colorScaleMap2 = d3
                .scaleLinear()
                .domain([
                d3.min(filteredDataByRange, (d) => d[attributes[1]]),
                d3.max(filteredDataByRange, (d) => d[attributes[1]]),
                ])
                .range([0,1]);
        }
    }

    // Set the fill color of each country based on its incomeperperson value
    filteredData.forEach((element) => {
        mapGroup
            .selectAll("path")
            .filter(function (d) {
                return d.properties.name == element.Country_name;
            })
            .attr("fill", (d) => {
                if (attributes.length == 2){
                    return d3.interpolate(
                        d3.interpolateGreens(colorScaleMap1(element[attributes[0]]))
                        ,
                        d3.interpolateReds(colorScaleMap2(element[attributes[1]]))
                            )(0.5)
                } else {
                    return d3.interpolateGreens(colorScaleMap1(element[attributes[0]]))
                }
        });
            });
}

function updateLineChart(attr = false) {
    const lineGroup = d3.select("#lineChart").select("svg").select("g");
    
    if (attr) {
      // If attr is provided or no buttons are selected, use the selected metric
      const metricName = Array.from(setButtons)[0];
      
      // Update the yScale, line, and line chart
     yScale.scaleLinear()
        .domain([
        d3.min(filteredDataByRange, (d) => d[metricName]),
        d3.max(filteredDataByRange, (d) => d[metricName])
      ]).nice()
      .nice()
      .range([height - margin.bottom, margin.top]);

    const xScale = d3
    .scaleLinear()
    .domain([rangeMin, rangeMax]) // Adjust the domain based on your data
    .range([margin.left, width - margin.right]);

      // Update the line generator based on the selected metric
    line.y((d) => yScale(d[metricName]))
        .x((d) => xScale(d.Year));

  // Group the data by continent
    const dataByContinent = d3.group(filteredDataByRange, (d) => {
    const country = d.Country_name;
    const continentEntry = CONTINENT_MAP.find((entry) =>
      entry.countries.includes(country)
    );
    return continentEntry ? continentEntry.continent : 'Unknown';
  });
  
  // Define a color scale for continents, including the 'Unknown' category
  const colorScale = d3.scaleOrdinal()
    .domain([...CONTINENT_MAP.map((entry) => entry.continent), 'Unknown'])
    .range(d3.schemeCategory10);
  
  // Iterate through each group (continent) and create a line for each
  dataByContinent.forEach((continentData, continent) => {
    if (continent !== 'Unknown') {  // Exclude 'Unknown'
    chartGroup
      .append("path")
      .datum(continentData)
      .attr("class", "line")
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke", colorScale(continent));
  }
   });
   // Add axes
   const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
   // Create the y-axis with percentage formatting
   // const yAxis = d3.axisLeft(yScale).tickFormat(d3.format(".0%"));
   const yAxis = d3.axisLeft(yScale);
 
 
   svg
     .append("g")
     .attr("class", "x-axis")
     .attr("transform", `translate(0, ${height - margin.bottom})`)
     .call(xAxis);
 
   svg
     .append("g")
     .attr("class", "y-axis")
     .attr("transform", `translate(${margin.left}, 0)`)
     .call(yAxis);
 
 }
      // Select the line chart group and update the line
      lineGroup.select(".line")
        .datum(filteredData)
        .attr("d", line);
  
    }

  