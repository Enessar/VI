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
      yScale.domain([
        d3.min(filteredData, (d) => d[metricName]),
        d3.max(filteredData, (d) => d[metricName])
      ]).nice();
  
      // Update the line generator based on the selected metric
      line.y((d) => yScale(d[metricName]));
  
      // Select the line chart group and update the line
      lineGroup.select(".line")
        .datum(filteredData)
        .attr("d", line);
  
    }
  }
  