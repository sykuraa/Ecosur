// === GOOGLE APPS SCRIPT CONFIGURATION ===
const appScriptURL = 'https://script.google.com/macros/s/AKfycbygEZx3xuW8UME1hqxPJ97beV5njRMBY-8OhBqzxkTm05-bAVwA5jyJ8DvEFrnhYD6Z/exec';

// Live Database Arrays
let realAnggota = [];
let realKomentar = [];

// Configuration Table
const itemsPerPageAnggota = 5;
const itemsPerPageKomentar = 10;
let currentKomentarPage = 1;
let currentAnggotaPage = 1;

document.addEventListener('DOMContentLoaded', () => {
    // 1. Sidebar SPA Routing
    const navLinks = document.querySelectorAll('.nav-link-spa');
    const sections = document.querySelectorAll('.view-section');
    const topNavTitle = document.getElementById('topNavTitle');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            // Set Sidebar active class
            navLinks.forEach(l => {
                l.classList.remove('active', 'text-white');
                l.classList.add('text-light');
                const i = l.querySelector('i');
                if (i) i.classList.remove('text-info');
            });
            link.classList.remove('text-light');
            link.classList.add('active', 'text-white');
            const icon = link.querySelector('i');
            if (icon) icon.classList.add('text-info');

            // Hide all sections, show target
            sections.forEach(s => s.classList.add('d-none'));
            const targetId = link.getAttribute('data-target');
            document.getElementById(`section-${targetId}`).classList.remove('d-none');

            // Set Titles
            if (targetId === 'dashboard') topNavTitle.innerText = 'Dashboard Overview';
            if (targetId === 'anggota') topNavTitle.innerText = 'Data Anggota (Registration)';
            if (targetId === 'komentar') topNavTitle.innerText = 'Data Komentar (Community Pulse)';

            // Mobile toggle collapse
            const wrapper = document.getElementById('wrapper');
            if (window.innerWidth < 768 && wrapper.classList.contains('toggled')) {
                wrapper.classList.remove('toggled');
            }
        });
    });

    // Mobile Toggle Button
    const menuToggle = document.getElementById("menu-toggle");
    if (menuToggle) {
        menuToggle.addEventListener("click", function (e) {
            e.preventDefault();
            document.getElementById("wrapper").classList.toggle("toggled");
        });
    }

    // 2. Fetch Live Database Data
    fetchLiveDatabases();
});

async function fetchLiveDatabases() {
    // Show Loading Spinners
    document.getElementById('anggotaTableBody').innerHTML = '<tr><td colspan="5" class="text-center py-5 border-0"><div class="spinner-border text-info mb-3"></div><h6 class="text-white-50 font-outfit">Syncing with Google Database...</h6></td></tr>';
    document.getElementById('komentarTableBody').innerHTML = '<tr><td colspan="5" class="text-center py-5 border-0"><div class="spinner-border text-warning mb-3"></div><h6 class="text-white-50 font-outfit">Loading Live Community Pulse...</h6></td></tr>';

    try {
        // Fetch Anggota & Komentar simultaneously for 2x faster load
        const [resA, resK] = await Promise.all([
            fetch(appScriptURL + '?type=anggota'),
            fetch(appScriptURL + '?type=komentar')
        ]);
        const dataA = await resA.json();
        const dataK = await resK.json();

        if (Array.isArray(dataA)) realAnggota = dataA;
        if (Array.isArray(dataK)) realKomentar = dataK;

        // Apply Data sizes to dashboard
        document.getElementById('dashTotalAnggota').innerText = realAnggota.length;
        document.getElementById('dashTotalKomentar').innerText = realKomentar.length;

        // Render populated tables
        renderAnggotaTable(1);
        renderKomentarTable(1);
    } catch (err) {
        console.error("Failed fetching live database", err);
        const errMsg = '<tr><td colspan="5" class="text-center py-5 text-danger border-0"><i class="fas fa-exclamation-circle me-2"></i>Failed to reach Google Spreadsheet Database</td></tr>';
        document.getElementById('anggotaTableBody').innerHTML = errMsg;
        document.getElementById('komentarTableBody').innerHTML = errMsg;
    }
}

