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

            if (attributes.length === 2) {
                colorScaleMap2 = d3
                    .scaleLinear()
                    .domain([
                        d3.min(filteredDataByRange, (d) => d[attributes[1]]),
                        d3.max(filteredDataByRange, (d) => d[attributes[1]]),
                    ])
                    .range([0, 1]);
            }
        }


    // Set the fill color of each country based on its incomeperperson value
    filteredData.forEach((element) => {
        mapGroup
            .selectAll("path")
            // .transition()
            // .duration(500)
            .filter(function (d) {
                return d.properties.name == element.Country_name;
            })
            .attr("fill", (d) => {
                if (attributes.length == 2){
                    return d3.interpolate(
                        d3.interpolateGreens(colorScaleMap1(element[attributes[0]])),
                        d3.interpolateReds(colorScaleMap2(element[attributes[1]]))
                    )(0.5);
                } else {
                    return d3.interpolateGreens(colorScaleMap1(element[attributes[0]]));
                }
            // } else {
            //     // Handle cases where data for the country is not found
            //     return "gray"; // Set a default color or handle as needed
            // }
        });
    
    // // Add code to zoom and center the map on the selected continent
    // if (selectedContinent) {
    //     // Implement zoom and center logic here
    //     // You may need to adjust the projection and scale to focus on the selected continent.
    // }
});
}

function updateLineChart(attr = false) {
    const chartGroup = d3.select("#lineChart").select("svg").select("g");
    const svg = d3.select("#lineChart").select("svg");
    
    if (attr) {
      // If attr is provided or no buttons are selected, use the selected metric
      const attributes = Array.from(setButtons)[0];
      
      // Update the yScale, line, and line chart
    const yScale = d3.scaleLinear()
        .domain([
        d3.min(filteredDataByRange, (d) => d[attributes]),
        d3.max(filteredDataByRange, (d) => d[attributes])
      ]).nice()
      .nice()
      .range([height - margin.bottom, margin.top]);

    const xScale = d3
    .scaleLinear()
    .domain([rangeMin, rangeMax]) // Adjust the domain based on your data
    .range([margin.left, width - margin.right]);

      // Update the line generator based on the selected metric
    const line = d3
        .line()
        .y((d) => yScale(d[attributes]))
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
      .select(".line")
      .datum(continentData)
      .transition().duration(500)
      .attr("d", line)
      .attr("stroke", colorScale(continent));
  }
   });
   // Add axes
   const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
   // Create the y-axis with percentage formatting
   // const yAxis = d3.axisLeft(yScale).tickFormat(d3.format(".0%"));
   const yAxis = d3.axisLeft(yScale);
 
 
   chartGroup
     .select(".x-axis")
     .transition().duration(500)
     .call(xAxis);
 
     chartGroup
     .select(".y-axis")
     .transition().duration(500)
     .call(yAxis);
 
    // Select the line chart group and update the line
      chartGroup.select(".line")
        .datum(filteredData)
        .attr("d", line);
  
    }

}