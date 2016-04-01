#fdic-sdi-manager

* This is an ecmascript 2015 (ES6) application that runs on node.js.
* Will *not* be using typescript since we will have the luxury of ES6 (even ES7 if we want) syntax already. And with ES6 deconstructions, specifying types as parameters is not as meaningful. All considered, I think typescript would get in the way more than it helps.
* No UI component in this project. It is intended to be imported to other projects that will provide UI.


## Project Setup Checklist

* Setup git repo on github/datadoodler/fdic-sdi-manager. Include .gitignore and README.md.
* Create readme file to keep track of steps
* Setup npm
    * create package.json by running <code>npm init</code>
    * publish to npm repository (login to npmjs.com to insure credentials are present) run <code>npm publish</code>
    * insure publish was successful. The readme should show up at https://www.npmjs.com/package/fdic-sdi-manager
    * this should be an installable package available via <code> npm install fdic-sdi-manager</code>
* Setup unit testing framework. We will be employing TDD and will need tests to guide our work. This will also asure that we don't get off-course too badly or code for edge cases that aren't worth the time spent.
    * Jasmine
    * Karama
    * Wallaby
* Upate blog (http://datadoodler.github.io/blog/) with pointer to public repo.