// === DATA ANGGOTA ===
window.renderAnggotaTable = function (page) {
    currentAnggotaPage = page;
    const totalItems = realAnggota.length;
    const startIndex = (page - 1) * itemsPerPageAnggota;
    const pageData = realAnggota.slice(startIndex, startIndex + itemsPerPageAnggota);

    document.getElementById('anggotaTableBody').innerHTML = '';

    pageData.forEach((d, internalArrayIdx) => {
        const badgeColor = d.interest === 'Competition' ? 'bg-danger' : (d.interest === 'Hobby' ? 'bg-success' : 'bg-primary');
        const tr = document.createElement('tr');
        tr.className = "border-bottom";
        tr.innerHTML = `
            <td class="ps-4 py-4">
                <span class="badge bg-light border-0 fw-medium font-outfit px-2 py-1"><i class="far fa-clock me-1 opacity-50"></i> ${d.timestamp}</span>
            </td>
            <td class="py-3">
                <div class="fw-bold font-outfit mb-1" style="color: #fff;">${d.name || '-'}</div>
                <div class="small fw-semibold text-info mb-2"><i class="fas fa-id-badge me-2"></i>${d.studentId || '-'}</div>
                <div class="small"><span class="badge bg-secondary bg-opacity-25 text-white border-0 px-2">${d.major || 'Unknown'}</span> <span class="badge bg-info bg-opacity-25 text-info border border-info px-2">Batch ${d.batch || '-'}</span></div>
            </td>
            <td class="py-3">
                <div class="small fw-semibold mb-1" style="color: #e0e0e0;"><i class="fab fa-whatsapp text-success fs-6 align-middle me-2"></i> ${d.whatsapp || '-'}</div>
                <div class="text-white-50 small fw-medium"><i class="far fa-envelope text-primary align-middle me-2"></i> ${d.email || '-'}</div>
            </td>
            <td class="py-3"><span class="badge ${badgeColor} rounded-pill py-2 px-3 fw-medium font-outfit shadow-sm">${d.interest || '-'}</span></td>
            <td class="text-center pe-4 py-3">
                <button class="btn btn-sm btn-info rounded-circle shadow-sm p-2 text-dark" onclick="openExpModal(${startIndex + internalArrayIdx})" title="Read Full Experience" style="width: 35px; height: 35px;">
                    <i class="fas fa-search"></i>
                </button>
            </td>
        `;
        document.getElementById('anggotaTableBody').appendChild(tr);
    });

    updatePagination('anggota', totalItems, page, itemsPerPageAnggota);
}

// === DATA KOMENTAR ===
window.renderKomentarTable = function (page) {
    currentKomentarPage = page;
    const totalItems = realKomentar.length;
    const startIndex = (page - 1) * itemsPerPageKomentar;
    const pageData = realKomentar.slice(startIndex, startIndex + itemsPerPageKomentar);

    document.getElementById('komentarTableBody').innerHTML = '';

    pageData.forEach(d => {
        const tr = document.createElement('tr');
        tr.className = "border-bottom";
        tr.innerHTML = `
            <td class="ps-4 py-4">
                <span class="badge bg-light border-0 fw-medium font-outfit px-2 py-1"><i class="far fa-clock me-1 opacity-50"></i> ${d.timestamp}</span>
            </td>
            <td class="py-3 font-outfit fw-bold" style="color:#fff;">${d.name || '-'}</td>
            <td class="py-3 text-info small fw-medium">${d.contact || '-'}</td>
            <td class="py-3 text-white-50 small">
                 <div class="text-truncate" style="max-width: 280px; font-size: 0.9rem;">${d.message || '-'}</div>
            </td>
            <td class="text-center pe-4 py-3">
                <button class="btn btn-sm btn-warning rounded-circle shadow-sm p-2 text-dark" onclick="openCommentModal(${d.rowIndex})" title="Read Full Message" style="width: 35px; height: 35px;">
                    <i class="fas fa-glasses"></i>
                </button>
            </td>
        `;
        document.getElementById('komentarTableBody').appendChild(tr);
    });

    updatePagination('komentar', totalItems, page, itemsPerPageKomentar);
}

