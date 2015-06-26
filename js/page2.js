Page2 = function(ctx){
    if (ctx.node === undefined) { throw Error('No Node given'); }
    this.node = ctx.node;

    this.render(ctx);
};


var replace_yesno = function(node, dx, dy, value) {
    node.selectAll('*').remove();
    var yesno = new Indicator({node:node, value:value});
    node.attr('transform', 'translate(' + dx + ',' + dy + ') scale(1, -1)');
    return node;
}

Page2.prototype = {

    render: function(ctx) {
        var n = this.node.classed('page2', true);
        d3.xml('/svg/page2.svg', function(xml) {
            var importedNode = document.importNode(xml.documentElement, true);
            var page2 = d3.select(n[0][0].appendChild(importedNode.cloneNode(true)));
            var quintile = ctx.quintile;
            page2.selectAll('.country-name tspan').text(ctx.country_name);

            page2.select('#flag').attr('xlink:href', 'data:image/png;base64,' + ctx.flag);

            var ind = ctx.indicators;
            replace_yesno(page2.select('#births-registered'), 87, 88, ind['births-registered'])
            replace_yesno(page2.select('#deaths-registered'), 87, 67, ind['deaths-registered'])
            replace_yesno(page2.select('#mdsr'), 87, 46, ind['mdsr'])
            replace_yesno(page2.select('#crvs'), 87, 24, ind['crvs'])
            replace_yesno(page2.select('#stats-available'), 87, -30, ind['stats-available'])
            replace_yesno(page2.select('#impact-indicators'), 87, -61, ind['impact-indicators'])
            replace_yesno(page2.select('#ehealth-strategy'), 87, -122, ind['ehealth-strategy'])
            replace_yesno(page2.select('#country-compact'), 87, -318, ind['country-compact'])
            replace_yesno(page2.select('#health-expenditure'), 87, -201, ind['health-expenditure'])
            replace_yesno(page2.select('#health-per-capita'), 87, -219, ind['health-per-capita'])
            replace_yesno(page2.select('#rmnch'), 87, -242, ind['rmnch'])
            replace_yesno(page2.select('#annual-rmnch'), 87, -258, ind['annual-rmnch'])
            replace_yesno(page2.select('#rmnch-expenditure'), 87, -383, ind['rmnch-expenditure'])
            replace_yesno(page2.select('#annual-review'), 87, -461, ind['annual-review'])
            replace_yesno(page2.select('#progress-assessment'), 87, -490, ind['progress-assessment'])
            replace_yesno(page2.select('#sector-performance'), 87, -547, ind['sector-performance'])
        })
    }
}

