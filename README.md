#fdic-sdi-manager

* This is an ecmascript 2015 (ES6) application that runs on node.js.
* Will *not* be using typescript since we will have the luxury of ES6 (even ES7 if we want) syntax already. And with ES6 deconstructions, specifying types as parameters is not as meaningful. All considered, I think typescript would get in the way more than it helps.
* No UI component in this project. It is intended to be imported to other projects that will provide UI.

### Testing
Mocha doesn't do well with ES6 arrow functions. It relies on binding the execution context of parent test blocks to child test blocks.

### Babel
Even though we are not planning on running this code on any non-ES6 platforms, node support for all ES6 specifications is *behind* the Babel support. (see https://kangax.github.io/compat-table/es6/ for details).  This may be a moot point for this project. I was simply surprised to see the 'Reflect' functionality not work in node, when it *did* work in some example code I was looking at. I doubt that any of the ES6 missing functionality will be missed in this project.  If something crucial comes up I'll remember to look into a babel.

### Generators

Simplify asynchronous control flow with generators. For example the process of expanding a quarterly zip file and returning an array of all the csv files it contains involves a sequence of asynchronous tasks. I've chosen to embrace ecmascript 6 generators accompanied with the co librarary to approach this task.


### Project Setup Checklist

* Setup git repo on github/datadoodler/fdic-sdi-manager. Include .gitignore and the README file.
* Create readme file to keep track of steps
* Setup npm
    * create package.json by running <code>npm init</code>
    * publish to npm repository (login to npmjs .com to insure credentials are present) run <code>npm publish</code>
    * insure publish was successful. The readme should show up at https://www.npmjs.com/package/fdic-sdi-manager
    * this should be an installable package available via <code> npm install fdic-sdi-manager</code>
* Setup unit testing framework. We will be employing BDD and will need tests to guide our work. This will also asure that we don't get off-course too badly or code for edge cases that aren't worth the time spent.
    * Mocha
    * Chai
    * Wallaby
* Upate blog (http://datadoodler.github.io/blog/) with pointer to public repo.