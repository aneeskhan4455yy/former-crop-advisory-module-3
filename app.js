const sidebar = document.querySelector('#sidebar');
const overlay = document.querySelector('#overlay');
const toast = new bootstrap.Toast(document.querySelector('#live-toast'));
const showToast = (message) => { document.querySelector('#toast-message').textContent = message; toast.show(); };

const loginScreen = document.querySelector('#login-screen');
const adminLayout = document.querySelector('#admin-layout');
const demoCredentials = { email: 'anees123@gmail.com', password: 'anees123' };
document.querySelector('#login-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const message = document.querySelector('#login-message');
  if (!form.checkValidity() || document.querySelector('#login-email').value.trim().toLowerCase() !== demoCredentials.email || document.querySelector('#login-password').value !== demoCredentials.password) { form.classList.add('was-validated'); message.textContent = 'Enter the correct account email and password.'; return; }
  loginScreen.classList.add('hidden');
  adminLayout.classList.remove('hidden');
  message.textContent = '';
});
document.querySelector('#forgot-password').addEventListener('click', () => { document.querySelector('#login-message').textContent = 'Password reset instructions would be sent to your email.'; });

function closeMenu() { sidebar.classList.remove('open'); overlay.classList.remove('show'); }
document.querySelector('#menu-button').addEventListener('click', () => { sidebar.classList.add('open'); overlay.classList.add('show'); });
overlay.addEventListener('click', closeMenu);

document.querySelectorAll('.nav-link').forEach((link) => link.addEventListener('click', () => {
  document.querySelectorAll('.nav-link').forEach((item) => item.classList.remove('active'));
  link.classList.add('active');
  closeMenu();
}));

function addRow(formId, tableId, row, message, countId) {
  const form = document.querySelector(`#${formId}`);
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.checkValidity()) { form.classList.add('was-validated'); return; }
    document.querySelector(`#${tableId}`).insertAdjacentHTML('afterbegin', row());
    if (countId) document.querySelector(`#${countId}`).textContent = Number(document.querySelector(`#${countId}`).textContent) + 1;
    bootstrap.Modal.getInstance(form.closest('.modal')).hide();
    form.reset();
    showToast(message);
  });
}

addRow('farmer-form', 'farmer-table', () => `<tr><td><strong>${document.querySelector('#farmer-name').value}</strong></td><td>${document.querySelector('#farmer-email').value}</td><td>27 Aug 2026</td><td><span class="status active-status">Active</span></td></tr>`, 'Farmer added successfully.', 'farmer-count');
addRow('crop-form', 'crop-table', () => `<tr><td><strong>${document.querySelector('#crop-name').value}</strong></td><td><span class="season">${document.querySelector('#crop-season').value}</span></td><td>${document.querySelector('#crop-soil').value}</td><td><button class="edit-crop" data-crop="${document.querySelector('#crop-name').value}" data-season="${document.querySelector('#crop-season').value}" data-soil="${document.querySelector('#crop-soil').value}" type="button"><i class="bi bi-pencil-square"></i>Edit</button></td></tr>`, 'Crop added successfully.', 'crop-count');
addRow('fertilizer-form', 'fertilizer-table', () => `<tr><td><strong>${document.querySelector('#fertilizer-name').value}</strong></td><td>${document.querySelector('#fertilizer-type').value}</td><td>${document.querySelector('#fertilizer-quantity').value}</td></tr>`, 'Fertilizer added successfully.');

document.querySelectorAll('.view-all, #all-farmers').forEach((button) => button.addEventListener('click', () => showToast('Showing all available records.')));
['logout-button', 'logout-top'].forEach((id) => document.querySelector(`#${id}`).addEventListener('click', () => { adminLayout.classList.add('hidden'); loginScreen.classList.remove('hidden'); document.querySelector('#login-form').reset(); showToast('You have been safely logged out.'); }));

