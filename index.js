// dependencies
const moment = require('moment');
const chalk = require('chalk');

// this is the output function, will ALWAYS output
function output(lvl,mask,cargs){
    var lvl = Logger.getNameForLevel(arguments[0]);
    var mask = arguments[1];
    var args = [];
    args.push(moment().format(Logger.tsFormat))
    args.push(Logger.levelTheme[lvl](lvl));
    args.push(mask)
    for (var i=0; i<cargs.length; i++){
        args.push(cargs[i])
    }
    console.log.apply(null,args)
}

function Logger(maskName,level){
    if (!maskName || maskName == '') throw new Error('maskName is required');
    this.maskName = maskName;
    this.level = Logger.defaultLevel;
}

// statics
Logger.Levels = {
    SILLY: 10,
    DEBUG: 20,
    INFO: 30,
    WARN: 40,
    ERROR: 50,
    FATAL: 60
}
Logger.tsFormat = 'YYYY-MM-DD HH:mm:ss.SSS';

Logger.getNameForLevel = function(lvl){
    return Object.keys(Logger.Levels).find(key => {
        return Logger.Levels[key] == lvl
    })
}
Logger.defaultLevel = Logger.Levels.DEBUG;
Object.defineProperty(Logger,'defaultLevelName',{
    get: function(){
        return Logger.getNameForLevel(Logger.defaultLevel);
    }
})
Logger.mask = null;

Logger.levelTheme = {
    SILLY: chalk.keyword('purple'),
    DEBUG: chalk.greenBright,
    INFO: chalk.whiteBright,
    WARN: chalk.yellowBright,
    ERROR: chalk.keyword('orange'),
    FATAL: chalk.redBright
}
Logger.showThisMask = function(currMask){
    var ret = false;
    if (Logger.mask){
        ret = (Logger.mask == currMask);
        if (!ret){
            var idx = Logger.mask.indexOf('*');
            if (idx != -1){
                const mustLeft = Logger.mask.substr(0,idx);
                const left = currMask.substr(0,mustLeft.length);
                //console.log('comparing',left,'to',mustLeft);
                ret = (left == mustLeft);
            }
        }
    }
    return ret;
}

// instance methods
Logger.prototype.debug = function(){
    this.outputIf(Logger.Levels.DEBUG,arguments)
}
Logger.prototype.error = function(){
    this.outputIf(Logger.Levels.ERROR,arguments)
}
Logger.prototype.fatal = function(){
    this.outputIf(Logger.Levels.FATAL,arguments)
}
Logger.prototype.info = function(){
    this.outputIf(Logger.Levels.INFO,arguments)
}
Logger.prototype.silly = function(){
    this.outputIf(Logger.Levels.SILLY,arguments)
}
Logger.prototype.warn = function(){
    this.outputIf(Logger.Levels.WARN,arguments)
}
Logger.prototype.outputIf = function(msgLevel,args){
    //console.log(`msglevel ${msgLevel} logLevel ${this.level}`)
    if (msgLevel >= this.level){
        //console.log('lvl ok, test mask')
        if (Logger.showThisMask(this.maskName)){
            //console.log('now do the output!!!')
            output(msgLevel,this.maskName,args);
        }
    }
}

// startup code
if (process.env.DEBUG_LEVEL){
    var newval = Logger.Levels[process.env.DEBUG_LEVEL];
    if (newval) Logger.defaultLevel = newval
}
Logger.mask = process.env.DEBUG || ''

module.exports = Logger;