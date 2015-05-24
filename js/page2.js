Page2 = function(ctx){
    if (ctx.node === undefined) { throw Error('No Node given'); }
    this.node = ctx.node;

    this.render(ctx);
};


Page2.prototype = {

    render: function(ctx) {
        var n = this.node.classed('page2', true);
        d3.xml('/svg/page2.svg', function(xml) {
            var importedNode = document.importNode(xml.documentElement, true);
            var page2 = d3.select(n[0][0].appendChild(importedNode.cloneNode(true)));
            var quintile = ctx.quintile;
            page2.selectAll('.country-name tspan').text(ctx.country_name);

            page2.select('#flag').attr('xlink:href', 'data:image/png;base64,' + ctx.flag);

        })
    }
}