const portalCards = document.querySelectorAll('.portal-card');
function filterPortal() {
  const query = document.querySelector('#portal-search').value.toLowerCase();
  const filter = document.querySelector('#portal-filter').value;
  portalCards.forEach((card) => {
    const matchesText = card.textContent.toLowerCase().includes(query);
    const matchesFilter = filter === 'all' || card.dataset.status === filter;
    card.style.display = matchesText && matchesFilter ? '' : 'none';
  });
}
document.querySelector('#portal-search').addEventListener('input', filterPortal);
document.querySelector('#portal-filter').addEventListener('change', filterPortal);
const guideContent = {
  'Maize application guide': ['Apply urea when the soil is slightly moist.', 'Use 50 kg per acre and spread it evenly between rows.', 'Water lightly or apply before expected rainfall.'],
  'Rice crop guide': ['Keep shallow water in the paddy during active growth.', 'Check the field every morning for dry patches.', 'Drain excess water after heavy rainfall.'],
  'Tomato disease guide': ['Inspect lower leaves for brown spots or yellow edges.', 'Remove affected leaves and keep them away from the field.', 'Avoid overhead watering and use a recommended fungicide if symptoms spread.']
};
document.querySelectorAll('.guide-button').forEach((button) => button.addEventListener('click', () => {
  document.querySelector('#guideModalTitle').textContent = button.dataset.guide;
  document.querySelector('#guideIntro').textContent = `Follow these steps for the ${button.dataset.guide.toLowerCase()}.`;
  document.querySelector('#guideSteps').innerHTML = guideContent[button.dataset.guide].map((step, index) => `<div class="guide-step"><b>${index + 1}</b><span>${step}</span></div>`).join('');
  bootstrap.Modal.getOrCreateInstance(document.querySelector('#guideModal')).show();
}));
document.querySelector('#profile-form').addEventListener('submit', (event) => {
  event.preventDefault();
  if (!event.currentTarget.checkValidity()) return;
  const farmerRow = [...document.querySelectorAll('#farmer-table tr')].find((row) => row.children[0]?.textContent.trim() === 'Malik Anees');
  if (farmerRow) {
    farmerRow.children[0].innerHTML = `<strong>${document.querySelector('#profile-name').value}</strong>`;
    farmerRow.children[1].textContent = document.querySelector('#profile-email').value;
  }
  bootstrap.Modal.getInstance(event.currentTarget.closest('.modal')).hide();
  showToast('Farmer profile updated successfully.');
});

function bindCropEdit(button) {
  button.addEventListener('click', () => {
    document.querySelector('#edit-crop-name').value = button.dataset.crop;
    document.querySelector('#edit-crop-season').value = button.dataset.season;
    document.querySelector('#edit-crop-soil').value = button.dataset.soil;
    document.querySelector('#edit-crop-form').dataset.row = button.closest('tr').rowIndex;
    bootstrap.Modal.getOrCreateInstance(document.querySelector('#editCropModal')).show();
  });
}
document.querySelectorAll('.edit-crop').forEach(bindCropEdit);
document.querySelector('#edit-crop-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const row = [...document.querySelectorAll('#crop-table tr')].find((item) => item.rowIndex === Number(event.currentTarget.dataset.row));
  if (!row) return;
  row.children[0].innerHTML = `<strong>${document.querySelector('#edit-crop-name').value}</strong>`;
  row.children[1].innerHTML = `<span class="season">${document.querySelector('#edit-crop-season').value}</span>`;
  row.children[2].textContent = document.querySelector('#edit-crop-soil').value;
  const button = row.querySelector('.edit-crop');
  button.dataset.crop = document.querySelector('#edit-crop-name').value;
  button.dataset.season = document.querySelector('#edit-crop-season').value;
  button.dataset.soil = document.querySelector('#edit-crop-soil').value;
  bootstrap.Modal.getInstance(document.querySelector('#editCropModal')).hide();
  showToast('Crop information updated successfully.');
});
