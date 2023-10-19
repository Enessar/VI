var filteredDataYear = null;

function updateChoroplethMap(attr = false){
    const mapGroup = d3.select("#choropleth").select("svg").select("g");
    attributes = Array.from(setButtons);

    if(!attr){
        filteredDataYear = filteredData.filter((element) => element.Year === curYear);
    } else {
        filteredDataYear = filteredData;
        // Create a color scale for the incomeperperson values
        colorScaleMap1 = d3
            .scaleLinear()
            .domain([
            d3.min(filteredData, (d) => d[attributes[0]]),
            d3.max(filteredData, (d) => d[attributes[0]]),
            ])
            .range([0,1]);

            if (attributes.length === 2) {
                colorScaleMap2 = d3
                    .scaleLinear()
                    .domain([
                        d3.min(filteredData, (d) => d[attributes[1]]),
                        d3.max(filteredData, (d) => d[attributes[1]]),
                    ])
                    .range([0, 1]);
            }
        }


        // Set the default gray fill color
    const grayColor = "gray";

    // Set the fill color of each country based on its incomeperperson value
    mapGroup.selectAll("path")
        .attr("fill", (d) => {
            const element = filteredDataYear.find((el) => el.Country_name === d.properties.name);
            if (element) {
                if (attributes.length === 2) {
                    return d3.interpolate(
                        d3.interpolateGreens(colorScaleMap1(element[attributes[0]])),
                        d3.interpolateReds(colorScaleMap2(element[attributes[1]]))
                    )(0.5);
                } else {
                    return d3.interpolateGreens(colorScaleMap1(element[attributes[0]]));
                }
            } else {
                return grayColor; // Set gray fill color for countries not in filteredDataYear
            }
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
            d3.min(filteredData, (d) => d[attributes]),
            d3.max(filteredData, (d) => d[attributes])
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
        const dataByContinent = d3.group(filteredData, (d) => {
            const country = d.Country_name;
            const continentEntry = CONTINENT_MAP.find((entry) =>
                entry.countries.includes(country)
            );
            return continentEntry ? continentEntry.continent : 'Unknown';
        } );
  
        // // Define a color scale for continents, including the 'Unknown' category
        // const colorScale = d3.scaleOrdinal()
        //     .domain([...CONTINENT_MAP.map((entry) => entry.continent), 'Unknown'])
        //     .range(d3.schemeCategory10);
        
        // // Iterate through each group (continent) and create a line for each
        // dataByContinent.forEach((continentData, continent) => {
        //     if (continent !== 'Unknown') {  // Exclude 'Unknown'
        //     chartGroup
        //         .select(".line")
        //         .datum(continentData)
        //         .transition().duration(500)
        //         .attr("d", line)
        //         .attr("stroke", colorScaleLine(continent));
        // }
        // });

        // Select all lines with the class "line"
        const lines = chartGroup.selectAll(".line")
        .data(dataByContinent.keys()); // Use keys() to get an array of continent names

        // Enter: append new lines for new data
        lines.enter()
            .append("path")
            .attr("class", "line")
            .attr("fill", "none")
            .merge(lines) // Update + Enter selection
            .transition().duration(500)
            .attr("d", (continent) => line(dataByContinent.get(continent))); // Use the continent as a key to get the data
        
        
        // Exit: remove any lines that don't have data anymore
        lines.exit().remove();

        // Add axes
        const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
        // Create the y-axis with percentage formatting
        // const yAxis = d3.axisLeft(yScale).tickFormat(d3.format(".0%"));
        const yAxis = d3.axisLeft(yScale);
        
        
        svg
            .select(".x-axis")
            .transition().duration(500)
            .call(xAxis)
            .selectAll(".x-axis text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end")
            .attr("dx", "-0.8em")
            .attr("dy", "0.15em");;
        
        svg
            .select(".y-axis")
            .transition().duration(500)
            .attr("transform", `translate(${margin.left}, 0)`)
            .call(yAxis);
    
  
    }

}