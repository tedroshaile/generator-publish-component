'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');

var uCaseFirst = function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

var lCaseFirst = function(string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
}


var AngularComponentGenerator = yeoman.generators.Base.extend({
    initializing: function () {
        //this.pkg = require('../package.json');
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
            /*,
            {
                type: 'input',
                name: 'destinationDirectory',
                message: 'Where should the component be created?'
            }*/
        ];

        this.prompt(prompts, function (props) {
            this.angularModuleName = props.angularModuleName;
            this.angularComponentName = props.angularComponentName;

            var angularComponentNameParts = this.angularComponentName.split('-')
            for(var i = 0; i < angularComponentNameParts.length; i++){
                angularComponentNameParts[i] = (i == 0)  ?
                    lCaseFirst(angularComponentNameParts[i]) :
                    uCaseFirst(angularComponentNameParts[i]) ;
            }
            var angularComponentNameMixedCase = angularComponentNameParts.join('')

            this.controllerFileName = this.angularComponentName + '.ng.controller.js';


            this.controllerName = angularComponentNameMixedCase + 'Ctrl'


            done();
        }.bind(this));
    },

    writing: function () {

        this.dest.mkdir(this.angularComponentName)

        this.template('controller.js', this.angularComponentName + '/' + this.controllerFileName);


    },

    end: function () {
    }
});

module.exports = AngularComponentGenerator;
