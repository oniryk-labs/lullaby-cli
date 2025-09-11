let ctx = null;

export function argv() {
  if (ctx) return ctx;

  const [, , ...args] = process.argv;
  const flags = new Set(args.filter((arg) => arg.startsWith("--")));
  const params = args.filter((arg) => !arg.startsWith("--"));

  ctx = {
    task: params[0],
    flags,
    params: params.slice(1),
  };

  return ctx;
}
