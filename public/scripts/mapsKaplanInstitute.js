function renderBeacon (x, y, beacon, beaconRssi) {

    var group = d3.select('svg').append('g').attr('class', 'beacons').attr('id', `${beacon.beacon_id}`).attr('beacon-data', JSON.stringify(beacon));

    group.append('circle')
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 4);

    group.append('circle')
        .attr('class', 'mainCircle')
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 0)
        .attr('data-toggle', 'popover')
        .attr('data-html', true)
        .attr('data-content', `<div class="row"><div class="col-md-12 text-center"><strong>MAC Address:</strong> ${beacon.beacon_id}</div></div>
            <div style="margin-top: 2px" class="row"><div class="col-md-6 text-center"><strong>x</strong>: ${Number((beacon.x).toFixed(2))}</div><div class="col-md-6 text-center"><strong>y:</strong> ${Number((beacon.y).toFixed(2))}</div></div>
            <div class="row"><div class="col-md-12 text-center"><strong>Last recorded RSSI:</strong> ${beaconRssi === {} ? 'No information recieved from gateway' : beaconRssi.rssi}</div></div>
            <div class="row"><div class="col-md-12 text-center"><strong>RSSI recieved at:</strong> ${beaconRssi === {} ? 'No information recieved from gateway' : moment(beaconRssi.timestamp).format('MMMM Do YYYY, h:mm:ss a')}</div></div>
            <div class="row"><div class="col-md-12 text-center"><strong>Gateway associated with:</strong> ${beaconRssi === {} ? 'No information recieved from gateway' : beaconRssi.gateway_id}</div></div>
            <div style="margin-top: 4px" class="row"><div class="col-md-6 text-center"><button style="width:100%" type="button" class="btn btn-warning btn-sm">Edit</button></div><div class="col-md-6 text-center"><button style="width:100%" type="button" class="btn btn-danger btn-sm" onclick="deleteBeacon('${beacon.beacon_id}')">Delete</button></div></div>
            <div style="margin-top: 4px" class="row"><div class="col-md-12 text-center"><button style="width:70%" type="button" id="closePopover" class="btn btn-secondary btn-sm">Close</button></div></div>`)
        .attr('data-trigger', 'manual')
        .attr('data-placement', 'top')
        .attr('title', `Major: ${beacon.major} Minor: ${beacon.minor}`)
        .on('mouseover', function() {
            d3.select(this).transition()
                .duration(300)
                .attr("r", "40");

        })
        .on('mouseout', function () {
            d3.select(this).transition()
                .duration(300)
                .attr("r", "20");
        })
        .on('click', function() {
            $(this).popover('show');
            $('#closePopover').click(() => {
                $('[data-toggle="popover"]').popover('hide');
            });
        })
        .style("fill", 'rgb(13, 138, 221)')
        .style("fill-opacity", "0.6")
        .style("stroke", "black")
        .style("stroke-dasharray", "33, 8")
        .style("stroke-width", "3")
        .transition()
        .duration(300)
        .attr("r", 20)
        .attr("transform", "rotate(180deg)")
}

function renderTemporaryBeacon (x, y) {

    var group = d3.select('svg').append('g').attr('class', 'beacons').attr('id', 'temporaryBeacon');

    group.append('circle')
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 4);

    group.append('circle')
        .attr('class', 'mainCircle')
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 0)
        .on('mouseover', function () {
            d3.select(this).transition()
                .duration(300)
                .attr("r", "40");
        })
        .on('mouseout', function () {
            d3.select(this).transition()
                .duration(300)
                .attr("r", "20");
        })
        .style("fill", 'rgb(88, 91, 96)')
        .style("fill-opacity", "0.6")
        .style("stroke", "black")
        .style("stroke-dasharray", "33, 8")
        .style("stroke-width", "3")
        .transition()
        .duration(300)
        .attr("r", 20)
        .attr("transform", "rotate(180deg)")
}

