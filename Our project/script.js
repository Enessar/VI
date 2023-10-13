var globalDataCountries;
var globalData;
var globalHDI;

// Define margin and dimensions for the charts
const margin = {
    top: 20,
    right: 20,
    bottom: 50,
    left: 80,
  };
  const width = 900 - margin.left - margin.right;
  const height = 600 - margin.top - margin.bottom;


function startDashboard(){
    // Helper functions to load JSON and CSV files using D3's d3.json and d3.csv
    function loadJSON(file) {
        return d3.json(file);
    }
    function loadCSV(file) {
        return d3.csv(file);
    }
    
    // Function to import both files (data.json and gapminder.csv) using Promise.all
    function importFiles(file1, file2,file3) {
        return Promise.all([Promise.all([loadJSON(file1), loadCSV(file2)]), loadCSV(file3)]);
    }
    // File names for JSON and CSV files
    const file1 = "src/all data in one/data.json";
    const file2 = "src/All data in one/Q.csv";
    const file3 = "src/All data in one/HDI.csv";

    // Import the files and process the data
    importFiles(file1, file2,file3).then(function (results) {
        // Store the JSON data into globalDataCountries using topojson.feature
        globalDataCountries = topojson.feature(results[0][0], results[0][0].objects.countries);
        
        // Store the CSV data into globalDataCapita
        globalData = results[0][1];
        globalHDI = results[1];


        globalData.forEach(function (d) {
        d.Year = +d.Year;
        d.life_expectancy = +d.life_expectancy;
        d.Fertility_Rate = +d.Fertility_Rate;
        d.Replacement_Rate = +d.Replacement_Rate;
        d.Natural_Rate = +d.Natural_Rate;
        });
        //TODO maybe convert also globalDataHDI to numbers


    createChoroplethMap();
    });
}

// Function to create the choropleth map
function createChoroplethMap() {
  
    // Create a title for the choropleth map
    const chartTitle = d3
      .select("#choroplethTitle")
      .append("text")
      .attr("x", width / 2)
      .attr("y", margin.top)
      .text("Main map");
  
    // Create an SVG element to hold the map
    const svg = d3
      .select("#choropleth")
      .append("svg")
      .attr("width", width)
      .attr("height", height);
  
    // Create a group to hold the map elements
    const mapGroup = svg.append("g");
  
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
  
    // Create a projection to convert geo-coordinates to pixel values
    const projection = d3
      .geoMercator()
      .fitSize([width, height], globalDataCountries);
  
    // Create a path generator for the map
    const path = d3.geoPath().projection(projection);
  
    // Add countries as path elements to the map
    mapGroup
      .selectAll(".country")
      .data(globalDataCountries.features)
      .enter()
      .append("path")
      .attr("class", "country data")
      .attr("d", path)
      .attr("stroke", "black")
      .attr("stroke-width", 0.1) // Adjust this value to make the stroke very thin
    //   .on("mouseover", handleMouseOver) // Function to handle mouseover event
    //   .on("mouseout", handleMouseOut)   // Function to handle mouseout event
    //   .on("click", handleMouseClick)
      .append("title")
      .text((d) => d.properties.name);
  
    // Set the fill color of each country based on its incomeperperson value
    globalData.forEach((element) => {
      mapGroup
        .selectAll("path")
        .filter(function (d) {
          return d.properties.name == element.Country_name && element.Year == 2016;
        })
        .attr("fill", 
        d3.interpolate(
            d3.interpolateGreens(colorScale1(element.life_expectancy))
            ,
            d3.interpolateReds(colorScale2(element.Fertility_Rate))
                )(0.5)
        // (d) => {
        //     const value1 = element.life_expectancy; // Replace with your actual dimension1 value
        //     const value2 = element.Fertility_Rate; // Replace with your actual dimension2 value
        

        //     // Calculate the relative weight of each dimension in color mixing
        //     const weight1 = value1 / (value1 + value2);
        //     const weight2 = value2 / (value1 + value2);

        //     const color1 = d3.interpolateBlues(weight1); // Use interpolateBlues for the first dimension
        //     const color2 = d3.interpolateOranges(weight2); // Use interpolateOranges for the second dimension
      
        //     // Calculate the mixed color
        //     return d3.interpolate(color1, color2)(0.5); // You can adjust the weight as needed

        // }
        );
    });
  
    // Create zoom behavior for the map
    const zoom = d3
      .zoom()
      .scaleExtent([1, 15])
      .translateExtent([
        [0, 0],
        [width, height],
      ])
      .on("zoom", zoomed);
  
    // Apply zoom behavior to the SVG element
    svg.call(zoom);
  
    // Function to handle the zoom event
    function zoomed(event) {
      mapGroup.attr("transform", event.transform);
    }
  
    // Create a legend for the choropleth map
    const legendWidth = 250; // Width of the legend
    const legendHeight = 250; // Height of the legend
    
    const legendSvg = d3.select("#choroplethLabel")
        .append("svg")
        .attr("width", legendWidth )
        .attr("height", legendHeight);
        
    const heatWidth = 200;
    const heatHeight = 200;

    const numColumns = 10; // Number of columns (dimension 1)
    const numRows = 10; // Number of rows (dimension 2)
    
    const columnWidth = heatWidth / numColumns;
    const rowHeight = heatHeight / numRows;


    
    for (let i = 0; i < numColumns; i++) {
        for (let j = 0; j < numRows; j++) {
            const mixedColor = d3.interpolate(
                d3.interpolateGreens((i + 0.5) / numColumns),
                            d3.interpolateReds((j + 0.5) / numRows))(0.5) // Adjust the mixing ratio as needed
            
    
            legendSvg.append("rect")
                .attr("x", i * columnWidth +50)
                .attr("y", heatHeight -j * rowHeight)
                .attr("width", columnWidth)
                .attr("height", rowHeight)
                .style("fill", mixedColor);
        }
    }

    const legend = legendSvg.append("g").attr("transform", `translate(0, 0)`);


    // Add tick marks and labels to the legend
    for (let index = 0; index <= 1; index+=0.2) {
        // console.log(colorScale1.invert(index))
        legend
        .append("text")
        .attr("x", 0)
        .attr("y", legendHeight - legendHeight * index + 10)
        .text(Math.round(colorScale2.invert(index)));
    }

    // Position the legend on the page
    legendSvg.attr("transform", "translate(10, 20)"); // Adjust the translation as needed
  }
