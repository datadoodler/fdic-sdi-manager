#fdic-sdi-manager

* This is an ecmascript 2015 (ES6) application that runs on node.js.
* Will *not* be using typescript since we will have the luxury of ES6 (even ES7 if we want) syntax already. And with ES6 deconstructions, specifying types as parameters is not as meaningful. All considered, I think typescript would get in the way more than it helps.
* No UI component in this project. It is intended to be imported to other projects that will provide UI.


##Initial steps

* Setup git repo on github/datadoodler/fdic-sdi-manager
* Create readme file to keep track of steps
* initialize npm
    * this should be an installable npm package
    * npm install fdic-sdi-manager
* Setup unit testing framework. We will be employing TDD and will need tests to guide our work. This will also asure that we don't get off-course too badly.
    * Jasmine
    * Karama
    * Wallaby
* Upate blog (http://datadoodler.github.io/blog/) with pointer to public repo.