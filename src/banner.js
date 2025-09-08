import gradient from "gradient-string";

const lullabyGradient = gradient(["#9370DB", "#E980FC"]);

export default function banner() {
  console.log(
    lullabyGradient(`
    oooo              oooo  oooo             .o8
    \`888              \`888  \`888            "888
     888  oooo  oooo   888   888   .oooo.    888oooo.  oooo    ooo
     888  \`888  \`888   888   888  \`P  )88b   d88' \`88b  \`88.  .8'
     888   888   888   888   888   .oP"888   888   888   \`88..8'
     888   888   888   888   888  d8(  888   888   888    \`888'
     o888o  \`V88V"V8P' o888o o888o \`Y888""8o  \`Y8bod8P'    .8'
                                                       .o..P'
                                                       \`Y8P'
  `),
  );
}
