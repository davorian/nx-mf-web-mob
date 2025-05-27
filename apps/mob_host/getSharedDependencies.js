const EXCEPT = ['@module-federation/enhanced'];

const getSharedDependencies = ({eager = true}, pkg) => {
const shared = Object.entries(pkg.dependencies)
    .map(([dep, version]) => {
    return [dep, {singleton: true, eager, requiredVersion: version}];
    });
return Object.fromEntries(shared);
};
module.exports = {getSharedDependencies}