function renderGateway (x, y, gateway, gatewayBeacons) {
    let self;
    var group = d3.select('svg').append('g').attr('class', 'gateways').attr('gateway-data', JSON.stringify(gateway)).attr('gateway-beacons', JSON.stringify(gatewayBeacons));

    group.append('circle')
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 4);

    group.append('circle')
        .attr('class', 'mainCircle')
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 0)
        .attr('data-toggle', 'popover')
        .attr('data-html', true)
        .attr('data-content', `<div class="row"><div class="col-md-12 text-center"><strong>MAC Address:</strong> ${gateway.gateway_id}</div></div>
        <div style="margin-top: 2px" class="row"><div class="col-md-6 text-center"><strong>x</strong>: ${Number((gateway.x).toFixed(2))}</div><div class="col-md-6 text-center"><strong>y:</strong> ${Number((gateway.y).toFixed(2))}</div></div>
        <div class="row"><div class="col-md-12 text-center"><strong>Battery Level:</strong> ${Number(((gateway.charged/7)*100).toFixed(2))}%</div></div>
        <div class="row"><div class="col-md-12 text-center"><strong>Last seen:</strong> ${moment(gateway.lastseen).format('MMMM Do YYYY, h:mm:ss a')}</div></div>
        <div class="col-md-12 text-center"><strong>Associated Beacons:</strong></div>
        <div>
          ${gatewayBeacons.map(gatewayBeacon => `<div class="card text-white bg-info" style="margin-top: 7px;">
              <div class="card-body" style="display: flex; justify-content: center; align-items: center; padding: 7px;">
                <div><h5 style="margin-right: 16px;">${gatewayBeacon.beacon_id}</h5></div>
                <button data-beacon-id="${gatewayBeacon.beacon_id}" type="button" class="btn btn-danger btn-sm deleteGatewayBeacon">Delete</button>
              </div>
            </div>`).join('')}
        </div>
        <div style="margin-top: 4px" class="row"><div class="col-md-6 text-center"><button style="width:100%" type="button" class="btn btn-warning btn-sm">Edit</button></div><div class="col-md-6 text-center"><button style="width:100%" type="button" id="deleteGateway" class="btn btn-danger btn-sm">Delete</button></div></div>
        <div style="margin-top: 4px" class="row"><div class="col-md-12 text-center"><button style="width:70%" type="button" id="addBeaconsToGateways" class="btn btn-primary btn-sm">Add Beacons</button></div></div>
        <div style="margin-top: 4px" class="row"><div class="col-md-12 text-center"><button style="width:70%" type="button" id="closePopover" class="btn btn-secondary btn-sm">Close</button></div></div>`)
        .attr('data-trigger', 'manual')
        .attr('data-placement', 'top')
        .attr('title', `Major: ${gateway.major} Minor: ${gateway.minor} <div id="battery${gateway.gateway_id}" class='battery'></div>`)
        .on('mouseover', function() {
            d3.select(this).transition()
                .duration(300)
                .attr("r", "40");
        })
        .on('mouseout', function () {
            d3.select(this).transition()
                .duration(300)
                .attr("r", "20");
        })
        .on('click', function() {
            self = this;
            $(this).popover('show');
            const gatewayInfo = JSON.parse(d3.select(self.parentNode).attr('gateway-data'));
            setGatewayBatteryLevel(gatewayInfo.gateway_id, gatewayInfo.charged);
            const gatewayBeacons = JSON.parse(d3.select(self.parentNode).attr('gateway-beacons')).map(gatewayBeacon => gatewayBeacon.beacon_id);
            $('#deleteGateway').click(() => {
                deleteGateway(JSON.parse(d3.select(self.parentNode).attr('gateway-data')).gateway_id);
            });
            $('.deleteGatewayBeacon').click(function() {
                deleteGatewayBeacon($(this).attr('data-beacon-id'), this);
            });
            $('#addBeaconsToGateways').click(function() {
                //Store gateway info
                $(this).after('<div style="margin-top: 4px" class="row"><div class="col-md-12 text-center"><button style="width:70%" type="button" id="stopAddingBeacons" class="btn btn-danger btn-sm">Stop Adding Beacons</button></div></div>');
                $('#stopAddingBeacons').click(function() {
                    //restore state of beacons and gateways
                    $(this).after('<div style="margin-top: 4px" class="row"><div class="col-md-12 text-center"><button style="width:70%" type="button" id="addBeaconsToGateways" class="btn btn-primary btn-sm">Add Beacons</button></div></div>');
                    $(this).remove();
                    d3.select(self).transition()
                        .duration(300)
                        .attr("r", "20");

                    d3.selectAll('.beacons').select('.mainCircle')
                        .on('click', function () {
                            $(this).popover('show');
                            $('#closePopover').click(() => {
                                $('[data-toggle="popover"]').popover('hide');
                            });
                        })
                        .transition()
                        .duration(300)
                        .attr("r", "20")
                        .style('fill', 'rgb(13, 138, 221)');
                });
                $(this).remove();

                // logic for adding beacons to gateways
                d3.select(self).transition()
                    .duration(300)
                    .attr("r", "40");

                d3.selectAll('.beacons').each(function(d,i) {
                    if($.inArray(d3.select(this).attr('id'), gatewayBeacons) === -1) {
                        d3.select(this).select('.mainCircle').style('fill', 'rgb(149, 237, 61)')
                            .on('click', function () {
                                // generate beacon and gateway object
                                const beaconInfo = JSON.parse(d3.select(this.parentNode).attr('beacon-data'));
                                $.post('https://api.iitrtclab.com/gatewaybeacon', {
                                    gateway_id: gatewayInfo.gateway_id,
                                    beacon_id: beaconInfo.beacon_id,
                                })
                                    .done(function(beacon){
                                        displaySuccess('Beacon added to gateway')
                                    })
                                    .fail(function(xhr, status, error) {
                                        displayError(error);
                                    });
                                d3.select(this).style('fill', 'rgb(98, 3, 198)');
                            })
                            .transition()
                            .duration(300)
                            .attr("r", "40");
                    }
                });
            });
            $('#closePopover').click(() => {
                $('[data-toggle="popover"]').popover('hide');
                d3.select(self).transition()
                    .duration(300)
                    .attr("r", "20");

                d3.selectAll('.beacons').select('.mainCircle')
                    .on('click', function () {
                        $(this).popover('show');
                        $('#closePopover').click(() => {
                            $('[data-toggle="popover"]').popover('hide');
                        });
                    })
                    .transition()
                    .duration(300)
                    .attr("r", "20")
                    .style('fill', 'rgb(13, 138, 221)');
            });
        })
        .style("fill", 'rgb(255, 0, 0)')
        .style("fill-opacity", "0.6")
        .style("stroke", "black")
        .style("stroke-dasharray", "33, 8")
        .style("stroke-width", "3")
        .transition()
        .duration(300)
        .attr("r", 20)
        .attr("transform", "rotate(180deg)");
}

function renderTemporaryGateway (x, y) {

    var group = d3.select('svg').append('g').attr('class', 'beacons').attr('id', 'temporaryBeacon');

    group.append('circle')
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 4);

    group.append('circle')
        .attr('class', 'mainCircle')
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 0)
        .on('mouseover', function () {
            d3.select(this).transition()
                .duration(300)
                .attr("r", "40");
        })
        .on('mouseout', function () {
            d3.select(this).transition()
                .duration(300)
                .attr("r", "20");
        })
        .style("fill", 'rgb(255, 0, 0)')
        .style("fill-opacity", "0.6")
        .style("stroke", "black")
        .style("stroke-dasharray", "33, 8")
        .style("stroke-width", "3")
        .transition()
        .duration(300)
        .attr("r", 20)
        .attr("transform", "rotate(180deg)")
}