// === PAGINATION COMPUTATION ===
function updatePagination(type, totalItems, currentPage, limit) {
    const totalPages = Math.ceil(totalItems / limit);
    const ul = document.getElementById(`${type}Pagination`);
    const info = document.getElementById(`${type}TableInfo`);

    ul.innerHTML = '';
    
    if (totalItems === 0) {
        info.innerText = "No entries found";
        return;
    }

    // Info display setup
    const startNum = ((currentPage - 1) * limit) + 1;
    let endNum = currentPage * limit;
    if (endNum > totalItems) endNum = totalItems;
    info.innerText = `Showing ${startNum} to ${endNum} of ${totalItems} entries`;

    // Dynamic Pagination UI generator
    const prevDis = currentPage === 1 ? 'disabled' : '';
    ul.innerHTML += `<li class="page-item ${prevDis}"><a class="page-link" href="#" onclick="event.preventDefault(); render${capitalize(type)}Table(${currentPage - 1})"><i class="fas fa-chevron-left"></i></a></li>`;

    for (let p = 1; p <= totalPages; p++) {
        const active = p === currentPage ? 'active' : '';
        ul.innerHTML += `<li class="page-item ${active}"><a class="page-link" href="#" onclick="event.preventDefault(); render${capitalize(type)}Table(${p})">${p}</a></li>`;
    }

    const nextDis = currentPage === totalPages ? 'disabled' : '';
    ul.innerHTML += `<li class="page-item ${nextDis}"><a class="page-link" href="#" onclick="event.preventDefault(); render${capitalize(type)}Table(${currentPage + 1})"><i class="fas fa-chevron-right"></i></a></li>`;
}

function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

// === MODAL ACTION POPUPS ===
window.openExpModal = function (globalIdx) {
    const data = realAnggota[globalIdx];
    if (data) {
        document.getElementById('modalName').innerText = data.name || '-';
        document.getElementById('modalSubInfo').innerHTML = `<i class="fas fa-id-card me-2 text-info"></i>Student ID: <span class="text-white">${data.studentId || '-'}</span> &mdash; <i class="fas fa-graduation-cap ms-2 me-2 text-info"></i>Major: <span class="text-white">${data.major} (${data.batch})</span>`;
        document.getElementById('modalLongText').innerText = data.experience || 'No extended experience details provided by the candidate.';

        // Header Styling for Anggota
        const header = document.getElementById('actionModalHeader');
        header.className = 'modal-header bg-primary text-white border-0 py-4 px-4';
        document.getElementById('actionModalTitle').innerHTML = '<i class="fas fa-file-alt me-3"></i>Application Experience Profile';
        document.querySelector('.border-start.border-4').className = 'px-4 py-4 bg-light border-start border-4 border-info rounded-end shadow-sm';
        
        // Reset Footer Buttons (No Delete form Anggota yet)
        const footer = document.querySelector('#actionModal .modal-body .mt-5');
        footer.innerHTML = `<button type="button" class="btn btn-outline-info px-4 rounded-pill font-outfit fw-semibold" data-bs-dismiss="modal">Close Overlay</button>`;

        new bootstrap.Modal(document.getElementById('actionModal')).show();
    }
}

