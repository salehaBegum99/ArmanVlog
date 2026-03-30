import { useState, useEffect } from "react";

const URL = "armanvlogs.vercel.app";

// Keyframe animations as CSS
const keyframes = `
  @keyframes floatGlow {
    0%, 100% { transform: translateY(0px); opacity: 0.6; }
    50% { transform: translateY(-8px); opacity: 0.8; }
  }
  
  @keyframes shimmer {
    0% { background-position: -1000px 0; }
    100% { background-position: 1000px 0; }
  }
  
  @keyframes slideInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes slideInDown {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
  }
  
  @keyframes gradientShift {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
  
  @keyframes rotateGlow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  @keyframes cardHoverGlow {
    0% { box-shadow: 0 0 20px rgba(220,160,0,0.1); }
    50% { box-shadow: 0 0 40px rgba(220,160,0,0.2); }
    100% { box-shadow: 0 0 20px rgba(220,160,0,0.1); }
  }
  
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
  
  @media (max-width: 768px) {
    .hide-mobile { display: none !important; }
  }
  
  @media (min-width: 769px) {
    .show-mobile { display: none !important; }
  }
`;

// Inject styles
const styleSheet = document.createElement("style");
styleSheet.textContent = keyframes;
if (typeof document !== "undefined" && !document.querySelector("style[data-injected]")) {
  document.head.appendChild(styleSheet);
  styleSheet.dataset.injected = "true";
}

const VIDEOS = [
  { id: 1, emoji: "🎡", title: "Niloufer — Hyderabad's Hidden Gem", views: "2.1L", duration: "12:34", tag: "Hidden Places", bg: "linear-gradient(135deg,#1a1200,#2a1f00)", url: "https://www.youtube.com/shorts/example1", trending: true },
  { id: 2, emoji: "🎢", title: "Wonderla Full Experience — Worth It?", views: "1.8L", duration: "18:22", tag: "Review", bg: "linear-gradient(135deg,#001a10,#002a1a)", url: "https://www.youtube.com/shorts/example2" },
  { id: 3, emoji: "🍜", title: "Best Irani Chai Spots in Old City", views: "3.2L", duration: "9:15", tag: "Food", bg: "linear-gradient(135deg,#1a0800,#2a1400)", url: "https://www.youtube.com/shorts/example3", trending: true },
  { id: 4, emoji: "🌆", title: "Charminar at 5AM — Nobody Talks About This", views: "4.5L", duration: "14:08", tag: "Hidden Places", bg: "linear-gradient(135deg,#0a0a1a,#12122a)", url: "https://www.youtube.com/shorts/example4" },
  { id: 5, emoji: "🏍️", title: "Solo Ride to Bhongir Fort — ₹200 Trip", views: "1.2L", duration: "21:40", tag: "Travel", bg: "linear-gradient(135deg,#0d1a00,#162600)", url: "https://www.youtube.com/shorts/example5" },
  { id: 6, emoji: "⚡", title: "SmartX — Mera Honest Review", views: "98K", duration: "8:55", tag: "Collab", bg: "linear-gradient(135deg,#110a00,#1f1200)", url: "https://www.youtube.com/shorts/example6", smartx: true },
];

const COLLABS = [
  { name: "Cashify", type: "Tech Resale", icon: "📱", year: "2024", active: false },
  { name: "SmartX", type: "Smart Gadgets", icon: "⚡", year: "2025", active: true },
];

const TABS = [
  { id: "Home", icon: "⌂" },
  { id: "Videos", icon: "▶" },
  { id: "Collabs", icon: "★" },
  { id: "Contact", icon: "✉" },
];

const C = {
  // Primary colors
  gold: "#ffd700", goldLight: "#ffed4e",
  goldDim: "rgba(255,215,0,0.15)", goldBorder: "rgba(255,215,0,0.35)",
  
  // Dark palette
  dark: "#0a0a0a", dark2: "#111111", dark3: "#1a1a1a", dark4: "#242424",
  
  // Text colors
  text: "#f5f5f5", textAlt: "#ffffff",
  muted: "rgba(245,245,245,0.65)", dim: "rgba(245,245,245,0.35)",
  
  // Borders
  border: "rgba(255,255,255,0.08)", borderMid: "rgba(255,255,255,0.12)", borderHi: "rgba(255,255,255,0.18)",
  
  // Accent colors
  green: "#2ecc71", cyan: "#00d4ff", pink: "#ff006e", purple: "#b537f2",
  
  // Gradients
  gradient1: "linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)",
  gradient2: "linear-gradient(135deg, #00d4ff 0%, #0099ff 100%)",
  gradient3: "linear-gradient(135deg, #ff006e 0%, #ff4d8e 100%)",
};

