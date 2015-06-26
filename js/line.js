LineGraph = function(ctx) {
    if (ctx.node === undefined) { throw Error('No Node given'); }
    this.node = ctx.node;

    if (ctx.data === undefined) { throw Error('No data given'); }
    this.data = ctx.data;

    this.year_range = ctx.year_range || [this.data[0][0], this.data[this.data.length - 1][0]];
    this.w = ctx.w || 400;
    this.h = ctx.h || 200;
    this.margin = 20;
    this.mdg = ctx.mdg || undefined;
    this.render();
}

LineGraph.prototype = {
    add_mdg: function(g) {
        g.selectAll('.mdg')
            .data([[this.year_range[0], this.year_range[1], this.mdg]])
            .enter()
            .append('line')
                .attr('x1', function(d) { return x(d[0]) + 5 }) 
                .attr('x2', function(d) { return x(d[1]) }) 
                .attr('y1', function(d) { return -y(d[2]) }) 
                .attr('y2', function(d) { return -y(d[2]) }) 
                .classed('mdg', true)

        var mdg_text = g.append('text')
            .attr('transform', 'translate(35, ' + (-y(this.mdg) - 7) + ')')

        mdg_text.append('tspan')
            .text('MDG Target: ')
            .classed('mdg-text', true)

        mdg_text.append('tspan')
            .text(this.mdg)
            .classed('mdg-text-figure', true)
    },
    add_datapoints: function(g, x, y) {

        g.selectAll('.spot')
            .data(this.data)
            .enter()
            .append('circle')
                .attr('r', 2)
                .attr('cx', function(d) { return x(d[0]); })
                .attr('cy', function(d) { return -y(d[1]); })
                .classed('spot', true)

        var g_spot = g.append('g')
            .attr('transform', 'translate(5, -14)')
            .classed('spot-labels', true);

        g_spot.selectAll('.spot-text')
            .data(this.data)
            .enter()
            .append('text')
                .attr('x', function(d) { return x(d[0]); })
                .attr('y', function(d) { return -y(d[1]); })
                .text(function(d) { return d[0]; })
                .classed('spot-text', true)

        g_spot.selectAll('.spot-text2')
            .data(this.data)
            .enter()
            .append('text')
                .attr('x', function(d) { return x(d[0]); })
                .attr('y', function(d) { return -y(d[1]); })
                .attr('dy', '1em')
                .text(function(d) { return d[1]; })
                .classed('spot-text2', true)

    },
    add_line: function(g, x, y) {
        var line = d3.svg.line()
            .x(function(d, i) { return x(d[0]); })
            .y(function(d) { return -y(d[1]); })

        g.append("path")
            .attr("d", line(this.data))
            .attr("fill", 'none')
            .classed('line', true)
    },
    add_xaxis: function(axes, x, y) {
        axes.append("line")
            .attr("x1", x(this.year_range[0]))
            .attr("y1", -1 * y(0))
            .attr("x2", x(this.year_range[1]))
            .attr("y2", -1 * y(0))

        axes.selectAll(".xLabel")
            .data(x.ticks(5))
            .enter().append("text")
            .attr("class", "xLabel")
            .text(String)
            .attr("x", function(d) { return x(d) })
            .attr("y", 0)
            .attr("text-anchor", "middle")

        axes.selectAll(".xTicks")
            .data(x.ticks(5))
            .enter().append("line")
            .attr("class", "xTicks")
            .attr("x1", function(d) { return x(d); })
            .attr("y1", -1 * y(0))
            .attr("x2", function(d) { return x(d); })
            .attr("y2", -1 * y(0) + 8)
    },
    add_yaxis: function(axes, x, y) {
        axes.append("line")
            .attr("x1", x(this.year_range[0]) + 5)
            .attr("y1", -1 * y(0))
            .attr("x2", x(this.year_range[0]) + 5)
            .attr("y2", -1 * y(max_y))

        axes.selectAll(".yLabel")
            .data(y.ticks(4))
            .enter().append("text")
            .attr("class", "yLabel")
            .text(String)
            .attr("x", -2)
            .attr("y", function(d) { return -1 * y(d) })
            .attr("dy", 3)
            .attr('dx', '1.5em')

        axes.selectAll(".yTicks")
            .data(y.ticks(4))
            .enter().append("line")
            .attr("class", "yTicks")
            .attr("y1", function(d) { return -1 * y(d); })
            .attr("x1", x(this.year_range[0]) - 1)
            .attr("y2", function(d) { return -1 * y(d); })
            .attr("x2", x(this.year_range[0]) + 6.05)
    },
    render : function() {
        var values = [];
        for (i = 0; i < this.data.length; i++)
            values.push(this.data[i][1]);

        max_y = d3.max(values) * 1.1;

        y = d3.scale.linear().domain([0, max_y]).range([0 + this.margin, this.h - this.margin]),
        x = d3.scale.linear().domain([this.year_range[0], this.year_range[1]]).range([0 + this.margin, this.w - this.margin])

        var vis = this.node.append("svg")
            .attr("width", this.w)
            .attr("height", this.h)
 
        var g = vis.append("g")
            .attr('transform', 'translate(10, ' + this.h + ') scale(0.85, 0.85)')
            .classed('line-graph', true)

        this.add_line(g, x, y);
        this.add_datapoints(g, x, y);
        /*
        g.append("path")
            .attr("d", line(this.data))
            .attr("fill", 'none')
            .classed('line', true)
        */

        if (this.mdg) {
            this.add_mdg(g);
        }

        g.selectAll('.guide-line')
            .data(this.data)
            .enter()
            .append('line')
                .attr('x1', function(d) { return x(d[0]) }) 
                .attr('x2', function(d) { return x(d[0]) }) 
                .attr('y1', function(d) { return -y(0) }) 
                .attr('y2', function(d) { return -y(max_y) }) 
                .classed('guide-line', true)

        var axes = g.append('g')
            .classed('axes', true)

        this.add_xaxis(axes, x, y);
        this.add_yaxis(axes, x, y);
    }
}
