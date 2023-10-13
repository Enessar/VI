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
  const width = 500 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;


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
    .scaleLinear()
    .domain([
    d3.min(globalData, (d) => d.life_expectancy),
    d3.max(globalData, (d) => d.life_expectancy),
    ])
    .range([0, 1]);

    const colorScale2 = d3
    .scaleLinear()
    .domain([
    d3.min(globalData, (d) => d.Fertility_Rate),
    d3.max(globalData, (d) => d.Fertility_Rate),
    ])
    .range([0, 1]);
  
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
    //   .attr("stroke", "black")
    //   .attr("stroke-width", 0.5) // Adjust this value to make the stroke very thin
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
          return d.properties.name == element.Country_name;
        })
        .attr("fill", 
        d3.interpolateBlues(colorScale1(element.life_expectancy))
        // (d) => {
        //     const value1 = d.life_expectancy; // Replace with your actual dimension1 value
        //     const value2 = d.Fertility_Rate; // Replace with your actual dimension2 value
        

        //     // Calculate the relative weight of each dimension in color mixing
        //     const weight1 = value1 / (value1 + value2);
        //     const weight2 = value2 / (value1 + value2);

        //     // Interpolate colors for both dimensions and combine them
        //     const color1 = d3.interpolateBlues(colorScale1(element.life_expectancy));
        //     const color2 = cd3.interpolateBlues(colorScale1(element.Fertility_Rate));

        //     const mixedColor = d3.rgb(color1).mix(d3.rgb(color2), weight2);

        //     return mixedColor;
        // }
        );
    });
  
    // Create zoom behavior for the map
    const zoom = d3
      .zoom()
      .scaleExtent([1, 10])
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
  
    // // Create a legend for the choropleth map
    // const svg2 = d3
    //   .select("#choroplethLabel")
    //   .append("svg")
    //   .attr("width", width * 0.2)
    //   .attr("height", height);
  
    // // Create a gradient for the legend color scale
    // const defs = svg2.append("defs");
    // const gradient = defs
    //   .append("linearGradient")
    //   .attr("id", "colorScaleGradient")
    //   .attr("x1", "0%")
    //   .attr("y1", "0%")
    //   .attr("x2", "0%")
    //   .attr("y2", "100%");
  
    // gradient
    //   .append("stop")
    //   .attr("offset", "0%")
    //   .attr("stop-color", d3.interpolateBlues(0));
  
    // gradient
    //   .append("stop")
    //   .attr("offset", "100%")
    //   .attr("stop-color", d3.interpolateBlues(1));
  
    // // Create the legend rectangle filled with the color scale gradient
    // const legend = svg2.append("g").attr("transform", `translate(0, 40)`);
    // const legendHeight = height - 40;
    // const legendWidth = 20;
  
    // legend
    //   .append("rect")
    //   .attr("width", legendWidth)
    //   .attr("height", legendHeight)
    //   .style("fill", "url(#colorScaleGradient)");
  
    // // Add tick marks and labels to the legend
    // for (let index = 0; index <= 1; index += 0.25) {
    //   legend
    //     .append("text")
    //     .attr("x", legendWidth + 5)
    //     .attr("y", legendHeight * index)
    //     .text(Math.round(colorScale.invert(index)));
    // }
  }
