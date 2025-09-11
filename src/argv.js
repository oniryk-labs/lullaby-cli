export function argv() {
  const [, , ...args] = process.argv;
  const flags = new Set(args.filter((arg) => arg.startsWith("--")));
  const params = args.filter((arg) => !arg.startsWith("--"));

  return {
    task: params[0],
    flags,
    params: params.slice(1),
  };
}
