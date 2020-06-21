function init() {
    var selector = d3.select("#selDataset");
  
    d3.json("samples.json").then((data) => {
      console.log(data);
      var sampleNames = data.names;
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
    buildMetadata(940);
    buildCharts(940);
    buildGauge(940);
})}
  


//   function optionChanged(newSample) {
//     console.log(newSample);
//   }

function optionChanged(newSample) {
    buildMetadata(newSample);
    buildCharts(newSample);
    buildGauge(newSample);
  }

function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    var PANEL = d3.select("#sample-metadata");
  
    PANEL.html("");
    Object.entries(result).forEach(([key, value]) =>
    {PANEL.append("h6").text(key.toUpperCase() + ': ' + value);});
      
  });
}

function buildCharts(sample){
  // On change to the DOM, call getData()
  d3.json("samples.json").then((data) => {
    
    
    var samples = data.samples;
    var samplefilter = samples.filter(sampleObj => sampleObj.id == sample);
    var sampling = samplefilter[0];
    
    var otu_ids = sampling.otu_ids.slice(0.10);
    console.log(`otu_ids: ${otu_ids}`)
    
    var sample_values = sampling.sample_values.slice(0,10);
    console.log(`sample_values: ${sample_values}`)

    var otu_labels = sampling.otu_labels.slice(0,10);
    console.log(`otu_labels: ${otu_labels}`)



// Bar Plots
    var trace1 = {
        x: sample_values.reverse(),
        y: otu_ids.map(yaxis => "OTU " + yaxis).reverse(),
        text: otu_labels.reverse(),
        name: "Top 10 bacterial species (OTUs)",
        type: "bar",
        orientation: "h"
        };
        
        // data
      var data1 = [trace1];
        
        // Apply the group bar mode to the layout
    var layout1 = {
        title: "Top 10 OTUs",
      margin: {
          l: 100,
          r: 100,
          t: 100,
          b: 70
      }
    };
        
        // Render the plot to the div tag with id "bar"
    Plotly.newPlot("bar", data1, layout1);
  // Bubble chart

    var trace2 = {
      x: sampling.otu_ids,
      y: sampling.sample_values,
      mode: 'markers',
      marker: {
        size: sampling.sample_values,
        color: sampling.otu_ids
      },
      text: sampling.otu_labels
    };

    var data2 = [trace2];

    var layout2 = {
      title: 'OTUs Bubble Chart',
      showlegend: false,
      height: 600,
      width: 1000
    };

    Plotly.newPlot('bubble', data2, layout2);

    var otu_ids = [];
    var sample_values = [];
    var otu_labels = [];
});
}

// Build the Gauge Chart
function buildGauge(sample) {

    d3.json("samples.json").then(function(data){
      var metadata = data.metadata;
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      var filteredWfreq = result.wfreq
      console.log(filteredWfreq);

      var data = [
        {
          type: "indicator",
          mode: "gauge+number+delta",
          value: filteredWfreq,
          title: { text: "Belly Button Washing Frequency <br> Scrubs per Week", font: { size: 24 } },
          delta: { reference: 5, increasing: { color: "RebeccaPurple" } },
          gauge: {
            axis: { range: [null, 9], tickwidth: 1, tickcolor: "darkblue" },
            bar: { color: "darkblue" },
            bgcolor: "white",
            borderwidth: 2,
            bordercolor: "gray",
            steps: [
              { range: [0, 1], color: "black" },
              { range: [1, 2], color: "grey" },
              { range: [2, 3], color: "#2ca02c" },
              { range: [3, 4], color: "lightgreen" },
              { range: [4, 5], color: "green" },
              { range: [5, 6], color: "darkgreen" },
              { range: [6, 7], color: "rgba(210, 206, 145, .5)" },
              { range: [7, 8], color: "#17becf" },
              { range: [8, 9], color: "cyan" }
            ],
            threshold: {
              line: { color: "red", width: 4 },
              thickness: 0.75,
              value: 10
            }
          }
        }
      ];
      
      var layout = { width: 600, height: 450, margin: { t: 0, b: 0 } };
      

      Plotly.newPlot('gauge', data, layout);
});


}


init();