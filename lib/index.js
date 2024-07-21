#! /usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startExpress = void 0;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
var next_1 = __importDefault(require("next"));
var express_1 = __importDefault(require("express"));
var url_1 = require("url");
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var child_process_1 = require("child_process");
var body_parser_1 = __importDefault(require("body-parser"));
var express_fileupload_1 = __importDefault(require("express-fileupload"));
var args_1 = require("./args");
var graphql_1 = __importDefault(require("./server/graphql"));
var config_1 = __importDefault(require("next/config"));
var generate_1 = require("./generate");
var lodash_1 = __importDefault(require("lodash"));
var cors_1 = __importDefault(require("cors"));
var resolve = path_1.default.resolve;
var curFolder = process.cwd();
var processArgvs = (0, args_1.getProcessArgvs)(2);
// console.log('processArgvs', processArgvs)
var command = processArgvs.command, dictionary = processArgvs.dictionary, controller = processArgvs.controller, action = processArgvs.action;
// console.log('processArgvs', processArgvs)
var handleServer = function (server, prefix) {
    // 本项目路径是 NSGM-CLI/server 目录，生成项目路径是 generation/server 目录
    var serverPath = resolve(curFolder + '/server/');
    if (fs_1.default.existsSync(serverPath)) {
        var list = fs_1.default.readdirSync(serverPath);
        list.forEach(function (item) {
            var resolverPath = resolve(serverPath + '/' + item);
            var stat = fs_1.default.statSync(resolverPath);
            var isFile = stat.isFile();
            // 只看单个文件，不看目录
            if (isFile) {
                var filename = item;
                if (item.indexOf('.') !== -1) {
                    filename = item.split('.')[0];
                }
                // console.log('resolverPath', resolverPath, filename)
                if (server && filename !== undefined && filename !== '') {
                    server.use('/' + filename, require(resolverPath));
                    server.use(prefix + '/' + filename, require(resolverPath));
                }
            }
        });
    }
};
var handlePrefix = function (prefix, url) {
    var newUrl = '';
    if (prefix && url && url.indexOf(prefix) !== -1) {
        var urlArr = url.split(prefix);
        if (urlArr.length > 0) {
            newUrl += urlArr[0];
        }
        if (urlArr.length > 1) {
            newUrl += urlArr[1];
        }
        if (newUrl === '')
            newUrl = '/';
    }
    else {
        newUrl = url;
    }
    return newUrl;
};
var startExpress = function (options, callback) {
    // console.info('startExpress', curFolder)
    var app = (0, next_1.default)(options);
    var handle = app.getRequestHandler();
    app
        .prepare()
        .then(function () {
        if (callback) {
            callback();
            return;
        }
        var server = (0, express_1.default)();
        server.use(body_parser_1.default.urlencoded({
            extended: false
        }));
        // 支持跨域，nsgm export 之后前后分离
        server.use((0, cors_1.default)());
        server.use(body_parser_1.default.json());
        server.use((0, express_fileupload_1.default)());
        server.use('/static', express_1.default.static(path_1.default.join(__dirname, 'public')));
        server.use('/graphql', (0, graphql_1.default)(command));
        var nextConfig = (0, config_1.default)();
        var publicRuntimeConfig = nextConfig.publicRuntimeConfig;
        var host = publicRuntimeConfig.host, port = publicRuntimeConfig.port, prefix = publicRuntimeConfig.prefix;
        if (prefix !== '') {
            server.use(prefix + '/static', express_1.default.static(path_1.default.join(__dirname, 'public')));
            server.use(prefix + '/graphql', (0, graphql_1.default)(command));
        }
        handleServer(server, prefix);
        server.get('*', function (req, res) {
            var url = req.url;
            // console.log('url: ' + url)
            var parsedUrl = (0, url_1.parse)(url, true);
            return handle(req, res, parsedUrl);
        });
        server.listen(port, function () {
            console.log('> Ready on http://' + host + ':' + port);
        });
    })
        .catch(function (ex) {
        console.error(ex.stack);
        process.exit(1);
    });
};
exports.startExpress = startExpress;
console.log();
switch (command) {
    case 'dev':
        (0, exports.startExpress)({ dev: true }, null);
        break;
    case 'start':
        (0, exports.startExpress)({ dev: false }, null);
        break;
    case 'build':
        (0, child_process_1.exec)('next build', {}, function (err, stdout, stderr) {
            if (err) {
                console.log(err);
                return;
            }
            console.log("stdout: ".concat(stdout));
            process.exit(0);
        });
        break;
    case 'export':
        var shellCommand = 'next ' + command;
        // console.log('dictionary', dictionary)
        if (dictionary === '') {
            shellCommand += ' -o webapp';
        }
        else {
            shellCommand += ' -o ' + dictionary;
        }
        (0, child_process_1.exec)(shellCommand, {}, function (err, stdout, stderr) {
            if (err) {
                console.log(err);
                return;
            }
            console.log("stdout: ".concat(stdout));
            process.exit(0);
        });
        break;
    case '-i':
    case 'init':
    case '--init':
        var initFlag_1 = true;
        // console.log('process.argv', process.argv)
        var argvArr = process.argv;
        var argvArrLen = argvArr.length;
        var fileName = '';
        if (argvArrLen > 2) {
            fileName = argvArr[2];
        }
        else if (argvArrLen > 1) {
            fileName = argvArr[1];
        }
        // console.log('fileName', fileName)
        if (fileName !== '') {
            if (fileName.indexOf('\\') !== -1) {
                fileName = fileName.replace(/\\/g, '/');
                // console.log('fileName2', fileName)
            }
            var fileNameArr = fileName.split('/');
            var fileNameArrLen = fileNameArr.length;
            var fileNameStr = fileNameArr[fileNameArrLen - 1];
            // console.log('fileNameStr', fileNameStr)
            if (fileNameStr === 'app') {
                initFlag_1 = false;
            }
            lodash_1.default.each(fileNameArr, function (item, index) {
                if (item === 'pm2') {
                    initFlag_1 = false;
                    return false;
                }
            });
        }
        console.log('initFlag', initFlag_1);
        if (initFlag_1) {
            (0, generate_1.initFiles)(dictionary);
        }
        process.exit(0);
        break;
    case '-u':
    case 'upgrade':
    case '--upgrade':
        (0, generate_1.initFiles)(dictionary, true);
        process.exit(0);
        break;
    case '-c':
    case 'create':
    case '--create':
        console.log(command, controller, action);
        if (controller !== '') {
            if (action === '') {
                (0, generate_1.createFiles)(controller, 'manage');
            }
            else {
                (0, generate_1.createFiles)(controller, action);
            }
        }
        break;
    case '-d':
    case 'delete':
    case '--delete':
        console.log(command, controller, action);
        if (controller !== '') {
            if (action === '' || action === 'all') {
                (0, generate_1.deleteFiles)(controller, 'all');
            }
            else {
                (0, generate_1.deleteFiles)(controller, action);
            }
        }
        break;
    case '-db':
    case 'deletedb':
    case '--deletedb':
        console.log(command, controller, action);
        if (controller !== '') {
            if (action === '' || action === 'all') {
                (0, generate_1.deleteFiles)(controller, 'all', true);
            }
            else {
                (0, generate_1.deleteFiles)(controller, action);
            }
        }
        break;
    case '-v':
    case 'version':
    case '--version':
        var version = require('../package.json').version;
        console.log('version: ' + version);
        /*
        startExpress({ dev: true, quiet: true, dir: '.' }, () => {
          const nextConfig = getConfig()
          const { publicRuntimeConfig } = nextConfig
          const { version } = publicRuntimeConfig
          console.log('version: ' + version)
          process.exit(0)
        })
        */
        process.exit(0);
        break;
    case '-h':
    case 'help':
    case '--help':
    default:
        console.log('Welcome to use NSGM');
        console.log("   -h or help: get nsgm help infomation");
        console.log("   -v or version: get nsgm version");
        console.log("   -i or init: nsgm init dictionary (default dictionary is .)");
        console.log("   -u or upgrade: nsgm upgrade");
        console.log("   -c or create: nsgm create controller action (default action is manage)");
        console.log("   -d or delete: nsgm delete controller action (default action is manage)");
        console.log("   dev: nsgm dev (development mode)");
        console.log("   build: nsgm build (production mode)");
        console.log("   start: nsgm start (production mode)");
        console.log("   export: nsgm export dictionary (default dictionary is webapp)");
        console.log('Happy to use');
        console.log('If you have some question, please contact Erishen (787058731@qq.com). Thanks!');
        break;
}
console.log();
