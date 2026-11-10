/* Shared cart line relationships; no requests, DOM, or price-setting operations. */
(() => {
  'use strict';
  const failure = (code) => Object.assign(new Error(code), { code });
  const isComponent = (item) => Boolean(item.properties?._framing_component);
  const visibleItems = (cart) => cart.items.filter((item) => !isComponent(item));
  const relationships = (cart, parent) => {
    const configuration = parent.properties?._framing_config;
    const children = configuration ? cart.items.filter((item) => isComponent(item) && item.properties?._framing_config === configuration) : [];
    const parents = configuration ? visibleItems(cart).filter((item) => item.properties?._framing_config === configuration) : [parent];
    const quantity = parents.reduce((sum, item) => sum + item.quantity, 0);
    const kinds = children.map((item) => item.properties._framing_component);
    const valid = Number.isSafeInteger(quantity) && quantity > 0 && parents.every((item) => Number.isSafeInteger(item.quantity) && item.quantity > 0)
      && new Set(kinds).size === kinds.length && children.every((item) => item.quantity === quantity);
    return { children, parents, quantity, valid };
  };
  const groupUpdate = (cart, key, quantity) => {
    if (!Number.isSafeInteger(quantity) || quantity < 0) throw failure('invalid-quantity');
    const parent = visibleItems(cart).find((item) => item.key === key);
    if (!parent) throw failure('stale-line');
    const group = relationships(cart, parent);
    const target = group.quantity - parent.quantity + quantity;
    // Existing product/custom framing code adds one component of each kind per
    // parent unit. Keep that relation when promotions split a parent into rows.
    if (group.children.length && (!group.valid || !Number.isSafeInteger(target) || target < 0)) throw failure('framing-split');
    return {
      updates: Object.fromEntries([[parent.key, quantity], ...group.children.map((item) => [item.key, target])]),
      metadata: { cart_line_key: key, quantity, component_count: group.children.length },
    };
  };
  const allocatedChildren = (cart, parent) => {
    const group = relationships(cart, parent);
    const index = group.parents.findIndex((item) => item.key === parent.key);
    if (index < 0 || !group.children.length) return [];
    // Unknown ratios are displayed once, never multiplied by parent-row count.
    // The update path independently rejects these groups instead of guessing.
    if (!group.valid) return index === 0 ? group.children.map((item) => ({ ...item })) : [];
    const before = group.parents.slice(0, index).reduce((sum, item) => sum + item.quantity, 0);
    const through = before + group.parents[index].quantity;
    return group.children.map((item) => {
      if (!Number.isSafeInteger(item.final_line_price) || item.final_line_price < 0) throw failure('invalid-component-price');
      // Cumulative integer allocation preserves every cent even if a discount
      // makes the child line total indivisible by the group's unit quantity.
      const price = BigInt(item.final_line_price);
      const amount = Number(price * BigInt(through) / BigInt(group.quantity) - price * BigInt(before) / BigInt(group.quantity));
      return { ...item, final_line_price: amount };
    });
  };
  window.PFCartLineGroups = Object.freeze({ groupUpdate, isComponent, visibleItems, allocatedChildren });
})();
