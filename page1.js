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

var replace_dial = function(node, dx, dy, values) {
    node.selectAll('*').remove();
    var g = node.append('g').attr('transform', 'scale(0.9, -0.9) translate(' + dx + ',' + dy +')');
    values.node = g;
    q1 = new DialWidget(values);
    //node.attr('height', '75px');
    return node;
}

Page1.prototype = {

    render: function(ctx) {
        var n = this.node.classed('page1', true);
        d3.xml('page1.svg', function(xml) {
            var importedNode = document.importNode(xml.documentElement, true);
            var page1 = d3.select(n[0][0].appendChild(importedNode.cloneNode(true)));
            var quintile = ctx.quintile;
            page1.selectAll('.country-name tspan').text(ctx.country_name);

            // TODO Add flag

            replace_quintile(page1.selectAll('#quintile-contraception'), 116, -820, quintile['contraception']);
            replace_quintile(page1.selectAll('#quintile-antenatal'), 575, -820, quintile['antenatal']);
            replace_quintile(page1.selectAll('#quintile-prevention'), 1035, -820, quintile['prevention']);
            replace_quintile(page1.selectAll('#quintile-birth-attendants'), 1498, -820, quintile['birth-attendants']);
            replace_quintile(page1.selectAll('#quintile-post-natal'), 116, -580, quintile['post-natal']);
            replace_quintile(page1.selectAll('#quintile-breast-feeding'), 575, -580, quintile['breast-feeding']);
            replace_quintile(page1.selectAll('#quintile-dpt3'), 1035, -580, quintile['dpt3']);
            replace_quintile(page1.selectAll('#quintile-pneumonia'), 1498, -580, quintile['pneumonia']);

            replace_dial(page1.selectAll('#dial-density'), 205, -490, { value : 84 });
            //replace_progdial(page1.selectAll('#dial-density'), 205, -490, { value : 1 });
        })
    }
}

