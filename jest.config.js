module.exports = {
    roots: ["<rootDir>"],
    verbose: true,
    transform: {
      "^.+\\.tsx?$": "ts-jest"
    },
    globals: {
      "ts-jest": {
        diagnostics: false
      }
    }
  };