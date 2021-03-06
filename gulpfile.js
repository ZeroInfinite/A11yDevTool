var gulp = require('gulp');
var fs = require('fs');
var builder = require('xmlbuilder');

var outputFileName = 'accessibilityTool.strings'; 
var outputF12JsonFileName = 'accessbilityPropertyFilters.json';
var startingIdNumber = 8169;  

gulp.task('buildStrings', function(){
    /*
    Example xml string
        
    <string id="202" name="BreakpointsWindowTitle">
        <value>Breakpoints</value>
        <comment></comment>
    </string>  
    */
    fs.readFile('PropertyMapping.json', 'utf8', function (err, data) {
        var jsonA11yProps = JSON.parse(data);
        var jsonA11yPropsKeys = Object.keys(jsonA11yProps);
        
        var id = startingIdNumber;
        
        var rootEl  = builder.create('resources');
        jsonA11yPropsKeys.forEach(function(key){
            var item = jsonA11yProps[key];
            var name = 'a11y_' + key + '_tooltip';
            var comment = 'String shown in the accessbility panel as the tooltip for the property name ' + key + '.';
            var value = item.description;
            if(!value || value === ""){
                console.log(key);
                value = " ";
            }
            
            var stringObject = {
                'string': {
                    '@id': id,
                    '@name': name,
                    'value': value,
                    'comment': comment
                }
            };
            
            rootEl.ele(stringObject);
            
            id++;
        });
        rootEl.end({ pretty: true});
        
        fs.writeFile(outputFileName, rootEl, function(err){
            if(err) {
                return console.log(err);
            }
            
            console.log("Saved resource strings to file.");
        }); 
    });
});

gulp.task('buildF12Json', function(){
    /*
    Example output json
        
    "<itemId>": {
        "DisplayName": "",
        "DefaultDisplay": true,
        "Description": "",
        "AriaEquivalent": ""
    }
    */
    fs.readFile('PropertyMapping.json', 'utf8', function (err, data) {
        var jsonA11yProps = JSON.parse(data);
        var jsonA11yPropsKeys = Object.keys(jsonA11yProps);
        
        var outputObject = {};
        jsonA11yPropsKeys.forEach(function(key){
            var item = jsonA11yProps[key];           
            
            outputObject[key] = {
                    'DisplayName': item.displayName,
                    'DefaultDisplay': item.defaultDisplay,
                    'Description': '',
                    'AriaEquivalent': item.ariaEquivalent
            };
        });
        
        var outputString = JSON.stringify(outputObject, null, 4);
        fs.writeFile(outputF12JsonFileName, outputString, function(err){
            if(err) {
                return console.log(err);
            }
            
            console.log("Saved resource strings to file.");
        }); 
    });
});