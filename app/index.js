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


var PublishComponentGenerator = yeoman.generators.Base.extend({
    initializing: function () {
        //this.pkg = require('../package.json');
    },

    prompting: function () {
        var done = this.async();

        // Have Yeoman greet the user.
        this.log(yosay(
            'Welcome to the astonishing PublishComponentGenerator generator!'
        ));

        var prompts = [
            {
                type: 'input',
                name: 'publisherComponentNameSingular',
                message: 'What is the singular name of the component you want to publish?'
            },
            {
                type: 'input',
                name: 'publisherComponentNamePlural',
                message: 'What is the MongoDB collection name of the component you want to publish?'
            },
            {
                type: 'input',
                name: 'publisherComponentKey',
                message: 'What is the name of the components primary key?'
            }
            /*,
            {
                type: 'input',
                name: 'destinationDirectory',
                message: 'Where should the component be created?'
            }*/
        ];

        this.prompt(prompts, function (props) {
            this.publisherComponentNameSingular = props.publisherComponentNameSingular;
            this.publisherComponentNamePlural = props.publisherComponentNamePlural;
            this.publisherComponentKey = props.publisherComponentKey;

            var publisherNameParts = this.publisherComponentNamePlural.split('-')
            for(var i = 0; i < publisherNameParts.length; i++){
                publisherNameParts[i] = (i == 0)  ?
                    lCaseFirst(publisherNameParts[i]) :
                    uCaseFirst(publisherNameParts[i]) ;
            }
            var publisherNameMixedCase = publisherNameParts.join('')

            this.publisherFileName ='publish-' + this.publisherComponentNamePlural + '.js';
            this.publisherName = 'publish' + uCaseFirst(publisherNameMixedCase)

            done();
        }.bind(this));
    },

    writing: function () {

        //this.dest.mkdir(this.angularComponentName)

        this.template('publisher.js', this.publisherFileName);


    },

    end: function () {
    }
});

module.exports = PublishComponentGenerator;
