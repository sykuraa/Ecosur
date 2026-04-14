const fs = require('fs');

const indexHtmlPath = 'd:\\Masa ngoding lagi sih\\Ngoding Ecosur 2\\user\\index.html';
const mainJsPath = 'd:\\Masa ngoding lagi sih\\Ngoding Ecosur 2\\user\\js\\main.js';
const indexCssPath = 'd:\\Masa ngoding lagi sih\\Ngoding Ecosur 2\\user\\css\\index.css';

// 1. Fix index.html
let html = fs.readFileSync(indexHtmlPath, 'utf8');

// Translations & Modal Button Add ID
html = html.replace('Pendaftaran Berhasil!', 'Registration Successful!');
html = html.replace('Data kamu sudah diamankan oleh sistem. Sampai jumpa di kolam ya!', 'Your data has been securely saved. See you at the pool!');
html = html.replace('<button type="button" class="btn btn-outline-light px-5 py-2 rounded-pill fw-bold transition-all hover-glow" data-bs-dismiss="modal">Siapp Bos!</button>', 
'<button type="button" id="successCloseBtn" class="btn btn-outline-light px-5 py-2 rounded-pill fw-bold transition-all" data-bs-dismiss="modal">Confirm</button>');

// Replace Images for Carousel & DB
html = html.replace(/1519558482650-613dcfcc898c/g, '1507525428034-b723cf961d3e'); 
html = html.replace(/1549419163-54cd2245c3ac/g, '1576610616656-d3aa5d1f4534');
html = html.replace(/1596482163155-276ceb7d3f8f/g, '1560090995-01632a28895b');

fs.writeFileSync(indexHtmlPath, html);

// 2. Fix main.js
let js = fs.readFileSync(mainJsPath, 'utf8');
js = js.replace('Komentar berhasil diposting!', 'Comment posted successfully!');

// Add logic to main.js for auto close
const countdownLogic = `
                // Show glowing Success Modal
                const successModalEl = document.getElementById('successModal');
                if (successModalEl) {
                    const successModal = new bootstrap.Modal(successModalEl);
                    successModal.show();
                    
                    const btn = document.getElementById('successCloseBtn');
                    if(btn) {
                        let count = 3;
                        btn.innerHTML = \`Closing in \${count}...\`;
                        btn.style.pointerEvents = 'none';
                        
                        const t = setInterval(() => {
                            count--;
                            if(count > 0) {
                                btn.innerHTML = \`Closing in \${count}...\`;
                            } else {
                                clearInterval(t);
                                successModal.hide();
                            }
                        }, 1000);
                    }
                }
`;

js = js.replace(/(\/\/ Show glowing Success Modal[\s\S]*?successModal\.show\(\);\n                })/g, countdownLogic.trim());

fs.writeFileSync(mainJsPath, js);

// 3. Fix Splash Screen Positioning in index.css
let css = fs.readFileSync(indexCssPath, 'utf8');

css = css.replace('left: -200px;', 'left: -200px;\n  bottom: 55%;');
css = css.replace(/font-size: 3rem;/g, 'font-size: 4rem;\n  margin-top: 5rem;');

fs.writeFileSync(indexCssPath, css);
console.log('Fixes applied successfully!');
