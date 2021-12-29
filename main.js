//on x axis= year
//on y axis=time

let url="https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"

fetch(url)
    .then(response=>response.json())
    .then(response=>{
        // console.log(response);
        chartMaker(response)        
    });
    var color = d3.scaleOrdinal(d3.schemeCategory10);
function chartMaker(data){
// console.log(data)
    //spliting the time(minitues and second)
    data.forEach(function(d){
        let parsedTime=d.Time.split(":")
        d.Time=new Date(1970,0,1,0,parsedTime[0],parsedTime[1]);

    });
    const height=475;
    const width=800;
    const padding=40;

    const minX=d3.min(data,(d)=>d.Year);
    const maxX=d3.max(data,(d)=>d.Year);
    const minY=d3.min(data,(d)=>d.Time)
    const maxY=d3.max(data,(d)=>d.Time)
// console.log(minY,maxY)
    //making svg
    const svg=d3.select("#graph")
                .append("svg")
                .attr("width",width)
                .attr("height",height);

    const xScale=d3.scaleLinear()
                    .domain([minX-1,maxX+1])
                    .range([padding,width-padding]);

    const yScale=d3.scaleTime()
                    .domain([minY,maxY])
                    .range([padding,height-padding]);
        
    const timeFormat=d3.timeFormat("%M:%S");

    const xAxis=d3.axisBottom(xScale).tickFormat(d3.format("d"));

    const yAxis=d3.axisLeft(yScale).tickFormat(timeFormat);

    svg.append("g")
        .attr("transform",`translate(0,${height-padding})`)
        .call(xAxis)
        .attr("id","x-axis")

    svg.append("g")
        .attr("transform",`translate(${padding},0)`)
        .call(yAxis)
        .attr("id","y-axis")
    
    var div=d3.select("#graph")
              .append("div")
              .attr("id","tooltip")
              .style("opacity",0)
            

        svg.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("class","dot")
            .attr("data-xvalue",(d)=>d.Year)
            .attr("data-yvalue",(d)=>d.Time)
            .attr("cx",(d)=>xScale(d.Year))
            .attr("cy",(d)=>yScale(d.Time))
            .attr("r",7)
            .style("fill",(d)=> color(d.Doping===""))
            .on("mouseover",function(i,d){
                // alert("dont touch me")
                // console.log(d)
                console.log("you are on me")
                div.style("opacity",0.9)
                    .style("display","flex")
                    .attr("data-year",d.Year)
                    .style("left",xScale(d.Year))
                    .style("left",(i.pageX+7)+"px")
                    .style("top",(i.pageY+10)+"px")
                    // .style('left', i.pageX + 'px')
                    // .style('top', i.pageY - 28 + 'px')
                    .html(
                        `${d.Name}:${d.Nationality}<br/>
                        Year:${d.Year} Time:${timeFormat(d.Time)}
                        ${d.Doping?("<br/>"+d.Doping):""}
                        ${d.Doping?("<br/>"+d.URL):""}`
                    )
                    
             })
            .on('mouseout', function(){
                console.log("you are gone")
                div.style('display', 'none');
              })
            
    
        var legendContainer=svg.append("g")
                                .attr("id","legend");
        var legend=legendContainer.selectAll("#legend")
                                  .data(color.domain())
                                  .enter()
                                  .append("g")
                                  .attr("transform",function(i,d){return "translate(0,"+(height/3-i*20)+")";})

            legend.append("rect")
                  .attr("x",width-24)
                  .attr("width",18)
                  .attr("height",18)
                  .style("fill",color)
                  .style("opacity",0.7);

        legend.append("text")
              .attr("x",width-28)
              .attr("y",9)
              .attr("dy","0.35em")
              .style("text-anchor","end")
              .text(function (i,d){
                if(d) return "No doping allegations";
                else {
                  return "Riders with doping allegations";
                }
  })
}