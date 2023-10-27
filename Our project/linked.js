function handleMouseOverMap(event, item){
    const countryName =item.properties.name
    const countryData = filteredDataYear.find((d) => d.Country_name    === countryName);

    // console.log(filteredDataYear);
    if (countryData != undefined){
        // Create and display a tooltip with country information
        const tooltip = d3.select("body").append("div")
          .attr("class", "tooltip")
          .style("position", "absolute")
          .style("opacity", 0);

          // Populate the tooltip with information
        tooltip.html(
            `<strong>${countryName} - ${curYear}</strong><br>
            <strong>Life Expectancy:</strong> ${countryData.life_expectancy.toFixed(2)}<br>
            <strong>Fertility Rate:</strong> ${countryData.Fertility_Rate.toFixed(2)}<br>
            <strong>Replacement Rate:</strong> ${countryData.Replacement_Rate.toFixed(2)}<br>
            <strong>Natural Rate:</stong> ${countryData.Natural_Rate.toFixed(2)}<br>`
        )
        .style("background-color", "rgba(128, 128, 128, 0.7)") // Grey with 70% transparency
        .style("padding", "8px") // Adjust the padding as needed
        .style("border", "1px solid #333") // Optional border
        .style("border-radius", "15px")
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 120) + "px")
        .transition()
        .duration(200)
        .style("opacity", 0.9);

        d3.select("#choropleth")
            .select("svg")
            .select("g")
            .selectAll(".country")
            .filter(function (d) {
                return d.properties.name === countryName;
            })
            .attr("stroke-width","1");

    }
}

function handleMouseMoveMap(event){
    // const [mouseX, mouseY] = d3.pointer(event, this);
    d3.select(".tooltip")
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 120) + "px")

}

function handleMouseOutMap(event, item){
    const countryName =item.properties.name

// Remove the tooltip
  d3.select(".tooltip")
  .transition()
  .duration(200)
  .style("opacity", 0);

  // Remove the tooltip div
    d3.select(".tooltip").remove();

    d3.select("#choropleth")
    .select("svg")
    .select("g")
    .selectAll(".country")
    .filter(function (d) {
        return d.properties.name === countryName;
    })
    .attr("stroke-width","0.1");

}

function handleMouseOverSankey(event, item){
    // console.log(item);
    const countryName =item.country;
    const countryData = filteredDataYear.find((d) => d.Country_name    === countryName);
    const width = item.width;
    // const strokeColor = event.target.attributes

    // console.log(filteredDataYear);
    if (countryData != undefined){
        // Create and display a tooltip with country information
        const tooltip = d3.select("body").append("div")
          .attr("class", "tooltip")
          .style("position", "absolute")
          .style("opacity", 0);

          // Populate the tooltip with information
        tooltip.html(
            `<strong>${countryName} - ${curYear}</strong><br>`
        )
        .style("background-color", "rgba(128, 128, 128, 0.7)") // Grey with 70% transparency
        .style("padding", "8px") // Adjust the padding as needed
        .style("border", "1px solid #333") // Optional border
        .style("border-radius", "15px")
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY -55)+ "px")
        .transition()
        .duration(200)
        .style("opacity", 0.9);

        // console.log(event)

        // Inside the event handler, select the path that triggered the event
        const path = d3.select(this);

        // Change the stroke color of the selected path
        path.attr('stroke', 'green');
        path.attr('stroke-width', width + 5);

        d3.select("#choropleth")
            .select("svg")
            .select("g")
            .selectAll(".country")
            .filter(function (d) {
                return d.properties.name === countryName;
            })
            .attr("stroke-width","1");

    }
}

function handleMouseMoveSankey(event){
    // const [mouseX, mouseY] = d3.pointer(event, this);
    d3.select(".tooltip")
        .style("left", (event.pageX +10) + "px")
        .style("top", (event.pageY - 55) + "px")

}

function handleMouseOutSankey(event, item){
    const countryName =item.country;
    const color = item.color;
    const width = item.width;

// Remove the tooltip
  d3.select(".tooltip")
  .transition()
  .duration(200)
  .style("opacity", 0);

  // Remove the tooltip div
    d3.select(".tooltip").remove();

    // Inside the event handler, select the path that triggered the event
    const path = d3.select(this);

    // Change the stroke color of the selected path
    path.attr('stroke', color);
    path.attr('stroke-width', width);

    d3.select("#choropleth")
    .select("svg")
    .select("g")
    .selectAll(".country")
    .filter(function (d) {
        return d.properties.name === countryName;
    })
    .attr("stroke-width","0.1");
}


// function handleMouseOverLine(event, item) {
//     console.log(event);
//     console.log(item);
//     console.log(this);
    // // Retrieve the country name from the data passed as "item"
    // const countryName = item.name;
  
    // // Find the data for the selected country
    // const countryData = filteredData.find((d) => d.Country_name === countryName);
  
    // if (countryData !== undefined) {
    //   // Create and display a tooltip with country information
    //   const tooltip = d3.select("#lineChartTooltip");

    //     tooltip.style("position", "absolute")
    //         .style("opacity", 0)
    //         .style("background-color", "rgba(128, 128, 128, 0.7)")
    //         .style("padding", "8px")
    //         .style("border", "1px solid #333")
    //         .style("border-radius", "15px");

    //       // Populate the tooltip with information
    //     tooltip.html(
    //         `<strong>${countryName} - ${curYear}</strong><br>
    //         <strong>Life Expectancy:</strong> ${countryData.life_expectancy.toFixed(2)}<br>
    //         <strong>Fertility Rate:</strong> ${countryData.Fertility_Rate.toFixed(2)}<br>
    //         <strong>Replacement Rate:</strong> ${countryData.Replacement_Rate.toFixed(2)}<br>
    //         <strong>Natural Rate:</stong> ${countryData.Natural_Rate.toFixed(2)}<br>`
    //     )
    //     .style("background-color", "rgba(128, 128, 128, 0.7)") // Grey with 70% transparency
    //     .style("padding", "8px") // Adjust the padding as needed
    //     .style("border", "1px solid #333") // Optional border
    //     .style("border-radius", "15px")
    //     .style("left", (event.pageX + 10) + "px")
    //     .style("top", (event.pageY - 120) + "px")
    //     .transition()
    //     .duration(200)
    //     .style("opacity", 0.9);

    //     d3.select("#lineChart")
    //         .select("svg")
    //         .select("g")
    //         .selectAll(".country")
    //         .filter(function (d) {
    //             return d.properties.name === countryName;
    //         })
    //         .attr("stroke-width","1");

    // }
// }

    // // Event listener for mousemove to update the tooltip position
    // function handleMouseMoveLine(event) {
    //     const tooltip = d3.select("#lineChartTooltip");
    //     tooltip.style("left", (event.pageX + 10) + "px");
    //     tooltip.style("top", (event.pageY - 120) + "px");
    // }

    // // Event listener for mouseout to hide the tooltip
    // function handleMouseOutLine(event, item) {
    //     d3.select("#lineChartTooltip")
    //         .transition()
    //         .duration(200)
    //         .style("opacity", 0);
    // }