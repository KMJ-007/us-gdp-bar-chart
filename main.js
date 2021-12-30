const DATASETS={
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

const urlParams=new URLSearchParams(window.location.search);
// console.log(urlParams.toString())
const DEFAULT_DATA="videogames"
const DATASET=DATASETS[urlParams.get("data")|| DEFAULT_DATA];

document.getElementById("title").innerHTML=DATASET.TITLE;
document.getElementById("description").innerHTML=DATASET.DESCRIPTION;

fetch(DATASET.FILE_PATH)
    .then(res=>res.json())
    .then(res=>{
            chartMaker(res);
    })

function chartMaker(data){
// console.log(data)
const svg=d3.select("#tree-map")
             .attr("width","960")
             .attr("height","560")

var tooltip=d3.select("body")
              .append("div")
              .attr("id","tooltip")
const treemap=d3.treemap()
                .size([960,560]).padding(1);
const root=d3.hierarchy(data).sum(d=>d.value);
// console.log(root)
treemap(root);

var color = d3.scaleOrdinal(
    [
      '#1f77b4',
      '#aec7e8',
      '#ff7f0e',
      '#ffbb78',
      '#2ca02c',
      '#98df8a',
      '#d62728',
      '#ff9896',
      '#9467bd',
      '#c5b0d5',
      '#8c564b',
      '#c49c94',
      '#e377c2',
      '#f7b6d2',
      '#7f7f7f',
      '#c7c7c7',
      '#bcbd22',
      '#dbdb8d',
      '#17becf',
      '#9edae5'
    ]);
// console.log(root.leaves())

 var cell=svg.selectAll("g")
            .data(root.leaves())
            .enter().append("g")
            .attr("transform",d=>`translate(${d.x0},${d.y0})`)


var tile=cell.append("rect")
             .attr("class","tile")
             .attr("fill",d=>color(d.data.category))
             .attr("width",d=>d.x1-d.x0)
             .attr("height",d=>d.y1-d.y0)
             .attr("data-name",d=>d.data.name)
             .attr("data-category",d=>d.data.category)
             .attr("data-value",d=>d.data.value)
             .on("mouseover",(i,d)=>{
                    // console.log(i,d)
                 tooltip.style("display","flex")
                 .html(`Name${d.data.name}<br>
                 Category:${d.data.category}<br>
                 Value:${d.data.value}
                 `)
                 .style("left",(i.pageX+10)+"px")
                 .style("top",(i.pageY+10)+"px")
                 .attr("data-value",d.data.value)

             })
             .on("mouseout",()=>{
                 tooltip.style("display","none")
             });

cell.append("text")
     .selectAll("tspan")
     .data(d=>d.data.name.split(/(?=[A-Z][^A-Z])/g))
     .enter().append("tspan")
     .style("font-size","10px")
     .attr("x",4)
     .attr("y",(d,i)=>10+i*100)
     .text(d=>d)

  const LEGEND_OFFSET = 10;  
  const LEGEND_RECT_SIZE = 15;
  const LEGEND_H_SPACING = 150;
  const LEGEND_V_SPACING = 10;
  const LEGEND_TEXT_X_OFFSET = 3;
  const LEGEND_TEXT_Y_OFFSET = -2;
  const LEGEND_ELEM_PER_ROW = 3;
var categories = root.leaves().map(d => d.data.category).filter((d,i,self) => self.indexOf(d) === i);
console.log(categories)

var legend=d3.select("#legend")
             .attr("width",LEGEND_H_SPACING*LEGEND_ELEM_PER_ROW+40)
             .append("g")
             .attr("transform",`translate(60,${LEGEND_OFFSET})`)
             .selectAll("g")
             .data(categories)
             .enter()
             .append("g")
             .attr("transform", (d,i) => `translate(${(i%LEGEND_ELEM_PER_ROW)*LEGEND_H_SPACING}, ${Math.floor(i/LEGEND_ELEM_PER_ROW)*LEGEND_RECT_SIZE + LEGEND_V_SPACING * Math.floor(i/LEGEND_ELEM_PER_ROW)})`)

legend.append("rect")
      .attr("width",LEGEND_RECT_SIZE)
      .attr("height",LEGEND_RECT_SIZE)
      .attr("fill",d=>color(d))
      .attr("class","legend-item")

legend.append("text")
       .text(d=>d)
       .attr("x", LEGEND_RECT_SIZE + LEGEND_TEXT_X_OFFSET)
       .attr("y", LEGEND_RECT_SIZE + LEGEND_TEXT_Y_OFFSET)
};//end of function