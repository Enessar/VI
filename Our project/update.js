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
    //axis
    if (attr){
        
        if (attributes.length === 0){
            d3.select("#choroplethTitle")
                .text(`Main map`);

            d3.select('#minXLegendMap').text("");
            d3.select('#maxXLegendMap').text("");
            d3.select('#textXLegendMap').text("");
        } else {
            d3.select('#minXLegendMap').text(d3.min(filteredData, (d) => d[attributes[0]]).toFixed(2));
            d3.select('#maxXLegendMap').text(d3.max(filteredData, (d) => d[attributes[0]]).toFixed(2));
            d3.select('#textXLegendMap').text(toName[attributes[0]]);
        
            if (attributes.length === 2) {
                d3.select("#choroplethTitle")
                    .text(`Main map representing ${toName[attributes[0]]} and ${toName[attributes[1]]}`);
                    
                d3.select('#minYLegendMap').text(d3.min(filteredData, (d) => d[attributes[1]]).toFixed(2));
                d3.select('#maxYLegendMap').text(d3.max(filteredData, (d) => d[attributes[1]]).toFixed(2));
                d3.select('#textYLegendMap').text(toName[attributes[1]]);
            } else {
                d3.select("#choroplethTitle")
                .text(`Main map representing ${toName[attributes[0]]}`);

                d3.select('#minYLegendMap').text("");
                d3.select('#maxYLegendMap').text("");
                d3.select('#textYLegendMap').text("");
            }
        }
    }
}

