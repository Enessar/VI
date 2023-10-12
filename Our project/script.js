var globalData;
var globalDataHDI;

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

    //import files:
    function loadCSV(file) {
        return d3.csv(file);
    }

    function importFiles(file1, file2) {
        return Promise.all([loadCSV(file1), loadCSV(file2)]);
    }
    // File names for JSON and CSV files
    const file1 = "Our project/src/All data in one/Q.csv";
    const file2 = "Our project/src/All data in one/HDI.csv";

    // Import the files and process the data
    importFiles(file1, file2).then(function (results) {
        globalData = results[0];
        
        globalDataHDI = results[1];

        globalData.forEach(function (d) {
        d.Year = +d.Year;
        d.life_expectancy = +d.life_expectancy;
        d.Fertility_Rate = +d.Fertility_Rate;
        d.Replacement_Rate = +d.Replacement_Rate;
        d.Natural_Rate = +d.Natural_Rate;
        }        );
    });
}