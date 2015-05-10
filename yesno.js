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
        d3.xml('yesno.svg', function(xml) {
            var importedNode = document.importNode(xml.documentElement, true);
            n[0][0].appendChild(importedNode.cloneNode(true));
            if (value === true) {
                n.selectAll('text tspan').text('Yes'); 
                n.selectAll('#outer-ring').classed('yes', true);
            }
            else {
                console.log(d3.selectAll(n).attr);
                n.selectAll('text tspan').text('No'); 
                n.selectAll('#outer-ring').classed('no', true);
            }
        });

    }
}



