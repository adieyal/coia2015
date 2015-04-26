Dial = function(ctx) {
    this.w = ctx.width || 112;
    this.h = ctx.width || 53;

    if (ctx.node === undefined) { throw Error('No Node given'); }
    this.node = ctx.node;

    if (ctx.value === undefined) { throw Error('No value given'); }
    this.value = ctx.value;
    this.radius = 27.1;
    this.border = 2.8;

    this.render(this.value);
};

Dial.prototype = {

    render: function(value) {
        var n = this.node.classed('dial', true);
        var me = this;
        d3.xml('dial.svg', function(xml) {
            var importedNode = document.importNode(xml.documentElement, true);
            var dial = n[0][0].appendChild(importedNode.cloneNode(true));
            var start_angle = Math.PI / 180 * 270;
            var arc = d3.svg.arc()
                .startAngle(start_angle)
                .innerRadius(me.radius)
                .outerRadius(me.radius + me.border);
            var front = d3.select(dial).select('.progress-strip')
                .attr('d', arc.endAngle(start_angle - Math.PI / 100 * me.value))
                .attr('transform', 'translate(' + me.radius + ',0)')
            d3.select(dial).select('.value-text').text(me.value);
        });

    }
}



