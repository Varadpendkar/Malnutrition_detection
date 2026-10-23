/* ─── ChildNutri AI — Auth helpers ──────────────────────────────────────── */
let _cachedUser = null;

async function getUser() {
  if (_cachedUser) return _cachedUser;
  try {
    _cachedUser = await API.get('/api/auth/me');
    return _cachedUser;
  } catch {
    return null;
  }
}

async function requireUser() {
  const user = await getUser();
  if (!user) {
    location.href = '/login.html';
    throw new Error('Not authenticated');
  }
  checkAndPromptConsent(user);
  return user;
}

function checkAndPromptConsent(user) {
  if (!user || user.consent_given) return;
  if (document.getElementById('consent-modal-root')) return;

  const backdrop = document.createElement('div');
  backdrop.id = 'consent-modal-root';
  backdrop.className = 'consent-backdrop';
  backdrop.innerHTML = `
    <div class="consent-card" id="consent-modal">
      <h2>🛡 Data Use & Screening Consent</h2>
      <p>ChildNutri AI collects and processes your child's age, anthropometric measurements (weight, height, MUAC), and feeding history solely to compute WHO growth standards and risk indicators.</p>
      <p>Your child's health records are stored securely and are <strong>never shared with unauthorized third parties</strong>.</p>
      <div style="background:rgba(234, 179, 8, 0.12); border:1px solid rgba(234, 179, 8, 0.3); border-radius:8px; padding:10px 12px; margin-bottom:14px; font-size:12.5px; color:#fde047; line-height:1.4;">
        ⚠ <strong>Screening Decision Support Only:</strong> This tool assists community healthcare workers and parents. It is not an autonomous medical diagnostic device.
      </div>
      <label class="consent-checkbox-wrap">
        <input type="checkbox" id="consent-check">
        <span>I understand and agree to data collection and analysis for child malnutrition screening purposes.</span>
      </label>
      <button class="primary btn" id="consent-submit-btn" disabled>Continue to Application →</button>
      <p id="consent-error" style="color:#ef4444; font-size:12px; margin-top:8px; display:none; text-align:center;"></p>
    </div>
  `;
  document.body.appendChild(backdrop);

  const check = document.getElementById('consent-check');
  const btn = document.getElementById('consent-submit-btn');
  const err = document.getElementById('consent-error');

  check.addEventListener('change', () => {
    btn.disabled = !check.checked;
  });

  btn.addEventListener('click', async () => {
    try {
      btn.disabled = true;
      btn.textContent = 'Saving consent...';
      const updated = await API.post('/api/auth/consent', { consent_agreed: true });
      if (user) {
        user.consent_given = true;
        user.consent_date = updated.consent_date || new Date().toISOString();
      }
      backdrop.remove();
    } catch (e) {
      btn.disabled = false;
      btn.textContent = 'Continue to Application →';
      err.textContent = e.message || 'Failed to record consent. Please try again.';
      err.style.display = 'block';
    }
  });
}

// Bind logout buttons
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[id="logout-btn"], [data-logout]').forEach(btn => {
    btn.addEventListener('click', async () => {
      try { await API.post('/api/auth/logout', {}); } catch {}
      _cachedUser = null;
      location.href = '/login.html';
    });
  });
});