window.openCommentModal = function (rowIndex) {
    const data = realKomentar.find(x => x.rowIndex === rowIndex);
    if (data) {
        document.getElementById('modalName').innerText = data.name || '-';
        document.getElementById('modalSubInfo').innerHTML = `<i class="fab fa-instagram me-2 text-warning"></i>Contact Profile: <span class="text-white">${data.contact || 'No Contact Provided'}</span>`;
        document.getElementById('modalLongText').innerText = data.message || '';

        // Header Styling for Komentar
        const header = document.getElementById('actionModalHeader');
        header.className = 'modal-header bg-warning text-dark border-0 py-4 px-4';
        document.getElementById('actionModalTitle').innerHTML = '<i class="fas fa-comment-dots me-3 text-dark"></i>Community Pulse Feedback';
        document.querySelector('.border-start.border-4').className = 'px-4 py-4 bg-light border-start border-4 border-warning rounded-end shadow-sm';
        
        // Add Delete Button to Footer
        const footer = document.querySelector('#actionModal .modal-body .mt-5');
        footer.innerHTML = `
            <button type="button" class="btn btn-danger px-4 rounded-pill font-outfit fw-semibold me-2 shadow-sm" onclick="triggerDeleteModal(${rowIndex})"><i class="fas fa-trash me-2"></i>Delete Response</button>
            <button type="button" class="btn btn-outline-warning px-4 rounded-pill font-outfit fw-semibold text-white" data-bs-dismiss="modal">Close Overlay</button>
        `;

        new bootstrap.Modal(document.getElementById('actionModal')).show();
    }
}

// === NEW DELETE MODAL LOGIC ===
let targetDeleteRow = null;

window.triggerDeleteModal = function(rowIndex) {
    targetDeleteRow = rowIndex;
    // Hide large modal, show small confirm modal
    const actionModalEl = document.getElementById('actionModal');
    const modalIns = bootstrap.Modal.getInstance(actionModalEl);
    if(modalIns) modalIns.hide();
    
    setTimeout(() => {
        const confirmModal = new bootstrap.Modal(document.getElementById('deleteConfirmModal'));
        confirmModal.show();
    }, 400); // Wait for fade out
}

document.addEventListener('DOMContentLoaded', () => {
    const confirmBtn = document.getElementById('confirmDeleteBtn');
    if(confirmBtn) {
        confirmBtn.addEventListener('click', () => {
             if(targetDeleteRow) {
                 const modalEl = document.getElementById('deleteConfirmModal');
                 bootstrap.Modal.getInstance(modalEl).hide();
                 executeDeleteComment(targetDeleteRow);
             }
        });
    }
});

window.executeDeleteComment = function(rowIndex) {
    // Optimistic UI Removal Update
    const idx = realKomentar.findIndex(x => x.rowIndex === rowIndex);
    if(idx !== -1) {
        realKomentar.splice(idx, 1);
        
        // Ensure accurate page re-render if we delete the last item on a page
        const totalItems = realKomentar.length;
        const totalPages = Math.ceil(totalItems / itemsPerPageKomentar);
        if(currentKomentarPage > totalPages && totalPages > 0) currentKomentarPage = totalPages;
        
        renderKomentarTable(currentKomentarPage);
        document.getElementById('dashTotalKomentar').innerText = totalItems;
    }

    // Call POST delete request to Apps Script Backend
    const formData = new FormData();
    formData.append('formType', 'deleteComment');
    formData.append('rowIndex', rowIndex);
    
    fetch(appScriptURL, { method: 'POST', body: formData })
    .then(res => res.json())
    .then(data => {
        if(data.result === 'success') {
            const toast = document.createElement('div');
            toast.className = 'position-fixed bottom-0 end-0 p-3 z-3';
            toast.innerHTML = `<div class="toast show bg-success text-white border-0"><div class="toast-body d-flex align-items-center"><i class="fas fa-check-circle me-2"></i> Comment successfully deleted from Spreadsheet!</div></div>`;
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 4000);
        } else {
            console.error("Delete failed in database.", data);
            alert("Database Error: Gagal menghapus baris di spreadsheet.");
        }
    })
    .catch(err => {
        console.error("Fatal Database POST error", err);
    });
}