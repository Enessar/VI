function updateChoroplethMap(attr = false, selectedContinent) {
    const mapGroup = d3.select("#choropleth").select("svg").select("g");
    attributes = Array.from(setButtons);

    // Filter data based on the selected continent
    if (selectedContinent) {
        filteredData = globalData.filter((element) =>
            getContinentForCountry(element.Country_name) === selectedContinent
        );
} else {
        // If no continent is selected, filter based on the current year or range
        if (!attr) {
            filteredData = globalData.filter((element) => element.Year === curYear);
        } else {
            const filteredDatarange = globalData.filter((element) => {
                const year = element.Year;
                return year >= rangeMin && year <= rangeMax;
            });

            // Create color scales for the selected attributes
            colorScaleMap1 = d3
                .scaleLinear()
                .domain([
                    d3.min(filteredDatarange, (d) => d[attributes[0]]),
                    d3.max(filteredDatarange, (d) => d[attributes[0]]),
                ])
                .range([0, 1]);

            if (attributes.length === 2) {
                colorScaleMap2 = d3
                    .scaleLinear()
                    .domain([
                        d3.min(filteredDatarange, (d) => d[attributes[1]]),
                        d3.max(filteredDatarange, (d) => d[attributes[1]]),
                    ])
                    .range([0, 1]);
            }
        }
    }

    // Set the fill color of each country based on its attribute values
    mapGroup
        .selectAll("path")
        .attr("fill", (d) => {
            const countryData = filteredData.find((element) => element.Country_name === d.properties.name);
            if (countryData) {
                if (attributes.length === 2) {
                    return d3.interpolate(
                        d3.interpolateGreens(colorScaleMap1(countryData[attributes[0]])),
                        d3.interpolateReds(colorScaleMap2(countryData[attributes[1]]))
                    )(0.5);
                } else {
                    return d3.interpolateGreens(colorScaleMap1(countryData[attributes[0]]));
                }
            } else {
                // Handle cases where data for the country is not found
                return "gray"; // Set a default color or handle as needed
            }
        });
    
    // Add code to zoom and center the map on the selected continent
    if (selectedContinent) {
        // Implement zoom and center logic here
        // You may need to adjust the projection and scale to focus on the selected continent.
    }
}
