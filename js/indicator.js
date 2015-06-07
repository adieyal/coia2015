Indicator = function(ctx){
    this.w = ctx.width || 67;
    this.h = ctx.width || 12;

    if (ctx.node === undefined) { throw Error('No Node given'); }
    this.node = ctx.node;

    if (ctx.value === undefined) { throw Error('No value given'); }
    this.value = ctx.value;

    this.yestext = ctx.yestext || 'YES';
    this.notext = ctx.notext || 'NO';
    this.partialtext = ctx.partialtext || 'PARTIAL';
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
            .classed('indicator', true);

        if (value === 'Y') {
            n.append('rect')
                .attr('width', w / 2)
                .attr('height', h)
                .attr('x', w / 2)
                .classed('yesblock', true);
        } else if (value === 'N') {
            n.append('rect')
                .attr('width', w / 2)
                .attr('height', h)
                .classed('noblock', true);
        } else if (value === null) {
            n.append('rect')
                .attr('width', w)
                .attr('height', h)
                .classed('nodatablock', true);
        } else {
            n.append('rect')
                .attr('width', w)
                .attr('height', h)
                .classed('valueblock', true);
        }

        n.append('text')
            .attr('x', w / 2)
            .attr('y', h / 2)
            .attr('fill', '#fff')
            .attr('dy', '0.3em')
            .attr('text-anchor', 'middle')
            .text(this.nodatatext);

        if (value === 'Y') {
            n.select('text').attr('x', w / 4 * 3).text(this.yestext);
            console.log('YES');
        }
        else if (value === 'N') {
            console.log('NO');
            n.select('text').attr('x', w / 4).text(this.notext);
        }
        else if (value === 'Partial') {
            console.log('PARTIAL')
            n.select('text').text(this.partialtext);
        }
        else if (value === null) {
        }
        else {
            n.select('text').text(value);
        }
    }
}

