(function() {
    var twoPi = Math.PI * 2;
    ProgressDial = function(ctx) {
        if (ctx.node === undefined) { throw Error('No Node given'); }
        this.node = ctx.node;

        if (ctx.end_percent === undefined) { throw Error('No percentage given'); }
        this.end_percent = ctx.end_percent;

        this.color = ctx.color || '#6ba3e4';
        this.radius = ctx.radius || 30;
        this.border = ctx.border || 10;
        this.padding = ctx.padding || 30;
        this.center_radius = ctx.center_radius || this.radius - 12;
        this.center_color = ctx.center_color || '#918f90';
        this.start_percent = 0;
        var threshold_format = 0.05;
        if (ctx.format) {
            this.format = ctx.format
        } else if (this.end_percent > threshold_format ) {
            this.format = d3.format('.0%');
        } else {
            this.format = d3.format('.2%');
        }

        this.render(this.end_percent);
    }

    ProgressDial.prototype = {
        render : function(percent) {
            var boxSize = (this.radius + this.padding) * 2;
            var arc = d3.svg.arc()
                .startAngle(0)
                .innerRadius(this.radius)
                .outerRadius(this.radius - this.border);

            var svg = this.node.append('svg')
                .attr('width', this.boxSize)
                .attr('height', this.boxSize);

            var g = svg.append('g')
                .attr('transform', 'translate(' + boxSize / 2 + ',' + boxSize / 2 + ')')
                .classed("progdial", true);

            g.append("circle")
                .attr("cx", 0)
                .attr("cy", 0)
                .attr("r", this.center_radius)
                .classed("center", true);

            var meter = g.append('g')
                .attr('class', 'progress-meter');

            meter.append('path')
                .attr('class', 'background')
                .attr('d', arc.endAngle(twoPi));

            var front = meter.append('path')
                .attr('class', 'foreground')
                .attr('fill-opacity', 1);

            var numberText = meter.append('text')
                .attr('fill', '#fff')
                .attr('text-anchor', 'middle')
                .attr('dy', '.35em')
                .classed('meter-value', true);


            var progress = percent;
            front.attr('d', arc.endAngle(twoPi * progress));
            if (progress == 0)
                numberText.classed('nodata', true).text('No Data');
            else
                numberText.text(this.format(progress));
        }
    }
})();

