// x-axis for year
//y-axis for months
let url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

fetch(url)
  .then((response) => response.json())
  .then((res) => {
    // console.log(res.length);
    chartMaker(res.monthlyVariance);
  });
  
  function chartMaker(data) {
  // console.log(data.length)
  data.forEach(d=>d.month-=1);
  const width = 950;
  const height = 500;
  const padding = {
    top: 30,
    bottom: 100,
    left: 100,
    right: 30,
  };
  const minTemp=d3.min(data,d=>(d.variance+8.66));
  const maxTemp=d3.max(data,d=>(d.variance+8.66));
  // console.log(minTemp,maxTemp)
  const diff=(maxTemp-minTemp)/11;
  var colorBrewer = ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026', '#000000'];
  var color=d3.scaleThreshold()
              .domain(d3.range(minTemp,maxTemp,diff))
              .range(colorBrewer)
  // console.log(color(minTemp),color(maxTemp),color(7))
  const barHeight = (height - padding.top - padding.bottom) / 12;
  const barWidth = (width-padding.left-padding.right) / (data.length / 12)
  // console.log(data.length)
  const minX = d3.min(data, d => d.year);
  const maxX = d3.max(data, d => d.year);
  const minY = 1;
  const maxY = 12;
  // console.log(barHeight,barWidth,minX,maxX)
  const tip=d3.tip()
              .attr("class","d3-tip")
              .attr("id","tooltip")
              .html(function(d){
                console.log(d)
                return d;
              })
              .direction("n")
              .offset([-10,0]);

  const svg = d3.select("#heatmap")
            .append("svg")
              .attr("width", width)
              .attr("height", height)
              
              
  svg.call(tip);

  const xScale=d3.scaleLinear()
                 .domain([minX-1,maxX+1])
                 .range([padding.left,width-padding.right])

  const xAxis=d3.axisBottom(xScale).tickFormat(d3.format("d"))
                 .tickSize(10,1);

   const yScale = d3
    .scaleBand()
    // months
    .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
    .rangeRound([padding.top, height-padding.bottom])
    .padding(0);

  const yAxis = d3
    .axisLeft()
    .scale(yScale)
    .tickValues(yScale.domain())
    .tickFormat(function (month) {
      var date = new Date(0);
      date.setUTCMonth(month);
      var format = d3.timeFormat('%B');
      return format(date);
    })
    .tickSize(10, 1);                 
  
  svg.append("g")
      .attr("transform",`translate(0,${height-padding.bottom})`)
      .call(xAxis)
      .attr("id","x-axis")
      .append("text")
      .text("Years")
      .style("text-anchor","middle")
      .attr("transform",`translate(${xScale(width/2)},30)`);

  svg.append("g")
      .attr("transform",`translate(${padding.left},0)`)
      .call(yAxis)
      .attr("id","y-axis")
      .append("text")
      .text("Months")
      .style("text-anchor", "middle");
  
    
  svg.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("class","cell")
      .attr("data-year",d=>d.year)
      .attr("data-month",d=>d.month)
      .attr("data-temp",d=>d.variance+8.66)
      .attr("x",(d)=>xScale(d.year))
      .attr("y",(d)=>yScale(d.month))
      .attr("width", barWidth)
     .attr("height", barHeight)
     .style("fill", d => color(d.variance+8.66))
     .on("mouseover",function(i,d){
       var date=new Date(d.year,d.month);
       var str=` <span class = 'Date'> ${d3.timeFormat("%Y - %B")(date)}</span><br/>
       <span class= 'temperature'>${d3.format('+.1f')(d.variance + 8.66)}&#8451; </span><br/>
       <span class='variance'>${d3.format('+.1f')(d.variance)}&#8451; </span>`;
       tip.attr("data-year",d.year);
       tip.show(str,this);
      //  console.log(d)
     })
     .on("mouseout",tip.hide);
    
     var legend=svg.append("g")
                   .attr("class","legend")
                   .attr("id","legend")
                   .attr("transform",`translate(${padding.left},${height-padding.bottom+30})`)
                
      const legendScale=d3.scaleLinear()
                          .domain([minTemp,maxTemp])
                          .range([50,400])
                          const legendrect = legend.selectAll("rect")
                          .data(color.range().map(d => {
                             d = color.invertExtent(d);
                            
                             if(d[0] == null) d[0] = legendScale.domain()[0];
                             if(d[1] == null) d[1] = legendScale.domain()[1];
                            return d;
                          }))
                          .enter()
                          .append("rect")
                          .attr("width",d => {
                            return (legendScale(d[1]) - legendScale(d[0]))
                          })
                          .attr("height",20)
                          .attr("x",(d) => legendScale(d[0]))
                          .attr("y", 0)
                          .style("fill", (d) => color(d[0]))
                  
                   legend.call(d3.axisBottom(legendScale)
                         .tickSize(25)
                         .tickFormat(d3.format(".1f"))
                         .tickValues(color.domain()))
                         .select(".domain")
                         .remove();           
  }//end of function
