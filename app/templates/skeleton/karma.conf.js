// Karma configuration
// Generated on Wed Dec 17 2014 09:23:46 GMT-0500 (Eastern Standard Time)

module.exports = function (config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],


        // list of files / patterns to load in the browser
        files: [
            'bower_components/lodash/lodash.js',
            'bower_components/moment/moment.js',
            'bower_components/angular/angular.js',
            'bower_components/angular-cookies/angular-cookies.js',
            'bower_components/angular-ui-router/release/angular-ui-router.js',
            'bower_components/angular-resource/angular-resource.js',
            'bower_components/angular-translate/angular-translate.js',
            'bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
            'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
            'bower_components/ng-file-upload/ng-file-upload-shim.js',
            'bower_components/ng-file-upload/ng-file-upload.js',
            'bower_components/angular-mocks/angular-mocks.js',

            'app/modules/**/*-config.js',
            'app/**/*.js'
        ],


        // list of files to exclude
        exclude: [],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            // source files, that you wanna generate coverage for
            // do not include tests or libraries
            'app/**/!(*.spec|*.e2e).js': ['coverage'],
            'app/**/*.html': ['ng-html2js']
        },


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['dots'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['PhantomJS'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true,

        plugins: [
            'karma-jasmine',
            'karma-chrome-launcher',
            'karma-phantomjs-launcher',
            'karma-firefox-launcher',
            'karma-coverage'
        ],

        coverageReporter: {
            type: 'lcov',
            dir: 'target/karma-reports/'
        }

    });
};
