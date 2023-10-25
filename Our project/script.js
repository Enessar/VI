var globalDataCountries;
var globalData;
var globalHDI;
var filteredData;

var curYear;
var rangeMin;
var rangeMax;

// Variable for the Map
var colorScaleMap1 = null;
var colorScaleMap2 = null;

//variable for sankeyplot
var sankey = null;
function sankeyContinetOrder(continent){
  if(continent == "Asia"){ return 0}
  else if(continent == "Europe"){ return 1}
  else if(continent == "Africa"){ return 2}
  else if(continent == "Americas"){ return 3}
  else if(continent == "Oceania"){ return 4}
  else {return -1}
}

// Variable for the line chart
const colorScaleLine = d3.scaleOrdinal()
  .domain(['Asia', 'Africa', 'Europe', 'Americas', 'Oceania', 'Unknown'])
  .range(['rgb(6,95,244,255)', 'rgb(250, 194, 34)', 'rgb(27, 213, 170)', 'rgb(249, 112, 11, 1)', 'rgb(0, 42, 76)', 'rgb(136, 111, 54)']);
var xScaleLine = null;
var dataByContinent = null;

// buttons
var setButtons = new Set();
var setFilter = new Set();

// map for name columns to display
const toName = {
  Fertility_Rate: "Fertility Rate",
  life_expectancy: "Life Expectancy",
  HDI: "HDI",
  Natural_Rate: "Natural Rate",
  Replacement_Rate: "Replacement Rate",
  HDI:"HDI",
  // Add more mappings as needed
};

const DevelopmentLevels = {
  HD: "Highly D",
  D: "Developed",
  UD: "Underdeveloped",
  SUD: "Strongly UD",
};

const LifeExpectanyLevels = {
  VH: "Very High",
  H: "High",
  M: "Moderate",
  L: "Low",
  VL: "Very Low",
};

const ReplacementRateLevels = {
  A: "Above",
  C: "Constant Replacement",
  B: "Below Replacement",
}

const FertilityRateLevels = {
  VHF: "Very High Fertility",
  HF: "High Fertility",
  MF: "Moderate Fertility",
  LF: "Low Fertility",
  VLF: "Very Low Fertility",
};

const NaturalRateLevels = {
  A: "Population Growth",
  C: "Maintaining",
  B: "Population Decline",
};
//to put in the dataSet
const CONTINENT_MAP = [
    {
      continent: 'Oceania',
      countries: ['Australia', 'Fiji', 'Papua New Guinea'],
    },
    {
      continent: 'Europe',
      countries: [
        'Hungary',
        'Czech',
        'Slovakia',
        'Slovenia',
        'Serbia',
        'Croatia',
        'Bosnia and Herz.',
        'Montenegro',
        'Macedonia',
        'Kosovo',
        'Albania',
        'Moldova',
        'Europe',
        'Belarus',
        'Lithuania',
        'Latvia',
        'Estonia',
        'Czechia',
        'Ireland',
        'Iceland',
        'Aruba',
        'Austria',
        'Azerbaijan',
        'Belgium',
        'Bulgaria',
        'Croatia',
        'Cyprus',
        'Denmark',
        'Finland',
        'France',
        'Georgia',
        'Germany',
        'Greece',
        'Italy',
        'Luxembourg',
        'Malta',
        'Netherlands',
        'Norway',
        'Poland',
        'Portugal',
        'Romania',
        'Spain',
        'Sweden',
        'Switzerland',
        'Ukraine',
        'United Kingdom',
      ],
    },
    {
      continent: 'Asia',
      countries: [
        'Bahrain',
        'Syria',
        'Azerbi',
        'Azerbaijan',
        'China',
        'India',
        'Mongolia',
        'Cambodia',
        'Vietnam',
        'Sri lanka',
        'Philippines',
        'Indonesia',
        'Armenia',
        'Afghanistan',
        'Tajikistan',
        'Nepal',
        'Bhutan',
        'Bangladesh',
        'Lebanon',
        'Iran',
        'Iraq',
        'Israel',
        'Japan',
        'Jordan',
        'Kazakhstan',
        'Myanmar',
        'South Korea',
        'Kuwait',
        'Kyrgyzstan',
        'Laos',
        'Malaysia',
        'Oman',
        'Pakistan',
        'Qatar',
        'Russia',
        'Saudi Arabia',
        'Singapore',
        'Thailand',
        'Turkey',
        'Turkmenistan',
        'United Arab Emirates',
        'Uzbekistan',
        'Vietnam',
        'Yemen',
      ],
    },
    {
      continent: 'Africa',
      countries: [
 
    'Algeria',
    'Angola',
    'Benin',
    'Botswana',
    'Burkina Faso',
    'Burundi',
    'Cabo Verde',
    'Cameroon',
    'Central African Rep.',
    'Chad',
    'Comoros',
    'Congo',
    'Dem. Rep. Congo',
    'Djibouti',
    'Egypt',
    'Eq. Guinea',
    'Eritrea',
    'Ethiopia',
    'Gabon',
    'Gambia',
    'Ghana',
    'Guinea',
    'Guinea-Bissau',
    'Kenya',
    'Lesotho',
    'Liberia',
    'Libya',
    'Madagascar',
    'Malawi',
    'Mali',
    'Mauritania',
    'Mauritius',
    'Morocco',
    'Mozambique',
    'Namibia',
    'Niger',
    'Nigeria',
    'Rwanda',
    'Sao Tome and Principe',
    'Senegal',
    'Seychelles',
    'Sierra Leone',
    'Somalia',
    'South Africa',
    'S. Sudan',
    'Sudan',
    'Tanzania',
    'Togo',
    'Tunisia',
    'Uganda',
    'Zambia',
    'Zimbabwe'
      ]
    },
    {
      continent: 'Americas',
      countries: [    
    'Greenland',
    'Antigua and Barbuda',
    '"Bahamas, The"',
    'Barbados',
    'Belize',
    'Canada',
    'Costa Rica',
    'Cuba',
    'Dominican Republic',
    'El Salvador',
    'Grenada',
    'Guatemala',
    'Haiti',
    'Honduras',
    'Jamaica',
    'Mexico',
    'Nicaragua',
    'Panama',
    'Trinidad and Tobago',
    'United States of America',
    'Argentina',
    'Bolivia',
    'Brazil',
    'Chile',
    'Colombia',
    'Ecuador',
    'Guyana',
    'Paraguay',
    'Peru',
    'Suriname',
    'Uruguay',
    'Venezuela'
    ]  
  },
  {
    continent: 'Unknown',
    countries: [] // Leave this empty or add specific countries as needed
  }
  ];

