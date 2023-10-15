var globalDataCountries;
var globalData;
var globalHDI;

var curYear;
var rangeMin;
var rangeMax;

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
    createSlider();
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

function createSlider (){


    // Get references to the slider container and value elements
    var slider = document.getElementById("slider");


    function filterPips(value, type) {
        if (value == 2016 || value % 5 == 0 && value != 2015){return 1;}
        else return 0;
    }

    // Create the multi-cursor slider with three cursors
    noUiSlider.create(slider, {
        start: [1970, 1990, 2010], // Initial positions of the three handles
        connect: true, // Connect all handles with colored bars
        range: {
            min: 1960,
            max: 2016,
        },
        tooltips: true,
        format: {
            to: function(value) {
                return Math.round(value);
            },
            from: function (value) {
                return value;
            }
        },
        pips: {
            mode: 'steps', // Use 'steps' mode for pips
            density: 5, // Density of pips
            filter: filterPips
        },
        step:1,
    });

    var activePips = [null, null,null];
    

    // Update the values as the handles are moved
    slider.noUiSlider.on("update", function (values, handle) {
        rangeMin = values[0];
        curYear = values[1];
        rangeMax = values[2];

        // Remove the active class from the current pip
        if (activePips[handle]) {
            activePips[handle].classList.remove('active-pip');
        }

        // Match the formatting for the pip
        var dataValue = Math.round(values[handle]);

        // Find the pip matching the value
        activePips[handle] = slider.querySelector('.noUi-value[data-value="' + dataValue + '"]');

        // Add the active class
        if (activePips[handle]) {
            activePips[handle].classList.add('active-pip');
        }
        // updateIdioms();
    }); 

    var sliderHandleYear = slider.querySelector(".noUi-handle[data-handle='1']");


    sliderHandleYear.addEventListener("mouseup",function (event) {
        updateIdioms();
    });

}

function updateIdioms(){
    updateChoroplethMap();
}