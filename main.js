async function chartMaker(){
    const countiesData=await fetch('https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json');
    const us=await countiesData.json()
    // console.log(us);

    const educationData=await fetch('https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json');
    const education=await educationData.json()
    // console.log(education)
    
   const svg=d3.select("#Graph")
                .append("svg")
                .attr("width",950)
                .attr("height",650)

    const path=d3.geoPath();
    const minX=d3.min(education,d=>d.bachelorsOrHigher);
    const maxX=d3.max(education,d=>d.bachelorsOrHigher);
    // console.log(minX,maxX)
    var color=d3.scaleThreshold()
                .domain(d3.range(minX,maxX,(maxX-minX)/8))
                .range(d3.schemeGreens[9]);
    // console.log(d3.schemeGreens[9])
    var tooltip=d3.select("body")
                  .append("div")
                  .attr("id","tooltip")
                  .style("opacity",0.8);

    svg.append("g")
        .attr("class","counties")
        .selectAll("path")
        .data(topojson.feature(us,us.objects.counties).features)
        .enter()
        .append("path")
        .attr("class","county")
        .attr("data-fips",d=>d.id)
        .style("fill",function(d){
            var result=education.filter(function(obj){
                // console.log(obj,d)
                return obj.fips==d.id;
            });
            if(result[0]){
                // console.log(color(result[0].bachelorsOrHigher))
                return color(result[0].bachelorsOrHigher)
            };
            return color(0);
        })
        .attr("data-education",function(d){
            var result=education.filter(function(obj){
                return obj.fips==d.id;
            });   
            if(result[0]){
                return result[0].bachelorsOrHigher
            };
            console.log("cant find data for",d.id);
            return 0;
        })
        .attr("d",path)
        .on("mouseover",function(i,d){ 
            // console.log("you are on me",i)
            tooltip.style("display","flex")
           
            .html(function(){ 
                var result=education.filter(function(obj){
                    // console.log(obj,d)
                    return obj.fips==d.id;
                })
            

                tooltip.attr("data-education",result[0].bachelorsOrHigher);
                return `${result[0].area_name},${result[0].state}:${result[0].bachelorsOrHigher}`
            })
            .style("left",(i.pageX+10)+"px")
            .style("top",(i.pageY-28)+"px")
        })
        .on("mouseout",()=>{
            tooltip.style("display","none")
        });
// console.log(us.objects.counties)
svg.append("path")
    .datum(topojson.mesh(us,us.objects.states,function(a,b){
        return a!=b;
    }))
    .attr("class","states")
    .attr("d",path)

    // console.log("it is working")
    var x = d3.scaleLinear()
    .domain([minX, maxX])
    .range([600, 860]);
    var g=svg.append("g")
             .attr("id","legend")
             .attr("transform","translate(0,40)");

    g.selectAll("rect")
        .data(color.range().map(function(d){
            // console.log("rect",d);
            d = color.invertExtent(d);
            if (d[0] == null) d[0] = x.domain()[0];
            if (d[1] == null) d[1] = x.domain()[1];
            return d;
        }))
        .enter().append("rect")
        .attr("height", 8)
        .attr("x", function(d) {return x(d[0]); })
        .attr("width", function(d){return x(d[1])-x(d[0]); })
        .attr("fill",function(d) {return color(d[0]); });

        g.append("text")
        .attr("x", x.range()[0])
        .attr("y", -6)
        .attr("fill", "#000")
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
     
   g.call(d3.axisBottom(x)
              .tickSize(13)
              .tickFormat(x => Math.round(x)+'%')
              .tickValues(color.domain()))
              .select(".domain")
              .remove();
}
chartMaker();

//https://observablehq.com/@d3/json-treemap