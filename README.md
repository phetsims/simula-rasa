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
For the simulation to run it will need TypeScript transpilation. If this is a PhET brand sim, continue to https://github.com/phetsims/phet-info/blob/master/checklists/new-repo-checklist.md.
If this is not a PhET brand simulation see https://github.com/phetsims/phet-info/blob/master/doc/phet-development-overview.md#transpile-typescript for
next steps.