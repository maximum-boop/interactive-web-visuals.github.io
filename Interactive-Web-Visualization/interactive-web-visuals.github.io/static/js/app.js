// print json dictionary to see data outline
d3.json("../../samples.json").then(function(data) {
    console.log(data)
});
// Builddata from ("samples.json") in order to build charts
function buildchartdata(sample) {
    d3.json("../../samples.json").then((data) => {
        let samples = data.samples;
        let resultArray = samples.filter(sampleObject =>sampleObject.id ==sample);
        let result = resultArray[0];
// Link data to build charts
        var otu_ids = result.otu_ids;
        var otu_labels = result.otu_labels;
        var sample_values = result.sample_values;
// Capture otu_ids by slicing the top 10.
       var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
// Define data variable
        let bardata = [
            {
                
                x: sample_values.slice(0, 10).reverse(),
                y: yticks,
                hovertext: otu_labels.slice(0, 10).reverse(),
                marker: {
                    color:"rgb(36, 44, 63)",
                    line: {'width': 1.5, color: 'rgb(45, 230, 156)'},
                opacity: 0.8,
                },
                type: "bar",
                orientation: "h",
            }
        ];
// Define the layout with title
        let barlayout = {
            title: "Top 10 OTUs Found in People Under Study",
        };
        Plotly.newPlot("bar",bardata,barlayout);

        
// Create a Bubble Chart by defining the bubbledata 
        var bubbleData = [
            {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Moon"
            },
            height: 450,

            width: 400,
            }
        ];
// Bubble Chart layout definition
        var bubbleLayout = {

            title: "Bacteria Cultures Per Sample",
            xaxis: {
                title:"OTU-IDS"
              },
            yaxis: {
               title:"sample-values"
              },
            showlegend: false,

            height: 400,
          
            width: 1000
        };
    
        Plotly.newPlot("bubble", bubbleData, bubbleLayout);
// Additional plot (pie chart) to highlight in percentage each sample in an individual 
        var pieData = [
            {
            type: "pie",
            values: sample_values.slice(0, 10).reverse(),
            labels: otu_labels.slice(0, 10).reverse(),
            textinfo: "label+percent",
            textposition: "inside",
            automargin: true
            
        }]
        var pielayout = {
          title: "Percent of each sample in an individual",
          
          height: 450,

          width: 400,
        
          margin: {"t": 0, "b": 0, "l": 0, "r": 0},
        
          showlegend: true
          
          }
          
          
          Plotly.newPlot('pie', pieData, pielayout);

    });
}
// Build the metadata and update all the plots whem a sample number is changed
function buildMetadata(sample) {
    d3.json("../../samples.json").then((data) => {
      let metadata = data.metadata;
      let resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      let result = resultArray[0];
// use D3 to collect sample metadata from <div id="sample-metadata" class="panel-body"></div>
      let PANEL = d3.select("#sample-metadata");
// Update all of the plots any time that a new sample is selected.
      PANEL.html("");
  
// Add key and value from metadata<select id="selDataset" onchange="optionChanged(this.value)"></select>
      Object.entries(result).forEach(([key, value]) => {
        PANEL.append("h4").text(`${key.toUpperCase()}: ${value}`);
      });
  
    });
  }
  function init() {
//
    var selector = d3.select("#selDataset");
  
// Use the list of sample names to populate the select options
    d3.json("../../samples.json").then((data) => {
      var sampleNames = data.names;
  
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });

      var firstSample = sampleNames[0];
      buildchartdata(firstSample);
      buildMetadata(firstSample);
    });
  }
  
  function optionChanged(newSample) {
    buildchartdata(newSample);
    buildMetadata(newSample);
  }
  
// create dashboard
  init();
