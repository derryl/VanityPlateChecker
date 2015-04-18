var startingPage = 'http://www.dmv.ca.gov/portal/dmv/detail/portal/ipp2/welcome',
    plate, response;

var c = require('colorizer').create('Colorizer');
var casper = require('casper').create();

function getResponse() {
    var p  = document.querySelector('p.alert'), // present when your plate doesn't exist
        h3 = document.querySelector('h3');      // present when your plate is available
    
    if (p) {
        return 'NOT_AVAILABLE';
    } else if ( h3 && /Step 3/i.test(h3.innerText)) {
        return 'SUCCESS';
    }
}

if (casper.cli.has("plate")) {
    
    plate = casper.cli.get("plate");
    
    if (plate.length === 0) {
        casper.die('You must supply a plate to search for (--plate=VALUE)');
    }
    
    if (plate.length > 7) {
        casper.echo("(removed "+(plate.length-7)+" trailing chars -- license plates have a maximum of 7)");
        plate = plate.substr(0,7);
    }
    
    plate = plate.toUpperCase();
    
    casper.echo("Seeing if plate is available: "+plate);
    
} else {
    casper.die('You must supply a plate to search for (--plate=VALUE)');
};

casper.start( startingPage );

casper.then( function() { 
    this.echo("-- Entering the website --");
})

// Start Page
casper.thenEvaluate( function() {
    document.querySelector('form[name="PersonalizeFormBean"]').submit();
});

// Select type of plate (Step 1)
casper.then( function() {
    this.fill( 'form#PersonalizeFormBean', {
        'vehicleType': 'AUTO',
        'isVehLeased': 'no',
        'plateType':   'R'
    }, true );
});

// Submit your plate (Step 2)
casper.then( function() {    
    this.echo("-- Submitting your plate --");
    
    var arr = plate.substr(0,7).replace(' ','/').split(''),
        plateParams = {};
    
    for (var i = 0; i < arr.length; i++) {
        plateParams['plateChar'+i] = arr[i];
    }
    
    this.fill( 'form#PersonalizeFormBean', plateParams, true );
});

// See if we made it to Step 3 (success)
casper.then( function() {
    response = this.evaluate( getResponse )
});

casper.then( function() {
    if (response === 'SUCCESS') {
        casper.echo(c.colorize("Hooray! This plate is available.", "INFO"));
    } else {
        casper.echo(c.colorize("Damn. This plate is taken.", "ERROR"));
    }
});

casper.run();