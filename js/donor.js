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
            donor.selectAll('#address1 tspan').text(ctx.contact.address1);
            donor.selectAll('#address2 tspan').text(ctx.contact.address2);
            donor.selectAll('.url tspan').text(ctx.contact.website);
            me.render_bars(ctx);
            add_stacked(
                d3.select('#bimulti'), ctx['bimulti'],
                {width : 250, height : 140, x : 11, y : 263}
            )

            me.add_donor_type(ctx);

            add_dial(d3.select('#perc_gdp'), ctx.commitments.figure, {x: 397, y: 744});
            add_dial(d3.select('#perc_health'), ctx['health-total'].figure, {x: 397, y: 744});
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

            post_process(ctx.donor.name);
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
        .text('' + data.year + '')
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
        values2 : data.map(function(v, idx, arr) { if (v[2] == 0) return null; else return v[2]; })
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
                    bottom: 0
                },
                min : 0,
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

var remove_health_total = function() {
    d3.selectAll('#health-total .c3-target-data2').remove();
    d3.selectAll('#health-total .c3-chart-text').remove();
    d3.selectAll('#health-total').remove()
    d3.selectAll('#health-total .c3-grid-lines').remove();
    d3.selectAll('#health-total .c3-texts-data2').remove();

    d3.selectAll('#g666').remove();
    d3.selectAll('#g658').remove();
    d3.selectAll('#text8909').remove();
    d3.selectAll('#text662').remove();
    d3.selectAll('#path474').remove();

    d3.selectAll('#no-health-data').classed('hidden', false);
    d3.selectAll('#health-pullout').classed('hidden', true);

}

var remove_rmnch = function() {

    d3.selectAll('#text680').remove();
    d3.selectAll('#g684').remove();
    d3.selectAll('#rmnch .c3-grid-lines').remove();
    d3.selectAll('#rmnch .c3-texts-data2').remove();
    d3.selectAll('#rmnch').remove()
    d3.selectAll('#rmnch .c3-chart-text').remove();
    d3.selectAll('#rmnch .c3-target-data2').remove();
    d3.selectAll('#no-rmnch-data').classed('hidden', false);
    d3.selectAll('#rmnch-static').classed('hidden', true);
}

var remove_bimulti = function() {
    d3.select('#bimulti').remove();
    d3.select('#bimulti-block .legend').classed('hidden', true);
    d3.selectAll('#no-bimulti-data').classed('hidden', false);
}

var move_labels = function(node, adjustments) {
    for (i in adjustments) {
        node2 = node.select('text.c3-text-' + i);
        adj = adjustments[i];

        if (adj == null)
            continue;

        if (typeof adj.styles == 'object') {
            for (key in adj.styles) {
                node2.style(key, adj.styles[key]);
            }
        }

        if (typeof adj.attrs == 'object') {
            for (key in adj.attrs) {
                node2.attr(key, adj.attrs[key]);
            }
        }
    }
}

var adjust_russia = function() {
    remove_health_total();
    remove_rmnch();
    d3.selectAll('#total-commitments .c3-event-rect').remove();
    d3.selectAll('#total-commitments .c3-texts-data1 .c3-text-0').remove();
    d3.selectAll('#total-commitments .c3-texts-data1 .c3-text-1').remove();
    d3.selectAll('#total-commitments .c3-texts-data1 .c3-text-2').remove();
    d3.selectAll('#total-commitments .c3-target-data2').remove();
    d3.select('#total-commitments .c3-axis-y .domain').attr('d', 'M0,1H0V76')
    d3.select('#total-commitments .c3-axis-y2').remove();
    d3.select('#pledge2').remove();
    d3.select('#pledge3').remove();
    d3.select('#pledge4').remove();
    d3.select('#transparency-block .numerator').text('-');
    d3.select('#pledge1 text').remove();
}

var adjust_australia = function() {

    d3.select('#g8707 text').attr('dx', -65);
    move_labels(d3.selectAll('#total-commitments .c3-texts-data1'), [
        null,
        null,
        null,
        null,
        {attrs: {dy : 13}, styles : {fill: '#ffffff'}} 
    ]);

    d3.select('#health-total .c3-axis-y .domain').attr('d', 'M0,0H0V76')
    d3.select('#pledge4').remove();
}

