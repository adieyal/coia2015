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

var replace_segpie = function(node, dx, dy, value) {
    node.selectAll('*').remove();
    var g = node.append('g').attr('transform', 'translate(' + dx + ',' + dy +') scale(1, -1)');
    var x = new Segpie({ node : g, value : value});
    return node;
}

var replace_family_planning = function(node, dx, dy, value) {
    node.selectAll('*').remove();
    var g = node.append('g').attr('transform', 'translate(' + dx + ',' + dy +') scale(0.73, -0.73)');
    var x = new ProgressDial({ node : g, end_percent : value});
    return node;
}

var replace_access_contraceptives = function(node, dx, dy, value) {
    node.selectAll('*').remove();
    var g = node.append('g').attr('transform', 'translate(' + dx + ',' + dy +') scale(0.73, -0.73)');
    var x = new YesNoWidget({ node : g, value : value});
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
            replace_segpie(page1.selectAll('#abortion-status'), 500, 386, ctx['abortion-status']);
            replace_family_planning(page1.selectAll('#family-planning'), 478, 463, ctx['family-planning']);
            replace_access_contraceptives(page1.selectAll('#access-contraceptives'), 230, 380, ctx['access-contraceptives']);
        })
    }
}

