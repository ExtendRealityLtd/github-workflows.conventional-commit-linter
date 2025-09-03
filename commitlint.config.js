module.exports = {
  rules: {
    'type-enum': [2, 'always', ['feat', 'fix', 'chore', 'refactor']],
    'scope-empty': [2, 'never'],
    'subject-empty': [2, 'never'],
    'header-max-length': [2, 'always', 72],
    'body-max-line-length': [2, 'always', 72],
    'footer-max-line-length': [2, 'always', 72],
    'subject-case': [2, 'always', 'lower-case'],
    'subject-full-stop': [2, 'never', '.'],
    'subject-min-length': [2, 'always', 3],
    'body-leading-blank': [2, 'always'],
  },

  customRules: {
    bodyRequiredForTypes: ['feat', 'fix', 'chore', 'refactor'],
    enforceBreakingChangeConsistency: true,
    footerCountsAsBody: true,

    messages: {
      headerFormat: 'Header must follow format: type(scope): description',
      invalidType: 'Invalid commit type. Valid types: feat, fix, chore, refactor',
      scopeRequired: 'Scope is required and cannot be empty. Use format: type(scope): description',
      descriptionRequired: 'Description is required after ": "',
      descriptionTooShort: 'Description too short (minimum 3 characters)',
      lowercaseRequired: 'Description should start with lowercase letter',
      noTrailingPeriod: 'Header should not end with a period',
      headerTooLong: 'Header too long ({length} chars, max 72)',
      bodyRequiredForType: 'Body is required for {type} commits. Add a blank line after header, then describe what and why.',
      bodyLeadingBlank: 'Blank line required after header',
      bodyLineTooLong: 'Body line too long ({length} chars, max 72)',
      footerLineTooLong: 'Footer line too long ({length} chars, max 72)',
      breakingNeedsFooter: "Breaking change '!' in header requires 'BREAKING CHANGE:' in footer",
      footerNeedsBang: "'BREAKING CHANGE:' in footer requires '!' in header",
      cannotBeEmpty: 'Commit message cannot be empty',
    }
  }
};
