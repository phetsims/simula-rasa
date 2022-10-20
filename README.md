simula-rasa
===========

PhET Simulation Template.  "Simula rasa" is Latin for "blank sim".

To create a sim based on this template, clone this and the other PhET libraries as described in the PhET Development Overview at https://github.com/phetsims/phet-info/blob/master/doc/phet-development-overview.md then run:
```
cd simula-rasa
npm update
cd ../perennial/
grunt create-sim --repo=project-name --author="Your Name (Your Affiliation)"
```

To transpile a new PhET sim to TypeScript, add the new sim to perennial-alias/data/active-repos. If this is not a
PhET simulation you can traspile the sim with the `repos` option of the transpiler. For example
```
cd chipper
node js/scripts/transpile.js --watch --repos=project-name
```
See https://github.com/phetsims/phet-info/blob/master/doc/phet-development-overview.md#transpile-typescript for more
information.