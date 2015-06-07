Donor = function(ctx){
    if (ctx.node === undefined) { throw Error('No Node given'); }
    this.node = ctx.node;

    this.render(ctx);
};

var add_graph = function(node, data, w, h, x, y) {
    node.selectAll('*').remove();
    var g = node.append('g');

    generate_bar(g, data, w, h);
    g.attr('transform', 'translate(' + x + ', ' + y + ') rotate(180) scale(-1, 1)');
}

Donor.prototype = {

    render: function(ctx) {
        var n = this.node.classed('donor', true);
        d3.xml('/svg/donor.svg', function(xml) {
            var importedNode = document.importNode(xml.documentElement, true);
            var donor = d3.select(n[0][0].appendChild(importedNode.cloneNode(true)));
            donor.selectAll('.country-name tspan').text(ctx.donor_name);
            add_graph(d3.select('#total_commitments').style('height', '250px'), ctx['commitments'], 540, 122, 13, 730);
            //donor.select('#flag').attr('xlink:href', 'data:image/png;base64,' + ctx.flag);
    
        })
    }
}


var generate_bar = function(node, data, w, h) {
    values = data.map(function(v, idx, arr) { return v[1]; }); 
    years = data.map(function(v, idx, arr) { return v[0]; }); 

    values.unshift('data');
    var chart = c3.generate({
        bindto: node,
        size: {
            height: h,
            width: w
        },
        data: {
            columns: [values],
            type: 'bar',
            labels: true
        },
        bar: {
            width: {
                ratio: 0.5 // this makes bar width 50% of length between ticks
            }
            // or
            //width: 100 // this makes bar width 100px
        },
        axis: {
            x: {
                type: 'category',
                categories: years,
                tick: {
                    multiline: false 
                },
                label: {
                    // TODO - add label spacing
                }
            }
        },
        legend: {
            show: false
        },
        grid: {
            x: {
                lines: [
                    {value: 0.50}, {value: 1.51}, {value: 2.51},
                    {value: 3.51}, {value: 4.51}, {value: 5.51},
                    {value: 6.51}, {value: 7.51}, {value: 8.51},
                    {value: 9.51}, {value: 10.51}, {value: 11.51},
                    {value: 12.51}, {value: 13.50}, {value: 14.50},
                ]
            }
        }
    });
}
