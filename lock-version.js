const fs = require('fs');

// 读取 package.json 文件
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

// 函数用于锁定版本
const lockVersions = (deps) => {
  for (const dep in deps) {
    if (deps[dep].startsWith('^')) {
      deps[dep] = deps[dep].replace('^', '');
    }
  }
};

// 锁定 dependencies 和 devDependencies
lockVersions(packageJson.dependencies);
lockVersions(packageJson.devDependencies);

// 将修改后的内容写回 package.json 文件
fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));

console.log('依赖版本已锁定');
