const flowData = {
  welcome: {
    kicker: "FLOW 01 — ACQUISITION",
    title: "Bienvenue",
    goal: "Transformer une inscription récente en première commande sans envoyer immédiatement une avalanche de promotions.",
    trigger: "Inscription à la liste principale",
    exit: "Commande passée",
    kpi: "Conversion première commande",
    tip: "Livre la promesse dans le premier email. Le second explique pourquoi la marque mérite l’attention.",
    nodes: [["⚡","Déclencheur","Inscription liste","T+0"],["✉","Email 1","Promesse + code","immédiat"],["⏱","Attente","Laisser découvrir","J+2"],["✉","Email 2","Preuve + best-seller","J+2"],["✉","Email 3","Rappel honnête","J+4"]]
  },
  checkout: {
    kicker: "FLOW 02 — CONVERSION",
    title: "Checkout abandonné",
    goal: "Aider une personne qui a commencé à payer mais n’a pas finalisé, en supprimant les vraies objections.",
    trigger: "Started Checkout",
    exit: "Placed Order",
    kpi: "Commandes récupérées",
    tip: "Le premier rappel peut être utile sans remise. Garde l’incitation pour plus tard si ta marge le permet.",
    nodes: [["⚡","Déclencheur","Checkout commencé","T+0"],["⏱","Attente","Éviter la collision","2–4 h"],["✉","Email 1","Panier + aide","J0"],["✉","Email 2","Preuve + réponses","J+1"],["✉","Email 3","Dernier rappel","J+2"]]
  },
  browse: {
    kicker: "FLOW 03 — INTENTION",
    title: "Navigation abandonnée",
    goal: "Ramener une personne identifiée vers un produit consulté, sans prétendre qu’elle avait déjà décidé d’acheter.",
    trigger: "Viewed Product",
    exit: "Started Checkout ou Placed Order",
    kpi: "Retour vers le produit",
    tip: "Réserve ce flow aux profils assez engagés et limite la fréquence. Une simple vue produit reste un signal faible.",
    nodes: [["⚡","Déclencheur","Produit consulté","T+0"],["⌁","Filtre","Profil engagé","check"],["⏱","Attente","Laisser comparer","4–8 h"],["✉","Email 1","Produit + bénéfice","J0"],["✉","Email 2","Preuve / alternative","J+2"]]
  },
  post: {
    kicker: "FLOW 04 — EXPÉRIENCE",
    title: "Après achat",
    goal: "Réduire l’incertitude, améliorer l’usage du produit et préparer la prochaine commande au bon moment.",
    trigger: "Placed Order ou Fulfilled Order",
    exit: "Selon produit et prochaine commande",
    kpi: "Réachat et satisfaction",
    tip: "Avant de revendre, aide le client à réussir son premier usage. La fidélité commence par une bonne expérience.",
    nodes: [["⚡","Déclencheur","Commande passée","T+0"],["✉","Email 1","Merci + attentes","immédiat"],["✉","Email 2","Conseils d’usage","J+3"],["✉","Email 3","Avis / support","J+10"],["✉","Email 4","Complément logique","selon usage"]]
  },
  winback: {
    kicker: "FLOW 05 — RÉTENTION",
    title: "Winback",
    goal: "Réactiver un client au moment où un nouveau besoin devient plausible, selon le cycle réel du produit.",
    trigger: "Délai depuis la dernière commande",
    exit: "Placed Order",
    kpi: "Clients réactivés",
    tip: "Le bon délai dépend du produit. Un consommable de 30 jours et un meuble ne partagent pas le même calendrier.",
    nodes: [["⚡","Déclencheur","Dernier achat","J0"],["⏱","Attente","Cycle produit","variable"],["✉","Email 1","Rappel du besoin","D0"],["✉","Email 2","Nouveauté / preuve","D+4"],["✉","Email 3","Dernier contact","D+8"]]
  }
};

const totalSteps = 12;
const stepKey = "focus-ku-steps";
const checkKey = "focus-ku-checks";
const cards = [...document.querySelectorAll(".module-card")];
let doneSteps = new Set(JSON.parse(localStorage.getItem(stepKey) || "[]"));

function renderProgress() {
  const done = doneSteps.size;
  const percent = Math.round((done / totalSteps) * 100);
  document.getElementById("headerDone").textContent = done;
  document.getElementById("doneCount").textContent = done;
  document.getElementById("leftCount").textContent = totalSteps - done;
  document.getElementById("progressPercent").textContent = `${percent}%`;
  document.getElementById("progressTrack").style.width = `${percent}%`;
  const titles = done === 0 ? "Construis le socle." : done < 3 ? "Rends les signaux visibles." : done < 6 ? "Transforme l’intérêt en commande." : done < 9 ? "Augmente la valeur du panier." : done < 12 ? "Prépare le prochain achat." : "La boucle de croissance est active.";
  document.getElementById("progressTitle").textContent = titles;
  const currentStage = Math.min(3, Math.floor(done / 3));
  document.querySelectorAll(".journey-stop").forEach((stop, index) => {
    stop.classList.toggle("passed", index < currentStage || done === totalSteps);
    stop.classList.toggle("current", index === currentStage && done < totalSteps);
  });
  cards.forEach(card => {
    const isDone = doneSteps.has(card.dataset.step);
    card.classList.toggle("done", isDone);
    card.lastElementChild.textContent = isDone ? "✓" : "+";
  });
}

