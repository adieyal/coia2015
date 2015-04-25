Indicator = function(ctx){
    this.w = ctx.width || 58;
    this.h = ctx.width || 16;

    if (ctx.node === undefined) { throw Error('No Node given'); }
    this.node = ctx.node;

    this.value = ctx.value || null;

    this.yestext = ctx.yestext || 'YES';
    this.notext = ctx.notext || 'NO';
    this.nodatatext = ctx.nodatatext || 'NO DATA';

    this.render(this.value);
};

Indicator.prototype = {

    render: function(value) {
        var w = this.w, h = this.h;
        var n = this.node.classed('indicator', true);

        n.append('rect')
            .attr('width', w)
            .attr('height', h)
            .classed('block', true);

        if (value === this.yestext) {
            n.append('rect')
                .attr('width', w / 2)
                .attr('height', h)
                .attr('x', w / 2)
                .classed('yesblock', true);
        } else if (value == this.notext) {
            n.append('rect')
                .attr('width', w / 2)
                .attr('height', h)
                .classed('noblock', true);
        } else if (value == null) {
            n.append('rect')
                .attr('width', w)
                .attr('height', h)
                .classed('nodatablock', true);
        }

        n.append('text')
            .attr('x', w / 2)
            .attr('y', h / 2)
            .attr('fill', '#fff')
            .attr('dy', '0.3em')
            .attr('text-anchor', 'middle')
            .text(this.nodatatext);

        if (value === this.yestext)
            n.select('text').attr('x', w / 4 * 3).text(value);
        else if (value === this.notext)
            n.select('text').attr('x', w / 4).text(value);
    }
}

