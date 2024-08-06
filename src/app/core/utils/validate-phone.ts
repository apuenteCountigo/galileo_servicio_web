export const validatePhoneNumber = (e: KeyboardEvent, value: string) => {
  const regex = new RegExp('[0-9]');
  if (value.length == 12) {
    e.preventDefault();
    return;
  }
  if (value.length > 0 && e.key == '+') {
    e.preventDefault();
    return;
  }
  if (value.length == 0 && e.key == '+') {
    return;
  }
  if (!regex.test(e.key)) {
    e.preventDefault();
    return;
  }
  return;
};
