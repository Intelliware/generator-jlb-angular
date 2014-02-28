'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');
var path = require('path');
var cgUtils = require('../utils.js');
var chalk = require('chalk');
var _ = require('underscore');
var fs = require('fs');

_.str = require('underscore.string');
_.mixin(_.str.exports());

var FilterGenerator = module.exports = function FilterGenerator(args, options, config) {

	yeoman.generators.NamedBase.apply(this, arguments);

	try {
		this.appname = require(path.join(process.cwd(), 'package.json')).name;
	} catch (e) {
		this.appname = 'Cant find name from package.json';
	}

};

util.inherits(FilterGenerator, yeoman.generators.NamedBase);

FilterGenerator.prototype.askFor = function askFor() {
    var cb = this.async();
    var name = this.name;
    var defaultDir = this.config.get('filterDirectory');
    if (!_(defaultDir).endsWith('/')) {
        defaultDir += '/';
    }

    var prompts = [
        {
            name:'dir',
            message:'Where would you like to create the filter files?',
            default: defaultDir
        }
    ];

    this.prompt(prompts, function (props) {
        this.dir = cgUtils.cleanDirectory(props.dir);

        cb();
    }.bind(this));
};

FilterGenerator.prototype.files = function files() {

    var templateDirectory = path.join(path.dirname(this.resolved),'templates');
    if(this.config.get('filterTemplates')){
        templateDirectory = path.join(process.cwd(),this.config.get('filterTemplates')); 
    }
    var that = this;
    _.chain(fs.readdirSync(templateDirectory))
        .filter(function(template){
            return template[0] !== '.';
        })
        .each(function(template){
            var customTemplateName = template.replace('filter',that.name);
            var templateFile = path.join(templateDirectory,template);
            that.template(templateFile,that.dir+ customTemplateName);
        });

	cgUtils.addToFile('index.html','<script src="'+this.dir+this.name+'.js"></script>',cgUtils.JS_MARKER,'  ');
	this.log.writeln(chalk.green(' updating') + ' %s','index.html');
};
