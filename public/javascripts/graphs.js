$(document).ready(async function() {
    let ordersData;

    await $.ajax({
        url: '/api/order',
        method: "GET",
        success: function(data) {
            ordersData = parseData1(data);
            drawChart1(ordersData);
        },
        error: function(error) {
            console.error(error);
        }
    });

    function parseData1(data) {
        let arr = [];
        data.forEach(order => {
            arr.push({
                date: new Date(order.orderDate),
                value: order.totalprice
            });
        });

        return arr;
    }

    function drawChart1(data) {
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

        const svg = d3.select('.line-chart-1')
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

    let branchData;

    await $.ajax({
        url: '/api/order',
        method: "GET",
        dataType: "json",
        contentType: 'application/json',
        data: {
            group: true
        },
        success: function(data) {
            branchData = data;
            fetchBranchDetails(); 
        },
        error: function(error) {
            console.error(error);
        }
    });

    async function fetchBranchDetails() {
        // Fetch branch details for each branch
        for (const branch of branchData) {
            try {
                const branchDetails = await $.ajax({
                    url: `/api/branches/${branch._id}`,
                    method: "GET"
                });
                branch._id = branchDetails.name;
            } catch (error) {
                console.error(error);
            }
        }

        // Parse and draw chart
        const branches = parseData2(branchData);
        console.log(branches);
        drawChart2(branches);
    }

    function parseData2(data) {
        let arr = [];
        data.forEach(branch => {
            arr.push({
                name: branch._id, 
                value: branch.count 
            });
        });

        return arr;
    }

    function drawChart2(data) {
        const width = 928;
        const height = 500;
        const marginTop = 30;
        const marginRight = 0;
        const marginBottom = 30;
        const marginLeft = 40;

        const x = d3.scaleBand()
            .domain(d3.groupSort(data, ([d]) => -d.value, (d) => d.name)) 
            .range([marginLeft, width - marginRight])
            .padding(0.1);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, (d) => d.value )])
            .range([height - marginBottom, marginTop]);

        const svg = d3.select(".line-chart-2")
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [0, 0, width, height])
            .attr("style", "max-width: 100%; height: auto;");


        svg.append("g")
            .attr("fill", "steelblue")
            .selectAll()
            .data(data)
            .enter()
            .append("rect")
            .attr("x", d => x(d.name))
            .attr("y", d => y(d.value))
            .attr("height", d => y(0) - y(d.value))
            .attr("width", x.bandwidth());

        svg.append("g")
            .attr("transform", `translate(0, ${height - marginBottom})`)
            .call(d3.axisBottom(x).tickSizeOuter(0));

        svg.append("g")
            .attr("transform", `translate(${marginLeft},0)`)
            .call(d3.axisLeft(y).tickFormat(y => y.toFixed()).ticks(d3.max(data, (d) => d.value )))
            .call(g => g.append("text")
                .attr("x", -marginLeft)
                .attr("y", 10)
                .attr("fill", "currentColor")
                .attr("text-anchor", "start")
                .text("↑ Number of orders for the branch (+)"));

        return svg.node();
    }
});