// ready toGame-text effect 
 document.querySelectorAll(".text-span").forEach(el => {
  const chars = el.textContent.split('');
  el.textContent = '';

  chars.forEach((char, i) => {
    const span = document.createElement('span');
    span.textContent = char;
    span.style.display = 'inline-block';
    span.style.opacity = 0;
    span.style.transform = 'translateY(40px)';
    el.appendChild(span);

    gsap.to(span, {
      opacity: 1,
      y: 0,
      delay: i * 0.10,
      duration: .7,
      ease: "power3.out"
    });
  });
});
// btn start
  const btn = document.querySelectorAll(".button-start")

  btn.addEventListener('click', () => {
  btn.classList.add(".button-clicked")
})

