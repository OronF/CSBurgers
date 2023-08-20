$(document).ready(async function() {
    let ordersData;

    await $.ajax({
        url: '/api/order',
        method: "GET",
        success: function(data) {
            ordersData = parseData(data);
            console.log(ordersData);
            drawChart(ordersData);
        },
        error: function(error) {
            console.error(error);
        }
    });

    function parseData(data) {
        let arr = [];
        data.forEach(order => {
            arr.push({
                date: new Date(order.orderDate),
                value: order.totalprice
            });
        });

        return arr;
    }

    function drawChart(data) {
        const width = 928;
        const height = 500;
        const marginTop = 20;
        const marginRight = 30;
        const marginBottom = 30;
        const marginLeft = 40;

        const x = d3.scaleUtc()
            .domain(d3.extent(data, d => d.date))
            .range([marginLeft, width - marginRight]);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.value)])
            .range([height - marginBottom, marginTop]);

        const svg = d3.select('svg')
            .attr('width', width)
            .attr('height', height);

        const g = svg.append('g')
            .attr("transform", `translate(0,${height - marginBottom})`)
            .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

        svg.append("g")
            .attr("transform", `translate(${marginLeft},0)`)
            .call(d3.axisLeft(y).ticks(height / 40))
            .call(g => g.select(".domain").remove())
            .call(g => g.selectAll(".tick line").clone()
                .attr("x2", width - marginLeft - marginRight)
                .attr("stroke-opacity", 0.1))
            .call(g => g.append("text")
                .attr("x", -marginLeft)
                .attr("y", 10)
                .attr("fill", "currentColor")
                .attr("text-anchor", "start")
                .text("↑ Daily close ($)"));

        const line = d3.line()
            .x(d => x(d.date))
            .y(d => y(d.value));

        svg.append("path")
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", line(data));

        return svg.node();
    }
});