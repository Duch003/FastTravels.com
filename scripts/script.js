class AirportConnectionSearcher {
    _currentPath = [];
    _visitedPaths = [];
    _validPaths = [];

    search(from, to) {
        this._currentPath = [];
        this._visitedPaths = [];
        this._validPaths = [];

        this.findConnection(from, to);

        return this._validPaths;
    }

    sequenceEqual(first, second) {
        if(first === null || second === null)
        {
            return false;
        }

        if(first.length!= second.length)
        {
            return false;
        }

        for(var i = 0; i < first.length; i++)
        {
            if(first[i].Name != second[i].Name)
            {
                return false;
            }
        }
    }

    isLoop(from) {
        return this._currentPath.some(x => x.name === from.name);
    }

    printPath() {
        console.log(this._currentPath.map((item, index) => item.name).join(' -> '));
    }

    findConnection(from, to) {

        if(this.isLoop(from)) {
            return;
        }

        if(this._visitedPaths.some(x => this.sequenceEqual(x, this._currentPath))) {
            return;
        }

        this._currentPath.push(from);

        for(let sibling of from.siblings) {

            if(sibling === to) {
                this._currentPath.push(to);
                this._visitedPaths.push([...this._currentPath]);
                this._validPaths.push([...this._currentPath]);
                this._currentPath.pop();
                continue;
            }

            if (sibling.siblings.length == 1)
            {
                var singleSibling = sibling.siblings[0];
                this._currentPath.push(singleSibling);
                this._visitedPaths.push([...this._currentPath]);
                this._currentPath.pop();
                continue;
            }

            this.findConnection(sibling, to);
        }

        this._visitedPaths.push([...this._currentPath]);
        this._currentPath.pop();
    }
}

class Airport {
    name = '';
    siblings = [];
    constructor(airportName) {
        this.name = airportName;
    }
}

function findAirport(airportName, array) {
    return array.find(airport => {
        return airport.name === airportName;
    });
}

var airportsNodes = [];
var airportsConnections = [
    ['ATH','EDI'],
    ['ATH','GLA'],
    ['ATH','CTA'],
    ['BFS','CGN'],
    ['BFS','LTN'],
    ['BFS','CTA'],
    ['BTS','STN'],
    ['BTS','BLQ'],
    ['CRL','BLQ'],
    ['CRL','BSL'],
    ['CRL','LTN'],
    ['DUB','LCA'],
    ['LTN','DUB'],
    ['LTN','MAD'],
    ['LCA','HAM'],
    ['EIN','BUD'],
    ['EIN','MAD'],
    ['HAM','BRS'],
    ['KEF','LPL'],
    ['KEF','CGN'],
    ['SUF','LIS'],
    ['SUF','BUD'],
    ['SUF','STN'],
    ['STN','EIN'],
    ['STN','HAM'],
    ['STN','DUB'],
    ['STN','KEF']
];

var airportsNames = [
    'ATH', 'BSL', 'BFS', 'BLQ', 'BTS', 
    'BRS', 'CRL', 'BUD', 'DUB', 'EDI', 
    'EIN', 'GLA', 'HAM', 'CTA', 'KEF', 
    'CGN', 'SUF', 'LCA', 'LPL', 'LIS', 
    'LTN', 'STN', 'MAD' ];

function loadAirports() {

    $(airportsNames).each((index, name) => {
        airportsNodes.push(new Airport(name));
    });

    $(airportsConnections).each((index, connection) => {
        var from = findAirport(connection[0], airportsNodes);
        var to = findAirport(connection[1], airportsNodes);

        from.siblings.push(to);
    });

    $(airportsConnections).each((index, connection) => {
        var from = findAirport(connection[1], airportsNodes);
        var to = findAirport(connection[0], airportsNodes);

        from.siblings.push(to);
    });

}


var errorToast = $(`>`)

$(document).ready(() => {
    loadAirports();

    for(let i = 0; i < airportsNames.length; i++) {
        $('#toDropdown').append($('<option/>', {
            value: airportsNames[i],
            html: airportsNames[i]
        }));
        $('#fromDropdown').append($('<option/>', {
            value: airportsNames[i],
            html: airportsNames[i]
        }));
    }

    $('#searchButton').click(() => {
        const fromValue = $('#fromDropdown').val();
        const toValue = $('#toDropdown').val();

        if(fromValue === 'From' || toValue ==='To') {
            $('#error').modal('show');
            return;
        }

        if(fromValue === toValue) {
            $('#samePlace').modal('show');
            return;
        }

        $('#printedPath').empty();
        $('.loader').show();

        const searcher = new AirportConnectionSearcher();
        const from = findAirport(fromValue, airportsNodes);
        const to = findAirport(toValue, airportsNodes);
        const validPaths = searcher.search(from, to).sort();
        const shortestPath = validPaths[0];

        let printedPath = [];

        for(let i = 0; i < shortestPath.length; i++) {
            if(i === 0) {
                printedPath.push($(`
                    <div class="col-1">
                        <div class="btn bg-success text-light font-weight-bold">${shortestPath[i].name}</div>
                    </div>
                    <div class="col-2">
                        <img class="rounded mx-auto d-block" src="./images/arrow.png"/>
                    </div>`));
            }
            else if(i === shortestPath.length - 1) {
                printedPath.push($(`
                    <div class="col-1">
                        <div class="btn bg-success text-light font-weight-bold">${shortestPath[i].name}</div>
                    </div>`));
            }
            else {
                printedPath.push($(`
                    <div class="col-1">
                        <div class="btn bg-secondary text-light font-weight-bold">${shortestPath[i].name}</div>
                    </div>
                    <div class="col-2">
                        <img  class="rounded mx-auto d-block"src="./images/arrow.png"/>
                    </div>`));
            }
        }
        $('#printedPath').append(printedPath);
        $('.loader').hide();
    });
});