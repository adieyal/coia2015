QuintileWidget = function(ctx){
    if (ctx.node === undefined) { throw Error('No Node given'); }
    this.node = ctx.node;

    if (ctx.bottom === undefined) { throw Error('No bottom quintile given'); }
    this.bottom = ctx.bottom;

    if (ctx.top === undefined) { throw Error('No top quintile given'); }
    this.top = ctx.top;

    if (ctx.value === undefined) { throw Error('No value given'); }
    this.value = ctx.value;

    this.render(this.value);
};

QuintileWidget.prototype = {

    render: function(value) {
        var n = this.node.classed('quintile-widget', true);
        var me = this;
        var xscale = d3.scale.linear().domain([0,100]).range([0, 109]);
        var line = d3.svg.line()
            .x(function(d, i) { return xscale(d[0]); })
            .y(function(d) { return d[1]; })

        d3.xml('quintile.svg', function(xml) {
            var importedNode = document.importNode(xml.documentElement, true);
            var qwidget = d3.select(n[0][0].appendChild(importedNode.cloneNode(true)));
            qwidget.select('#red-circle').attr('transform', 'translate(' + xscale(me.bottom) + ',0)');
            qwidget.select('#yellow-circle').attr('transform', 'translate(' + xscale(me.top) + ',0)');
            qwidget.select('#indicator #line line')
                .attr('x1', me.bottom)
                .attr('x2', me.top)

            console.log(me.value);
            qwidget.select('#result-value')
                .attr('transform', 'translate(' + xscale(me.value) + ',0)')
                .select('text').text(me.value + '%');
            qwidget.select('#result-indicator')
                .attr('transform', 'translate(' + xscale(me.value) + ',0)')
            
                
            /*
            qwidget.select('#indicator').append('line')
                .attr('x1', xscale(me.bottom))
                .attr('x2', xscale(me.top))
                .attr('y1', 10)
                .attr('y2', 10)
                .style('stroke', 'black')
            */
        });

    }
}