var adjust_canada = function() {
    move_labels(d3.selectAll('#total-commitments .c3-texts-data1'), [
        null, null, null,
        {attrs: {dy : 9}, styles : {fill: '#ffffff'}},
        {attrs: {dy : 18}, styles : {fill: '#ffffff'}}
    ]);

    move_labels(d3.selectAll('#total-commitments .c3-texts-data2'), [
        null, null, null, null,
        {attrs: {dy : -4}, styles : {fill: '#ffffff'}}
    ]);

    move_labels(d3.selectAll('#health-total .c3-texts-data1'), [
        null, null,
        {attrs: {dy : 13}, styles : {fill: '#ffffff'}}, 
        {attrs: {dy : 16}, styles : {fill: '#ffffff'}}, 
    ]);

    move_labels(d3.selectAll('#health-total .c3-texts-data2'), [
        null, null, null, null,
        {attrs: {dy : 2}, styles : {fill: '#ffffff'}}, 
    ]);
    d3.select('#total-commitments .c3-axis-y .domain').attr('d', 'M0,1H0V76')
    d3.select('#health-total .c3-axis-y .domain').attr('d', 'M0,8H0V82')
}

var adjust_gavi_alliance = function() {
    d3.select('#g8707 text').attr('dx', -20);
    d3.selectAll('#total-commitments .c3-text-0').remove();
    d3.selectAll('#total-commitments .c3-text-1').remove();
    d3.selectAll('#total-commitments .c3-texts-data2 .c3-text-2').remove();
    d3.selectAll('#total-commitments .c3-target-data2').remove();

    d3.selectAll('#health-total .c3-text-0').remove();
    d3.selectAll('#health-total .c3-text-1').remove();
    d3.selectAll('#health-total .c3-circle-0').remove();
    d3.selectAll('#health-total .c3-circle-1').remove();

    move_labels(d3.selectAll('#health-total .c3-texts-data1'), [
        null, null, null, null,
        {attrs: {dy : 17}, styles : {fill: '#ffffff'}}
    ]);
    d3.select('#total-commitments .c3-axis-y2').remove();

    remove_bimulti();
    d3.selectAll('#no-bimulti-data tspan').text("This chart is not relevant for this agency")

}

var adjust_global_fund = function() {
    d3.select('#g8707 text').attr('dx', -100);
    d3.selectAll('#total-commitments .c3-texts-data1 .c3-text-0').remove();
    d3.selectAll('#total-commitments .c3-texts-data2').remove();

    d3.selectAll('#health-total .c3-text-0').remove();

    move_labels(d3.selectAll('#health-total .c3-texts-data1'), [
        null, null, null,
        {attrs: {dy : 15}, styles : {fill: '#ffffff'}},
        {attrs: {dy : 13}, styles : {fill: '#ffffff'}}
    ]);

    remove_bimulti();
    d3.select('#total-commitments .c3-axis-y2').remove();
    d3.selectAll('#no-bimulti-data tspan').text("This chart is not relevant for this agency")
    d3.select('#title .donor-name tspan').text('The Global Fund (GFATM)').style('font-size', '9px');
}

var adjust_japan = function() {
    move_labels(d3.selectAll('#total-commitments .c3-texts-data2'), [
        null,
        {attrs: {dy : 15}},
        {attrs: {dy : 15}},
        {attrs: {dy : 15}},
    ]);

    move_labels(d3.selectAll('#health-total .c3-texts-data1'), [
        {attrs: {dy : 11}, styles : {fill: '#ffffff'}},
        {attrs: {dy : -2}},
    ]);

    move_labels(d3.selectAll('#health-total .c3-texts-data2'), [
        null,
        {attrs: {dy : 16}},
        {attrs: {dy : 16}},
        {attrs: {dy : 17}},
        {attrs: {dy : 15}},
    ]);
    d3.select('#rmnch .c3-axis-y .domain').attr('d', 'M0,1H0V76')
}

var adjust_world_bank = function() {
    d3.selectAll('#total-commitments .c3-texts-data2').remove();
    move_labels(d3.selectAll('#health-total .c3-texts-data1'), [
        null,
        {attrs: {dy : 13}, styles : {fill: '#ffffff'}},
        {attrs: {dy : 13}, styles : {fill: '#ffffff'}},
        {attrs: {dy : 18}, styles : {fill: '#ffffff'}},
        {attrs: {dy : 16}, styles : {fill: '#ffffff'}},
    ]);

    remove_bimulti();
    d3.selectAll('#no-bimulti-data tspan').text("This chart is not relevant for this agency")
    d3.select('#total-commitments .c3-axis-y2').remove();
}

var adjust_gates_foundation = function() {
    d3.selectAll('#total-commitments .c3-texts-data2').remove();
    d3.selectAll('#total-commitments .c3-texts-data1 .c3-text-0').remove();
    d3.selectAll('#total-commitments .c3-texts-data1 .c3-text-1').remove();
    d3.selectAll('#total-commitments .c3-texts-data1 .c3-text-2').remove();

    remove_health_total();
    d3.selectAll('#rmnch .c3-texts-data1 .c3-text-0').remove();
    remove_bimulti();
    d3.select('#total-commitments .c3-axis-y .domain').attr('d', 'M0,1H0V76')
    d3.select('#total-commitments .c3-axis-y2').remove();
}

