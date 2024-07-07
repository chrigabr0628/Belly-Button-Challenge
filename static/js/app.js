// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata = data.metadata

    // Filter the metadata for the object with the desired sample number
    let metaarray = metadata.filter(obj => obj.id == sample)
    let metaresult = metaarray[0]

    // Use d3 to select the panel with id of `#sample-metadata`
    let table = d3.select("#sample-metadata")

    // Use `.html("") to clear any existing metadata
    table.html("")

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(metaresult).forEach(([key, value])=>{
      table.append("h6").text(`${key.toUpperCase()}: ${value}`)
    })
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let metaitem = data.metadata
    let samples = data.samples

    // Filter the metadata for the object with the desired sample number
    let metaitemarray = metaitem.filter(obj => obj.id == sample)
    let metaitemresult = metaitemarray[0]  

    // Filter the samples for the object with the desired sample number
    let samplesarray = samples.filter(obj => obj.id == sample)
    let samplesresult = samplesarray[0]

   
    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = samplesresult.otu_ids
    let otu_labels = samplesresult.otu_labels
    let sample_values = samplesresult.sample_values
    let wfreq = metaitemresult.wfreq

    // Build a Bubble Chart
    var bubbledata = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        color: otu_ids,
        size: sample_values,
        colorscale: 'Earth'
      }
    };
    
    var bubbleData = [bubbledata];
    
    var layout = {
      title: 'Bacteria Cultures Per Sample',
      showlegend: false,
      height: 600,
      width: 1200,
      xaxis: { title: 'OTU IDs' },
      hovermode: 'closest'
    };
    
    // Render the Bubble Chart
    Plotly.newPlot('bubble', bubbleData, layout);
    

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    var bardata = [{
      type: 'bar',
      x: sample_values.slice(0, 10).reverse(),
      y: otu_ids.slice(0, 10).map(otu => `OTU ${otu}`).reverse(),
      text: otu_labels.slice(0, 10).reverse(),
      orientation: 'h'
    }];
    

    // Render the Bar Chart
    Plotly.newPlot('bar', bardata);

  });
}

// Function to run on page load
function init() {
  // Use d3 to select the dropdown with id of `#selDataset`
  let selector = d3.select("#selDataset")
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    console.log(data)
    // Get the names field
    let names = data.names

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    names.forEach((item) => {
      selector.append("option").text(item).property("value", item)
    })
    //for(let i = 0;i < names.length; i++){}

    // Get the first sample from the list
    let firstitem = names[0]

    // Build charts and metadata panel with the first sample
    buildCharts(firstitem)
    buildMetadata(firstitem)

  
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample)
  buildMetadata(newSample)
}

// Initialize the dashboard
init();
