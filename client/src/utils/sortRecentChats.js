export const sortMessagesByTypeAndCreatedAt = (a, b) => {
  if (a.isMessage && !b.isMessage) {
    return -1; // a should come before b (a is message, b is not)
  } else if (!a.isMessage && b.isMessage) {
    return 1; // b should come before a (b is message, a is not)
  } else if (a.isMessage && b.isMessage) {
    // Both are messages, sort by createdAt
    return new Date(b.createdAt) - new Date(a.createdAt);
  } else {
    return 0; // Maintain the order for non-message objects
  }
};
