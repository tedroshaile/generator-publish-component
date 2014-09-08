'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');

var AngularComponentGenerator = yeoman.generators.Base.extend({
    initializing: function () {
        this.pkg = require('../package.json');
    },

    prompting: function () {
        var done = this.async();

        // Have Yeoman greet the user.
        this.log(yosay(
            'Welcome to the astonishing AngularComponentGenerator generator!'
        ));

        var prompts = [
            {
                type: 'input',
                name: 'angularModuleName',
                message: 'What is the name of your angular module?'
            },
            {
                type: 'input',
                name: 'angularComponentName',
                message: 'What is the name of the angular component you want to create?'
            }
        ];

        this.prompt(prompts, function (props) {
            this.angularModuleName = props.angularModuleName;
            this.angularComponentName = props.angularComponentName;
            done();
        }.bind(this));
    },

    writing: {
        app: function () {
            this.dest.mkdir('app');
            this.dest.mkdir('app/templates');

            this.src.copy('_package.json', 'package.json');
            this.src.copy('_bower.json', 'bower.json');
        },

        projectfiles: function () {
            this.src.copy('editorconfig', '.editorconfig');
            this.src.copy('jshintrc', '.jshintrc');
        }
    },

    end: function () {
        this.installDependencies();
    }
});

module.exports = AngularComponentGenerator;
