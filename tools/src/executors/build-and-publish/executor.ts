import { execSync } from 'child_process';
import { BuildAndPublishExecutorSchema } from './schema';

const getPackageVersion = (name: string) => {
  const packageWithVersion = execSync(`npm view @abcdpackage/${name}`)
    .toString('utf-8')
    .split('\n')[1]
    .split('|')[0]
    .trim();
  const version = packageWithVersion.slice(
    packageWithVersion.lastIndexOf('@') + 1
  );
  return version;
};

export default async function runExecutor(
  options: BuildAndPublishExecutorSchema
) {
  console.log('------');
  const { dependencies, name } = options;
  const cwd = `./dist/${name}`;

  execSync(`pnpm nx build ${name}`);

  await Promise.all(
    dependencies.map((dependency) =>
      execSync(
        `npm pkg set dependencies.@abcdpackage/${dependency}=^${getPackageVersion(
          dependency
        )}`,
        { cwd }
      )
    )
  );

  let version = getPackageVersion(name);
  version =
    version.slice(0, version.lastIndexOf('.') + 1) +
    (+version.slice(version.lastIndexOf('.') + 1) + 1).toString();
  execSync(`npm pkg set 'version'=${version}`, { cwd });

  //   execSync(`npm publish`, { cwd });

  return {
    success: true,
  };
}
