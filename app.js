const SUPABASE_URL = "https://YOUR_PROJECT.supabase.co";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

let supabase = null;
let mode = "login";
const modal = document.querySelector("#auth-modal");
const profileModal = document.querySelector("#profile-modal");
const form = document.querySelector("#auth-form");
const message = document.querySelector("#form-message");
const nameWrap = document.querySelector("#name-wrap");
const password = document.querySelector("#password");

function showModal(kind) {
  if (kind === "profile") {
    modal.classList.remove("open");
    profileModal.classList.add("open");
    profileModal.setAttribute("aria-hidden", "false");
    return;
  }
  setMode(kind);
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.querySelector("#email").focus();
}
function closeModals() {
  [modal, profileModal].forEach(el => {
    el.classList.remove("open");
    el.setAttribute("aria-hidden", "true");
  });
}
function setMode(next) {
  mode = next;
  document.querySelectorAll("[data-tab]").forEach(btn => btn.classList.toggle("active", btn.dataset.tab === mode));
  nameWrap.classList.toggle("hidden", mode !== "register");
  document.querySelector("#auth-title").innerHTML = mode === "register" ? "Mulai perjalanan<br><em>barumu.</em>" : "Senang bertemu<br><em>denganmu.</em>";
  document.querySelector("#submit-auth").innerHTML = (mode === "register" ? "Buat akun" : "Masuk") + " <span>→</span>";
  password.autocomplete = mode === "register" ? "new-password" : "current-password";
  message.textContent = "";
}
function say(text) { message.textContent = text; }

document.querySelectorAll("[data-open]").forEach(btn => btn.addEventListener("click", () => showModal(btn.dataset.open)));
document.querySelectorAll("[data-close]").forEach(btn => btn.addEventListener("click", closeModals));
document.querySelectorAll("[data-tab]").forEach(btn => btn.addEventListener("click", () => setMode(btn.dataset.tab)));
document.addEventListener("keydown", event => { if (event.key === "Escape") closeModals(); });

async function connectAuth() {
  if (SUPABASE_URL.includes("YOUR_PROJECT") || SUPABASE_ANON_KEY.includes("YOUR_SUPABASE")) return;
  try {
    const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2");
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data: { session } } = await supabase.auth.getSession();
    if (session) showProfile(session.user);
    supabase.auth.onAuthStateChange((_event, sessionNow) => {
      if (sessionNow) showProfile(sessionNow.user);
      else closeModals();
    });
  } catch (error) {
    console.error("Auth initialization failed:", error);
  }
}
function showProfile(user) {
  document.querySelector("#profile-email").textContent = user.email || "Akun pengguna";
  showModal("profile");
}

form.addEventListener("submit", async event => {
  event.preventDefault();
  if (!supabase) {
    say("Autentikasi belum dihubungkan. Isi URL dan anon key Supabase di app.js terlebih dahulu.");
    return;
  }
  const email = document.querySelector("#email").value.trim();
  const pass = password.value;
  const submit = document.querySelector("#submit-auth");
  submit.disabled = true;
  say(mode === "register" ? "Sedang membuat akun..." : "Sedang masuk...");
  try {
    if (mode === "register") {
      const displayName = document.querySelector("#display-name").value.trim();
      if (displayName.length < 2) throw new Error("Nama pengguna minimal 2 karakter.");
      const { data, error } = await supabase.auth.signUp({
        email, password: pass, options: { data: { display_name: displayName } }
      });
      if (error) throw error;
      if (data.session) showProfile(data.user);
      else say("Pendaftaran berhasil. Periksa email untuk verifikasi akun.");
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
      if (error) throw error;
      if (data.user) showProfile(data.user);
    }
  } catch (error) {
    say(error.message || "Terjadi kesalahan. Coba lagi.");
  } finally {
    submit.disabled = false;
  }
});

document.querySelector("#sign-out").addEventListener("click", async () => {
  if (!supabase) return;
  const { error } = await supabase.auth.signOut();
  if (error) document.querySelector("#profile-email").textContent = error.message;
  else closeModals();
});

connectAuth();