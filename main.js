let url="https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
var tooltip=document.getElementById('tooltip');
fetch(url)
    .then(response=>response.json())
    .then(json=>{
        const {data}=json;
        chartMaker(data)        
    });

function chartMaker(data){
    // console.log(data)
    const width=800;
    const height=460;
    const padding=40;

    const minX=new Date(d3.min(data,(d)=>d[0]));
    const maxX=new Date(d3.max(data,(d)=>d[0]));
    const minY=d3.min(data,(d)=>d[1]);
    const maxY=d3.max(data,(d)=>d[1]);
    
    const xScale=d3.scaleTime()
                    .domain([minX,maxX])
                    .range([padding,width-padding]);

    const yScale=d3.scaleLinear()
                    .domain([0,maxY])
                    .range([height-padding,padding]);

    
    const svg=d3.select("#graph")
                .append("svg")
                .attr("width",width)
                .attr("height",height);

        svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("class","bar")
        .attr("data-date",(d)=>d[0])
        .attr("data-gdp",(d)=>d[1])
        .attr("x",(d)=>xScale(new Date(d[0])))
        .attr("y",(d)=>yScale(d[1]))
        .attr("width","3")
        .attr("height",(d)=>height-padding-yScale(d[1]))
        // .style('fill', '#33adff')
        .on("mouseover",(i,d)=>{
            tooltip.classList.add("show");
            tooltip.style.left=i*3+padding*2+"px";
            tooltip.setAttribute('data-date',d[0]);
            
            tooltip.innerHTML=
                `${d[0]}"<br>"${d[1]}"Billion"`;
            
        })
        .on("mouseout",()=>{
            tooltip.classList.remove("show")
        });

        const xAxis=d3.axisBottom(xScale);
        const yAxis=d3.axisLeft(yScale);

        svg.append("g")
            .attr("transform",`translate(0,${height-padding})`)
            .call(xAxis)
            .attr("id","x-axis")
            
        svg.append("g")
            .attr("transform",`translate(${padding},0)`)
            .call(yAxis)
            .attr("id","y-axis")

};
