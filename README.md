#VanityPlateChecker
Headless script to check availability of personalized (vanity) plates on the CA DMV website.

![FUUGIIT](fuugiit.jpg)

###Usage

    >> cd VanityPlateChecker
    >> casperjs find_plate.js --plate=LUVMAN
      Seeing if plate is available: LUVMAN
      -- Entering the website --
      -- Submitting your plate --
      Damn. This plate is taken.

###Requirements

- CasperJS: `brew update && brew install casperjs`


###Why?
The DMV website lets you search for personalized plates, but it's rather cumbersome and difficult to use. Especially if you're looking for more than one.

So... I wrote this small CLI script to automate that process. Enjoy!

###Troubleshooting

I had an issue with Casper, wherein it didn't play nicely with the version of PhantomJS I had installed (2.0.0). To fix that, I had to go into Casper's `bootstrap.js` file, and comment out the lines that specified a 1.8.x version of Phantom. This file is located at: `/usr/local/Cellar/casperjs/1.1-beta3/libexec/bin/bootstrap.js` (your version may be different)