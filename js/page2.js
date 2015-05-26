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
            replace_yesno(page2.select('#births-registered'), 87, 60, ind['births-registered'])
            replace_yesno(page2.select('#deaths-registered'), 87, 40, ind['deaths-registered'])
            replace_yesno(page2.select('#mdsr'), 87, 20, ind['mdsr'])
            replace_yesno(page2.select('#crvs'), 87, 0, ind['crvs'])
            replace_yesno(page2.select('#stats-available'), 87, -50, ind['stats-available'])
            replace_yesno(page2.select('#impact-indicators'), 87, -80, ind['impact-indicators'])
            replace_yesno(page2.select('#ehealth-strategy'), 87, -145, ind['ehealth-strategy'])
            replace_yesno(page2.select('#country-compact'), 87, -230, ind['country-compact'])
            replace_yesno(page2.select('#health-expenditure'), 87, -290, ind['health-expenditure'])
            replace_yesno(page2.select('#health-per-capita'), 87, -310, ind['health-per-capita'])
            replace_yesno(page2.select('#rmnch'), 87, -330, ind['rmnch'])
            replace_yesno(page2.select('#annual-rmnch'), 87, -350, ind['annual-rmnch'])
            replace_yesno(page2.select('#rmnch-expenditure'), 87, -405, ind['rmnch-expenditure'])
            replace_yesno(page2.select('#annual-review'), 87, -485, ind['annual-review'])
            replace_yesno(page2.select('#progress-assessment'), 87, -510, ind['progress-assessment'])
            replace_yesno(page2.select('#sector-performance'), 87, -568, ind['sector-performance'])
        })
    }
}

