import { merge } from 'lodash';
var mixins = [
    require('./assets').default,
    require('./collections').default,
    require('./currency').default,
    require('./electron').default,
    require('./formatter').default,
    require('./network').default,
    require('./qr').default,
    require('./session').default,
    require('./strings').default,
    require('./wallet').default
];
export default merge.apply(void 0, mixins);
//# sourceMappingURL=index.js.map