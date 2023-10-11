// Function to handle mouseover event
function handleMouseOver(event, item) {
  // Select all elements with class "data" and filter based on the item's properties
  d3.selectAll(".data")
    .filter(function (d) {
      // Check if "properties" exist in both item and d objects
      if ("properties" in item) {
        if ("properties" in d) return item.properties.name == d.properties.name;
        else return item.properties.name == d.country;
      } else if ("properties" in d) {
        return item.country == d.properties.name;
      } else {
        return item.country == d.country;
      }
    })
    .attr("fill", "red"); // Change the fill color of the matching elements to red

  // Create and display a tooltip with country information
  const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("opacity", 0);

    // var coordinates= d3.pointer(this);
    // var mouseX = coordinates[0];
    // var mouseY = coordinates[1];

  // Populate the tooltip with information
  tooltip.html(
    `<strong>Country:</strong> ${item.properties.name}<br>
     <strong>Income Per Person:</strong> ${item.properties.incomeperperson}<br>
     <strong>Alcohol Consumption:</strong> ${item.properties.alcconsumption}<br>
     <strong>Employment Rate:</strong> ${item.properties.employrate}`
  )
  .style("background-color", "rgba(128, 128, 128, 0.7)") // Grey with 70% transparency
  .style("padding", "8px") // Adjust the padding as needed
  .style("border", "1px solid #333") // Optional border
  .style("left", (event.pageX + 10) + "px")
  .style("top", (event.pageY - 20) + "px")
  .transition()
  .duration(200)
  .style("opacity", 0.9);
}

// Function to handle mouseout event
function handleMouseOut(event, item) {
  // Filter the current data to remove entries with missing incomeperperson values
  currentData = globalDataCapita.filter(function (d) {
    return d.incomeperperson != "";
  });

  // Create a color scale for the incomeperperson values
  const colorScale = d3
    .scaleLog()
    .domain([
      d3.min(currentData, (d) => d.incomeperperson),
      d3.max(currentData, (d) => d.incomeperperson),
    ])
    .range([0, 1]);

  // Reset the fill color of all elements with class "country data" to black
  d3.selectAll(".country.data").attr("fill", "black");

  // Set the fill color of each country based on its incomeperperson value
  currentData.forEach((element) => {
    d3.selectAll(".country.data")
      .filter(function (d) {
        return d.properties.name == element.country;
      })
      .attr("fill", d3.interpolateBlues(colorScale(element.incomeperperson)));
  });

  // Remove the tooltip
  d3.select(".tooltip")
    .transition()
    .duration(200)
    .style("opacity", 0);

    // Remove the tooltip div
  d3.select(".tooltip").remove();


  // Reset the fill color of all elements with class "circle data" to steelblue
  d3.selectAll("circle.data").attr("fill", "steelblue");
}