// Define margin and dimensions for the charts
const margin = {
    top: 20,
    right: 20,
    bottom: 50,
    left: 80,
  };
  const width = 800 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;

function getContinentForCountry(country) {
    for (const continentInfo of CONTINENT_MAP) {
        const countries = continentInfo.countries;
        if (countries.includes(country.Country_name)) {
            return continentInfo.continent;
        }
    }
    return "Unknown"; // Default to "Unknown" if the country is not found in the map
}


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
        d.HDI= +d.HDI; 
        });
        //TODO maybe convert also globalDataHDI to numbers


        xScaleLine = (x => 0);

    dataByContinent= d3.group(globalData, (d) => {
      const country = d.Country_name;
      const continentEntry = CONTINENT_MAP.find((entry) =>
        entry.countries.includes(country)
      );
      return continentEntry ? continentEntry.continent : 'Unknown';
    });
    createSlider();
    createButtons();
    createFilterButtons();
    filterData(); //filter data the first time
    filteredDataYear = filteredData;
    createChoroplethMap();
    createLineChart();
    createSankyPlot(); 
    updateIdioms();
  });
}

// Function to create the choropleth map
function createChoroplethMap() {
  
    var attributes = Array.from(setButtons);
    // Create a title for the choropleth map
    const chartTitle = d3
      .select("#choroplethTitle")
      .append("text")
      .attr("x", width / 2)
      .attr("y", margin.top)
      .text(`Main map representing ${toName[attributes[0]]} and ${toName[attributes[1]]}`);
    
  
    // Create an SVG element to hold the map
    const svg = d3
      .select("#choropleth")
      .append("svg")
      .attr("width", width + 800)
      .attr("height", height);
  
    // Create a group to hold the map elements
    const mapGroup = svg.append("g");
    
    // Create a color scale for the first attribute
    colorScaleMap1 = d3
        .scaleLinear()
        .domain([
        d3.min(filteredData, (d) => d.life_expectancy),
        d3.max(filteredData, (d) => d.life_expectancy),
        ])
        .range([0, 1]);
    
    // Create a color scale for the second attribute
    colorScaleMap2 = d3
        .scaleLinear()
        .domain([
        d3.min(filteredData, (d) => d.Fertility_Rate),
        d3.max(filteredData, (d) => d.Fertility_Rate),
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
      .attr("stroke", "black")
      .attr("stroke-width", 0.1) // Adjust this value to make the stroke very thin
      .on("mouseover", handleMouseOverMap) // Function to handle mouseover event
      .on("mouseout", handleMouseOutMap)   // Function to handle mouseout event
      .on("mousemove",handleMouseMoveMap)
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
            d3.interpolateGreens(colorScaleMap1(element.life_expectancy))
            ,
            d3.interpolateReds(colorScaleMap2(element.Fertility_Rate))
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
    const legendWidth = 200; // Width of the legend
    const legendHeight = 200; // Height of the legend
    
    const legendSvg = d3.select("#choroplethLabel")
        .append("svg")
        .attr("width", legendWidth )
        .attr("height", legendHeight);
        
    const heatWidth = 100;
    const heatHeight = 100;

    const numColumns = 10; // Number of columns (dimension 1)
    const numRows = 10; // Number of rows (dimension 2)
    
    const columnWidth = heatWidth / numColumns;
    const rowHeight = heatHeight / numRows;


    
    for (let i = 0; i < numColumns; i++) {
      // if (i%2 == 0){
      //   legendSvg.append("text")
      //             .attr("x", i * columnWidth +50)
      //             .attr("y", 150)
      //             .attr("font-size", "10px") // Add this line to set the font size
      //             .text((i + 0.5) / numColumns);
      // }
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

    const legend = legendSvg.append("g").attr("transform", `translate(35, 125)`);


    // Define the arrowhead path
    const arrowhead = "M0 0 L10 5 L0 10 L3 5Z";

    // x-axis
      legend.append("text")
            .attr("x", 20)
            .attr("y", 0)
            .attr("id", "minXLegendMap")
            .attr("font-size", "13px") // Add this line to set the font size
            .attr("text-anchor", "middle") // Center the text horizontally
            .text(d3.min(filteredData, (d) => d[attributes[0]]));
      legend.append("text")
            .attr("x", 120)
            .attr("y", 0)
            .attr("id", "maxXLegendMap")
            .attr("font-size", "13px") // Add this line to set the font size
            .attr("text-anchor", "middle") // Center the text horizontally
            .text(d3.max(filteredData, (d) => d[attributes[0]].toFixed(2)));
      legend.append("text")
          .attr("x", 70)
          .attr("y", 20)
          .attr("id", "textXLegendMap")
          .attr("font-size", "15px") // Add this line to set the font size
          .attr("text-anchor", "middle") // Center the text horizontally
          .text(toName[attributes[0]]);

      // Draw an arrow body (a line) using a line element
      legend.append("line")
        .attr("x1", 14)
        .attr("y1", -15)
        .attr("x2", 118)
        .attr("y2", -15)
        .attr("stroke", "black")
        .attr("stroke-width", 2);
      // Draw an arrow using a path element
      legend.append("path")
        .attr("d", arrowhead)
        .attr("fill", "black")
        .attr("transform", "translate(110, -20)");
    
    // y-axis
      legend.append("text")
            .attr("x", -18)
            .attr("y", -10)
            .attr("id", "minYLegendMap")
            .attr("font-size", "13px") // Add this line to set the font size
            .attr("text-anchor", "right") // Center the text horizontally  
            .text(d3.min(filteredData, (d) => d[attributes[1]].toFixed(2)));
      legend.append("text")
            .attr("x", -18)
            .attr("y", -110)
            .attr("id", "maxYLegendMap")
            .attr("font-size", "13px") // Add this line to set the font size
            .attr("text-anchor", "right") // Center the text horizontally
            .text(d3.max(filteredData, (d) => d[attributes[1]].toFixed(2)));
      legend.append("text")
          .attr("x", -60)
          .attr("y", 30)
          .attr("id", "textYLegendMap")
          .attr("font-size", "15px") // Add this line to set the font size
          .attr("text-anchor", "middle") // Center the text horizontally
          .attr("transform", "rotate(90)") // Rotate the text 90 degrees counter-clockwise
          .text(toName[attributes[1]]);
      // Draw an arrow body (a line) using a line element
      legend.append("line")
        .attr("x1", 15)
        .attr("y1", -14)
        .attr("x2", 15)
        .attr("y2", -118)
        .attr("stroke", "black")
        .attr("stroke-width", 2);
      // Draw an arrow using a path element
      legend.append("path")
        .attr("d", arrowhead)
        .attr("fill", "black")
        .attr("transform", " rotate(-90), translate(110,10)");

    // Position the legend on the page
    legendSvg.attr("transform", "translate(10, 20)"); // Adjust the translation as needed


  }



 // Function to create a line chart
 function createLineChart() {
  var attributes = Array.from(setButtons);


  // Create a title for the line chart
  const chartTitle = d3
    .select("#lineChartTitle")
    .append("text")
    .attr("x", width / 2)
    .attr("y", margin.top)
    .text(`Line chart representing ${toName[attributes[0]]}`);

  // Create an SVG element to hold the line chart
  const svg = d3
    .select("#lineChart")
    .append("svg")
    .attr("width", width + 200)
    .attr("height", height );


  const yScale = d3
   .scaleLinear()
    .domain([
      d3.min(filteredData, (d) => d.life_expectancy),
      d3.max(filteredData, (d) => d.life_expectancy),
    ])
    .nice()
    .range([height - margin.bottom, margin.top]);

  xScaleLine = d3
    .scaleLinear()
    .domain([rangeMin, rangeMax]) // Adjust the domain based on your data
    .range([margin.left, width - margin.right - 100]);

  // Add axes
  const xAxis = d3.axisBottom(xScaleLine).tickFormat(d3.format("d"));
  const yAxis = d3.axisLeft(yScale);
  
  
  // Create a line generator
  const line = d3
    .line()
    .x((d) => xScaleLine(d.Year))
    .y((d) => yScale(d.life_expectancy));
  

  // Create a group for the line chart elements
  const chartGroup = svg.append("g");

// Group the data by continent
const dataByContinent = d3.group(filteredData, (d) => {
  const country = d.Country_name;
  const continentEntry = CONTINENT_MAP.find((entry) =>
    entry.countries.includes(country)
  );
  return continentEntry ? continentEntry.continent : 'Unknown';
});


// Iterate through each group (continent) and create a line for each
dataByContinent.forEach((continentData, continent) => {
  if (continent !== 'Unknown') {  // Exclude 'Unknown'
  chartGroup
    .append("path")
    .datum(continentData)
    .attr("class", "line")
    .attr("d", line)
    .attr("fill", "none")
    .attr("stroke", colorScaleLine(continent))
    // .on("mouseover", handleMouseOverLine) // Function to handle mouseover event
    // .on("mouseout", handleMouseOutLine)   // Function to handle mouseout event
    // .on("mousemove",handleMouseMoveLine);
}
 });

 const currentYearLine = chartGroup
  .append("line")
  .attr("class", "current-year-line")
  .attr("x1", xScaleLine(curYear)) // Position the start of the line
  .attr("x2", xScaleLine(curYear)) // Position the end of the line
  .attr("y1", margin.top) // Start at the top of the chart
  .attr("y2", height - margin.bottom) // Extend to the bottom of the chart
  .attr("stroke", "red") // Customize the color of the line (you can adjust it)
  .attr("stroke-width", 2); // Customize the line width

  // Create a group for the legend elements
  const legendGroup = svg
  .append("g")
  .attr("class", "legend")
  .attr("transform", `translate(${600}, ${margin.top})`);

  // Extract a list of all unique continents, including 'Unknown'
  const uniqueContinents = Array.from(dataByContinent.keys()).filter((continent) => continent !== 'Unknown');

  // Create the legend items
  const legendItems = legendGroup
  .selectAll(".legend-item")
  .data(uniqueContinents)
  .enter()
  .append("g")
  .attr("class", "legend-item")
  .attr("transform", (d, i) => `translate(0, ${i * 20})`);

  // Add colored rectangles for each continent
  legendItems
  .append("rect")
  .attr("width", 16)
  .attr("height", 16)
  .style("fill", (d) => colorScaleLine(d))
  .attr("rx", 3) // Rounded corners
  .style("stroke", "black") // Border color
  .style("stroke-width", 1) // Border width
  .style("background-color", "black"); // Background color here


  // Add text labels for each continent
  legendItems
  .append("text")
  .attr("x", 23)
  .attr("y", 9)
  .attr("dy", ".35em")
  .style("text-anchor", "start")
  .text((d) => d);


   svg
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(xAxis);

  // You can also customize the x-axis as needed here
  svg
    .selectAll(".x-axis text")
    .attr("transform", "rotate(-45)")
    .style("text-anchor", "end")
    .attr("dx", "-0.8em")
    .attr("dy", "0.15em");

  svg
    .append("g")
    .attr("class", "y-axis")
    .attr("transform", `translate(${margin.left}, 0)`)
    .call(yAxis);
  
    // Add x-axis label
  svg
  .append("text")
  .attr("class", "x-axis-label")
  .attr("text-anchor", "middle")
  .attr("x", width / 2 -20 )
  .attr("y", height - margin.bottom / 2 + 25)
  .text("Year");

  svg
  .append("text")
  .attr("id", "y-axis-label-LineChart")
  .attr("text-anchor", "middle")
  .attr("transform", "rotate(-90)")
  .attr("x", -(height / 2))
  .attr("y", margin.left - 50)
  .text(toName[attributes[0]]); 
  
}


function createButtons(){
    const warningMessage = d3.select("#warningMessage");

    // Select button 1 using D3.js
    var fertilityR = d3.select("#fertilityR").style('background-color','rgb(244, 69, 0)');

    // Add a click event listener to button 1
    fertilityR.on("click", function() {
        if (setButtons.has("Fertility_Rate")){
            setButtons.delete("Fertility_Rate");
            fertilityR.classed('active', false);
            updateIdioms(true);
        } else if (setButtons.size >= 2) {
            
        } else {
            setButtons.add("Fertility_Rate");
            fertilityR.classed('active', true);
            updateIdioms(true);
        }
    });
    // Select button 1 using D3.js
    var lifeExp = d3.select("#lifeExp").style('background-color','rgb(244, 69, 0)');

    // Add a click event listener to button 1
    lifeExp.on("click", function() {
        if (setButtons.has("life_expectancy")){
            setButtons.delete("life_expectancy");
            lifeExp.classed('active', false);
            updateIdioms(true);
        } else if (setButtons.size >= 2) {
            
        } else {
            setButtons.add("life_expectancy");
            lifeExp.classed('active', true);
            updateIdioms(true);
        }
    });

    // selecteur of the slider
    var slider = document.getElementById("slider");


    // Select button 1 using D3.js
    var birthR = d3.select("#HDI").style('background-color','rgb(244, 69, 0)');

    // Add a click event listener to button 1
    birthR.on("click", function() {
        if (setButtons.has("HDI")){
            setButtons.delete("HDI");
            birthR.classed('active', false);
            // Change the minimum value of the slider
            slider.noUiSlider.updateOptions({
              range: {
                  min: 1960, // New minimum value
                  max: 2016, // Keep the maximum value
              }
          });
          filterData();
          updateIdioms(true);
        } else if (setButtons.size >= 2) {
            
        } else {
            setButtons.add("HDI");
            birthR.classed('active', true);
            rangeMin = 1990;
            rangeMax = 2016;
            curYear = 2010;
            slider.noUiSlider.set([rangeMin, curYear, rangeMax]);
            // Change the minimum value of the slider
            slider.noUiSlider.updateOptions({
              range: {
                  min: 1990, // New minimum value
                  max: 2016, // Keep the maximum value
              }
          });
          filterData();
          updateIdioms(true);
        }
    });
    // Select button 1 using D3.js
    var naturalR = d3.select("#naturalR").style('background-color','rgb(244, 69, 0)');

    // Add a click event listener to button 1
    naturalR.on("click", function() {
        if (setButtons.has("Natural_Rate")){
            setButtons.delete("Natural_Rate");
            naturalR.classed('active', false);
            updateIdioms(true);
        } else if (setButtons.size >= 2) {
            
        } else {
            setButtons.add("Natural_Rate");
            naturalR.classed('active', true);
            updateIdioms(true);
        }
    });
    // Select button 1 using D3.js
    var raplacementR = d3.select("#raplacementR").style('background-color','rgb(244, 69, 0)');

    // Add a click event listener to button 1
    raplacementR.on("click", function() {
        if (setButtons.has("Replacement_Rate")){
            setButtons.delete("Replacement_Rate");
            raplacementR.classed('active', false);
            updateIdioms(true);
        } else if (setButtons.size >= 2) {
            // Show the warning message
            warningMessage.style("display", "block");
        } else {
            setButtons.add("Replacement_Rate");
            raplacementR.classed('active', true);
            // Hide the warning message if it was previously shown
            warningMessage.style("display", "none");
            updateIdioms(true);
        }
    });

    // put the first 2 attributes:
    setButtons.add("life_expectancy");
    lifeExp.classed('active', true);
    setButtons.add("Fertility_Rate");
    fertilityR.classed('active', true);

}

function createSlider (){
    // Get references to the slider container and value elements
    var slider = document.getElementById("slider");
    
    rangeMin = 1970;
    rangeMax = 2010;
    filterData(); //filter data the first time
    filteredDataYear = filteredData;

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

        updateIdioms();

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
    }); 

    // var sliderHandleYear = slider.querySelector(".noUi-handle[data-handle='1']");
    var sliderHandleMin = slider.querySelector(".noUi-handle[data-handle='0']");
    var sliderHandleMax = slider.querySelector(".noUi-handle[data-handle='2']");

    
    // sliderHandleYear.addEventListener("mouseup",function (event) {
    //     updateIdioms();
    // });
    sliderHandleMin.addEventListener("mouseup",function (event) {
        filterData();
        updateIdioms(true);
    });
    sliderHandleMax.addEventListener("mouseup",function (event) {
        filterData();
        updateIdioms(true);
    });
    // Play flag to indicate if the animation is running
    var isPlaying = false;
    var playIntervalId;

    slider.addEventListener("click", function (event) {
        if (isPlaying) {
          clearInterval(playIntervalId); // Pause the animation
          isPlaying = false;
        }
        updateIdioms();
      });
    
    var playButton = d3.select("#play-button");

    // Function to update the slider's value
    function updateSliderValue(newValue) {
        var currentValues = slider.noUiSlider.get();
        currentValues[1] = newValue;
        slider.noUiSlider.set(currentValues);
        updateIdioms(); // Call your function to update the visualizations
    }


    // Function to handle the play functionality
    function playSlider() {
        if (isPlaying) {
            // If animation is running, stop it
            clearInterval(playIntervalId);
            isPlaying = false;
        } else {
            var currentValue = parseInt(slider.noUiSlider.get()[1]);
            var maxValue = rangeMax; // Maximum value of the slider
            var playInterval = 500; // 500 milliseconds (half a second)

            function incrementValue() {
                currentValue += 5; // Increment the value
                if (currentValue <= maxValue) {
                    updateSliderValue(currentValue); // Update the slider
                } else {
                    currentValue = rangeMin;
                }
            }

            playIntervalId = setInterval(incrementValue, playInterval); // Start playing
            isPlaying = true;
        }
    }

    // Add a click event listener to the play button
    playButton.on("click", function() {
        playSlider(); // Start/stop playing the slider
    });

  
}

function filterData(){
    filteredData = globalData.filter((element) => {
        const year = element.Year;
        const country = element.Country_name
        return year >= rangeMin && year <= rangeMax  && CountryInSelectedContinents(country);
      });

    function CountryInSelectedContinents(country){
        for (const continentInfo of CONTINENT_MAP) {
            const countries = continentInfo.countries;
            if (setFilter.has(continentInfo.continent) && countries.includes(country)) {
                return true;
            }
        }
    return false;
    }
}

function updateIdioms(attr = false){
    updateChoroplethMap(attr);
    updateLineChart(attr);
    updateSankyPlot(attr);
}

function createFilterButtons() {
    const warningMessage = d3.select("#warningMessage");
    // Select button 1 using D3.js
    var africaBtn = d3.select("#africa").style("background-color", colorScaleLine('Africa'));
    // Add a click event listener to button 1
    africaBtn.on("click", function() {
      if (setFilter.has("Africa")){
        setFilter.delete("Africa");
        africaBtn.classed('active', false);
        filterData();
        updateIdioms(true);
    } else {
        setFilter.add("Africa");
        africaBtn.classed('active', true);
        filterData();

        updateIdioms(true);
    }
    });
  
    // Select button 2 using D3.js
    var asiaBtn = d3.select("#asia").style("background-color", colorScaleLine('Asia'));
    // Add a click event listener to button 2
    asiaBtn.on("click", function() {
      if (setFilter.has("Asia")){
        setFilter.delete("Asia");
        asiaBtn.classed('active', false);
        filterData();
        updateIdioms(true);
    } else {
        setFilter.add("Asia");
        asiaBtn.classed('active', true);
        filterData();
        updateIdioms(true);
    }
    });
  
  
   // Select button 3 using D3.js
   var europeBtn = d3.select("#europe").style("background-color", colorScaleLine('Europe'));
   // Add a click event listener to button 3
   europeBtn.on("click", function() {
     if (setFilter.has("Europe")){
       setFilter.delete("Europe");
       europeBtn.classed('active', false);
       filterData();
       updateIdioms(true);
   } else {
       setFilter.add("Europe");
       europeBtn.classed('active', true);
       filterData();
       updateIdioms(true);
   }
   });
  
   // Select button 4 using D3.js
   var AmericaBtn = d3.select("#Americas").style("background-color", colorScaleLine('Americas'));
   // Add a click event listener to button 4
   AmericaBtn.on("click", function() {
     if (setFilter.has("Americas")){
       setFilter.delete("Americas");
       AmericaBtn.classed('active', false);
       filterData();
       updateIdioms(true);
   } else {
       setFilter.add("Americas");
       AmericaBtn.classed('active', true);
       filterData();
       updateIdioms(true);
   }
   });
  
   // Select button 5 using D3.js
   var OceaniaBtn = d3.select("#Oceania").style("background-color", colorScaleLine('Oceania'));
   // Add a click event listener to button 5
   OceaniaBtn.on("click", function() {
     if (setFilter.has("Oceania")){
       setFilter.delete("Oceania");
       OceaniaBtn.classed('active', false);
       filterData();
       updateIdioms(true);
   } else {
       setFilter.add("Oceania");
       OceaniaBtn.classed('active', true);
       filterData();
       updateIdioms(true);
  }
  });

  setFilter.add("Africa");
  africaBtn.classed('active', true);
  setFilter.add("Asia");
  asiaBtn.classed('active', true);
  setFilter.add("Europe");
  europeBtn.classed('active', true);
  setFilter.add("Americas");
  AmericaBtn.classed('active', true);
  setFilter.add("Oceania");
  OceaniaBtn.classed('active', true);

  
  }

function Development_Level(element) {
  if (element.HDI>0.800){
    return [0, DevelopmentLevels.HD]
  } else if (element.HDI>0.700){
    return [1, DevelopmentLevels.D]
  }  else if (element.HDI>0.550){
    return [2, DevelopmentLevels.UD]
  }  else {
    return [3,DevelopmentLevels.SUD]
  }
}

function LifeExpectancy_Level(element) {
  if (element.life_expectancy>90){
    return [4,LifeExpectanyLevels.VH]
  } else if (element.life_expectancy>80){
    return [5, LifeExpectanyLevels.H]
  } else if (element.life_expectancy>70){
    return [6, LifeExpectanyLevels.M]
  } else if (element.life_expectancy>60){
    return [7,LifeExpectanyLevels.L]
  } else { 
    return [8, LifeExpectanyLevels.VL]
  }
}

function ReplacementRate_Level(element) {
  if (element.Replacement_Rate<2){
    return [9, ReplacementRateLevels.A]
  } else if (element.Replacement_Rate>=2 && element.Replacement_Rate<=2.2){
    return [10,ReplacementRateLevels.C]
  } else { 
    return [11, ReplacementRateLevels.B]
  }
}

function FertilityRate_Level(element) {
  if (element.Fertility_Rate>4){
    return [12, FertilityRateLevels.VHF]
  } else if (element.Fertility_Rate>3){
    return [13, FertilityRateLevels.HF]
  } else if (element.Fertility_Rate>2.1){
    return [14, FertilityRateLevels.MF]
  } else if (element.Fertility_Rate>1.5){
    return [15, FertilityRateLevels.LF]
} else {return [16, FertilityRateLevels.VLF]}
}

function NaturalRate_Level(element) {
  if (element.Natural_Rate<2){
    return [9, NaturalRateLevels.B]
  } else if (element.Natural_Rate>=2 && element.Natural_Rate<=2.2){
    return [10,NaturalRateLevels.C]
  } else { 
    return [11, NaturalRateLevels.A]
  }
}

function SankeyLayers(d, attributes){
  target1 = null; target2 = null;
  if(attributes[0] = "life_expectancy"  || attributes[1] ="life_expectancy"){
    target1 = LifeExpectancy_Level(d);
    if(attributes[0] == "Replacement_Rate" || attributes[1] =="Replacement_Rate"){
      target2 = ReplacementRate_Level(d);
    }
    else if(attributes[0] == "Fertility_Rate" || attributes[1] =="Fertility_Rate"){
      target2 = FertilityRate_Level(d);
    }
    else if(attributes[0] == "Natural_Rate" || attributes[1] =="Natural_Rate"){
      target2 = NaturalRate_Level(d);
    } 
  }else if(attributes[0] == "Natural_Rate"  || attributes[1] =="Natural_Rate"){
    target1 = NaturalRate_Level(d);
    if(attributes[0] == "Replacement_Rate" || attributes[1] =="Replacement_Rate"){
    target2 = ReplacementRate_Level(d);
    }
    else if(attributes[0] == "Fertility_Rate" || attributes[1] =="Fertility_Rate"){
    target2 = FertilityRate_Level(d);
  }
}else if(attributes[0] == "Fertility_Rate" || attributes[1] =="Fertility_Rate"){
  target1 = FertilityRate_Level(d)
  if(attributes[0] == "Replacement_Rate" || attributes[1] =="Replacement_Rate"){
    target2 = ReplacementRate_Level(d);
  }
} 
return [target1, target2]
}

function createSankyPlot(){
    // Assuming 'filteredData' is an array containing your CSV data
// Define your Sankey data directly
const sankeyData = {
  nodes: [],
  links: [] };

    // Create a title for the choropleth map
/*const chartTitle = d3
      .select("#choroplethTitle")
      .append("text")
      .attr("x", width / 2)
      .attr("y", margin.top)
      .text(`Main map representing ${toName[attributes[0]]} and ${toName[attributes[1]]}`);*/

function sankeyContinetOrder(continent){
  if(continent == "Asia"){ return 0}
  else if(continent == "Europe"){ return 1}
  else if(continent == "Africa"){ return 2}
  else if(continent == "Americas"){ return 3}
  else if(continent == "Oceania"){ return 4}
  else {return -1}
}
console.log("attributes[0]= ", attributes[0]);
console.log("attributes[1]= ", attributes[1]);

filteredData.filter((element) => element.Year === curYear).forEach(function(d) {
  source = Development_Level(d);
  t = SankeyLayers(d, Array.from(setButtons))
  target1 = t[0];
  target2 = t[1];
  value = 5; // Convert to a number if needed

  // Check if the source node (Country_name) already exists, if not, add it
  if (!sankeyData.nodes.find(node => node.name === source[1])) {
    sankeyData.nodes.push({ name: source[1], order: source[0]});
  }

  // Check if the target1 node (Life_Expectancy) already exists, if not, add it
  if (!sankeyData.nodes.find(node => node.name === target1[1])) {
    sankeyData.nodes.push({ name: target1[1], order: target1[0]});
  }

  // Check if the target2 node (Replacement_Rate) already exists, if not, add it
  if (!sankeyData.nodes.find(node => node.name === target2[1])) {
    sankeyData.nodes.push({ name: target2[1],order: target2[0] });
  }
  c = getContinentForCountry(d);
  color = colorScaleLine(c);
  order= sankeyContinetOrder(c);

  // console.log(sankeyData.nodes.find(node=> node.name === source[1]))
  source = sankeyData.nodes.find(node=> node.name === source[1]);
  target = sankeyData.nodes.find(node=> node.name === target1[1]);
  sankeyData.links.push({
    source,
    target,
    value,
    color,
    order,
  });
  source = sankeyData.nodes.find(node=> node.name === target1[1]);
  target = sankeyData.nodes.find(node=> node.name === target2[1]);
  sankeyData.links.push({
    source,
    target,
    value,
    color,
    order,
  });
});
              
// Create a Sankey layout
sankey = d3.sankey()
  .nodeWidth(30)
  .nodePadding(40)
  .extent([[40, 40], [width-100, height]])
  .nodeSort(null)
  .linkSort(null) 
  ;

  sankeyData.nodes.sort((a, b) => a.order - b.order);
  sankeyData.links.sort((a, b) => a.order - b.order);
  

// console.log('Nodes:', sankeyData.nodes);
// console.log('Links:', sankeyData.links);

const { nodes, links } = sankey({
  nodes:sankeyData.nodes,
  links:sankeyData.links,
});

// console.log(sankey)



// console.log(nodes);
// console.log(links);
// Create the SVG container
const svg = d3.select('#sankeyPlot')
  .append('svg')
  .attr('width', width)
  .attr('height', height);
   

// Draw the links
svg.append('g')
  .attr("class", "links-sankey")
  .selectAll('path')
  .data(links)
  .enter()
  .append('path')
  .attr('d', d3.sankeyLinkHorizontal())
  .attr('stroke', d => d.color)
  .attr('stroke-width', d => Math.max(1, d.width))
  .style('fill', 'none');



// Draw the nodes
const nodeGroup = svg.append('g')
  .attr("class", "nodes-sankey")
  .selectAll('g')
  .data(nodes)
  .enter()
  .append('g')
  .attr('transform', d => `translate(${d.x0}, ${d.y0})`)
  // .attr('x', d => d.x0)
  // .attr('y', d => d.y0)
  ;

nodeGroup.append('rect')
  // .attr('x', d => d.x0)
  // .attr('y', d => d.y0)
  .attr('height', d => d.y1 - d.y0)
  .attr('width', d => d.x1 - d.x0)
  .attr('fill', 'blue');


// Define the layers of nodes (assuming you have an array of layers)
const nodeLayers = ['Developpment Level', 'Fertility Rate', 'Replacement Rate']; // Replace with your actual layer names

/*
nodeGroup.append('rect')
  .attr('x', -60)
  .attr('y', 0)
  .attr('width', 120)
  .attr('height', 30)
  .style('fill', 'lightgray');
  */
 // Add text with vertical rotation
 nodeGroup.append('text')
 .text(d => d.name) // Set the text to the node name or label
 .attr('x', function(d) {
  if (d.name === 'Above') {
    // Adjust the x position for the "Above" node
    return -(d.y1 - d.y0)+23; // Modify the position as needed
  } else if (d.name === 'Highly D') {
    // Adjust the x position for the "Highly D" node
    return -(d.y1 - d.y0)+50; // Modify the position as needed
  } else {
    return -(d.y1 - d.y0) / 2; // Default x position for other nodes
  }
})
 //.attr('x', d => -(d.y1 - d.y0)/2) // Adjust the x position
 .attr('y', function(d) {
  if (d.name === 'Above') {
    // Adjust the x position for the "Above" node
    return (d.x1 - d.x0)-12; // Modify the position as needed
  } else if (d.name === 'Highly D') {
    // Adjust the x position for the "Highly D" node
    return 5+(d.x1 - d.x0); // Modify the position as needed
  } else {
    return (d.x1 - d.x0) / 2; // Default x position for other nodes
  }
})
 //.attr('y', d => (d.x1 - d.x0)/2) // Adjust the y position
 .attr('dy', '0.35em') // Adjust the vertical alignment
 .style('font-size', '12px') // Set the font size as needed
 .style('text-anchor', 'middle') // Center-align the text
 .style('fill', d => (d.name === 'Above' || d.name === 'Highly D') ? 'black' : 'white') // Set text color
 .attr('transform', function(d) {
  // Conditionally rotate the text
  return (d.name !== 'Above' && d.name !== 'Highly D') ? 'rotate(-90)' : null;
});

/*

nodeGroup.append('text')
  .attr('x', d => (d.x1 - d.x0) / 2)
  .attr('y', d => (d.y1 - d.y0) / 2)
  .attr('dy', '0.35em') // Adjust vertical alignment as needed
  .style('fill', 'black')
  .text(d => d.name)
  .style('font-size', '15px') // Set the font size as needed
  .style('text-anchor', 'end');// Align text to the end (left) of the node



  // Now, add titles with background boxes to the nodes
svg
.selectAll('.node')
.each(function(d) {
  const node = d3.select(this);

  node.append('rect')
    .attr('x', -60)
    .attr('y', -15)
    .attr('width', 120)
    .attr('height', 30)
    .style('fill', 'lightgray');

  node.append('text')
    .text(d => d.name)
    .attr('x', 0)
    .attr('y', 0)
    .attr('dy', '0.35em')
    .style('font-size', '12px')
    .style('text-anchor', 'middle');
});
*/

}
  
