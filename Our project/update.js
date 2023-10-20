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

     // Remove the existing legend group
     d3.select("#lineChart").select(".legend").remove();

     // Create a new legend group
    const legendGroup = svg
    .append("g")
    .attr("class", "legend")
    .attr("transform", `translate(${600}, ${margin.top})`);

    // Define a fixed color scale for continents
    const colorScaleLine = d3.scaleOrdinal()
    .domain(['Asia', 'Africa', 'Europe', 'Americas', 'Oceania', 'Unknown'])
    .range(['green', 'orange', 'red', 'purple', 'blue', 'grey']);

    if (attr) {
        // If attr is provided or no buttons are selected, use the selected metric
        const attributes = Array.from(setButtons)[0];
    
        // Update the yScale, line, and line chart
        const yScale = d3.scaleLinear()
            .domain([
            d3.min(filteredData, (d) => d[attributes]),
            d3.max(filteredData, (d) => d[attributes])
        ])
        .nice()
        .range([height - margin.bottom, margin.top]);

        const xScale = d3
        .scaleLinear()
        .domain([rangeMin, rangeMax]) // Adjust the domain based on your data
        .range([margin.left, width - margin.right - 100]);

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
        

        // Extract the currently displayed continents
        const displayedContinents = new Set(dataByContinent.keys());

        // Select all lines with the class "line"
        const lines = chartGroup.selectAll(".line")
            .data(displayedContinents);

        // Enter: append new lines for new data
        lines.enter()
            .append("path")
            .attr("class", "line")
            .attr("fill", "none")
            .merge(lines) // Update + Enter selection
            .transition().duration(500)
            .attr("d", (continent) => line(dataByContinent.get(continent)))
            .attr("stroke", (continent) => colorScaleLine(continent));

        // Exit: remove any lines that don't have data anymore
        lines.exit().remove();
        

        // Add axes
        const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
        const yAxis = d3.axisLeft(yScale);
        
        svg
        .select(".x-axis")
        .transition().duration(500)
        .call(xAxis);

      // You can also customize the x-axis updates as needed here
        svg
            .selectAll(".x-axis text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end")
            .attr("dx", "-0.8em")
            .attr("dy", "0.15em");
        
        svg
            .select(".y-axis")
            .transition().duration(500)
            .attr("transform", `translate(${margin.left}, 0)`)
            .call(yAxis);
        
        // Determine which continents are selected based on button states
        const selectedContinents = [];
        const CONTINENTS = ['Asia', 'Europe', 'Africa', 'Americas', 'Oceania', 'Unknown'];
        CONTINENTS.forEach((continent) => {
            if (setFilter.has(continent)) {
            selectedContinents.push(continent);
            }
        });

       const newLegendItems = legendGroup
                            .selectAll(".legend-item")
                            .data(selectedContinents)
                            .enter()
                            .append("g")
                            .attr("class", "legend-item")
                            .attr("transform", (d, i) => `translate(0, ${i * 20})`);

        // Add colored rectangles for each selected continent
        newLegendItems
            .append("rect")
            .attr("width", 16)
            .attr("height", 16)
            .style("fill", (d) => colorScaleLine(d))
            .attr("rx", 3) // Rounded corners
            .style("stroke", "black") // Border color
            .style("stroke-width", 1) // Border width
            .style("background-color", "black"); // Background color here

        // Add text labels for each selected continent
        newLegendItems
            .append("text")
            .attr("x", 23)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "start")
            .text((d) => d);

  
    }

}