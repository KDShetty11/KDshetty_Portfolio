/* ===========================================================
   KD-SHELL — client-side terminal assistant (no backend)
   Answers recruiter questions about Deekshith from a curated KB.
   Self-mounts on any page that includes this script.
   =========================================================== */
(function () {
  'use strict';

  // ---- Knowledge base: keyword triggers -> answer (HTML allowed, author-controlled) ----
  var KB = [
    { id: 'whoami', keys: ['whoami', 'who are you', 'about', 'summary', 'intro', 'yourself', 'bio'],
      a: "<b>Kurudunje Deekshith Shetty</b> — security engineer who builds and runs security programs end to end. Currently the <b>sole security engineer</b> for a HIPAA-attested healthcare SaaS, owning cloud + identity (AWS & Azure), application & LLM security, and SOC 2 / HIPAA compliance. Previously 2.5 years as an L2 SOC escalation point & shift lead at an MSSP. M.Sc. Cybersecurity & Privacy, NJIT (3.9 GPA)." },

    { id: 'cloud', keys: ['cloud', 'aws', 'azure', 'infrastructure', 'infra', 'terraform', 'network', 'vpc', 'kms'],
      a: "<b>Cloud & Infrastructure:</b> I own the AWS + Azure estate end to end, as code with Terraform — private-subnet networking where nothing in the data path is internet-reachable, default-deny WAF, KMS encryption throughout, GuardDuty/Macie/Security Hub continuous monitoring, and tamper-proof write-once audit logging across control planes. Deep-dive: <a href='work/cloud-infrastructure/'>cloud-infrastructure</a>." },

    { id: 'appsec', keys: ['appsec', 'application', 'app security', 'owasp', 'auth', 'jwt', 'csrf', 'xss', 'code review', 'sast', 'dast'],
      a: "<b>Application Security:</b> Re-architected platform auth (browser-stored JWTs → HttpOnly cookies, algorithm pinning, stateless revocation), built reusable CSRF / PHI-audit / tenant-scoping middleware, and reviewed the codebase against a decade of OWASP Top 10 + the OWASP LLM Top 10 — then took it through a third-party pentest with <b>no critical or high findings</b>. Deep-dive: <a href='work/application-security/'>application-security</a>." },

    { id: 'llm', keys: ['llm', 'ai', 'ml', 'clara', 'agent', 'prompt injection', 'bedrock', 'mcp', 'genai'],
      a: "<b>AI / LLM Security:</b> Secured a healthcare LLM agent + its tool/MCP layer — layered role/org/conversation permissions, <b>tenant isolation enforced beneath the model</b> so generated queries can't escape the caller's org, indirect-prompt-injection defense, and HIPAA Safe Harbor PHI redaction, all enforced by a test suite. Deep-dive: <a href='work/ai-llm-security/'>ai-llm-security</a>." },

    { id: 'devsecops', keys: ['devsecops', 'ci', 'cd', 'cicd', 'pipeline', 'supply chain', 'identity', 'oidc', 'iam', 'zero standing', 'sso', 'intune'],
      a: "<b>DevSecOps & Identity:</b> SAST/DAST/secret-scanning gates across the org, keyless CI via GitHub OIDC (no long-lived keys), and a zero-standing-admin design on AWS Identity Center + OIDC that contains a worst-case breach to a single short-lived role. Also run Entra ID / Intune / M365 access. Deep-dive: <a href='work/devsecops-identity/'>devsecops-identity</a>." },

    { id: 'compliance', keys: ['compliance', 'soc2', 'soc 2', 'hipaa', 'nist', 'risk', 'audit', 'iso', 'hitrust', 'governance', 'bcdr'],
      a: "<b>Compliance & Risk:</b> Built the SOC 2 / HIPAA control matrix from nothing across AWS, Azure/Entra, MongoDB & GitHub — risk assessment (NIST SP 800-30), policy + continuity program (incident response, BCDR, escrow), and automated evidence. The platform is <b>independently HIPAA-attested</b> (third-party AICPA-affiliated firm); SOC 2 Type II is in progress. Deep-dive: <a href='work/compliance-risk/'>compliance-risk</a>." },

    { id: 'secops', keys: ['soc', 'secops', 'detection', 'incident', 'ir', 'forensics', 'siem', 'edr', 'xdr', 'ndr', 'terralogic', 'mssp', 'ransomware', 'threat'],
      a: "<b>Security Operations & IR:</b> 2.5 years at an MSSP as an L2 escalation point & shift lead — deployed and correlated the full stack (EDR, SIEM/XDR, NGFW, NAC, NDR) for enterprise clients, cut false positives by more than half, and led ransomware investigations end to end (containment, memory/disk forensics, RCA). Deep-dive: <a href='work/security-operations/'>security-operations</a>." },

    { id: 'skills', keys: ['skills', 'stack', 'tools', 'tech', 'technologies', 'languages', 'programming'],
      a: "<b>Core stack:</b> AWS (IAM, Identity Center, GuardDuty, Security Hub, Macie, KMS, ECS, WAF), Terraform, Entra ID / Intune / M365; OWASP / threat modeling / SAST-DAST (Semgrep, ZAP, Burp); SIEM/XDR/EDR/NDR (LogRhythm, Stellar Cyber, SentinelOne, Darktrace), NGFW + NAC; SOC 2 / HIPAA / NIST. Languages: Python, Bash, PowerShell, JS/TS, SQL. Type <b>skills cloud</b>, <b>skills appsec</b>, etc. for detail." },

    { id: 'experience', keys: ['experience', 'work', 'career', 'history', 'roles', 'job', 'medlaunch'],
      a: "<b>Experience:</b> Medlaunch Concepts — Lead Cybersecurity/Cloud Specialist & sole security engineer (2026–present, promoted from intern). Terralogic — Cyber Security Analyst, MSSP SOC, L2 shift lead (2021–2023). Full timeline: <a href='#experience'>#experience</a>." },

    { id: 'education', keys: ['education', 'degree', 'school', 'university', 'njit', 'masters', 'gpa', 'college'],
      a: "<b>Education:</b> M.Sc. in Cybersecurity & Privacy, New Jersey Institute of Technology (3.9 GPA, completed Dec 2025). B.Tech in ECE (Cloud & IoT), Vellore Institute of Technology." },

    { id: 'certs', keys: ['cert', 'certs', 'certification', 'security+', 'comptia', 'fortinet'],
      a: "<b>Certifications:</b> CompTIA Security+ (SY0-702), Fortinet NSE 5 — FortiSIEM, Stellar Cyber XDR Associate." },

    { id: 'pentest', keys: ['pentest', 'penetration', 'pen test', 'vapt', 'result'],
      a: "<b>Pentest:</b> Led a HIPAA platform through its first independent third-party penetration test — result: <b>0 Critical, 0 High</b>, and no PHI exposed. The two medium findings were resolved within the next cycle." },

    { id: 'contact', keys: ['contact', 'hire', 'email', 'reach', 'linkedin', 'github', 'connect', 'available'],
      a: "<b>Get in touch:</b> <a href='mailto:k.deekshithshetty@gmail.com'>k.deekshithshetty@gmail.com</a> · <a href='https://www.linkedin.com/in/kdshetty/' target='_blank' rel='noopener'>LinkedIn</a> · <a href='https://github.com/KDShetty11' target='_blank' rel='noopener'>GitHub</a>." },

    { id: 'resume', keys: ['resume', 'cv', 'download'],
      a: "<b>Resume:</b> <a href='Kurudunje_Deekshith_CV_Lead_Cybersecurity_and_Cloud_Specialist.pdf' download>download the PDF &darr;</a>" },

    { id: 'projects', keys: ['projects', 'work samples', 'case study', 'case studies', 'domains', 'portfolio'],
      a: "I work across six security domains — each has a deep-dive: <a href='work/cloud-infrastructure/'>cloud</a>, <a href='work/application-security/'>appsec</a>, <a href='work/ai-llm-security/'>ai/llm</a>, <a href='work/devsecops-identity/'>devsecops</a>, <a href='work/compliance-risk/'>compliance</a>, <a href='work/security-operations/'>secops</a>." },

    { id: 'different', keys: ['different', 'stand out', 'why you', 'unique', 'special', 'best fit', 'why hire'],
      a: "What's unusual is the <b>breadth held by one person</b>: I've personally built and run cloud, application, LLM, DevSecOps, identity, compliance, and SOC/IR — from a multi-tenant MSSP across the full tool stack to being the <b>sole</b> security engineer who took a HIPAA platform to attestation and a clean pentest. I don't hand security to another team; I design it, build it, deploy it, and operate it." },

    { id: 'principles', keys: ['principle', 'principles', 'approach', 'philosophy', 'mindset', 'how do you work', 'how you work', 'values'],
      a: "My operating principles: <b>assume breach</b> (design so one compromise stays small), <b>least privilege by default</b> (zero standing admin), <b>shift left, prove right</b> (security in the SDLC, evidence over assertion), and <b>make the secure path the easy path</b> (controls developers adopt, not fight)." },

    { id: 'leadership', keys: ['leadership', 'lead', 'mentor', 'team', 'manage', 'ownership', 'shift lead'],
      a: "I led real-time SOC operations as an L2 shift lead and escalation point, authored ATT&CK-mapped playbooks, and mentored junior analysts. At Medlaunch I own the whole security function solo — partnering directly with backend, frontend, and AI teams rather than gatekeeping from the outside." },

    { id: 'achievement', keys: ['achievement', 'proud', 'biggest', 'accomplishment', 'impact', 'highlight', 'best work'],
      a: "Taking a HIPAA healthcare platform from <b>no security program</b> to an <b>independent HIPAA attestation</b> and a third-party pentest with <b>0 critical / 0 high</b> — as the only security engineer, while keeping the product shipping. That's program-building, not just control-tuning." },

    { id: 'location', keys: ['location', 'based', 'where', 'relocation', 'remote', 'hybrid', 'available', 'availability', 'open to'],
      a: "Based in <b>Jersey City, NJ</b> (US) — open to remote or hybrid for the right role. Best way to start a conversation is <a href='mailto:k.deekshithshetty@gmail.com'>email</a> or <a href='https://www.linkedin.com/in/kdshetty/' target='_blank' rel='noopener'>LinkedIn</a>." },

    { id: 'hire', keys: ['hire', 'hiring', 'recruit', 'opportunity', 'role', 'position', 'offer'],
      a: "Happy to talk about the right senior security engineering opportunity. Reach Deekshith at <a href='mailto:k.deekshithshetty@gmail.com'>k.deekshithshetty@gmail.com</a> or <a href='https://www.linkedin.com/in/kdshetty/' target='_blank' rel='noopener'>LinkedIn</a>." }
  ];

  var SUGGEST = ['whoami', 'what makes you different', 'cloud', 'appsec', 'ai/llm', 'pentest', 'principles', 'contact'];

  function pageBase() {
    // work/<slug>/ pages are two levels deep; rewrite relative links accordingly
    return /\/work\//.test(location.pathname) ? '../../' : '';
  }
  function rebase(html) {
    var b = pageBase();
    if (!b) return html;
    // prefix root-relative resource links (work/, the PDF) — leave #, http, mailto alone
    return html
      .replace(/href='(work\/)/g, "href='" + b + "$1")
      .replace(/href='(Kurudunje_)/g, "href='" + b + "$1")
      .replace(/href='#/g, "href='" + b + "index.html#");
  }

  function answer(q) {
    var query = q.toLowerCase().trim();
    if (!query) return null;
    if (query.indexOf('sudo') === 0) return "Permission denied &mdash; nice try. &#128274; (this attempt has been logged.)";
    if (query === 'hi' || query === 'hello' || query === 'hey') return "Hey &#128075; &mdash; ask me about Deekshith's work, or type <b>help</b>.";
    if (query.indexOf('coffee') !== -1) return "&#9749; 418: I'm a teapot. (Deekshith runs on it, though.)";
    if (query === 'help' || query === '?' || query === 'commands')
      return "Ask me about Deekshith. Try: <b>whoami</b>, <b>cloud</b>, <b>appsec</b>, <b>ai/llm</b>, <b>devsecops</b>, <b>compliance</b>, <b>secops</b>, <b>skills</b>, <b>experience</b>, <b>education</b>, <b>certs</b>, <b>pentest</b>, <b>resume</b>, <b>contact</b>. Commands: <b>ls</b>, <b>clear</b>.";
    if (query === 'ls')
      return "about.md  experience.log  cloud/  appsec/  ai-llm/  devsecops/  compliance/  secops/  skills.txt  resume.pdf  contact.vcf";
    // score KB entries by keyword hits
    var best = null, bestScore = 0;
    for (var i = 0; i < KB.length; i++) {
      var score = 0, e = KB[i];
      for (var k = 0; k < e.keys.length; k++) {
        if (query.indexOf(e.keys[k]) !== -1) score += e.keys[k].length; // longer match = stronger
      }
      // token overlap as a weaker signal
      query.split(/\s+/).forEach(function (w) {
        if (w.length > 2 && e.keys.some(function (kk) { return kk.indexOf(w) !== -1; })) score += 1;
      });
      if (score > bestScore) { bestScore = score; best = e; }
    }
    if (best && bestScore > 0) return best.a;
    return "Not sure about that one. Type <b>help</b> for what I can answer — or just ask about cloud, appsec, AI/LLM, devsecops, compliance, secops, or how to <b>contact</b> Deekshith.";
  }

  // ---- DOM ----
  function el(tag, cls, html) { var n = document.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; }

  function mount() {
    if (document.getElementById('kd-bot')) return;

    var toggle = el('button', null, "<span class='blip'></span> ./ask-me");
    toggle.id = 'kd-bot-toggle';
    toggle.setAttribute('aria-label', 'Open terminal assistant');

    var bot = el('div'); bot.id = 'kd-bot';
    bot.innerHTML =
      "<div class='kd-bot-head'>" +
        "<span class='term-dot r'></span><span class='term-dot y'></span><span class='term-dot g'></span>" +
        "<span class='term-title'>kd-shell — ask about Deekshith</span>" +
        "<button class='kd-bot-close' aria-label='Close'>&times;</button>" +
      "</div>" +
      "<div class='kd-bot-log' id='kd-log'></div>" +
      "<form class='kd-bot-form' id='kd-form' autocomplete='off'>" +
        "<span class='pmt'>&gt;</span>" +
        "<input class='kd-bot-input' id='kd-input' placeholder='ask me anything about Deekshith...' aria-label='Ask the assistant'>" +
      "</form>";

    document.body.appendChild(toggle);
    document.body.appendChild(bot);

    var log = bot.querySelector('#kd-log');
    var form = bot.querySelector('#kd-form');
    var input = bot.querySelector('#kd-input');
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function scroll() { log.scrollTop = log.scrollHeight; }
    function addUser(t) { var n = el('div', 'kd-line user'); n.textContent = t; log.appendChild(n); scroll(); }
    function addSys(t) { var n = el('div', 'kd-line sys', t); log.appendChild(n); scroll(); }

    function addBot(html) {
      html = rebase(html);
      var n = el('div', 'kd-line bot'); log.appendChild(n);
      if (reduce) { n.innerHTML = html; scroll(); return; }
      // typewriter that preserves HTML tags
      var i = 0, out = '';
      (function tick() {
        if (i >= html.length) { n.innerHTML = html; scroll(); return; }
        if (html[i] === '<') { var j = html.indexOf('>', i); out += html.slice(i, j + 1); i = j + 1; }
        else { out += html[i]; i++; }
        n.innerHTML = out + "<span class='kd-cursor'></span>";
        scroll();
        setTimeout(tick, 6);
      })();
    }

    function addChips() {
      var wrap = el('div', 'kd-chips');
      SUGGEST.forEach(function (s) {
        var c = el('span', 'kd-chip', s);
        c.addEventListener('click', function () { run(s); });
        wrap.appendChild(c);
      });
      log.appendChild(wrap); scroll();
    }

    function run(q) {
      if (q.toLowerCase().trim() === 'clear') { log.innerHTML = ''; greet(); return; }
      addUser(q);
      var a = answer(q);
      if (a) setTimeout(function () { addBot(a); }, 120);
    }

    var greeted = false;
    function greet() {
      addSys("kd-shell v1.0 — type <b>help</b> or pick a topic:");
      addBot("Hi — I'm Deekshith's terminal assistant. Ask me about his work, skills, or how to reach him.");
      addChips();
      greeted = true;
    }

    function open() { bot.classList.add('open'); if (!greeted) greet(); setTimeout(function () { input.focus(); }, 80); }
    function close() { bot.classList.remove('open'); }

    toggle.addEventListener('click', function () { bot.classList.contains('open') ? close() : open(); });
    bot.querySelector('.kd-bot-close').addEventListener('click', close);
    form.addEventListener('submit', function (e) { e.preventDefault(); var v = input.value; input.value = ''; if (v.trim()) run(v); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        bot.classList.contains('open') ? close() : open();
      }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
