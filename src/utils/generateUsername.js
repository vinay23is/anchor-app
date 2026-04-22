export function generateUsername(email) {
  let hash = 0;
  for (let i = 0; i < email.length; i++) {
    hash = (hash * 31 + email.charCodeAt(i)) >>> 0;
  }
  const number = hash % 9000 + 1000;
  return `Anchor#${number}`;
}
