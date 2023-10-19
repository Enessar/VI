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

// Variable for the line chart
var colorScaleLine = null;

var setButtons = new Set();
var setFilter = new Set();

//to put in the dataSet
const CONTINENT_MAP = [
    {
      continent: 'Oceania',
      countries: ['Australia', 'Fiji'],
    },
    {
      continent: 'Europe',
      countries: [
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
        'China',
        'India',
        'Indonesia',
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
        if (countries.includes(country)) {
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
        });
        //TODO maybe convert also globalDataHDI to numbers


    createSlider();
    createButtons();
    createFilterButtons();

    filterData(); //filter data the first time
    filteredDataYear = filteredData;

    createChoroplethMap();
    createLineChart(); 
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
      .attr("width", width +300)
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


    attributes = Array.from(setButtons);

    // x-axis
      legend.append("text")
            .attr("x", 20)
            .attr("y", 0)
            .attr("font-size", "10px") // Add this line to set the font size
            .attr("text-anchor", "middle") // Center the text horizontally
            .text(d3.min(filteredData, (d) => d[attributes[0]]));
      legend.append("text")
            .attr("x", 120)
            .attr("y", 0)
            .attr("font-size", "10px") // Add this line to set the font size
            .attr("text-anchor", "middle") // Center the text horizontally
            .text(d3.max(filteredData, (d) => d[attributes[0]].toFixed(2)));
      legend.append("text")
          .attr("x", 70)
          .attr("y", 10)
          .attr("font-size", "10px") // Add this line to set the font size
          .attr("text-anchor", "middle") // Center the text horizontally
          .text(attributes[0]);
    
    // y-axis
      legend.append("text")
            .attr("x", 0)
            .attr("y", -10)
            .attr("font-size", "10px") // Add this line to set the font size
            .attr("text-anchor", "middle") // Center the text horizontally  
            .text(d3.min(filteredData, (d) => d[attributes[1]].toFixed(2)));
      legend.append("text")
            .attr("x", 0)
            .attr("y", -110)
            .attr("font-size", "10px") // Add this line to set the font size
            .attr("text-anchor", "middle") // Center the text horizontally
            .text(d3.max(filteredData, (d) => d[attributes[1]].toFixed(2)));
      legend.append("text")
          .attr("x", -60)
          .attr("y", 20)
          .attr("font-size", "10px") // Add this line to set the font size
          .attr("text-anchor", "middle") // Center the text horizontally
          .attr("transform", "rotate(90)") // Rotate the text 90 degrees counter-clockwise
          .text(attributes[1]);

  // // Append x and y axes to the line chart
  // legendSvg
  //     .append("g")
  //     .attr("class", "x-axis")
  //     .attr("transform", `translate(10,100)`)
  //     .call(d3.axisBottom(colorScaleMap1));

  //       // Append x and y axes to the line chart
  // legendSvg
  // .append("g")
  // .attr("class", "y-axis")
  // .attr("transform", `translate(100,0)`)
  // .call(d3.axisBottom(colorScaleMap2));

  //   legendSvg
  //     .selectAll(".x-axis text")
  //     .attr("transform", "rotate(-45)")
  //     .style("text-anchor", "end")
  //     .attr("dx", "-0.8em")
  //     .attr("dy", "0.15em");

    // // Add tick marks and labels to the legend
    // for (let index = 0; index <= 1; index+=0.2) {
    //     // console.log(colorScale1.invert(index))
    //     legend
    //     .append("text")
    //     .attr("x", 0)
    //     .attr("y", legendHeight - legendHeight * index + 10)
    //     .text(Math.round(colorScaleMap2.invert(index)));
    // }

    // Position the legend on the page
    legendSvg.attr("transform", "translate(10, 20)"); // Adjust the translation as needed

    // console.log("here");

  }



 // Function to create a line chart
 function createLineChart() {

  // Create a title for the line chart
  const chartTitle = d3
    .select("#lineChartTitle")
    .append("text")
    .attr("x", width / 2)
    .attr("y", margin.top)
    .text("Data Over Time");

  // Create an SVG element to hold the line chart
  const svg = d3
    .select("#lineChart")
    .append("svg")
    .attr("width", width )
    .attr("height", height );


  const yScale = d3
   .scaleLinear()
    .domain([
      d3.min(filteredData, (d) => d.life_expectancy),
      d3.max(filteredData, (d) => d.life_expectancy),
    ])
    .nice()
    .range([height - margin.bottom, margin.top]);

  const xScale = d3
    .scaleLinear()
    .domain([rangeMin, rangeMax]) // Adjust the domain based on your data
    .range([margin.left, width - margin.right - 100]);

 
  // Create a line generator
  const line = d3
    .line()
    .x((d) => xScale(d.Year))
    .y((d) => yScale(d.life_expectancy));
    

  // Create a group for the line chart elements
  const chartGroup = svg.append("g");

  // Add the line to the chart
  chartGroup
    .append("path")
    .datum(filteredData)
    .attr("class", "line")
    .attr("d", line)
    .attr("fill", "none")
    .attr("stroke", "steelblue");


// Group the data by continent
const dataByContinent = d3.group(filteredData, (d) => {
  const country = d.Country_name;
  const continentEntry = CONTINENT_MAP.find((entry) =>
    entry.countries.includes(country)
  );
  return continentEntry ? continentEntry.continent : 'Unknown';
});

// Define a color scale for continents, including the 'Unknown' category
    colorScaleLine = d3.scaleOrdinal()
        .domain([...CONTINENT_MAP.map((entry) => entry.continent), 'Unknown'])
        .range(d3.schemeCategory10);

// Iterate through each group (continent) and create a line for each
dataByContinent.forEach((continentData, continent) => {
  if (continent !== 'Unknown') {  // Exclude 'Unknown'
  chartGroup
    .append("path")
    .datum(continentData)
    .attr("class", "line")
    .attr("d", line)
    .attr("fill", "none")
    .attr("stroke", colorScaleLine(continent));
}
 });

// // Create line charts for each continent
// const lines = chartGroup.selectAll(".line")
//     .data(dataByContinent.keys()) // Use keys() to get an array of continent names
//     .enter()
//     .append("path")
//     .attr("class", "line")
//     .attr("fill", "none")
//     .attr("d", (continent) => line(dataByContinent.get(continent))) // Use the continent as a key to get the data
//     .attr("stroke", (continent) => colorScaleLine(continent));

  // Create a group for the legend elements
  const legendGroup = svg
  .append("g")
  .attr("class", "legend")
  .attr("transform", `translate(${width - margin.right+5}, ${margin.top})`);

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
  .attr("width", 18)
  .attr("height", 18)
  .style("fill", (d) => colorScaleLine(d));

  // Add text labels for each continent
  legendItems
  .append("text")
  .attr("x", -70)
  .attr("y", 9)
  .attr("dy", ".35em")
  .style("text-anchor", "start")
  .text((d) => d);

  // Add axes
  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
  // Create the y-axis with percentage formatting
  // const yAxis = d3.axisLeft(yScale).tickFormat(d3.format(".0%"));
  const yAxis = d3.axisLeft(yScale);


  svg
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(xAxis);

  svg
    .append("g")
    .attr("class", "y-axis")
    .attr("transform", `translate(${margin.left}, 0)`)
    .call(yAxis);
  
  // Create a title for the x-axis
  svg
  .append("text")
  .attr("class", "axis-title")
  .attr("x", width / 2)
  .attr("y", height + margin.top + 30)
  .text("Year");

  // Create a title for the y-axis
  svg
  .append("text")
  .attr("class", "axis-title")
  .attr("x", -height / 2)
  .attr("y", -margin.left + 20)
  .attr("transform", "rotate(-90)")
  .text("Life Expectancy");

}


function createButtons(){
    const warningMessage = d3.select("#warningMessage");

    // Select button 1 using D3.js
    var fertilityR = d3.select("#fertilityR");

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
    var lifeExp = d3.select("#lifeExp");

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
    // Select button 1 using D3.js
    var birthR = d3.select("#HDI");

    // Add a click event listener to button 1
    birthR.on("click", function() {
        if (setButtons.has("HDI")){
            setButtons.delete("HDI");
            birthR.classed('active', false);
            updateIdioms(true);
        } else if (setButtons.size >= 2) {
            
        } else {
            setButtons.add("HDI");
            birthR.classed('active', true);
            updateIdioms(true);
        }
    });
    // Select button 1 using D3.js
    var naturalR = d3.select("#naturalR");

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
    var raplacementR = d3.select("#raplacementR");

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

    var sliderHandleYear = slider.querySelector(".noUi-handle[data-handle='1']");
    var sliderHandleMin = slider.querySelector(".noUi-handle[data-handle='0']");
    var sliderHandleMax = slider.querySelector(".noUi-handle[data-handle='2']");

    
    sliderHandleYear.addEventListener("mouseup",function (event) {
        updateIdioms();
    });
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
            // console.log(continentInfo);
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
}




function createFilterButtons() {
    const warningMessage = d3.select("#warningMessage");
    // Select button 1 using D3.js
    var africaBtn = d3.select("#africa");
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
    var asiaBtn = d3.select("#asia");
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
   var europeBtn = d3.select("#europe");
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
   var AmericaBtn = d3.select("#Americas");
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
   var OceaniaBtn = d3.select("#Oceania");
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