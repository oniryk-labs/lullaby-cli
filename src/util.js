export const safe = async (fn) => {
  try {
    return { ok: true, result: await fn() };
  } catch (err) {
    return { ok: false, error: err };
  }
};
