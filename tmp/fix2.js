const fs = require('fs');

const indexHtmlPath = 'd:\\Masa ngoding lagi sih\\Ngoding Ecosur 2\\user\\index.html';
const mainJsPath = 'd:\\Masa ngoding lagi sih\\Ngoding Ecosur 2\\user\\js\\main.js';
const indexCssPath = 'd:\\Masa ngoding lagi sih\\Ngoding Ecosur 2\\user\\css\\index.css';

// 1. Fix CSS (Splash Screen spacing & Gallery Image Object-Fit)
let css = fs.readFileSync(indexCssPath, 'utf8');
css = css.replace('bottom: 55%;', 'top: 42%;'); // Move swimmer lower
css = css.replace(/margin-top: 5rem;/g, 'margin-top: 2rem;'); // Move logo higher

// Add Gallery Img styles at the end
if (!css.includes('#prestasiCarousel img')) {
    css += `\n\n/* Ensure all gallery images are perfectly uniform */\n#prestasiCarousel img {\n  height: 450px;\n  object-fit: cover;\n}\n`;
}
fs.writeFileSync(indexCssPath, css);

// 2. Fix JS (Clickable manual close button during countdown)
let js = fs.readFileSync(mainJsPath, 'utf8');
// remove pointer-events none
js = js.replace(/btn\.style\.pointerEvents = 'none';/g, '');
// add click listener to clear interval
const fixedCountdown = `
                    if(btn) {
                        let count = 3;
                        btn.innerHTML = \`Closing in \${count}...\`;
                        
                        const t = setInterval(() => {
                            count--;
                            if(count > 0) {
                                btn.innerHTML = \`Closing in \${count}...\`;
                            } else {
                                clearInterval(t);
                                successModal.hide();
                            }
                        }, 1000);

                        // If user clicks it manually, stop the timer so it doesn't conflict
                        btn.onclick = () => clearInterval(t);
                    }
`;
// Let's replace the whole block again properly, matching the previous logic.
js = js.replace(/if\(btn\) \{\s+let count = 3;\s+btn\.innerHTML = `Closing in \$\{count\}\.\.\.`;\s+const t = setInterval[\s\S]*?\}, 1000\);\s+\}/g,  fixedCountdown.trim() + '\n                ');

fs.writeFileSync(mainJsPath, js);
console.log('Fix2 applied successfully!');
