export const rules = {
  glass: {
    maxBlur: 24, // Never exceed blur(24px)
    avoidNestedFilters: true, // Avoid nested backdrop filters
    limitSimultaneousLayers: 3, // Limit simultaneous glass layers
    preferTransforms: true, // Prefer transforms over layout changes
  }
} as const;