cards.forEach(card => card.addEventListener("click", () => {
  const step = card.dataset.step;
  doneSteps.has(step) ? doneSteps.delete(step) : doneSteps.add(step);
  localStorage.setItem(stepKey, JSON.stringify([...doneSteps]));
  renderProgress();
}));

document.getElementById("resetProgress").addEventListener("click", () => {
  doneSteps = new Set();
  localStorage.removeItem(stepKey);
  renderProgress();
});

function renderFlow(name) {
  const flow = flowData[name];
  document.getElementById("flowKicker").textContent = flow.kicker;
  document.getElementById("flowTitle").textContent = flow.title;
  document.getElementById("flowGoal").textContent = flow.goal;
  document.getElementById("flowTrigger").textContent = flow.trigger;
  document.getElementById("flowExit").textContent = flow.exit;
  document.getElementById("flowKpi").textContent = flow.kpi;
  document.getElementById("flowTip").textContent = flow.tip;
  document.getElementById("flowCanvas").innerHTML = flow.nodes.map(node => `<div class="flow-node"><i>${node[0]}</i><div><small>${node[1]}</small><b>${node[2]}</b></div><span>${node[3]}</span></div>`).join("");
}

document.querySelectorAll(".flow-tabs button").forEach(button => button.addEventListener("click", () => {
  document.querySelectorAll(".flow-tabs button").forEach(item => item.classList.remove("active"));
  button.classList.add("active");
  renderFlow(button.dataset.flow);
}));

function updateCalculator() {
  const orders = Number(document.getElementById("ordersInput").value) || 0;
  const aov = Number(document.getElementById("aovInput").value) || 0;
  const lift = Number(document.getElementById("liftInput").value) || 0;
  const margin = Number(document.getElementById("marginInput").value) || 0;
  const value = orders * aov * (lift / 100);
  const marginValue = value * (margin / 100);
  document.getElementById("revenueResult").textContent = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value);
  document.getElementById("marginResult").textContent = `≈ ${new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(marginValue)} de marge brute`;
}
document.querySelectorAll("#aovCalculator input").forEach(input => input.addEventListener("input", updateCalculator));

const maturitySteps = [
  ["Fiabiliser les fondations", "Commence par la connexion, les événements et le consentement avant de créer des campagnes."],
  ["Construire la capture", "Publie une promesse claire, vérifie le consentement puis livre immédiatement ce qui a été promis."],
  ["Activer les flows prioritaires", "Lance Welcome, abandon de checkout et après-achat avant d’ajouter des scénarios avancés."],
  ["Valider une offre dans l’app Upsell", "Choisis un seul couple produit × complément, protège la marge et teste le parcours Shopify complet."],
  ["Installer le rituel de pilotage", "Observe chaque semaine la qualité d’envoi, la conversion, l’AOV et la marge incrémentale."],
  ["Optimiser avec méthode", "Les fondations sont en place : formule une hypothèse, change une variable et documente la décision."]
];
const maturityInputs = [...document.querySelectorAll("#maturityChecks input")];
function updateMaturity() {
  const completed = maturityInputs.filter(input => input.checked).length;
  document.getElementById("maturityResult").textContent = maturitySteps[completed][0];
  document.getElementById("maturityAdvice").textContent = maturitySteps[completed][1];
}
maturityInputs.forEach(input => input.addEventListener("change", updateMaturity));

const toast = document.getElementById("toast");
let toastTimer;
document.querySelectorAll(".copy-button").forEach(button => button.addEventListener("click", async () => {
  const card = button.closest(".copy-card");
  const text = `${card.querySelector("p").innerText}\n${card.querySelector("footer").innerText}`;
  try { await navigator.clipboard.writeText(text); } catch { /* clipboard may require https */ }
  button.textContent = "Copié ✓";
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.classList.remove("show"); button.textContent = "Copier"; }, 1800);
}));

const savedChecks = new Set(JSON.parse(localStorage.getItem(checkKey) || "[]"));
document.querySelectorAll("#launchChecklist input").forEach(input => {
  input.checked = savedChecks.has(input.dataset.check);
  input.addEventListener("change", () => {
    input.checked ? savedChecks.add(input.dataset.check) : savedChecks.delete(input.dataset.check);
    localStorage.setItem(checkKey, JSON.stringify([...savedChecks]));
  });
});

const menuButton = document.getElementById("menuButton");
const mainNav = document.getElementById("mainNav");
menuButton.addEventListener("click", () => {
  const open = mainNav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.textContent = open ? "×" : "☰";
});
mainNav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  mainNav.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.textContent = "☰";
}));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add("visible"); revealObserver.unobserve(entry.target); } });
}, { threshold: .08, rootMargin: "0px 0px -45px" });
document.querySelectorAll(".reveal").forEach(item => revealObserver.observe(item));

function updateReadingBar() {
  const max = document.documentElement.scrollHeight - innerHeight;
  const value = max > 0 ? (scrollY / max) * 100 : 0;
  document.getElementById("readingBar").style.width = `${value}%`;
  document.getElementById("backToTop").classList.toggle("visible", scrollY > 700);
}
addEventListener("scroll", updateReadingBar, { passive: true });

document.getElementById("backToTop").addEventListener("click", () => {
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
});

renderProgress();
renderFlow("welcome");
updateCalculator();
updateReadingBar();