export default function App() {
  const [tab, setTab] = useState("Home");
  const [hoveredVideo, setHoveredVideo] = useState(null);
  const [filter, setFilter] = useState("All");
  const [copied, setCopied] = useState(false);
  const [msgSent, setMsgSent] = useState(false);
  const [form, setForm] = useState({ name: "", brand: "", message: "" });
  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" ? window.innerWidth < 769 : false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 769);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const tags = ["All", ...Array.from(new Set(VIDEOS.map(v => v.tag)))];
  const filtered = filter === "All" ? VIDEOS : VIDEOS.filter(v => v.tag === filter);

  const handleCopy = () => {
    navigator.clipboard?.writeText(URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSend = () => {
    if (!form.name || !form.brand) return;
    setMsgSent(true);
    setTimeout(() => { setMsgSent(false); setForm({ name: "", brand: "", message: "" }); }, 3000);
  };

  if (isMobile) {
    // MOBILE VIEW - Phone frame
    return (
      <div style={s.page}>
        <div style={s.phone}>

        {/* ── STATUS BAR ── */}
        <div style={s.statusBar}>
          <span style={s.statusTime}>9:41</span>
          <div style={s.notch} />
          <div style={s.statusRight}>
            <span style={s.statusIco}>●●●</span>
            <span style={s.statusIco}>WiFi</span>
            <span style={s.statusBatt}>88%</span>
          </div>
        </div>

        {/* ── BROWSER BAR ── */}
        <div style={s.browserWrap}>
          <div style={s.browserBar} onClick={handleCopy}>
            <span style={s.browserLock}>🔒</span>
            <span style={s.browserUrl}>{URL}</span>
            <span style={s.browserShare}>{copied ? "✓ Copied" : "⎘"}</span>
          </div>
        </div>

        {/* ── MAIN CONTENT ── */}
        <div style={s.main}>

          {/* ════════ HOME ════════ */}
          {tab === "Home" && (
            <div style={s.scroll}>
              {/* Hero */}
              <div style={s.hero}>
                <div style={s.heroGlow} />
                <div style={s.avatarRing}>
                  <div style={s.avatar}>
                    {/*
                      REPLACE WITH PHOTO:
                      <img src="./arman.jpg" alt="Arman" style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:"50%"}} />
                    */}
                    <span style={{ color: C.gold, fontFamily: "serif", fontSize: 30 }}> </span>
                  </div>
                </div>
                <div style={s.liveTag}>
                  <span style={s.liveBullet} />
                  Active Creator
                </div>
                <h1 style={s.heroName}>Arman___ Vlogs</h1>
                <p style={s.heroAt}>@arman___vlogs</p>
                <p style={s.heroBio}>Pakka Hyderabadi 📍 · Hidden spots · Genuine reviews · Fayde waali reels</p>
                <div style={s.heroPills}>
                  <span style={s.pill}>Instagram</span>
                  <span style={s.pill}>YouTube</span>
                  <span style={{ ...s.pill, ...s.pillGold }}>Open to Collabs ✦</span>
                </div>
              </div>

              {/* Stats */}
              <div style={s.statsRow}>
                {[
                  { n: "60K", l: "Followers" },
                  { n: "4.5L+", l: "Top Views" },
                  { n: "8.4%", l: "Engagement" },
                  { n: "2+", l: "Collabs" },
                ].map((st, i) => (
                  <div key={st.l} style={{ ...s.statCell, ...(i < 3 ? { borderRight: `0.5px solid ${C.border}` } : {}) }}>
                    <span style={s.statN}>{st.n}</span>
                    <span style={s.statL}>{st.l}</span>
                  </div>
                ))}
              </div>

              {/* About */}
              <Section label="About">
                <p style={s.bodyText}>Hyderabad ka real explorer. Main woh jagahein dikhata hoon jo Google Maps pe nahi milti — aur reviews deta hoon jo sponsor ke baad bhi honest rehte hain.</p>
                <TagList tags={["Hidden Places", "Genuine Reviews", "Hyderabad Local", "Fayde Waali Reels", "Travel", "Food", "Lifestyle"]} />
              </Section>

              {/* Top video */}
              <Section label="Top Video">
                <VideoThumb video={VIDEOS[3]} large />
              </Section>

              {/* SmartX */}
              <div style={{ ...s.sectionCard, borderColor: C.goldBorder }}>
                <div style={s.sxTop}>
                  <span style={s.sxBadge}>⚡ SmartX Partner</span>
                  <span style={s.sxActive}>Active</span>
                </div>
                <p style={s.bodyText}>Arman ne SmartX ke products ko apni honest review series mein feature kiya hai — real audience, real impact.</p>
                <VideoThumb video={VIDEOS[5]} />
              </div>

              <Gap />
            </div>
          )}

          {/* ════════ VIDEOS ════════ */}
          {tab === "Videos" && (
            <div style={s.scroll}>
              <TabHeader title="All Videos" sub={`${VIDEOS.length} videos · Growing`} />

              {/* Filters */}
              <div style={s.filterRow}>
                {tags.map(t => (
                  <button key={t} style={{ ...s.filterChip, ...(filter === t ? s.filterOn : {}) }} onClick={() => setFilter(t)}>
                    {t}
                  </button>
                ))}
              </div>

              <div style={s.vList}>
                {filtered.map(v => (
                  <div
                    key={v.id}
                    style={{ ...s.vRow, ...(hoveredVideo === v.id ? s.vRowHover : {}) }}
                    onMouseEnter={() => setHoveredVideo(v.id)}
                    onMouseLeave={() => setHoveredVideo(null)}
                  >
                    <div style={{ ...s.vThumb, background: v.bg }}>
                      <span style={{ fontSize: 18, opacity: 0.3 }}>{v.emoji}</span>
                      <div style={s.vPlay}><div style={s.vTri} /></div>
                      <span style={s.vDur}>{v.duration}</span>
                    </div>
                    <div style={s.vInfo}>
                      <p style={s.vTitle}>{v.title}</p>
                      <div style={s.vMeta}>
                        <span style={s.vViews}>👁 {v.views}</span>
                        <span style={{ ...s.vTag, ...(v.smartx ? s.vTagGold : {}) }}>{v.tag}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Gap />
            </div>
          )}

          {/* ════════ COLLABS ════════ */}
          {tab === "Collabs" && (
            <div style={s.scroll}>
              <TabHeader title="Brand Collabs" sub="Trusted by real brands" />

              <Section label="Why brands choose Arman">
                {[
                  { icon: "🎯", t: "Hyper-local audience", d: "60K real Hyderabadis who act on recommendations" },
                  { icon: "💬", t: "8.4% engagement rate", d: "Well above industry average of 3–4%" },
                  { icon: "✅", t: "Honest reviews only", d: "His audience trusts him — that trust transfers to your brand" },
                  { icon: "📱", t: "Multi-platform reach", d: "YouTube + Instagram combined presence" },
                ].map((item, i, arr) => (
                  <div key={item.t} style={{ ...s.whyRow, ...(i < arr.length - 1 ? { borderBottom: `0.5px solid ${C.border}`, paddingBottom: 10 } : {}) }}>
                    <span style={s.whyIco}>{item.icon}</span>
                    <div>
                      <p style={s.whyT}>{item.t}</p>
                      <p style={s.whyD}>{item.d}</p>
                    </div>
                  </div>
                ))}
              </Section>

              <Section label="Past & Current Collabs">
                {COLLABS.map((c, i) => (
                  <div key={c.name} style={{ ...s.collabRow, ...(i < COLLABS.length - 1 ? { borderBottom: `0.5px solid ${C.border}`, paddingBottom: 10 } : {}) }}>
                    <div style={s.collabIco}>{c.icon}</div>
                    <div style={{ flex: 1 }}>
                      <p style={s.collabName}>{c.name}</p>
                      <p style={s.collabSub}>{c.type} · {c.year}</p>
                    </div>
                    <span style={c.active ? s.chipOn : s.chipOff}>{c.active ? "Active" : "Completed"}</span>
                  </div>
                ))}
              </Section>

              <Section label="Ideal for">
                <TagList tags={["Local Restaurants", "Tech Gadgets", "Travel Gear", "Hyderabad Businesses", "Fashion", "Apps & Services"]} />
              </Section>

              <div style={{ padding: "0 14px" }}>
                <button style={s.bigBtn} onClick={() => setTab("Contact")}>Start a Collaboration →</button>
              </div>
              <Gap />
            </div>
          )}

          {/* ════════ CONTACT ════════ */}
          {tab === "Contact" && (
            <div style={s.scroll}>
              <TabHeader title="Get in Touch" sub="Response within 24 hours" />

              {msgSent ? (
                <div style={s.successBox}>
                  <span style={{ fontSize: 36 }}>🎉</span>
                  <p style={s.successT}>Message Sent!</p>
                  <p style={s.successS}>Arman will get back to you soon.</p>
                </div>
              ) : (
                <Section label="Send a Collaboration Request">
                  <div style={s.fGroup}>
                    <label style={s.fLabel}>Your Name *</label>
                    <input style={s.fInput} placeholder="e.g. Rahul Sharma" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div style={s.fGroup}>
                    <label style={s.fLabel}>Brand / Company *</label>
                    <input style={s.fInput} placeholder="e.g. SmartX, Cashify..." value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} />
                  </div>
                  <div style={s.fGroup}>
                    <label style={s.fLabel}>What do you have in mind?</label>
                    <textarea style={{ ...s.fInput, ...s.fTextarea }} placeholder="Tell Arman about your product and what kind of collab you're thinking..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
                  </div>
                  <button style={{ ...s.bigBtn, ...(!form.name || !form.brand ? s.bigBtnOff : {}) }} onClick={handleSend}>
                    Send Request
                  </button>
                </Section>
              )}

              <Section label="Quick Links">
                {[
                  { ico: "📸", l: "Instagram", h: "@arman___vlogs" },
                  { ico: "▶️", l: "YouTube", h: "Arman___ Vlogs" },
                  { ico: "✉️", l: "Email", h: "arman@armanvlogs.in" },
                ].map((q, i, arr) => (
                  <div key={q.l} style={{ ...s.qRow, ...(i < arr.length - 1 ? { borderBottom: `0.5px solid ${C.border}`, paddingBottom: 8 } : {}) }}>
                    <span style={s.qIco}>{q.ico}</span>
                    <div>
                      <p style={s.qL}>{q.l}</p>
                      <p style={s.qH}>{q.h}</p>
                    </div>
                  </div>
                ))}
              </Section>

              <div style={{ ...s.sectionCard, borderColor: C.goldBorder, textAlign: "center" }}>
                <p style={{ fontSize: 11, color: C.muted, lineHeight: 1.7, margin: 0 }}>
                  This portfolio was built by{" "}
                  <span style={{ color: C.gold, fontWeight: 500 }}>SmartX</span> as part of a creator partnership.
                  {"\n"}Want one like this?{" "}
                  <span style={{ color: C.gold }}>Contact SmartX →</span>
                </p>
              </div>
              <Gap />
            </div>
          )}

        </div>

        {/* ── BOTTOM NAV ── */}
        <div style={s.nav}>
          {TABS.map(t => (
            <button key={t.id} style={s.navBtn} onClick={() => setTab(t.id)}>
              <span style={{ ...s.navIco, ...(tab === t.id ? s.navIcoOn : {}) }}>{t.icon}</span>
              <span style={{ ...s.navLbl, ...(tab === t.id ? s.navLblOn : {}) }}>{t.id}</span>
              {tab === t.id && <div style={s.navDot} />}
            </button>
          ))}
        </div>

        <div style={s.homeIndicator}><div style={s.homeBar} /></div>
      </div>

      {copied && <div style={s.toast}>🔗 Link copied!</div>}
    </div>
    );
  }

  // DESKTOP VIEW - Full responsive layout
  return (
    <div style={s.desktopPage}>
      <style>{keyframes}</style>
      <DesktopLayout tab={tab} setTab={setTab} scrollY={scrollY} hoveredVideo={hoveredVideo} setHoveredVideo={setHoveredVideo} filter={filter} setFilter={setFilter} copied={copied} handleCopy={handleCopy} msgSent={msgSent} handleSend={handleSend} form={form} setForm={setForm} />
    </div>
  );
}

/* ── SUB COMPONENTS ── */

function DesktopLayout({ tab, setTab, scrollY, hoveredVideo, setHoveredVideo, filter, setFilter, copied, handleCopy, msgSent, handleSend, form, setForm }) {
  const tags = ["All", ...Array.from(new Set(VIDEOS.map(v => v.tag)))];
  const filtered = filter === "All" ? VIDEOS : VIDEOS.filter(v => v.tag === filter);

  const parallaxY = scrollY * 0.5;

  return (
    <div style={s.desktopContainer}>
      {/* FLOATING HEADER */}
      <div style={s.floatingHeader}>
        <div style={s.headerContent}>
          <div style={s.logo}>
            <span style={s.logoIcon}>▶</span>
            {/* <span><img src="./ArmaanVlog.jpeg"></img></span> */}
            <span style={s.logoText}>Arman___ Vlogs</span>
          </div>
          <nav style={s.desktopNav}>
            {TABS.map(t => (
              <button key={t.id} style={{ ...s.desktopNavBtn, ...(tab === t.id ? s.desktopNavBtnActive : {}) }} onClick={() => setTab(t.id)}>
                {t.id}
              </button>
            ))}
          </nav>
          <button style={s.ctaBtn} onClick={() => setTab("Contact")}>Get in Touch</button>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div style={s.desktopContent}>
        {tab === "Home" && <HomeSection parallaxY={parallaxY} />}
        {tab === "Videos" && <VideosSection hoveredVideo={hoveredVideo} setHoveredVideo={setHoveredVideo} filter={filter} setFilter={setFilter} filtered={filtered} tags={tags} />}
        {tab === "Collabs" && <CollabsSection setTab={setTab} />}
        {tab === "Contact" && <ContactSection msgSent={msgSent} handleSend={handleSend} form={form} setForm={setForm} />}
      </div>

      {copied && <div style={s.desktopToast}>🔗 Link copied!</div>}
    </div>
  );
}

function HomeSection({ parallaxY }) {
  return (
    <div style={s.heroSection}>
      <div style={{ ...s.heroBackground, transform: `translateY(${parallaxY}px)` }} />
      
      <div style={s.heroContent}>
        <div style={s.avatarContainerDesktop}>
          <div style={s.avatarGlow} />
          <div style={s.desktopAvatar}>
            <img src="/ArmaanVlog.jpeg" alt="Arman" style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:"50%"}} />
          </div>
        </div>

        <div style={s.liveIndicatorDesktop}>
          <span style={s.liveDot} />Active Creator
        </div>

        <h1 style={s.desktopHeroName}>Arman___ Vlogs</h1>
        <p style={s.desktopSubtitle}>@arman___vlogs</p>
        <p style={s.desktopBio}>"Pakka Hyderabadi 📍" Exploring hidden gems · Breaking stereotypes · Creating authentic content</p>

        <div style={s.desktopHeroPills}>
          <a href="https://www.instagram.com/arman____vlogs/" target="_blank" rel="noopener noreferrer" style={{...s.desktopPill, textDecoration: 'none', color: 'inherit'}}>📸 Instagram</a>
          <a href="www.youtube.com/@arman_vlogs-ASA" target="_blank" rel="noopener noreferrer" style={{...s.desktopPill, textDecoration: 'none', color: 'inherit'}}>▶️ YouTube</a>
          <span style={{ ...s.desktopPill, ...s.desktopPillGold }}>⭐ Open to Collabs</span>
        </div>

        <div style={s.statsGridDesktop}>
          {[
            { n: "61.1K", l: "Followers", icon: "👥" },
            { n: "4.5L+", l: "Views", icon: "👁️" },
            { n: "8.4%", l: "Engagement", icon: "💫" },
            { n: "2+", l: "Brands", icon: "🤝" },
          ].map(st => (
            <div key={st.l} style={s.statCardDesktop}>
              <span style={{ fontSize: 24, marginBottom: 8 }}>{st.icon}</span>
              <div style={s.statNumber}>{st.n}</div>
              <div style={s.statLabel}>{st.l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={s.featuredVideoSection}>
        <div style={s.sectionTitleWrapper}>
          <h2 style={s.sectionTitle}>🔥 Featured Highlight</h2>
          <span style={s.trendingBadge}>Trending</span>
        </div>
        <p style={s.sectionSubtitle}>Most watched content from this month</p>
        <FeaturedVideoCard video={VIDEOS[3]} />
      </div>

      <div style={s.ctaSection}>
        <div style={s.ctaCard}>
          <h3 style={s.ctaTitle}>📹 Watch My Latest</h3>
          <p style={s.ctaDesc}>Explore hidden gems & authentic Hyderabad vibes</p>
          <button  style={s.ctaBtnPrimary}>Browse Videos →</button>
        </div>
        <div style={s.ctaCard}>
          <h3 style={s.ctaTitle}>🤝 Collaborate</h3>
          <p style={s.ctaDesc}>Let's create something amazing together</p>
          <button style={s.ctaBtnSecondary}>Start Collab →</button>
        </div>
      </div>
    </div>
  );
}

function FeaturedVideoCard({ video: v }) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div 
      style={{...s.featuredVideoCard, ...(isHovered && s.featuredVideoCardHover)}}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => v.url && window.open(v.url, "_blank")}
    >
      <div style={{...s.featuredVideoThumb, background: v.bg}}>
        {v.trending && <div style={s.trendingLabel}>🔥 TRENDING</div>}
        <span style={{fontSize: 60, opacity: 0.2}}>{v.emoji}</span>
        <div style={{...s.playButtonLarge, ...(isHovered && s.playButtonLargeHover)}}>
          <div style={s.playTriangle} />
        </div>
      </div>
      <div style={s.featuredVideoInfo}>
        <h3 style={s.featuredVideoTitle}>{v.title}</h3>
        <div style={s.featuredVideoStats}>
          <span>👁️ {v.views} views</span>
          <span>⏱️ {v.duration}</span>
          <span style={{...s.tagBadge, ...(v.smartx && s.tagBadgeGold)}}>{v.tag}</span>
        </div>
        <div style={s.watchBtn}>Watch Now →</div>
      </div>
    </div>
  );
}

function VideosSection({ hoveredVideo, setHoveredVideo, filter, setFilter, filtered, tags }) {
  return (
    <div style={s.videosSection}>
      <div style={s.sectionHeader}>
        <h2 style={s.sectionTitle}>All Videos</h2>
        <p style={s.sectionSubtitle}>{filtered.length} videos</p>
      </div>

      <div style={s.filterRowDesktop}>
        {tags.map(t => (
          <button key={t} style={{ ...s.filterChipDesktop, ...(filter === t ? s.filterChipDesktopActive : {}) }} onClick={() => setFilter(t)}>
            {t}
          </button>
        ))}
      </div>

      <div style={s.videosGridDesktop}>
        {filtered.map(v => (
          <div
            key={v.id}
            onClick={() => v.url && window.open(v.url, "_blank")}
            style={{ ...s.videoCardDesktop, ...(hoveredVideo === v.id ? s.videoCardDesktopHover : {}) }}
            onMouseEnter={() => setHoveredVideo(v.id)}
            onMouseLeave={() => setHoveredVideo(null)}
          >
            <div style={{ ...s.vThumbDesktop, background: v.bg }}>
              <span style={{ fontSize: 50, opacity: 0.3 }}>{v.emoji}</span>
              <div style={s.vPlayDesktop}><div style={s.vTriDesktop} /></div>
              <span style={s.vDurDesktop}>{v.duration}</span>
            </div>
            <p style={s.vTitleDesktop}>{v.title}</p>
            <div style={s.vMetaDesktop}>
              <span>👁 {v.views}</span>
              <span style={{ ...s.vTagDesktop, ...(v.smartx ? s.vTagDesktopGold : {}) }}>{v.tag}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CollabsSection({ setTab }) {
  return (
    <div style={s.collabsSection}>
      <div style={s.sectionHeader}>
        <h2 style={s.sectionTitle}>Brand Partnerships</h2>
        <p style={s.sectionSubtitle}>Collaborations that matter</p>
      </div>

      <div style={s.whyBrandsGridDesktop}>
        {[
          { icon: "🎯", t: "Hyper-local Audience", d: "60K real Hyderabadis who trust and act on recommendations" },
          { icon: "💬", t: "High Engagement", d: "8.4% engagement rate — well above industry average" },
          { icon: "✅", t: "Honest Reviews", d: "Authentic content that builds trust with your brand" },
          { icon: "📱", t: "Multi-Platform", d: "Combined YouTube & Instagram presence for maximum reach" },
        ].map(item => (
          <div key={item.t} style={s.whyCardDesktop}>
            <span style={s.whyIconDesktop}>{item.icon}</span>
            <p style={s.whyTitleDesktop}>{item.t}</p>
            <p style={s.whyDescDesktop}>{item.d}</p>
          </div>
        ))}
      </div>

      <div style={s.collabsGridDesktop}>
        {COLLABS.map(c => (
          <div key={c.name} style={s.collabCardDesktop}>
            <span style={s.collabIconDesktop}>{c.icon}</span>
            <p style={s.collabNameDesktop}>{c.name}</p>
            <p style={s.collabSubDesktop}>{c.type} · {c.year}</p>
            <span style={c.active ? s.statusBadgeActive : s.statusBadge}>{c.active ? "Active" : "Completed"}</span>
          </div>
        ))}
      </div>

      <button style={s.ctaBtnLarge} onClick={() => setTab("Contact")}>Start a Collaboration →</button>
    </div>
  );
}

function ContactSection({ msgSent, handleSend, form, setForm }) {
  return (
    <div style={s.contactSection}>
      {msgSent ? (
        <div style={s.successMessageDesktop}>
          <span style={{ fontSize: 60 }}>🎉</span>
          <p style={s.successTitle}>Message Sent!</p>
          <p style={s.successDesc}>Arman will get back to you within 24 hours.</p>
        </div>
      ) : (
        <div>
          <div style={s.sectionHeader}>
            <h2 style={s.sectionTitle}>Get in Touch</h2>
            <p style={s.sectionSubtitle}>Response within 24 hours</p>
          </div>

          <div style={s.contactFormDesktop}>
            <div style={s.formGroupDesktop}>
              <label style={s.formLabel}>Your Name *</label>
              <input style={s.formInput} placeholder="Full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div style={s.formGroupDesktop}>
              <label style={s.formLabel}>Brand / Company *</label>
              <input style={s.formInput} placeholder="Company name" value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} />
            </div>
            <div style={s.formGroupDesktop}>
              <label style={s.formLabel}>Tell us about your project</label>
              <textarea style={{ ...s.formInput, ...s.formTextarea }} placeholder="Describe your collaboration idea..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
            </div>
            <button style={{ ...s.ctaBtnLarge, ...(form.name && form.brand ? {} : s.ctaBtnDisabled) }} onClick={handleSend}>Send Message</button>
          </div>
        </div>
      )}

      <div style={s.quickLinksDesktop}>
        {[
          { ico: "📸", l: "Instagram", h: "@arman__vlogs" },
          { ico: "▶️", l: "YouTube", h: "Arman___ Vlogs" },
          { ico: "✉️", l: "Email", h: "arman@armanvlogs.in" },
        ].map(q => (
          <div key={q.l} style={s.quickLinkDesktop}>
            <span style={{ fontSize: 24 }}>{q.ico}</span>
            <div>
              <p style={s.qlLabel}>{q.l}</p>
              <p style={s.qlValue}>{q.h}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
function Section({ label, children }) {
  return (
    <div style={s.sectionCard}>
      <p style={s.secLabel}>{label}</p>
      {children}
    </div>
  );
}

function TabHeader({ title, sub }) {
  return (
    <div style={s.tabHdr}>
      <p style={s.tabHdrT}>{title}</p>
      <p style={s.tabHdrS}>{sub}</p>
    </div>
  );
}

function TagList({ tags }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {tags.map(t => <span key={t} style={s.tag}>{t}</span>)}
    </div>
  );
}

function VideoThumb({ video: v, large, isDesktop }) {
  return (
    <div onClick={() => v.url && window.open(v.url, "_blank")} style={{ cursor: v.url ? "pointer" : "default" }}>
      <div style={{ ...s.vFeat, ...(isDesktop && { ratio: large ? "16/9" : "16/10" }), background: v.bg, aspectRatio: large ? "16/9" : "16/8" }}>
        <span style={{ fontSize: large ? 40 : 30, opacity: 0.22 }}>{v.emoji}</span>
        <div style={s.vFeatPlay}><div style={{ ...s.vTri, borderWidth: large ? "7px 0 7px 12px" : "5px 0 5px 9px" }} /></div>
        <div style={s.vFeatMeta}>
          <span style={s.vFeatViews}>👁 {v.views}</span>
          <span style={s.vFeatDur}>{v.duration}</span>
        </div>
      </div>
      <p style={s.vFeatTitle}>{v.title}</p>
    </div>
  );
}

function Gap() { return <div style={{ height: 24 }} />; }

/* ════════════════════════════════════ STYLES ════════════════════════════════════ */
const s = {
  // ─── MOBILE STYLES ───
  page: {
    minHeight: "100vh", background: "#040404",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: "'DM Sans', sans-serif", padding: "20px 0",
  },
  phone: {
    width: 390, height: 844,
    background: C.dark, borderRadius: 50,
    border: "1px solid rgba(255,255,255,0.09)",
    overflow: "hidden",
    display: "flex", flexDirection: "column",
    boxShadow: "0 40px 120px rgba(0,0,0,0.85), inset 0 0 0 1px rgba(255,255,255,0.03), 0 0 0 9px #0c0c0c, 0 0 0 10px rgba(255,255,255,0.04)",
    position: "relative",
  },

  statusBar: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "12px 22px 0", background: C.dark, flexShrink: 0,
  },
  statusTime: { fontSize: 13, fontWeight: 600, color: C.text, letterSpacing: "0.2px" },
  notch: { width: 100, height: 24, background: "#000", borderRadius: "0 0 14px 14px", marginTop: -12 },
  statusRight: { display: "flex", alignItems: "center", gap: 5 },
  statusIco: { fontSize: 7, color: C.muted, letterSpacing: "1.5px" },
  statusBatt: { fontSize: 11, color: C.muted, fontWeight: 500 },

  browserWrap: {
    padding: "6px 14px 8px", background: C.dark,
    borderBottom: `0.5px solid ${C.border}`, flexShrink: 0,
  },
  browserBar: {
    display: "flex", alignItems: "center", gap: 8,
    background: C.dark3, borderRadius: 10,
    padding: "7px 12px", cursor: "pointer",
    border: `0.5px solid ${C.border}`,
  },
  browserLock: { fontSize: 10 },
  browserUrl: { flex: 1, fontSize: 11, color: C.muted, textAlign: "center" },
  browserShare: { fontSize: 11, color: C.dim, minWidth: 40, textAlign: "right" },

  main: { flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" },
  scroll: { flex: 1, overflowY: "auto", overflowX: "hidden" },

  hero: {
    padding: "28px 18px 22px",
    display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
    borderBottom: `0.5px solid ${C.border}`, gap: 8, position: "relative", overflow: "hidden",
  },
  heroGlow: {
    position: "absolute", top: -100, left: "50%", transform: "translateX(-50%)",
    width: 280, height: 280, borderRadius: "50%",
    background: "radial-gradient(circle, rgba(255,215,0,0.15) 0%, transparent 65%)",
    pointerEvents: "none",
  },
  avatarRing: {
    padding: 3, borderRadius: "50%",
    background: `conic-gradient(${C.gold} 0deg, ${C.goldLight} 180deg, ${C.gold} 360deg)`,
    marginBottom: 2, zIndex: 1,
    animation: "rotateGlow 8s linear infinite",
  },
  avatar: {
    width: 88, height: 88, borderRadius: "50%",
    background: C.dark3, border: `3px solid ${C.dark}`,
    display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
  },
  liveTag: {
    display: "flex", alignItems: "center", gap: 5,
    fontSize: 10, color: C.green, fontWeight: 500,
    background: "rgba(46,204,113,0.09)", border: "0.5px solid rgba(46,204,113,0.22)",
    borderRadius: 20, padding: "3px 10px", letterSpacing: "0.3px", zIndex: 1,
    animation: "pulse 2s ease-in-out infinite",
  },
  liveBullet: { width: 5, height: 5, borderRadius: "50%", background: C.green },
  heroName: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 25, fontWeight: 700, color: C.text,
    letterSpacing: "-0.4px", lineHeight: 1.2, margin: 0, zIndex: 1,
  },
  heroAt: { fontSize: 12, color: C.dim, margin: 0, zIndex: 1 },
  heroBio: { fontSize: 12.5, color: C.muted, lineHeight: 1.6, fontWeight: 300, margin: 0, zIndex: 1 },
  heroPills: { display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center", zIndex: 1 },
  pill: {
    fontSize: 11, padding: "4px 12px", borderRadius: 20,
    border: `0.5px solid ${C.border}`, color: C.muted, background: "transparent",
  },
  pillGold: { border: `0.5px solid ${C.goldBorder}`, color: C.gold, background: C.goldDim },

  statsRow: {
    display: "flex", borderBottom: `0.5px solid ${C.border}`, flexShrink: 0,
  },
  statCell: {
    flex: 1, padding: "13px 6px",
    display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
  },
  statN: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 17, fontWeight: 700, color: C.gold, lineHeight: 1,
  },
  statL: { fontSize: 9, color: C.dim, textTransform: "uppercase", letterSpacing: "0.5px" },

  sectionCard: {
    margin: "12px 14px 0",
    background: C.dark2, borderRadius: 16,
    border: `0.5px solid ${C.border}`, padding: 16,
    display: "flex", flexDirection: "column", gap: 10,
    transition: "all 0.3s ease",
  },
  secLabel: {
    fontSize: 10, fontWeight: 500,
    textTransform: "uppercase", letterSpacing: "1px", color: C.dim, margin: 0,
  },
  bodyText: { fontSize: 12.5, color: C.muted, lineHeight: 1.65, fontWeight: 300, margin: 0 },
  tag: {
    fontSize: 11, padding: "3px 10px", borderRadius: 20,
    background: C.dark3, border: `0.5px solid ${C.borderMid}`, color: C.muted,
  },

  sxTop: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  sxBadge: {
    fontSize: 11, padding: "3px 10px", borderRadius: 20,
    background: C.goldDim, color: C.gold, border: `0.5px solid ${C.goldBorder}`, fontWeight: 500,
  },
  sxActive: {
    fontSize: 10, padding: "3px 8px", borderRadius: 20,
    background: "rgba(46,204,113,0.09)", color: C.green, border: "0.5px solid rgba(46,204,113,0.22)",
  },

  vFeat: {
    width: "100%", borderRadius: 12,
    display: "flex", alignItems: "center", justifyContent: "center",
    position: "relative", overflow: "hidden",
  },
  vFeatPlay: {
    position: "absolute", width: 40, height: 40, borderRadius: "50%",
    background: "rgba(255,255,255,0.13)",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  vFeatMeta: {
    position: "absolute", bottom: 8, left: 10, right: 10,
    display: "flex", justifyContent: "space-between",
  },
  vFeatViews: {
    fontSize: 10, color: "rgba(255,255,255,0.7)",
    background: "rgba(0,0,0,0.55)", padding: "2px 7px", borderRadius: 6,
  },
  vFeatDur: {
    fontSize: 10, color: "rgba(255,255,255,0.7)",
    background: "rgba(0,0,0,0.55)", padding: "2px 7px", borderRadius: 6,
  },
  vFeatTitle: { fontSize: 13, fontWeight: 500, color: C.text, margin: "8px 0 0", lineHeight: 1.4 },

  tabHdr: { padding: "18px 16px 12px", borderBottom: `0.5px solid ${C.border}` },
  tabHdrT: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 20, fontWeight: 700, color: C.text, margin: "0 0 2px",
  },
  tabHdrS: { fontSize: 12, color: C.muted, margin: 0 },

  filterRow: {
    display: "flex", gap: 6, flexWrap: "nowrap",
    overflowX: "auto", padding: "10px 14px",
    borderBottom: `0.5px solid ${C.border}`,
  },
  filterChip: {
    fontSize: 11, padding: "5px 13px", borderRadius: 20,
    border: `0.5px solid ${C.border}`, background: "transparent",
    color: C.muted, cursor: "pointer", whiteSpace: "nowrap",
    fontFamily: "'DM Sans', sans-serif", flexShrink: 0,
    transition: "all 0.2s ease",
  },
  filterOn: { background: C.goldDim, color: C.gold, border: `0.5px solid ${C.goldBorder}` },

  vList: { padding: "8px 14px", display: "flex", flexDirection: "column", gap: 8 },
  vRow: {
    display: "flex", gap: 10,
    background: C.dark2, borderRadius: 12,
    border: `0.5px solid ${C.border}`,
    overflow: "hidden", cursor: "pointer",
    transition: "all 0.2s ease",
  },
  vRowHover: { borderColor: C.goldBorder, background: C.dark3 },
  vThumb: {
    width: 88, flexShrink: 0, minHeight: 66,
    display: "flex", alignItems: "center", justifyContent: "center",
    position: "relative",
  },
  vPlay: {
    position: "absolute", width: 20, height: 20, borderRadius: "50%",
    background: "rgba(255,255,255,0.12)",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  vTri: {
    width: 0, height: 0, borderStyle: "solid",
    borderWidth: "5px 0 5px 9px",
    borderColor: "transparent transparent transparent rgba(255,255,255,0.8)",
    marginLeft: 1,
  },
  vDur: {
    position: "absolute", bottom: 4, right: 4,
    fontSize: 8, padding: "1px 5px", borderRadius: 4,
    background: "rgba(0,0,0,0.65)", color: "rgba(255,255,255,0.7)",
  },
  vInfo: {
    flex: 1, padding: "10px 10px 10px 0",
    display: "flex", flexDirection: "column", justifyContent: "center", gap: 5,
  },
  vTitle: { fontSize: 12, fontWeight: 500, color: C.text, margin: 0, lineHeight: 1.4 },
  vMeta: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  vViews: { fontSize: 10, color: C.dim },
  vTag: {
    fontSize: 9, padding: "2px 7px", borderRadius: 6,
    background: C.dark3, color: C.dim, border: `0.5px solid ${C.border}`,
  },
  vTagGold: { background: C.goldDim, color: C.gold, border: `0.5px solid ${C.goldBorder}` },

  whyRow: { display: "flex", alignItems: "flex-start", gap: 12, paddingTop: 6 },
  whyIco: { fontSize: 18, flexShrink: 0, marginTop: 1 },
  whyT: { fontSize: 12, fontWeight: 500, color: C.text, margin: "0 0 2px" },
  whyD: { fontSize: 11, color: C.muted, margin: 0, lineHeight: 1.5 },
  collabRow: { display: "flex", alignItems: "center", gap: 12, paddingTop: 6 },
  collabIco: {
    width: 36, height: 36, borderRadius: 10,
    background: C.dark3, display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 16, flexShrink: 0, border: `0.5px solid ${C.border}`,
  },
  collabName: { fontSize: 13, fontWeight: 500, color: C.text, margin: "0 0 2px" },
  collabSub: { fontSize: 11, color: C.muted, margin: 0 },
  chipOn: {
    fontSize: 10, padding: "3px 9px", borderRadius: 20,
    background: "rgba(46,204,113,0.09)", color: C.green, border: "0.5px solid rgba(46,204,113,0.22)",
  },
  chipOff: {
    fontSize: 10, padding: "3px 9px", borderRadius: 20,
    background: C.dark3, color: C.dim, border: `0.5px solid ${C.border}`,
  },
  bigBtn: {
    display: "block", width: "100%", padding: 13, borderRadius: 12,
    background: C.gold, color: C.dark, fontSize: 13, fontWeight: 500,
    fontFamily: "'DM Sans', sans-serif", cursor: "pointer", border: "none", letterSpacing: "0.2px",
    transition: "all 0.3s ease",
  },
  bigBtnOff: { background: C.dark3, color: C.dim, cursor: "not-allowed" },

  fGroup: { display: "flex", flexDirection: "column", gap: 5 },
  fLabel: { fontSize: 11, color: C.dim, letterSpacing: "0.3px" },
  fInput: {
    background: C.dark3, border: `0.5px solid ${C.borderMid}`,
    borderRadius: 10, padding: "10px 12px",
    fontSize: 13, color: C.text,
    fontFamily: "'DM Sans', sans-serif", outline: "none",
    transition: "all 0.2s ease",
  },
  fTextarea: { minHeight: 80, resize: "none", lineHeight: 1.5 },
  successBox: {
    margin: "32px 14px", background: C.dark2,
    borderRadius: 16, border: `0.5px solid ${C.goldBorder}`,
    padding: "36px 20px",
    display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
  },
  successT: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 20, fontWeight: 700, color: C.text, margin: 0,
  },
  successS: { fontSize: 13, color: C.muted, margin: 0 },
  qRow: { display: "flex", alignItems: "center", gap: 12, paddingTop: 6 },
  qIco: { fontSize: 16, flexShrink: 0 },
  qL: { fontSize: 10, color: C.dim, margin: "0 0 1px", textTransform: "uppercase", letterSpacing: "0.4px" },
  qH: { fontSize: 12, color: C.text, margin: 0, fontWeight: 500 },

  nav: {
    display: "flex", background: C.dark2,
    borderTop: `0.5px solid ${C.border}`, flexShrink: 0, padding: "4px 0 0",
  },
  navBtn: {
    flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
    padding: "6px 0 8px", background: "transparent", border: "none",
    cursor: "pointer", position: "relative", fontFamily: "'DM Sans', sans-serif",
    transition: "all 0.2s ease",
  },
  navIco: { fontSize: 18, color: C.dim, lineHeight: 1, transition: "color 0.2s ease" },
  navIcoOn: { color: C.gold },
  navLbl: { fontSize: 9, color: C.dim, letterSpacing: "0.3px", transition: "color 0.2s ease" },
  navLblOn: { color: C.gold },
  navDot: {
    position: "absolute", bottom: 3,
    width: 3, height: 3, borderRadius: "50%", background: C.gold,
  },

  homeIndicator: {
    height: 22, background: C.dark2,
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  homeBar: { width: 120, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.15)" },

  toast: {
    position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)",
    background: C.dark3, color: C.gold, fontSize: 12, padding: "8px 20px",
    borderRadius: 20, border: `0.5px solid ${C.goldBorder}`, zIndex: 100, whiteSpace: "nowrap",
    animation: "slideInUp 0.3s ease",
  },

  // ─── DESKTOP STYLES ───
  desktopPage: {
    minHeight: "100vh",
    background: `linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0f0f1e 100%)`,
    fontFamily: "'DM Sans', sans-serif",
    overflow: "hidden",
    position: "relative",
  },

  desktopContainer: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    position: "relative",
  },

  floatingHeader: {
    position: "sticky",
    top: 0,
    zIndex: 1000,
    backdropFilter: "blur(10px)",
    background: "rgba(10, 10, 10, 0.8)",
    borderBottom: `1px solid ${C.border}`,
    animation: "slideInDown 0.5s ease",
  },

  headerContent: {
    maxWidth: "1200px",
    margin: "0 auto",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 40px",
  },

  logo: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    cursor: "pointer",
    transition: "all 0.3s ease",
  },

  logoIcon: {
    fontSize: 24,
    color: C.gold,
    animation: "floatGlow 3s ease-in-out infinite",
  },

  logoText: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 22,
    fontWeight: 700,
    color: C.text,
    letterSpacing: "-0.5px",
  },

  desktopNav: {
    display: "flex",
    gap: 8,
    flex: 1,
    justifyContent: "center",
  },

  desktopNavBtn: {
    padding: "8px 20px",
    background: "transparent",
    border: `1px solid ${C.border}`,
    color: C.muted,
    fontSize: 14,
    fontWeight: 500,
    borderRadius: 20,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    transition: "all 0.3s ease",
  },

  desktopNavBtnActive: {
    background: C.goldDim,
    borderColor: C.goldBorder,
    color: C.gold,
  },

  ctaBtn: {
    padding: "10px 28px",
    background: C.gold,
    color: C.dark,
    border: "none",
    borderRadius: 25,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    transition: "all 0.3s ease",
    boxShadow: `0 10px 30px rgba(255,215,0,0.2)`,
  },

  desktopContent: {
    flex: 1,
    maxWidth: "1200px",
    margin: "0 auto",
    width: "100%",
    padding: "60px 40px",
    animation: "slideInUp 0.6s ease",
  },

  // Hero section
  heroSection: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    gap: 80,
    paddingBottom: 80,
    paddingTop: 40,
  },

  heroBackground: {
    position: "absolute",
    top: 0,
    left: "50%",
    transform: "translateX(-50%)",
    width: "800px",
    height: "800px",
    background: `radial-gradient(circle, rgba(255,215,0,0.08) 0%, transparent 70%)`,
    borderRadius: "50%",
    zIndex: 0,
  },

  heroContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    gap: 24,
    position: "relative",
    zIndex: 1,
    marginTop: 40,
  },

  avatarContainerDesktop: {
    position: "relative",
    width: 180,
    height: 180,
    animation: "scaleIn 0.6s ease",
  },

  avatarGlow: {
    position: "absolute",
    inset: -20,
    background: `conic-gradient(${C.gold} 0deg, ${C.goldLight} 180deg, ${C.gold} 360deg)`,
    borderRadius: "50%",
    opacity: 0.3,
    filter: "blur(40px)",
    animation: "rotateGlow 6s linear infinite",
  },

  desktopAvatar: {
    width: 180,
    height: 180,
    borderRadius: "50%",
    background: `linear-gradient(135deg, ${C.dark3} 0%, ${C.dark4} 100%)`,
    border: `3px solid ${C.gold}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    zIndex: 1,
    boxShadow: `0 0 60px rgba(255,215,0,0.15), inset 0 0 60px rgba(255,215,0,0.05)`,
  },

  desktopHeroName: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 52,
    fontWeight: 700,
    color: C.text,
    margin: 0,
    letterSpacing: "-1px",
    background: `linear-gradient(135deg, ${C.text} 0%, ${C.gold} 50%, ${C.goldLight} 100%)`,
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  desktopSubtitle: {
    fontSize: 18,
    color: C.gold,
    margin: 0,
    fontWeight: 500,
    letterSpacing: "0.5px",
  },

  desktopBio: {
    fontSize: 16,
    color: C.muted,
    margin: 0,
    maxWidth: 600,
    lineHeight: 1.8,
    fontWeight: 300,
  },

  desktopHeroPills: {
    display: "flex",
    gap: 12,
    justifyContent: "center",
    flexWrap: "wrap",
  },

  desktopPill: {
    padding: "12px 24px",
    background: C.dark3,
    border: `1px solid ${C.border}`,
    borderRadius: 25,
    color: C.muted,
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.3s ease",
  },

  desktopPillGold: {
    background: C.goldDim,
    borderColor: C.goldBorder,
    color: C.gold,
  },

  liveIndicatorDesktop: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 16px",
    background: "rgba(46, 204, 113, 0.15)",
    border: `1px solid rgba(46, 204, 113, 0.3)`,
    borderRadius: 25,
    color: C.green,
    fontSize: 12,
    fontWeight: 600,
    marginBottom: 12,
    animation: "pulse 2s ease-in-out infinite",
    width: "fit-content",
    margin: "0 auto 12px",
  },

  liveDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: C.green,
    display: "inline-block",
  },

  statsGridDesktop: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 20,
    width: "100%",
    marginTop: 40,
  },

  statCardDesktop: {
    background: `linear-gradient(135deg, rgba(255,215,0,0.05) 0%, rgba(255,215,0,0.02) 100%)`,
    border: `1px solid ${C.goldBorder}`,
    borderRadius: 20,
    padding: 24,
    textAlign: "center",
    transition: "all 0.3s ease",
    cursor: "pointer",
  },

  statNumber: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 32,
    fontWeight: 700,
    color: C.gold,
    margin: 0,
    marginBottom: 8,
  },

  statLabel: {
    fontSize: 12,
    color: C.dim,
    textTransform: "uppercase",
    letterSpacing: "1px",
    fontWeight: 600,
  },

  featuredVideoSection: {
    marginTop: 80,
    position: "relative",
    zIndex: 1,
  },

  sectionTitleWrapper: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },

  trendingBadge: {
    background: C.goldDim,
    border: `1px solid ${C.goldBorder}`,
    color: C.gold,
    padding: "4px 12px",
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 600,
    animation: "pulse 2s ease-in-out infinite",
  },

  featuredVideoCard: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 32,
    alignItems: "center",
    padding: 32,
    background: `linear-gradient(135deg, rgba(255,215,0,0.08) 0%, rgba(255,215,0,0.03) 100%)`,
    border: `1.5px solid ${C.goldBorder}`,
    borderRadius: 24,
    transition: "all 0.4s ease",
    cursor: "pointer",
    marginTop: 24,
    animation: "slideInUp 0.6s ease",
  },

  featuredVideoCardHover: {
    borderColor: C.gold,
    boxShadow: `0 20px 60px rgba(255,215,0,0.15)`,
    transform: "translateY(-5px)",
  },

  featuredVideoThumb: {
    position: "relative",
    aspectRatio: "16/9",
    borderRadius: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  trendingLabel: {
    position: "absolute",
    top: 12,
    left: 12,
    background: C.gold,
    color: C.dark,
    padding: "4px 12px",
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 700,
    zIndex: 2,
  },

  playButtonLarge: {
    width: 70,
    height: 70,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backdropFilter: "blur(10px)",
    transition: "all 0.3s ease",
  },

  playButtonLargeHover: {
    background: "rgba(255,215,0,0.3)",
    transform: "scale(1.15)",
  },

  playTriangle: {
    width: 0,
    height: 0,
    borderStyle: "solid",
    borderWidth: "12px 0 12px 20px",
    borderColor: "transparent transparent transparent rgba(255,255,255,0.9)",
    marginLeft: 3,
  },

  featuredVideoInfo: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },

  featuredVideoTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 28,
    fontWeight: 700,
    color: C.text,
    margin: 0,
    lineHeight: 1.3,
  },

  featuredVideoStats: {
    display: "flex",
    gap: 16,
    flexWrap: "wrap",
    fontSize: 13,
    color: C.muted,
  },

  tagBadge: {
    background: C.dark3,
    color: C.dim,
    padding: "4px 10px",
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 500,
  },

  tagBadgeGold: {
    background: C.goldDim,
    color: C.gold,
  },

  watchBtn: {
    display: "inline-block",
    padding: "12px 24px",
    background: C.gold,
    color: C.dark,
    borderRadius: 12,
    fontWeight: 600,
    fontSize: 14,
    width: "fit-content",
    transition: "all 0.3s ease",
    cursor: "pointer",
    marginTop: 8,
  },

  ctaSection: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 24,
    marginTop: 80,
  },

  ctaCard: {
    background: `linear-gradient(135deg, rgba(255,215,0,0.08) 0%, rgba(0,212,255,0.05) 100%)`,
    border: `1px solid ${C.borderHi}`,
    borderRadius: 20,
    padding: 40,
    textAlign: "center",
    transition: "all 0.3s ease",
    animation: "slideInUp 0.7s ease",
  },

  ctaTitle: {
    fontSize: 22,
    fontWeight: 700,
    color: C.text,
    margin: "0 0 8px",
  },

  ctaDesc: {
    fontSize: 14,
    color: C.muted,
    margin: "0 0 20px",
    lineHeight: 1.6,
  },

  ctaBtnPrimary: {
    padding: "12px 28px",
    background: C.gold,
    color: C.dark,
    border: "none",
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.3s ease",
  },

  ctaBtnSecondary: {
    padding: "12px 28px",
    background: "transparent",
    color: C.gold,
    border: `1px solid ${C.goldBorder}`,
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.3s ease",
  },

  // Videos section
  videosSection: {
    display: "flex",
    flexDirection: "column",
    gap: 40,
  },

  sectionHeader: {
    textAlign: "center",
    marginBottom: 20,
  },

  sectionTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 42,
    fontWeight: 700,
    color: C.text,
    margin: 0,
    marginBottom: 12,
    letterSpacing: "-0.5px",
  },

  sectionSubtitle: {
    fontSize: 16,
    color: C.muted,
    margin: 0,
  },

  filterRowDesktop: {
    display: "flex",
    gap: 12,
    justifyContent: "center",
    flexWrap: "wrap",
    padding: "20px 0",
  },

  filterChipDesktop: {
    padding: "10px 20px",
    background: C.dark3,
    border: `1px solid ${C.border}`,
    color: C.muted,
    fontSize: 14,
    borderRadius: 25,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 500,
    transition: "all 0.3s ease",
  },

  filterChipDesktopActive: {
    background: C.gold,
    borderColor: C.gold,
    color: C.dark,
  },

  videosGridDesktop: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: 24,
    marginTop: 40,
  },

  videoCardDesktop: {
    background: C.dark2,
    borderRadius: 16,
    border: `1px solid ${C.border}`,
    overflow: "hidden",
    transition: "all 0.4s ease",
    cursor: "pointer",
    animation: "slideInUp 0.6s ease",
  },

  videoCardDesktopHover: {
    borderColor: C.goldBorder,
    transform: "translateY(-10px)",
    boxShadow: `0 20px 60px rgba(255,215,0,0.1)`,
  },

  vThumbDesktop: {
    width: "100%",
    aspectRatio: "16/9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    transition: "all 0.3s ease",
  },

  vPlayDesktop: {
    width: 50,
    height: 50,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backdropFilter: "blur(10px)",
    transition: "all 0.3s ease",
  },

  vTriDesktop: {
    width: 0,
    height: 0,
    borderStyle: "solid",
    borderWidth: "8px 0 8px 14px",
    borderColor: "transparent transparent transparent rgba(255,255,255,0.9)",
    marginLeft: 2,
  },

  vDurDesktop: {
    position: "absolute",
    bottom: 12,
    right: 12,
    fontSize: 11,
    padding: "4px 10px",
    borderRadius: 8,
    background: "rgba(0,0,0,0.6)",
    color: "rgba(255,255,255,0.8)",
    backdropFilter: "blur(10px)",
    fontWeight: 500,
  },

  vTitleDesktop: {
    fontSize: 16,
    fontWeight: 600,
    color: C.text,
    margin: "16px 16px 8px",
    lineHeight: 1.4,
  },

  vMetaDesktop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 16px 16px",
    fontSize: 13,
    color: C.muted,
  },

  vTagDesktop: {
    background: C.dark3,
    color: C.dim,
    padding: "4px 10px",
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 500,
    border: `1px solid ${C.border}`,
  },

  vTagDesktopGold: {
    background: C.goldDim,
    color: C.gold,
    borderColor: C.goldBorder,
  },

  // Collabs section
  collabsSection: {
    display: "flex",
    flexDirection: "column",
    gap: 50,
  },

  whyBrandsGridDesktop: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: 24,
    marginTop: 40,
  },

  whyCardDesktop: {
    background: `linear-gradient(135deg, rgba(255,215,0,0.05) 0%, rgba(255,215,0,0.02) 100%)`,
    border: `1px solid ${C.goldBorder}`,
    borderRadius: 16,
    padding: 32,
    textAlign: "center",
    transition: "all 0.3s ease",
    animation: "scaleIn 0.6s ease",
  },

  whyIconDesktop: {
    fontSize: 40,
    display: "block",
    marginBottom: 12,
  },

  whyTitleDesktop: {
    fontSize: 16,
    fontWeight: 600,
    color: C.text,
    margin: "0 0 8px",
  },

  whyDescDesktop: {
    fontSize: 13,
    color: C.muted,
    margin: 0,
    lineHeight: 1.6,
  },

  collabsGridDesktop: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 20,
    marginTop: 40,
  },

  collabCardDesktop: {
    background: C.dark2,
    border: `1px solid ${C.border}`,
    borderRadius: 16,
    padding: 24,
    textAlign: "center",
    transition: "all 0.3s ease",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
  },

  collabIconDesktop: {
    fontSize: 36,
  },

  collabNameDesktop: {
    fontSize: 16,
    fontWeight: 600,
    color: C.text,
    margin: 0,
  },

  collabSubDesktop: {
    fontSize: 12,
    color: C.muted,
    margin: 0,
  },

  statusBadgeActive: {
    padding: "6px 12px",
    background: "rgba(46,204,113,0.15)",
    color: C.green,
    border: `1px solid rgba(46,204,113,0.3)`,
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 500,
  },

  statusBadge: {
    padding: "6px 12px",
    background: C.dark3,
    color: C.dim,
    border: `1px solid ${C.border}`,
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 500,
  },

  ctaBtnLarge: {
    padding: "16px 40px",
    background: C.gold,
    color: C.dark,
    border: "none",
    borderRadius: 30,
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    transition: "all 0.3s ease",
    boxShadow: `0 10px 30px rgba(255,215,0,0.25)`,
    marginTop: 20,
  },

  ctaBtnDisabled: {
    opacity: 0.5,
    cursor: "not-allowed",
  },

  // Contact section
  contactSection: {
    display: "flex",
    flexDirection: "column",
    gap: 50,
  },

  successMessageDesktop: {
    textAlign: "center",
    padding: 60,
    background: `linear-gradient(135deg, rgba(255,215,0,0.1) 0%, rgba(255,215,0,0.05) 100%)`,
    border: `1px solid ${C.goldBorder}`,
    borderRadius: 20,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 16,
    animation: "scaleIn 0.5s ease",
  },

  successTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 32,
    fontWeight: 700,
    color: C.text,
    margin: 0,
  },

  successDesc: {
    fontSize: 16,
    color: C.muted,
    margin: 0,
  },

  contactFormDesktop: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 20,
    marginTop: 40,
  },

  formGroupDesktop: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },

  formLabel: {
    fontSize: 13,
    fontWeight: 600,
    color: C.dim,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },

  formInput: {
    padding: "12px 16px",
    background: C.dark3,
    border: `1px solid ${C.border}`,
    borderRadius: 12,
    fontSize: 14,
    color: C.text,
    fontFamily: "'DM Sans', sans-serif",
    outline: "none",
    transition: "all 0.3s ease",
  },

  formTextarea: {
    gridColumn: "1 / -1",
    minHeight: 120,
    resize: "none",
    lineHeight: 1.6,
  },

  quickLinksDesktop: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: 20,
    marginTop: 40,
  },

  quickLinkDesktop: {
    background: C.dark2,
    border: `1px solid ${C.border}`,
    borderRadius: 16,
    padding: 24,
    display: "flex",
    gap: 16,
    alignItems: "flex-start",
    transition: "all 0.3s ease",
  },

  qlLabel: {
    fontSize: 12,
    color: C.dim,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    margin: 0,
    fontWeight: 600,
  },

  qlValue: {
    fontSize: 14,
    color: C.text,
    fontWeight: 600,
    margin: "4px 0 0",
  },

  desktopToast: {
    position: "fixed",
    bottom: 40,
    left: "50%",
    transform: "translateX(-50%)",
    background: C.dark3,
    color: C.gold,
    fontSize: 14,
    padding: "12px 28px",
    borderRadius: 25,
    border: `1px solid ${C.goldBorder}`,
    zIndex: 100,
    whiteSpace: "nowrap",
    animation: "slideInUp 0.4s ease",
  },

  // ─── RESPONSIVE ───
  "@media (max-width: 1024px)": {
    desktopContent: {
      padding: "40px 24px",
    },
    sectionTitle: {
      fontSize: 36,
    },
    statsGridDesktop: {
      gridTemplateColumns: "repeat(2, 1fr)",
    },
    videosGridDesktop: {
      gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    },
    contactFormDesktop: {
      gridTemplateColumns: "1fr",
    },
  },

  "@media (max-width: 640px)": {
    headerContent: {
      padding: "12px 20px",
    },
    desktopNav: {
      gap: 4,
    },
    desktopNavBtn: {
      padding: "6px 12px",
      fontSize: 12,
    },
    ctaBtn: {
      padding: "8px 20px",
      fontSize: 12,
    },
    desktopContent: {
      padding: "30px 16px",
    },
    sectionTitle: {
      fontSize: 28,
    },
    statsGridDesktop: {
      gridTemplateColumns: "1fr",
    },
    whyBrandsGridDesktop: {
      gridTemplateColumns: "1fr",
    },
    collabsGridDesktop: {
      gridTemplateColumns: "1fr",
    },
    videosGridDesktop: {
      gridTemplateColumns: "1fr",
    },
    heroSection: {
      gap: 40,
    },
  },
};
