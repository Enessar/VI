var filteredData = null;
function updateChoroplethMap(attr = false){
    const mapGroup = d3.select("#choropleth").select("svg").select("g");
    attributes = Array.from(setButtons);
    if(!attr){
        filteredData = globalData.filter((element) => element.Year === curYear);
    }
    
    if(attr){

        // Create a color scale for the incomeperperson values
        colorScaleMap1 = d3
            .scaleLinear()
            .domain([
            d3.min(globalData, (d) => d[attributes[0]]),
            d3.max(globalData, (d) => d[attributes[0]]),
            ])
            .range([0,1]);

        if (attributes.length == 2){

            colorScaleMap2 = d3
                .scaleLinear()
                .domain([
                d3.min(globalData, (d) => d[attributes[1]]),
                d3.max(globalData, (d) => d[attributes[1]]),
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
