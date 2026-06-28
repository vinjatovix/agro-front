// @ts-nocheck
export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Detect hardcoded UI text (i18n required)'
    },
    schema: []
  },

  create(context) {
    return {
      JSXText(node) {
        const text = node.value?.trim?.();

        if (!text) return;
        if (text.length < 2) return;

        context.report({
          node,
          message: 'Hardcoded UI text detected. Use i18n t() instead.'
        });
      }
    };
  }
};
