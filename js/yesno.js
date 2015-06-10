YesNoWidget = function(ctx) {

    if (ctx.node === undefined) { throw Error('No Node given'); }
    this.node = ctx.node;

    if (ctx.value === undefined) { throw Error('No value given'); }
    this.value = ctx.value;

    this.render(this.value);
};

YesNoWidget.prototype = {

    render: function(value) {
        var n = this.node.classed('yesno', true);
        d3.xml('/svg/yesno.svg', function(xml) {
            var importedNode = document.importNode(xml.documentElement, true);
            n[0][0].appendChild(importedNode.cloneNode(true));
            if (value === 'YES') {
                n.selectAll('text tspan').text('Yes'); 
                n.selectAll('#outer-ring').classed('yes', true);
            }
            else if (value === 'NO') {
                n.selectAll('text tspan').text('No'); 
                n.selectAll('#outer-ring').classed('no', true);
            }
            else if (value === 'PARTIAL') {
                n.selectAll('text tspan').text('Partial').classed('partial', true); 
                n.selectAll('#outer-ring').classed('partial', true);
            }
            else {
                n.selectAll('text tspan').text('No Data').classed('nodata', true); 
                n.selectAll('#outer-ring').classed('nodata', true);
            }
        });
    }
}



