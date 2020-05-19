import path from 'path';
import fs from 'fs';
export function validatePluginPath(pluginPath) {
    var structureExists = [
        'package.json',
        'src',
        'src/index.js'
    ];
    for (var _i = 0, structureExists_1 = structureExists; _i < structureExists_1.length; _i++) {
        var pathCheck = structureExists_1[_i];
        if (!fs.existsSync(path.resolve(pluginPath, pathCheck))) {
            throw new Error("'" + pathCheck + "' does not exist");
        }
    }
}
//# sourceMappingURL=validate-plugin-path.js.map