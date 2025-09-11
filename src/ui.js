class Toast {
  static icons = {
    success: "✓",
    error: "✗",
    warning: "⚠",
    info: "ℹ",
    loading: "⟳",
  };

  static colors = {
    success: "\x1b[32m",
    error: "\x1b[31m",
    warning: "\x1b[33m",
    info: "\x1b[36m",
    loading: "\x1b[34m",
    reset: "\x1b[0m",
  };

  static wrapText(text, maxWidth) {
    const words = text.split(" ");
    const lines = [];
    let currentLine = "";

    words.forEach((word) => {
      if (this.stripAnsi(currentLine + word).length <= maxWidth) {
        currentLine += (currentLine ? " " : "") + word;
      } else {
        if (currentLine) lines.push(currentLine);
        if (this.stripAnsi(word).length > maxWidth) {
          for (let i = 0; i < word.length; i += maxWidth) {
            lines.push(word.slice(i, i + maxWidth));
          }
          currentLine = "";
        } else {
          currentLine = word;
        }
      }
    });

    lines.push(currentLine);
    return lines;
  }

  static truncateText(text, maxWidth) {
    if (this.stripAnsi(text).length <= maxWidth) return text;
    return this.stripAnsi(text).slice(0, maxWidth - 3) + "...";
  }

  static show({
    type = "info",
    title,
    message,
    icon,
    maxWidth = 80,
    lineDecorator = "",
    footNote,
  }) {
    const displayIcon = icon || this.icons[type] || this.icons.info;
    const color = this.colors[type] || this.colors.info;
    const reset = this.colors.reset;

    const firstLineContent = title
      ? `(${displayIcon}) ${this.truncateText(title, maxWidth - 8)}`
      : `(${displayIcon})`;

    const contentLength = this.stripAnsi(firstLineContent).length;
    const paddingLength = Math.max(0, maxWidth - contentLength - 4);
    const padding = "─".repeat(paddingLength);
    const lines = [];

    lines.push(`${color} ╭ ${firstLineContent} ${padding}╮${reset}`);

    message.split("\n").forEach((line) => {
      const wrappedLines = this.wrapText(line, maxWidth - 6);

      wrappedLines.forEach((wrappedLine) => {
        const linePadding = " ".repeat(
          Math.max(
            0,
            maxWidth -
              this.stripAnsi(wrappedLine).length -
              4 -
              lineDecorator.length,
          ),
        );
        lines.push(
          `${color} │${lineDecorator} ${wrappedLine}${linePadding} │${reset}`,
        );
      });
    });

    const bottomLine = "─".repeat(maxWidth - 2);
    lines.push(`${color} ╰${bottomLine}╯${reset}`);

    console.log(lines.join("\n"));

    if (footNote) {
      console.log(`${color}  ╰ (ℹ) ${footNote} ${reset}`);
    }
  }

  static stripAnsi(str) {
    return str.replace(/\x1b\[[0-9;]*m/g, "");
  }

  static success(options) {
    return this.show({ ...options, type: "success" });
  }

  static error(options) {
    return this.show({ ...options, type: "error" });
  }

  static warning(options) {
    return this.show({ ...options, type: "warning" });
  }

  static info(options) {
    return this.show({ ...options, type: "info" });
  }

  static loading(options) {
    return this.show({ ...options, type: "loading" });
  }
}

export function toast(options) {
  return Toast.show(options);
}

toast.success = (options) => Toast.success(options);
toast.error = (options) => Toast.error(options);
toast.warning = (options) => Toast.warning(options);
toast.info = (options) => Toast.info(options);
toast.loading = (options) => Toast.loading(options);

export function decorateLine(text, decorator = "*", maxWidth = 80) {
  return text
    .split("\n")
    .map((line) => {
      const strippedLine = Toast.stripAnsi(line);
      const lineLength = strippedLine.length;

      if (lineLength >= maxWidth - 4) {
        const wrappedLines = Toast.wrapText(strippedLine, maxWidth - 4);
        return wrappedLines
          .map((wrappedLine) => {
            return `${decorator} ${wrappedLine}`;
          })
          .join("\n");
      } else {
        return `${decorator} ${line}`;
      }
    })
    .join("\n");
}
