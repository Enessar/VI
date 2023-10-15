function updateChoroplethMap(){
    const mapGroup = d3.select("#choropleth").select("svg").select("g");
    
    // Create a color scale for the incomeperperson values
    const colorScale1 = d3
    .scaleLog()
    .domain([
    d3.min(globalData, (d) => d.life_expectancy),
    d3.max(globalData, (d) => d.life_expectancy),
    ])
    .range([0,1]);

    const colorScale2 = d3
    .scaleLog()
    .domain([
    d3.min(globalData, (d) => d.Fertility_Rate),
    d3.max(globalData, (d) => d.Fertility_Rate),
    ])
    .range([0,1]);

    // Set the fill color of each country based on its incomeperperson value
    globalData.forEach((element) => {
        mapGroup
            .selectAll("path")
            .filter(function (d) {
            return d.properties.name == element.Country_name && element.Year == curYear;
            })
            .attr("fill", 
            d3.interpolate(
                d3.interpolateGreens(colorScale1(element.life_expectancy))
                ,
                d3.interpolateReds(colorScale2(element.Fertility_Rate))
                    )(0.5)
            );
        });
}