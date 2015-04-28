Page1 = function(ctx){
    if (ctx.node === undefined) { throw Error('No Node given'); }
    this.node = ctx.node;

    this.render(ctx);
};

var replace_quintile = function(node, dx, dy, values) {
    node.selectAll('*').remove();
    var g = node.append('g').attr('transform', 'scale(0.29, -0.29) translate(' + dx + ',' + dy +')');
    values.node = g;
    q1 = new QuintileWidget(values);
    node.attr('height', '75px');
    return node;
}

Page1.prototype = {

    render: function() {
        var n = this.node.classed('page1', true);
        d3.xml('page1.svg', function(xml) {
            var importedNode = document.importNode(xml.documentElement, true);
            var page1 = d3.select(n[0][0].appendChild(importedNode.cloneNode(true)));
            page1.selectAll('.country-name tspan').text(ctx.country_name);
            // TODO Add flag
            page1.selectAll('#quintile-post-natal *').remove();
            var g = page1.select('#quintile-post-natal').append('g').attr('transform', 'scale(0.29, -0.29) translate(116, -580)');
            q1 = new QuintileWidget({ bottom : 23, top : 67, value : 45, node : g});
            page1.select('#quintile-post-natal').attr('height', '75px');
            replace_quintile(page1.selectAll('#quintile-contraception'), 116, -820, {bottom : 20, value : 40, top : 60});
            replace_quintile(page1.selectAll('#quintile-antenatal'), 575, -820, {bottom : 20, value : 40, top : 60});
            replace_quintile(page1.selectAll('#quintile-prevention'), 1035, -820, {bottom : 20, value : 40, top : 60});
            replace_quintile(page1.selectAll('#quintile-birth-attendants'), 1498, -820, {bottom : 20, value : 40, top : 60});
            replace_quintile(page1.selectAll('#quintile-breast-feeding'), 575, -580, {bottom : 20, value : 40, top : 60});
            replace_quintile(page1.selectAll('#quintile-dpt3'), 1035, -580, {bottom : 30, value : 50, top : 70});
            replace_quintile(page1.selectAll('#quintile-pneumonia'), 1498, -580, {bottom : 40, value : 60, top : 80});
        })
    }
}

