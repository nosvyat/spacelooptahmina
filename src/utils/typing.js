function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function typeText(element, text, speed = 45) {
  element.textContent = '';

  for (let i = 0; i < text.length; i += 1) {
    element.textContent += text[i];
    await wait(speed);
  }
}