function updateLineChart(attr = false) {
    const chartGroup = d3.select("#lineChart").select("svg").select("g");
    const svg = d3.select("#lineChart").select("svg");
    d3.select(".current-year-line")
    .attr("x1", xScaleLine(curYear))
    .attr("x2", xScaleLine(curYear))
    
    .attr("stroke", "red") // Customize the color of the line (you can adjust it)
    .attr("stroke-width", 2); // Customize the line width
  
    if (attr) {

        // If attr is provided or no buttons are selected, use the selected metric
        const attribute = Array.from(setButtons)[0];
        
        // Remove the existing legend group
        d3.select("#lineChart").select(".legend").remove();

        // Create a new legend group
        const legendGroup = svg
        .append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${600}, ${margin.top})`);

        // Update the yScale, line, and line chart
        const yScale = d3.scaleLinear()
            .domain([
            d3.min(filteredData, (d) => d[attribute]),
            d3.max(filteredData, (d) => d[attribute])
        ])
        .nice()
        .range([height - margin.bottom, margin.top]);

        xScaleLine = d3
        .scaleLinear()
        .domain([rangeMin, rangeMax]) // Adjust the domain based on your data
        .range([margin.left, width - margin.right - 100]);

        // Update the line generator based on the selected metric
        const line = d3
            .line()
            .y((d) => yScale(d[attribute]))
            .x((d) => xScaleLine(d.Year));



        // // Group the data by continent
        dataByContinent = d3.group(filteredData, (d) => {
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
        const xAxis = d3.axisBottom(xScaleLine).tickFormat(d3.format("d"));
        const yAxis = d3.axisLeft(yScale);
        

        svg
        .select(".x-axis")
        .transition().duration(500)
        .call(xAxis);

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
            

        if (setButtons.size >= 1){
            d3.select("#lineChartTitle").text(`Line chart representing ${toName[attribute]}`);
            d3.select("#y-axis-label-LineChart").text(toName[attribute]);
        } else {
            d3.select("#y-axis-label-LineChart").text("");
            d3.select("#lineChartTitle").text("");
        }
    }



}



function updateSankyPlot(attr = false){

    if (sankey != null){
        const sankeyData = {
            nodes: [],
            links: [] };
        
        SankeyLayers(Array.from(setButtons));   

        // console.log("new")
        filteredDataYear.filter((element) => element.Year === curYear).forEach(function(d) {
            source = Development_Level(d);
            target1 = functionToUse1(d);
            target2 = functionToUse2(d);
            value = 5; // Convert to a number if needed

        
            // Check if the source node (Country_name) already exists, if not, add it
            if (!sankeyData.nodes.find(node => node.name === source[1])) {
            sankeyData.nodes.push({ name: source[1], order: source[0]});
            }
            
            //sankeyData.nodes.length = 0;
            // Check if the target1 node (Life_Expectancy) already exists, if not, add it
            if (target1 != null && !sankeyData.nodes.find(node => node.name === target1[1])) {
            sankeyData.nodes.push({ name: target1[1], order: target1[0]});
            }
            //sankeyData.nodes.length = 0;
            // Check if the target2 node (Replacement_Rate) already exists, if not, add it
            if (target2 != null && !sankeyData.nodes.find(node => node.name === target2[1])) {
            sankeyData.nodes.push({ name: target2[1],order: target2[0] });
            }
            c = getContinentForCountry(d);
            color = colorScaleLine(c);
            order= sankeyContinetOrder(c);
            country = d.Country_name;

            
            // console.log(country)
            // console.log(c)
            // console.log(color)

            if (target1 != null){
            // console.log(sankeyData.nodes.find(node=> node.name === source[1]))
            source = sankeyData.nodes.find(node=> node.name === source[1]);
            target = sankeyData.nodes.find(node=> node.name === target1[1]);
            sankeyData.links.push({
                source,
                target,
                value,
                color,
                order,
                color,
                country,
            });
        }
            if (target2 != null){
                source = sankeyData.nodes.find(node=> node.name === target1[1]);
                target = sankeyData.nodes.find(node=> node.name === target2[1]);
                sankeyData.links.push({
                    source,
                    target,
                    value,
                    order,
                    color,
                    country,
                });
            }
        });
        sankeyData.nodes.sort((a, b) => a.order - b.order);
        sankeyData.links.sort((a, b) => a.order - b.order);

        // console.log(sankey);
        const { nodes, links } = sankey({
            nodes:sankeyData.nodes,
            links:sankeyData.links,
          });

        // console.log(nodes);
        // console.log(links);

        const link = d3.select(".links-sankey")
                        .selectAll("path")
                        .data(links);


        var linkEnter = link.enter().append("path")
                            .attr("d", d3.sankeyLinkHorizontal())
                            .attr('stroke', d => {
                                // console.log(d);
                                return d.color})
                            .attr('stroke-width', d => Math.max(1, d.width))
                            .style('fill', 'none')
                            .on("mouseover", handleMouseOverSankey) // Function to handle mouseover event
                            .on("mouseout", handleMouseOutSankey)   // Function to handle mouseout event
                            .on("mousemove",handleMouseMoveSankey);

        link.transition().duration(750).ease(d3.easeLinear)
            .attr("d", d3.sankeyLinkHorizontal())
            .attr('stroke', d => {
                // console.log(d);
                return d.color})
            .attr("stroke-width", function(d) { return Math.max(1, d.width); });

        link.exit().remove();

        // Select the nodes and bind data
        var node = d3.select(".nodes-sankey").selectAll("g")
            .data(nodes);

        // Enter selection
        var nodeEnter = node.enter().append("g");

        // Append a rectangle to the enter selection
        nodeEnter.append("rect")
            .attr('x', d => d.x0)
            .attr('y', d => d.y0)
            .attr('height', d => d.y1 - d.y0)
            .attr('width', d => d.x1 - d.x0)
            .attr('fill', 'grey');

        // // Merge the enter and update selections
        // node = node.merge(nodeEnter);

        nodeEnter.append("text")
            .text(d => d.name) // Set the text to the node name or label
            .style('font-weight', 'bold') // Set the font-weight to 'bold'
            .attr('x', function(d) {
            if (this.getBBox().width < (d.y1 - d.y0)){
            return -(d.y1 - d.y0) / 2 ; // Default x position for other nodes
            } else {
            return (d.x1 - d.x0) / 2;
            }
            })
            .attr('y', function(d) {
            if ( (this.getBBox().width < (d.y1 - d.y0))){
            return (d.x1 - d.x0) / 2; // Default x position for other nodes
            } else {
            return (d.y1 - d.y0) / 2
            }
            })
            .attr('dy', '0.35em') // Adjust the vertical alignment
            .style('font-size', '12px') // Set the font size as needed
            .style('text-anchor', 'middle') // Center-align the text
            .style('fill', 'black') // Set text color
            .attr('transform', function(d) {
                // Conditionally rotate the text
                return (this.getBBox().width < (d.y1 - d.y0)) ? 
                'rotate(-90)' : null;
            });


        node
            .transition()
            .duration(750)
            .attr('transform', d => `translate(${d.x0}, ${d.y0})`);

        
        // Update the position and size of the rectangles
        node.select("rect")
            .transition()
            .duration(750)
            .attr('x', d => d.x0)
            .attr('y', d => d.y0)
            .attr('height', d => d.y1 - d.y0)
            .attr('width', d => d.x1 - d.x0);

        // Update the position and size of the rectangles
        node.select("text")
        .transition()
        .duration(750)
        .attr('x', function(d) {
            if (this.getBBox().width < (d.y1 - d.y0)){
            return -(d.y1 - d.y0) / 2 ; // Default x position for other nodes
          } else {
            return (d.x1 - d.x0) / 2;
          }
          })
         .attr('y', function(d) {
          if ( (this.getBBox().width < (d.y1 - d.y0))){
            return (d.x1 - d.x0) / 2; // Default x position for other nodes
          } else {
            return (d.y1 - d.y0) / 2
          }
          })
          .attr('transform', function(d) {
            // Conditionally rotate the text
            return (this.getBBox().width < (d.y1 - d.y0)) ? 
             'rotate(-90)' : null;
          })
        .text(d => d.name);

        // Remove any exiting nodes
        node.exit().remove();

    if (attr){
        
        if (attributes.length === 0){
            d3.select("#sankeyPlotTitle")
                .text(`Sankey plot`);

            d3.select('#attr0SankeyPlotTitle').text("");
            d3.select('#attr1SankeyPlotTitle').text("");
            d3.select('#attr2SankeyPlotTitle').text("");
        } else if (attributes.length === 1){
            d3.select("#sankeyPlotTitle")
                .text(`Sankey plot representing ${toName[attributes[0]]}`);

            d3.select('#attr0SankeyPlotTitle').text("HDI");
            d3.select('#attr1SankeyPlotTitle').text("");
            d3.select('#attr2SankeyPlotTitle').text(toName[attributes[0]]);
        
        } else {
            d3.select("#sankeyPlotTitle")
                    .text(`Sankey plot representing ${toName[attributes[0]]} and ${toName[attributes[1]]}`);
                    
                d3.select('#attr0SankeyPlotTitle').text("HDI");
                d3.select('#attr1SankeyPlotTitle').text(toName[attributes[0]]);
                d3.select('#attr2SankeyPlotTitle').text(toName[attributes[1]]);
        }
    }
}
}