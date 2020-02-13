var Logger = require('../index');

var log = new Logger('hamp:testing');
var o = {
    id: 'clonina'
}

console.log('DEBUG',process.env.DEBUG)
console.log('DEBUG_LEVEL',process.env.DEBUG_LEVEL)

log.silly('one','two',o,`id: ${o.id}`);
log.debug('one','two',o,`id: ${o.id}`);
log.info('one','two',o,`id: ${o.id}`);
log.warn('one','two',o,`id: ${o.id}`);
log.error('one','two',o,`id: ${o.id}`);
log.fatal('one','two',o,`id: ${o.id}`);

