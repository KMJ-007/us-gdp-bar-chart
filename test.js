const projectName = 'treemap'

const DATASETS = {
  videogames: {
    TITLE: "Video Game Sales",
    DESCRIPTION: "Top 100 Most Sold Video Games Grouped by Platform",
    FILE_PATH: 'https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/video-game-sales-data.json'
  },
  
  movies: {
  TITLE: "Movie Sales",
  DESCRIPTION: "Top 100 Highest Grossing Movies Grouped By Genre",
  FILE_PATH: "https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/movie-data.json"
},

 kickstarter:{
   TITLE: "Kickstarter Pledges",
   DESCRIPTION: "Top 100 Most Pledged Kickstarter Campaigns Grouped By Category",
  FILE_PATH: "https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/kickstarter-funding-data.json"
 } 
}

//const dataselector = document.getElementById("data-selector")

//dataselector.innerHTML = `$<a href`


const urlParams = new URLSearchParams(window.location.search);
const DEFAULT_DATA = "videogames";
const DATASET = DATASETS[urlParams.get('data') || DEFAULT_DATA];

document.getElementById("title").innerHTML = DATASET.TITLE;
document.getElementById("description").innerHTML = DATASET.DESCRIPTION;


fetch(DATASET.FILE_PATH)
  .then(res => res.json())
  .then(res => {
  charting(res);
})

function charting(data){

//  if(error) throw (error);
//console.log("test 0");

var tooltip = d3.select("body").append("div")
                .attr("id", "tooltip")

const width = 960;
const height = 570;

const svg = d3.select("#tree-map")
            .attr("width", width)
            .attr("height", height)

const treemap = d3.treemap()
                .size([width, height])
                .padding(1);
  
const root = d3.hierarchy(data)
             .sum(d => d.value)

treemap(root);
  
const pallette = ['#a6cee3','#1f78b4','#b2df8a','#33a02c','#e31a1c','#fdbf6f','#ff7f00','#cab2d6','#6a3d9a','#b15928', '#8dd3c7','#ffffb3','#bebada','#fb8072','#80b1d3','#fdb462','#b3de69','#fccde5','#d9d9d9','#bc80bd','#ccebc5','#ffed6f']

const color = d3.scaleOrdinal(pallette);

//console.log("test 1");

  
var cell = svg.selectAll("g")
              .data(root.leaves())
              .enter().append("g")
              .attr("transform",d =>  `translate(${d.x0}, ${d.y0})`);

var tile = cell.append("rect")
//               .attr("id", d => d.data.id)
               .attr("class", "tile")
               .attr("fill", d => color(d.data.category))
               .attr("width", d=> d.x1 - d.x0)
               .attr("height", d => d.y1 - d.y0)
               .attr("data-name", d => d.data.name)
               .attr("data-category", d => d.data.category)
               .attr("data-value", d => d.data.value)
               .on("mouseover", d => {
                 tooltip.style("display", "flex")
                    .html(`Name: ${d.data.name}<br>
                           Category: ${d.data.category}<br>
                           Value: ${d.data.value}`)
                    .style("left", (d3.event.pageX + 10) + "px")
                    .style("top", (d3.event.pageY + 10) + "px")
                    .attr("data-value", d.data.value)
               })
               .on("mouseout",() => { 
                 tooltip.style("display", "none")});
 
  
  cell.append('text')
      .selectAll('tspan')
      .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g))
      .enter().append('tspan')
      .style("font-size", "10px")
      .attr("x", 4)
      .attr("y", (d,i) => 13 + i*10)
      .text( d => d)
  
  var categories = root.leaves().map(d => d.data.category).filter((d,i,self) => self.indexOf(d) === i);
  //console.log(categories);
  
  const LEGEND_OFFSET = 10;
  const LEGEND_RECT_SIZE = 15;
  const LEGEND_H_SPACING = 150;
  const LEGEND_V_SPACING = 10;
  const LEGEND_TEXT_X_OFFSET = 3;
  const LEGEND_TEXT_Y_OFFSET = -2;
  const LEGEND_ELEM_PER_ROW = 3;
  
  var legend = d3.select("#legend")
      .attr("width", LEGEND_H_SPACING * LEGEND_ELEM_PER_ROW + 40)
      .append("g")
      .attr("transform", `translate(60,${LEGEND_OFFSET})`)
      .selectAll("g")
      .data(categories)
      .enter().append("g")
      .attr('transform', (d,i) => `translate(${(i%LEGEND_ELEM_PER_ROW)*LEGEND_H_SPACING}, ${Math.floor(i/LEGEND_ELEM_PER_ROW)*LEGEND_RECT_SIZE + LEGEND_V_SPACING * Math.floor(i/LEGEND_ELEM_PER_ROW)})`)
  
  legend.append("rect")
        .attr("width", LEGEND_RECT_SIZE)
        .attr("height", LEGEND_RECT_SIZE)
        .attr("fill", d => color(d))
        .attr("class", "legend-item")
  
  legend.append("text")
        .text(d => d)
        .attr("x", LEGEND_RECT_SIZE + LEGEND_TEXT_X_OFFSET)
        .attr("y", LEGEND_RECT_SIZE + LEGEND_TEXT_Y_OFFSET)
}