var fmt_thousands = function(x) {
    return d3.format(',.0f')(x).replace(',', ' ')
}

var fmt_percentage = d3.format('.2%');

Donor = function(ctx) {
    if (ctx.node === undefined) { throw Error('No Node given'); }
    this.node = ctx.node;

    this.render(ctx);
};

Donor.prototype = {

    render_bars: function(ctx) {
        add_bars(
            d3.select('#total-commitments'), ctx.commitments.data,
            {width : 400, height : 110, x : 13, y : 735}
        );

        add_bars(
            d3.select('#health-total'), ctx['health-total'].data,
            {width : 400, height : 110, x : 13, y : 590}
        );

        add_bars(
            d3.select('#rmnch'), ctx['rmnch'].data,
            {width : 400, height : 110, x : 13, y : 450}
        );
    },

    add_donor_type: function(ctx) {
        var set_donor_type = function(node, value) {
            if (value) {
                node.attr('xlink:href', '#tick-circle')
            } else {
                node.attr('xlink:href', '#tick-cross')
            }
        }

        var donor_type = ctx.donor_type;
        set_donor_type(d3.select('#funder'), donor_type.funder);
        set_donor_type(d3.select('#financial-intermediary'), donor_type.financial_intermediary);
        set_donor_type(d3.select('#dac-member'), donor_type.dac_member);
        set_donor_type(d3.select('#crs-reports'), donor_type.crs_reports);
    },

    add_pledges: function(ctx) {
        var add_pledge = function(node, text) {
            text_node = node.select('.pledge-text')
            text_node.selectAll('*').remove()
            text_node.text(text);
            rect_node = node.select('rect')
            text_node.textwrap(rect_node);
        }

        add_pledge(d3.selectAll('#pledge1'), ctx.pledges[0])
        add_pledge(d3.selectAll('#pledge2'), ctx.pledges[1])
        add_pledge(d3.selectAll('#pledge3'), ctx.pledges[2])
        add_pledge(d3.selectAll('#pledge4'), ctx.pledges[3])

    },

    add_title : function(node, ctx) {
        var flag_node = node.select('#flag');
        var flag = ctx.flag;
        var page_width = 566.28436;
        var image_padding = 4;
        var image_height = 17;
        var image_width = image_height * ctx.flag.width / ctx.flag.height;
        var image_x = page_width - image_width - image_padding;
        flag_node
            .attr('xlink:href', 'data:image/png;base64,' + ctx.flag.data)
            .attr('width', image_width)
            .attr('height', image_height)
            .attr('x', page_width - image_width - image_padding)

        d3.selectAll('.donor-name tspan').text(ctx.donor.name);
        var text_width = node.select('.donor-name')[0][0].getBBox().width; 
        node.selectAll('.donor-name')
            .attr('transform', 'translate(' + (page_width - image_width - image_padding * 2) + ', 0)')
            .attr('transform', 'translate(' + -(image_padding * 2) + ',0)')
    },

    render: function(ctx) {
        var n = this.node.classed('donor', true);
        var me = this;
        d3.xml('/svg/donor.svg', function(xml) {
            var importedNode = document.importNode(xml.documentElement, true);
            var donor = d3.select(n[0][0].appendChild(importedNode.cloneNode(true)));
            donor.selectAll('.address tspan').text(ctx.contact.address);
            donor.selectAll('.url tspan').text(ctx.contact.website);
            me.render_bars(ctx);
            add_stacked(
                d3.select('#bimulti'), ctx['bimulti'],
                {width : 250, height : 140, x : 11, y : 263}
            )

            me.add_donor_type(ctx);

            add_dial(d3.select('#perc_gdp'), ctx.commitments.figure, {x: 397, y: 744});
            add_dial(d3.select('#perc_health'), ctx['health-total'].figure, {x: 397, y: 744});
            add_dial(d3.select('#perc_rmnch'), ctx.rmnch.figure, {x: 397, y: 744});
            me.add_title(donor.select('#title'), ctx);
            d3.select('#transparency .numerator').text(ctx.transparency.numerator);
            d3.select('#transparency .denominator').text('/' + ctx.transparency.denominator);

            if (ctx.transparency.vector === 'up') {
                d3.select('#transparency-vector').attr('xlink:href', '#vector-up');
            } else if (ctx.transparency.vector == 'down') {
                d3.select('#transparency-vector').attr('xlink:href', '#vector-down');
            } else {
                d3.select('#transparency-vector').attr('xlink:href', '#vector-no-change');
            }

            me.add_pledges(ctx)
        })
    }
}

