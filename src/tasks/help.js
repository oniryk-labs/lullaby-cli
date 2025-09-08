import colors from "colors";

const help = () => {
  console.log(
    colors.gray(`  ${colors.bold("@oniryk/llby-cli ✦ a commit message validator")}

  usage:
    llby <command> [options]

  commands:
    setup             Setup git hooks for commit message validation
    auth <token>      Authenticate with your llby access token
    help              Display this help message
`),
  );
};

export default help;
