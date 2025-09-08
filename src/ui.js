import boxen from "boxen";
import colors from "colors";

const types = new Set(["info", "success", "error", "warn"]);

const colorMap = new Map([
  ["info", "blue"],
  ["success", "green"],
  ["error", "red"],
  ["warn", "yellow"],
]);

const iconMap = new Map([
  ["info", "ℹ"],
  ["success", "✓"],
  ["error", "✘"],
  ["warn", "!"],
]);

/**
 * Displays a styled toast message in the terminal.
 *
 * @param {Object} options - Toast options.
 * @param {string} options.title - The title of the toast.
 * @param {string} options.message - The message to display.
 * @param {"info"|"success"|"error"|"warn"} options.type - The type of toast.
 * @param {string} [options.icon] - Optional custom icon to display.
 * @throws {Error} If an invalid toast type is provided.
 */
export function toast({ title, message, type, icon }) {
  if (!types.has(type)) {
    throw new Error(`invalid toast type: ${type}`);
  }

  const color = colorMap.get(type);
  const ikon = icon || iconMap.get(type);
  const titleTxt = title ? `(${ikon}) ${title}` : `(${ikon})`;
  const messageTxt = colors[color](message);

  const el = boxen(messageTxt, {
    title: titleTxt,
    titleAlignment: "left",
    margin: { bottom: 0, left: 1, right: 1, top: 0 },
    padding: { top: 0, bottom: 0, left: 1, right: 1 },
    width: 80,
    borderStyle: "round",
    borderColor: colorMap.get(type),
    dimBorder: true,
  });

  console.log(el);
}