var add_dial = function(node, data, geom) {
    node.selectAll('*').remove();
    var g = node.append('g');
    g.attr('transform', 'translate(' + geom.x + ', ' + geom.y + ') rotate(180) scale(-0.62, 0.62)');
    var ctx = {
        end_percent : data.value,
        node : g,
        color : '#918f90'
    }
    var x = new ProgressDial(ctx);

    g.append('text')
        .text('(' + data.year + ')')
        .classed('perc_year', true)
        .attr('transform', 'translate(' + 48 + ', ' + 71 + ')')

    g.select('.progress-meter text').attr('dy', '0.15em');
    return node;

}

var add_stacked = function(node, data, geom) {
    node.selectAll('*').remove();
    var g = node.append('g');

    generate_stacked(g, data, geom.width, geom.height);
    g.attr('transform', 'translate(' + geom.x + ', ' + geom.y + ') rotate(180) scale(-1, 1)');
}

var generate_stacked = function(node, data, w, h) {

    var data = { 
        years : data.map(function(v, idx, arr) { return v[0]; }),
        values1 : data.map(function(v, idx, arr) { return v[1]; }),
        values2 : data.map(function(v, idx, arr) { return v[2]; }),
        values3 : data.map(function(v, idx, arr) { return v[3]; }),
        values4 : data.map(function(v, idx, arr) { return v[4]; })
    }
            
    data.values1.unshift('data1');
    data.values2.unshift('data2');
    data.values3.unshift('data3');
    data.values4.unshift('data4');

    var chart = c3.generate({
        bindto: node,
        size: {
            height: h,
            width: w
        },
        data: {
            columns: [
                data.values1, data.values2/*,
                data.values3, data.values4*/
            ],
            groups : [
                ['data1', 'data2']
            ],
            type: 'bar',
            /*
            types: {
                data3 : 'line',
                data4 : 'line',
            },
            */
            labels: false,
        },
        bar: {
            width: {
                ratio: 0.5 // this makes bar width 50% of length between ticks
            }
            // or
            //width: 100 // this makes bar width 100px
        },
        point: {
            show: true
        },
        axis: {
            x: {
                type: 'category',
                categories: data.years,
                tick: {
                    multiline: false
                },
                label: {
                    // TODO - add label spacing
                }
            },
            y: {
                show: true,
                tick: {
                    format: fmt_thousands,
                },
                padding : {
                    top: 0,
                    bottom: 0
                }
            }
        },
        legend: {
            show: false
        }
    });
}


var add_bars = function(node, data, geom) {
    node.selectAll('*').remove();
    var g = node.append('g');

    generate_bar(g, data, geom.width, geom.height);
    g.attr('transform', 'translate(' + geom.x + ', ' + geom.y + ') rotate(180) scale(-1, 1)');

}

var generate_bar = function(node, data, w, h) {

    var data = { 
        years : data.map(function(v, idx, arr) { return v[0]; }),
        values1 : data.map(function(v, idx, arr) { return v[1]; }),
        values2 : data.map(function(v, idx, arr) { return v[2]; })
    }
            
    data.values1.unshift('data1');
    data.values2.unshift('data2');
    var chart = c3.generate({
        bindto: node,
        size: {
            height: h,
            width: w
        },
        data: {
            columns: [data.values1, data.values2],
            type: 'bar',
            types: {
                data2 : 'line'
            },
            labels: {
                format : {
                    'data1' : fmt_thousands,
                    'data2' : fmt_percentage,
                }
            },
            axes: {
                data1: 'y',
                data2: 'y2'
            }
        },
        bar: {
            width: {
                ratio: 0.5 // this makes bar width 50% of length between ticks
            }
            // or
            //width: 100 // this makes bar width 100px
        },
        point: {
            show: true
        },
        axis: {
            x: {
                type: 'category',
                categories: data.years,
                tick: {
                    multiline: false
                },
                label: {
                    // TODO - add label spacing
                }
            },
            y: {
                show: true,
                tick: {
                    format: function(x) { return fmt_thousands(x) + 'm'; }
                },
                padding : {
                    top: 10,
                    bottom: 0
                }
            },
            y2: {
                show: true,
                tick: {
                    count: 5,
                    format: fmt_percentage
                },
                padding : {
                    top: 15,
                    bottom: 10
                }
            }
        },
        legend: {
            show: false
        },
        grid: {
            x: {
                lines: [
                    {value: 0.50}, {value: 1.51},
                    {value: 2.51}, {value: 3.51}
                ]
            }
        }
    });
}