var adjust_france = function() {
    move_labels(d3.selectAll('#total-commitments .c3-texts-data1'), [
        null, null,
        {attrs: {dy : 13}, styles : {fill: '#ffffff'}},
        {attrs: {dy : 16}, styles : {fill: '#ffffff'}},
        {attrs: {dy : 20}, styles : {fill: '#ffffff'}}
    ]);

    move_labels(d3.selectAll('#total-commitments .c3-texts-data2'), [
        null, null, null, null,
        {attrs: {dy : -3}}
    ]);

    move_labels(d3.selectAll('#health-total .c3-texts-data1'), [
        null,
        null,
        {attrs: {dy : 10}, styles : {fill: '#ffffff'}},
        {attrs: {dy : 16}, styles : {fill: '#ffffff'}},
        {attrs: {dy : 18}, styles : {fill: '#ffffff'}}
    ]);

    move_labels(d3.selectAll('#health-total .c3-texts-data2'), [
        {attrs: {dy : -3}},
        null, null, null,
        {attrs: {dy : -1}}
    ]);
    d3.select('#total-commitments .c3-axis-y .domain').attr('d', 'M0,1H0V76')

    d3.select('#health-total .c3-axis-y .domain').attr('d', 'M0,8H0V76')
    d3.select('#rmnch .c3-axis-y .domain').attr('d', 'M0,1H0V76')
}

var adjust_germany = function() {
    move_labels(d3.selectAll('#total-commitments .c3-texts-data1'), [
        null,
        null,
        {attrs: {dy : 13}, styles : {fill: '#ffffff'}},
        {attrs: {dy : 13}, styles : {fill: '#ffffff'}},
        {attrs: {dy : 16}, styles : {fill: '#ffffff'}}
    ]);

    move_labels(d3.selectAll('#total-commitments .c3-texts-data2'), [
        {attrs: {dy : 3}}
    ]);

    move_labels(d3.selectAll('#health-total .c3-texts-data1'), [
        null,
        null,
        {attrs: {dy : 9}, styles : {fill: '#ffffff'}},
        {attrs: {dy : 13}, styles : {fill: '#ffffff'}},
        {attrs: {dy : 16}, styles : {fill: '#ffffff'}}
    ]);
    d3.select('#total-commitments .c3-axis-y .domain').attr('d', 'M0,1H0V76')
    d3.select('#health-total .c3-axis-y .domain').attr('d', 'M0,4H0V76')
    d3.select('#rmnch .c3-axis-y .domain').attr('d', 'M0,3H0V76')

    d3.select('#pledge4').remove();
}

var adjust_italy = function() {
    move_labels(d3.selectAll('#total-commitments .c3-texts-data1'), [
        null,
        {attrs: {dy : 2}},
        {attrs: {dy : 16}, styles : {fill: '#ffffff'}},
    ]);

    move_labels(d3.selectAll('#total-commitments .c3-texts-data2'), [
        {attrs: {dy : 3}},
        null,
        null,
        {attrs: {dy : 2}},
        {attrs: {dy : 3}},
    ]);


    move_labels(d3.selectAll('#health-total .c3-texts-data1'), [
        null,
        null,
        {attrs: {dy : 15}, styles : {fill: '#ffffff'}},
        {attrs: {dy : 13}, styles : {fill: '#ffffff'}},
        {attrs: {dy : 9}, styles : {fill: '#ffffff'}},
    ]);

    d3.select('#total-commitments .c3-axis-y .domain').attr('d', 'M0,1H0V76')
    d3.select('#health-total .c3-axis-y .domain').attr('d', 'M0,8H0V76')
    d3.select('#rmnch .c3-axis-y .domain').attr('d', 'M0,-2H0V76')
    d3.select('#pledge1 text').remove();
    d3.select('#pledge2').remove();
    d3.select('#pledge3').remove();
    d3.select('#pledge4').remove();
}

var adjust_norway = function() {
    move_labels(d3.selectAll('#total-commitments .c3-texts-data1'), [
        null,
        null,
        null,
        {attrs: {dy : 11}, styles : {fill: '#ffffff'}},
        {attrs: {dy : 17}, styles : {fill: '#ffffff'}},
    ]);

    move_labels(d3.selectAll('#health-total .c3-texts-data2'), [
        null,
        null,
        {attrs: {dy : 16}},
    ]);

    d3.select('#total-commitments .c3-axis-y .domain').attr('d', 'M0,1H0V76')
    d3.select('#health-total .c3-axis-y .domain').attr('d', 'M0,2H0V76')
    d3.select('#rmnch .c3-axis-y .domain').attr('d', 'M0,0H0V76')
}

