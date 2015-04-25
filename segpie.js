Segpie = function(ctx){
    this.w = ctx.width || 42;
    this.h = ctx.width || 42;

    if (ctx.node === undefined) { throw Error('No Node given'); }
    this.node = ctx.node;

    if (ctx.value === undefined) { throw Error('No value given'); }
    this.value = ctx.value;

    this.render(this.value);
};

Segpie.prototype = {

    render: function(value) {
        var n = this.node.classed('segpie', true);
        d3.xml('segment.svg', function(xml) {
            var importedNode = document.importNode(xml.documentElement, true);
            var pie = n[0][0].appendChild(importedNode.cloneNode(true));
            for (i = 1; i <= 5; i++) {
                if (value >= i)
                    n.select(".segment" + i).classed("active", true);
            }
        });

    }
}