var adjust_sweden = function() {
    move_labels(d3.selectAll('#total-commitments .c3-texts-data1'), [
        null,
        null,
        null,
        {attrs: {dy : 13}, styles : {fill: '#ffffff'}},
        {attrs: {dy : 17}, styles : {fill: '#ffffff'}},
    ]);

    move_labels(d3.selectAll('#health-total .c3-texts-data1'), [
        null,
        null,
        {attrs: {dy : 2}}
    ]);

    move_labels(d3.selectAll('#total-commitments .c3-texts-data2'), [
        null, null,
        {attrs: {dy : 2}},
        null,
        {attrs: {dy : -2}}
    ]);

    move_labels(d3.selectAll('#health-total .c3-texts-data2'), [
        null, null, null,
        {attrs: {dy : -5}}
        
    ]);

    d3.select('#total-commitments .c3-axis-y .domain').attr('d', 'M0,1H0V76')
    d3.select('#health-total .c3-axis-y .domain').attr('d', 'M0,2H0V76')
    d3.select('#rmnch .c3-axis-y .domain').attr('d', 'M0,0H0V76')

}

var adjust_united_kingdom = function() {
    move_labels(d3.selectAll('#total-commitments .c3-texts-data1'), [
        null,
        {attrs: {dy : 11}, styles : {fill: '#ffffff'}},
        null,
        null,
        {attrs: {dy : 15}, styles : {fill: '#ffffff'}},
    ]);

    move_labels(d3.selectAll('#total-commitments .c3-texts-data2'), [
        null,
        null,
        {attrs: {dy : 15}},
        {attrs: {dy : 15}},
    ]);

    move_labels(d3.selectAll('#health-total .c3-texts-data1'), [
        null,
        null,
        {attrs: {dy : 13}, styles : {fill: '#ffffff'}},
        {attrs: {dy : 11}, styles : {fill: '#ffffff'}},
    ]);

    move_labels(d3.selectAll('#health-total .c3-texts-data2'), [
        {attrs: {dy : -2}},
        null,
        null,
        null,
        {attrs: {dy : 15}},
    ]);
    d3.select('#total-commitments .c3-axis-y .domain').attr('d', 'M0,1H0V76')
    d3.select('#health-total .c3-axis-y .domain').attr('d', 'M0,2H0V76')
    d3.select('#rmnch .c3-axis-y .domain').attr('d', 'M0,0H0V76')
    d3.selectAll('.url tspan').style('font-size', '5px');
}

var adjust_united_states = function() {

    move_labels(d3.selectAll('#total-commitments .c3-texts-data1'), [
        null,
        null,
        {attrs: {dy : 13}, styles : {fill: '#ffffff'}},
        {attrs: {dy : 13}, styles : {fill: '#ffffff'}},
        {attrs: {dy : 17}, styles : {fill: '#ffffff'}},
    ]);


    move_labels(d3.selectAll('#health-total .c3-texts-data1'), [
        null,
        null,
        {attrs: {dy : 13}, styles : {fill: '#ffffff'}},
        {attrs: {dy : 15}, styles : {fill: '#ffffff'}},
    ]);

    move_labels(d3.selectAll('#health-total .c3-texts-data2'), [
        {attrs: {dy : -3}},
        null,
        null,
        null,
        {attrs: {dy : 15}},
    ]);

    d3.select('#total-commitments .c3-axis-y .domain').attr('d', 'M0,1H0V76')
    d3.select('#health-total .c3-axis-y .domain').attr('d', 'M0,2H0V76')
    d3.select('#rmnch .c3-axis-y .domain').attr('d', 'M0,5H0V76')
}

var post_process = function(donor) {
    d3.selectAll('#g902').remove();
    d3.selectAll('#g1102').remove();
    d3.selectAll('#g1106').remove();

    d3.selectAll('#health-total .c3-texts-data1 text').style('fill', '#224e61')
    d3.selectAll('.c3-texts-data1 text').style('fill', '#224e61')
    funcs = {
        'Russia' : adjust_russia,
        'Australia' : adjust_australia,
        'Canada' : adjust_canada,
        'GAVI Alliance' : adjust_gavi_alliance,
        'Global Fund' : adjust_global_fund,
        'Japan' : adjust_japan,
        'World Bank' : adjust_world_bank,
        'Bill & Melinda Gates Foundation' : adjust_gates_foundation,
        'France' : adjust_france,
        'Germany' : adjust_germany,
        'Italy' : adjust_italy,
        'Norway' : adjust_norway,
        'Sweden' : adjust_sweden,
        'United Kingdom' : adjust_united_kingdom,
        'United States' : adjust_united_states,
    }

    func = funcs[donor];
    if (donor != undefined) func();

}
