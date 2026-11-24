import { createElement, useEffect, useRef, useState } from "react";
import {
  FiArrowDown,
  FiArrowUpRight,
  FiCode,
  FiExternalLink,
  FiGithub,
  FiLayers,
  FiMail,
  FiMapPin,
  FiMessageCircle,
  FiPhone,
  FiRefreshCw,
  FiSend,
  FiX,
  FiZap,
} from "react-icons/fi";
import {
  SiCss,
  SiFacebook,
  SiFigma,
  SiGit,
  SiGithub,
  SiHtml5,
  SiInstagram,
  SiJavascript,
  SiAngular,
  SiNextdotjs,
  SiPython,
  SiReact,
  SiSolid,
  SiSnapchat,
  SiTiktok,
  SiX,
  SiVuedotjs,
} from "react-icons/si";
import { VscVscode } from "react-icons/vsc";
import "./App.css";
import { portfolio } from "../../shared/personalInfo.js";

const motion = new Proxy({}, {
  get: (_target, tag) => function MotionElement({
    children,
    className = "",
    initial,
    animate,
    whileInView,
    transition,
    style,
    ...props
  }) {
    const classes = [
      className,
      whileInView ? "motion-reveal" : "",
      initial && animate && !whileInView ? "motion-enter" : "",
    ].filter(Boolean).join(" ");
    delete props.variants;
    delete props.viewport;
    const motionStyle = {
      ...style,
      ...(animate && typeof animate === "object" &&
        ("rotateX" in animate || "rotateY" in animate)
        ? { transform: `rotateX(${animate.rotateX || 0}deg) rotateY(${animate.rotateY || 0}deg)` }
        : {}),
      ...(transition?.delay ? { "--motion-delay": `${transition.delay}s` } : {}),
    };

    return createElement(tag, {
      ...props,
      className: classes,
      style: motionStyle,
      "data-reveal": whileInView ? "true" : undefined,
    }, children);
  },
});
const AnimatePresence = ({ children }) => children;

const Icon = ({ icon: IconComponent, size = 16, className = "", ...props }) => (
  <IconComponent
    size={size}
    className={`ui-icon ${className}`.trim()}
    aria-hidden="true"
    focusable="false"
    {...props}
  />
);
const ArrowDown = (props) => <Icon icon={FiArrowDown} {...props} />;
const ArrowUpRight = (props) => <Icon icon={FiArrowUpRight} {...props} />;
const Github = (props) => <Icon icon={FiGithub} {...props} />;
const Mail = (props) => <Icon icon={FiMail} {...props} />;
const Phone = (props) => <Icon icon={FiPhone} {...props} />;
const MapPin = (props) => <Icon icon={FiMapPin} {...props} />;
const X = (props) => <Icon icon={FiX} {...props} />;
const Code2 = (props) => <Icon icon={FiCode} {...props} />;
const Sparkles = (props) => <Icon icon={FiZap} {...props} />;
const Layers3 = (props) => <Icon icon={FiLayers} {...props} />;
const ExternalLink = (props) => <Icon icon={FiExternalLink} {...props} />;

const technologyIcons = {
  HTML: SiHtml5,
  CSS: SiCss,
  JavaScript: SiJavascript,
  Python: SiPython,
  React: SiReact,
  "Next.js": SiNextdotjs,
  "Vue.js": SiVuedotjs,
  Angular: SiAngular,
  SolidJS: SiSolid,
  Git: SiGit,
  GitHub: SiGithub,
  "VS Code": VscVscode,
  Figma: SiFigma,
};

const socialIcons = {
  Facebook: SiFacebook,
  Instagram: SiInstagram,
  TikTok: SiTiktok,
  X: SiX,
  Snapchat: SiSnapchat,
};

const navItems = ["Home", "About", "Skills", "Projects", "Contact"];

function scrollToSection(id) {
  const section = document.getElementById(id);
  if (!section) return;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  section.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
}

function TextReveal({ children }) {
  const words = children.split(/(\s+)/);
  return (
    <span className="text-reveal">
      {words.map((word, index) => (
        /\s+/.test(word)
          ? word
          : <span className="text-reveal-word" key={`${word}-${index}`} style={{ "--word-index": index }}>{word}</span>
      ))}
    </span>
  );
}

const reveal = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
};

function SectionHeading({ eyebrow, title, copy }) {
  return (
    <motion.header
      className="section-heading"
      variants={reveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
    >
      <div className="eyebrow"><span />{eyebrow}</div>
      <h2 aria-label={title}><TextReveal>{title}</TextReveal></h2>
      {copy && <p>{copy}</p>}
    </motion.header>
  );
}

function Navbar({ activeSection }) {
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef(null);
  const goTo = (item) => {
    setOpen(false);
    scrollToSection(item.toLowerCase());
  };

  useEffect(() => {
    if (!open) return undefined;

    const root = document.documentElement;
    const menuButton = menuButtonRef.current;
    const previousRootOverflow = root.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    const handleMenuKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
      if (event.key !== "Tab") return;

      const links = [...document.querySelectorAll(".mobile-menu-link")];
      const focusable = [menuButtonRef.current, ...links].filter(Boolean);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    root.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleMenuKeyDown);
    document.querySelector(".mobile-menu-link")?.focus({ preventScroll: true });

    return () => {
      root.style.overflow = previousRootOverflow;
      document.body.style.overflow = previousBodyOverflow;
      window.removeEventListener("keydown", handleMenuKeyDown);
      menuButton?.focus({ preventScroll: true });
    };
  }, [open]);

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 981px)");
    const closeOnDesktop = (event) => event.matches && setOpen(false);
    desktopQuery.addEventListener("change", closeOnDesktop);
    return () => desktopQuery.removeEventListener("change", closeOnDesktop);
  }, []);

  return (
    <>
      <nav className="navbar" aria-label="Primary navigation">
        <button className="wordmark magnetic-button" data-magnetic onClick={() => goTo("Home")} aria-label="Go to home">
          R<span>ENZO</span>
        </button>
        <div className="nav-links">
          {navItems.map((item) => (
            <button
              key={item}
              className={activeSection === item.toLowerCase() ? "active" : ""}
              onClick={() => goTo(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <a className="nav-contact magnetic-button" data-magnetic href="#contact">
          <span>Let&apos;s talk</span><ArrowUpRight size={15} />
        </a>
        <button
          className={`menu-button ${open ? "open" : ""}`}
          ref={menuButtonRef}
          onClick={() => setOpen((current) => !current)}
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          aria-controls="mobile-navigation-panel"
        >
          <span className="menu-icon" aria-hidden="true"><span /><span /></span>
        </button>
      </nav>
      {open && (
        <div
          className="mobile-menu-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Portfolio navigation"
          onClick={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <nav id="mobile-navigation-panel" className="mobile-menu-panel" aria-label="Mobile navigation">
            <p className="mobile-menu-kicker">Navigate the portfolio</p>
            <div className="mobile-menu-links">
              {navItems.map((item, index) => (
                <button
                  key={item}
                  className={`mobile-menu-link ${activeSection === item.toLowerCase() ? "active" : ""}`}
                  style={{ "--menu-index": index }}
                  onClick={() => goTo(item)}
                >
                  <span>{item}</span><ArrowUpRight size={18} />
                </button>
              ))}
            </div>
          </nav>
        </div>
      )}
    </>
  );
}

function ProfilePortrait() {
  const [imageFailed, setImageFailed] = useState(false);
  const stageRef = useRef(null);
  const frameRef = useRef(null);
  const pointerRef = useRef(null);
  const settleTimerRef = useRef(0);

  const setRotation = (rotateX, rotateY) => {
    const frame = frameRef.current;
    if (!frame) return;
    frame.style.setProperty("--portrait-tilt-x", `${rotateX}deg`);
    frame.style.setProperty("--portrait-tilt-y", `${rotateY}deg`);
  };

  const resetRotation = () => {
    window.clearTimeout(settleTimerRef.current);
    pointerRef.current = null;
    stageRef.current?.classList.remove("is-dragging", "is-settling");
    setRotation(0, 0);
  };

  useEffect(() => () => window.clearTimeout(settleTimerRef.current), []);

  const handlePointerDown = (event) => {
    if (event.target.closest("button") || (event.pointerType === "mouse" && event.button !== 0)) return;
    window.clearTimeout(settleTimerRef.current);
    stageRef.current?.classList.remove("is-settling");
    pointerRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      lastX: event.clientX,
      lastTime: performance.now(),
      rotateX: 0,
      rotateY: 0,
      velocity: 0,
      dragging: false,
    };
  };

  const handlePointerMove = (event) => {
    const pointer = pointerRef.current;
    if (!pointer || pointer.pointerId !== event.pointerId) return;

    const deltaX = event.clientX - pointer.startX;
    const deltaY = event.clientY - pointer.startY;
    if (!pointer.dragging && Math.max(Math.abs(deltaX), Math.abs(deltaY)) < 7) return;
    if (!pointer.dragging && Math.abs(deltaY) > Math.abs(deltaX)) {
      pointerRef.current = null;
      return;
    }

    if (!pointer.dragging) {
      pointer.dragging = true;
      stageRef.current?.classList.add("is-dragging");
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    event.preventDefault();

    const now = performance.now();
    const elapsed = Math.max(now - pointer.lastTime, 1);
    pointer.velocity = ((event.clientX - pointer.lastX) / elapsed) * 0.45;
    pointer.lastX = event.clientX;
    pointer.lastTime = now;
    pointer.rotateY = Math.max(-28, Math.min(28, deltaX * 0.45));
    pointer.rotateX = Math.max(-12, Math.min(12, -deltaY * 0.22));
    setRotation(pointer.rotateX, pointer.rotateY);
  };

  const finishPointer = (event) => {
    const pointer = pointerRef.current;
    if (!pointer || pointer.pointerId !== event.pointerId) return;
    pointerRef.current = null;
    if (!pointer.dragging) return;

    stageRef.current?.classList.remove("is-dragging");
    stageRef.current?.classList.add("is-settling");
    const momentum = Math.max(-8, Math.min(8, pointer.velocity * 18));
    setRotation(pointer.rotateX * 0.7, Math.max(-28, Math.min(28, pointer.rotateY + momentum)));
    settleTimerRef.current = window.setTimeout(() => setRotation(0, 0), 160);
  };

  return (
    <div className="portrait-stage" ref={stageRef}>
      <div className="orbit orbit-one" />
      <div className="orbit orbit-two" />
      <div
        className="portrait-frame"
        ref={frameRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishPointer}
        onPointerCancel={finishPointer}
        onTransitionEnd={(event) => {
          if (event.propertyName === "transform" && !pointerRef.current) {
            stageRef.current?.classList.remove("is-settling");
          }
        }}
      >
        {!imageFailed ? (
          <img
            src={portfolio.profileImage}
            alt="Lawrence portrait"
            onError={() => setImageFailed(true)}
            fetchPriority="high"
            draggable="false"
          />
        ) : (
          <div className="portrait-placeholder" role="img" aria-label="Profile photograph placeholder">
            <div className="initials">RL</div>
            <span>Profile photo<br />coming soon</span>
          </div>
        )}
        <div className="portrait-glare" />
        <button className="portrait-reset" type="button" onClick={resetRotation} aria-label="Reset portrait rotation" title="Reset portrait rotation">
          <Icon icon={FiRefreshCw} size={16} />
        </button>
      </div>
      <motion.div className="float-card float-card-one" animate={{ y: [0, -7, 0] }} transition={{ duration: 5, repeat: Infinity }}>
        <Sparkles size={14} /><span>Creative</span>
      </motion.div>
      <motion.div className="float-card float-card-two" animate={{ y: [0, 7, 0] }} transition={{ duration: 6, repeat: Infinity }}>
        <Code2 size={14} /><span>Problem Solver</span>
      </motion.div>
      <motion.div className="float-card float-card-three" animate={{ y: [0, -5, 0] }} transition={{ duration: 5.5, repeat: Infinity }}>
        <Layers3 size={14} /><span>Always Learning</span>
      </motion.div>
    </div>
  );
}

function FunFactCard() {
  const [factIndex, setFactIndex] = useState(0);
  const showNextFact = () => {
    setFactIndex((current) => (current + 1) % portfolio.funFacts.length);
  };

  return (
    <button className="fun-fact-card" type="button" onClick={showNextFact} aria-label="Show another fun fact">
      <span className="fun-fact-label"><Icon icon={FiRefreshCw} size={14} /> Little fact <span>{factIndex + 1}/{portfolio.funFacts.length}</span></span>
      <span className="fun-fact-text" key={factIndex} aria-live="polite">{portfolio.funFacts[factIndex]}</span>
      <span className="fun-fact-hint">Tap for another <ArrowUpRight size={14} /></span>
    </button>
  );
}

function Hero() {
  return (
    <section id="home" className="hero section-shell">
      <div className="hero-copy">
        <motion.div className="status-pill" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 }}>
          <span className="status-dot" />
          <span>Available for opportunities</span>
        </motion.div>
        <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.08, delayChildren: 0.12 } } }}>
          <motion.p className="hero-kicker" variants={reveal}>{portfolio.studentStatus}</motion.p>
          <div className="hero-name" aria-label="Renzo Lawrence">
            {"RENZO".split("").map((letter, index) => (
              <motion.span key={letter + index} style={{ "--motion-delay": `${index * 0.025}s` }} variants={{ hidden: { y: "110%", opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } } }}>{letter}</motion.span>
            ))}
          </div>
          <motion.div className="hero-surname" variants={reveal}>LAWRENCE</motion.div>
          <motion.p className="hero-role" variants={reveal}>{portfolio.role}</motion.p>
        </motion.div>
        <motion.p className="hero-intro" variants={reveal} initial="hidden" animate="visible">
          <TextReveal>{portfolio.intro}</TextReveal>
        </motion.p>
        <motion.div className="hero-actions" variants={reveal} initial="hidden" animate="visible">
          <a className="primary-button magnetic-button" data-magnetic href="#projects">View my work <ArrowUpRight size={17} /></a>
          <a className="secondary-button magnetic-button" data-magnetic href="#contact">Contact me</a>
        </motion.div>
        <motion.div className="location" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
          <MapPin size={14} />
          <span>Based in {portfolio.location}</span>
        </motion.div>
      </div>
      <ProfilePortrait />
    </section>
  );
}

function About() {
  return (
    <section id="about" className="section-shell section">
      <SectionHeading eyebrow="01 / About" title="Curious by nature. Driven by purpose." />
      <div className="about-grid">
        <motion.div className="about-lead glass-panel" variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <span className="quote-mark">“</span>
          <p><TextReveal>{portfolio.about}</TextReveal></p>
        </motion.div>
        <motion.div className="about-copy" variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <p><TextReveal>{portfolio.approach}</TextReveal></p>
          <div className="focus-card">
            <div className="focus-title"><Sparkles size={15} /> Current focus</div>
            <p>{portfolio.currentFocus}</p>
            <div className="interest-tags">
              {portfolio.interests.map((interest) => <span key={interest}>{interest}</span>)}
            </div>
          </div>
          <FunFactCard />
        </motion.div>
      </div>
    </section>
  );
}

function Skills() {
  return (
    <section id="skills" className="section-shell section">
      <SectionHeading eyebrow="02 / Skills" title="Tools for turning ideas into interfaces." copy="A growing toolkit for building accessible and thoughtful digital experiences." />
      <div className="skills-grid">
        {portfolio.skills.map((group, groupIndex) => (
          <motion.div
            className="skill-group"
            key={group.category}
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: groupIndex * 0.08 }}
          >
            <h3>{group.category}</h3>
            <div className="skill-items">
              {group.items.map((item) => (
                <div className="skill-item" key={item}>
                  <div className={`skill-icon skill-${item.toLowerCase().replaceAll(" ", "-")}`}>
                    <Icon icon={technologyIcons[item] || FiCode} size={22} />
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function ProjectVisual({ accent, title }) {
  return (
    <div className={`project-visual ${accent}`}>
      <div className="browser-chrome">
        <span /><span /><span />
        <div />
      </div>
      <div className="project-art">
        <div className="art-sidebar" />
        <div className="art-content">
          <div className="art-label">Preview</div>
          <strong>{title}</strong>
          <div className="art-lines"><span /><span /><span /></div>
        </div>
      </div>
    </div>
  );
}

function Projects() {
  const [selected, setSelected] = useState(null);
  const [activeProject, setActiveProject] = useState(0);
  const projectTrackRef = useRef(null);
  const projectPointerRef = useRef(null);
  const skipProjectClickRef = useRef(false);
  const projectLightRef = useRef({ frame: 0, pointer: null });

  useEffect(() => {
    if (!selected) return;
    const close = (event) => event.key === "Escape" && setSelected(null);
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [selected]);

  useEffect(() => () => window.cancelAnimationFrame(projectLightRef.current.frame), []);

  const scrollToProject = (index) => {
    const track = projectTrackRef.current;
    const card = track?.children[index];
    if (!track || !card) return;
    const scrollInset = Number.parseFloat(getComputedStyle(track).scrollPaddingInlineStart) || 0;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollTo({
      left: Math.max(0, card.offsetLeft - scrollInset),
      behavior: reduceMotion ? "auto" : "smooth",
    });
    setActiveProject(index);
  };

  const updateActiveProject = (event) => {
    const track = event.currentTarget;
    const cards = [...track.children];
    const center = track.scrollLeft + track.clientWidth / 2;
    let nearestIndex = 0;
    let nearestDistance = Infinity;
    cards.forEach((card, index) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const distance = Math.abs(center - cardCenter);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });
    setActiveProject(nearestIndex);
  };

  const handleProjectKeyDown = (event) => {
    if (event.target !== event.currentTarget) return;
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = Math.max(0, Math.min(portfolio.projects.length - 1, activeProject + direction));
    scrollToProject(nextIndex);
  };

  const handleProjectPointerDown = (event) => {
    const track = projectTrackRef.current;
    if (event.pointerType !== "mouse" || event.button !== 0 || !track || track.scrollWidth <= track.clientWidth) return;
    projectPointerRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startScroll: track.scrollLeft,
      dragging: false,
    };
  };

  const handleProjectPointerMove = (event) => {
    const pointer = projectPointerRef.current;
    const track = projectTrackRef.current;
    if (!pointer || pointer.pointerId !== event.pointerId || !track) return;
    const deltaX = event.clientX - pointer.startX;
    if (!pointer.dragging && Math.abs(deltaX) < 6) return;
    if (!pointer.dragging) {
      pointer.dragging = true;
      track.classList.add("is-mouse-dragging");
      track.setPointerCapture(event.pointerId);
    }
    event.preventDefault();
    track.scrollLeft = pointer.startScroll - deltaX;
  };

  const finishProjectPointer = (event) => {
    const pointer = projectPointerRef.current;
    const track = projectTrackRef.current;
    if (!pointer || pointer.pointerId !== event.pointerId) return;
    projectPointerRef.current = null;
    if (!pointer.dragging || !track) return;
    track.classList.remove("is-mouse-dragging");
    if (track.hasPointerCapture(event.pointerId)) track.releasePointerCapture(event.pointerId);
    skipProjectClickRef.current = true;
    window.setTimeout(() => {
      skipProjectClickRef.current = false;
    }, 0);
  };

  const preventClickAfterProjectDrag = (event) => {
    if (!skipProjectClickRef.current) return;
    event.preventDefault();
    event.stopPropagation();
  };

  const moveProjectLight = (event) => {
    const pointer = projectLightRef.current;
    pointer.pointer = { target: event.currentTarget, x: event.clientX, y: event.clientY };
    if (pointer.frame) return;
    pointer.frame = window.requestAnimationFrame(() => {
      const current = projectLightRef.current.pointer;
      pointer.frame = 0;
      if (!current) return;
      const bounds = current.target.getBoundingClientRect();
      current.target.style.setProperty("--pointer-x", `${current.x - bounds.left}px`);
      current.target.style.setProperty("--pointer-y", `${current.y - bounds.top}px`);
      if (!window.matchMedia("(hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference)").matches) return;
      const horizontal = (current.x - bounds.left) / bounds.width - 0.5;
      const vertical = (current.y - bounds.top) / bounds.height - 0.5;
      current.target.style.setProperty("--project-tilt-x", `${-vertical * 4}deg`);
      current.target.style.setProperty("--project-tilt-y", `${horizontal * 5}deg`);
    });
  };

  const resetProjectCard = (event) => {
    window.cancelAnimationFrame(projectLightRef.current.frame);
    projectLightRef.current.frame = 0;
    projectLightRef.current.pointer = null;
    event.currentTarget.style.setProperty("--project-tilt-x", "0deg");
    event.currentTarget.style.setProperty("--project-tilt-y", "0deg");
  };

  return (
    <section id="projects" className="section-shell section">
      <SectionHeading eyebrow="03 / Selected work" title="Built to learn. Designed to matter." />
      <div className="projects-carousel" role="region" aria-roledescription="carousel" aria-label="Featured projects">
        <div
          className="projects-grid"
          ref={projectTrackRef}
          tabIndex={0}
          aria-label="Project cards. Use the left and right arrow keys to browse."
          onScroll={updateActiveProject}
          onKeyDown={handleProjectKeyDown}
          onPointerDown={handleProjectPointerDown}
          onPointerMove={handleProjectPointerMove}
          onPointerUp={finishProjectPointer}
          onPointerCancel={finishProjectPointer}
          onClickCapture={preventClickAfterProjectDrag}
        >
        {portfolio.projects.map((project, index) => (
          <motion.article
            className="project-card"
            key={project.title}
            id={`project-slide-${index}`}
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${portfolio.projects.length}: ${project.title}`}
            data-project-index={index}
            onMouseMove={moveProjectLight}
            onMouseLeave={resetProjectCard}
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            transition={{ delay: index * 0.1 }}
          >
            <button className="project-preview" onClick={() => setSelected(project)} aria-label={`View ${project.title}`}>
              <ProjectVisual accent={project.accent} title={project.title} />
            </button>
            <div className="project-info">
              <div className="project-meta"><span>{project.type}</span><span>0{index + 1}</span></div>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="tech-tags">{project.technologies.map((tech) => <span key={tech}>{tech}</span>)}</div>
              <div className="project-links">
                {project.github && <a href={project.github} target="_blank" rel="noreferrer"><Github size={15} /> GitHub</a>}
                {project.live && <a href={project.live} target="_blank" rel="noreferrer"><ExternalLink size={15} /> Live demo</a>}
                <button onClick={() => setSelected(project)}>View details <ArrowUpRight size={15} /></button>
              </div>
            </div>
          </motion.article>
        ))}
        </div>
        {portfolio.projects.length > 1 && (
          <div className="project-pagination" role="group" aria-label="Choose a project">
            {portfolio.projects.map((project, index) => (
              <button
                key={project.title}
                type="button"
                aria-label={`Show project ${index + 1}: ${project.title}`}
                aria-current={activeProject === index ? "true" : undefined}
                onClick={() => scrollToProject(index)}
              >
                <span />
              </button>
            ))}
            <span className="visually-hidden" aria-live="polite">
              Project {activeProject + 1} of {portfolio.projects.length}
            </span>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={(event) => event.target === event.currentTarget && setSelected(null)}>
            <motion.div className="project-modal" role="dialog" aria-modal="true" aria-label={selected.title} initial={{ opacity: 0, y: 30, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20 }} onClick={(event) => event.stopPropagation()}>
              <button className="modal-close" onClick={() => setSelected(null)} aria-label="Close details"><X size={19} /></button>
              <ProjectVisual accent={selected.accent} title={selected.title} />
              <div className="modal-copy">
                <div className="eyebrow"><span />Project detail</div>
                <h3>{selected.title}</h3>
                <p>{selected.description} Additional screenshots and project information can be added here when available.</p>
                <div className="tech-tags">{selected.technologies.map((tech) => <span key={tech}>{tech}</span>)}</div>
                {selected.github && <a className="primary-button magnetic-button" data-magnetic href={selected.github} target="_blank" rel="noreferrer">Visit GitHub <ExternalLink size={16} /></a>}
                {selected.live && <a className="primary-button magnetic-button" data-magnetic href={selected.live} target="_blank" rel="noreferrer">Open live demo <ExternalLink size={16} /></a>}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function Journey() {
  return (
    <section id="journey" className="section-shell section">
      <SectionHeading eyebrow="04 / Journey" title="Always becoming." copy="A timeline for education, milestones and experiences along the way." />
      <div className="journey-list">
        {portfolio.journey.map((item, index) => (
          <motion.article className="journey-item" key={item.title} variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }}>
            <div className="timeline-marker"><span>{index + 1}</span></div>
            <div className="journey-period">{item.period}</div>
            <div className="journey-copy"><h3>{item.title}</h3><p>{item.detail}</p></div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="section-shell section contact-section">
      <motion.div className="contact-panel" variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.35 }}>
        <div className="contact-copy">
          <div className="eyebrow"><span />Start a conversation</div>
          <h2>Let&apos;s build something meaningful.</h2>
          <p>Have an interesting idea or project? I&apos;d love to hear about it.</p>
        </div>
        <div className="contact-actions">
          <a className="contact-link" href={`mailto:${portfolio.email}`}>
            <div className="contact-icon"><Mail size={18} /></div>
            <div><small>Email</small><strong>{portfolio.email}</strong></div>
            <ArrowUpRight size={18} />
          </a>
          <a className="contact-link" href={`tel:${portfolio.phone}`}>
            <div className="contact-icon"><Phone size={18} /></div>
            <div><small>Phone</small><strong>{portfolio.phone}</strong></div>
            <ArrowUpRight size={18} />
          </a>
        </div>
      </motion.div>
    </section>
  );
}

function PortfolioAssistant() {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hey! I can answer general questions, explain ideas, help with writing or code, and share what I know about Lawrence.",
    },
  ]);
  const messageListRef = useRef(null);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages, open]);

  const sendMessage = async (value) => {
    const content = value.trim();
    if (!content || busy) return;

    const nextMessages = [...messages, { role: "user", content }];
    const conversation = nextMessages
      .filter((message) => !message.error)
      .slice(-10)
      .map(({ role, content: messageContent }) => ({ role, content: messageContent }));
    setMessages([...nextMessages, { role: "assistant", content: "", streaming: true }]);
    setDraft("");
    setBusy(true);
    let streamedAnswer = "";

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: conversation }),
      });
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "The assistant could not answer right now.");
      }
      if (!response.body) throw new Error("The assistant could not stream a response.");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      const handleChunk = (line) => {
        if (!line.trim()) return;

        const event = JSON.parse(line);
        if (event.error) throw new Error(event.error);
        if (typeof event.text !== "string") return;

        streamedAnswer += event.text;
        setMessages((current) => current.map((message, index) =>
          index === current.length - 1 && message.streaming
            ? { ...message, content: streamedAnswer }
            : message
        ));
      };

      while (true) {
        const { value, done } = await reader.read();
        buffer += decoder.decode(value, { stream: !done });

        let newlineIndex = buffer.indexOf("\n");
        while (newlineIndex !== -1) {
          handleChunk(buffer.slice(0, newlineIndex));
          buffer = buffer.slice(newlineIndex + 1);
          newlineIndex = buffer.indexOf("\n");
        }

        if (done) break;
      }

      if (buffer.trim()) handleChunk(buffer);
      if (!streamedAnswer) throw new Error("The AI service returned an empty answer. Please try again.");
      setMessages((current) => current.map((message, index) =>
        index === current.length - 1 && message.streaming
          ? { role: "assistant", content: streamedAnswer }
          : message
      ));
    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : "The assistant could not answer right now.";
      setMessages((current) => {
        const pending = current[current.length - 1]?.streaming;
        const completedMessages = pending ? current.slice(0, -1) : current;
        return [
          ...completedMessages,
          ...(streamedAnswer ? [{ role: "assistant", content: streamedAnswer }] : []),
          { role: "assistant", content: message, error: true },
        ];
      });
    } finally {
      setBusy(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendMessage(draft);
  };

  return (
    <div className="floating-controls">
      <button
        type="button"
        className="back-to-top-button"
        aria-label="Back to top"
        onClick={() => scrollToSection("home")}
      >
        <ArrowDown className="back-to-top-icon" size={18} />
      </button>
      <div className="assistant-widget">
        {open && (
          <section className="assistant-panel" aria-label="Ask Renzo's AI assistant">
            <header className="assistant-header">
              <div className="assistant-mark"><FiMessageCircle aria-hidden="true" /></div>
              <div><strong>Ask Renzo</strong><span>General AI assistant</span></div>
              <button type="button" className="assistant-close" aria-label="Close assistant" onClick={() => setOpen(false)}><X size={18} /></button>
            </header>
            <div className="assistant-messages" ref={messageListRef} aria-live="polite">
              {messages.map((message, index) => (
                <div className={`assistant-message ${message.role}${message.error ? " error" : ""}`} key={`${message.role}-${index}`}>
                  {message.content}
                </div>
              ))}
              {busy && !messages[messages.length - 1]?.content && <div className="assistant-typing" role="status">Thinking<span /><span /><span /></div>}
              {messages.length === 1 && (
                <div className="assistant-prompts">
                  {["What is Lawrence learning?", "Explain a coding idea", "Help me brainstorm an idea"].map((prompt) => (
                    <button type="button" key={prompt} onClick={() => sendMessage(prompt)} disabled={busy}>{prompt}</button>
                  ))}
                </div>
              )}
            </div>
            <form className="assistant-form" onSubmit={handleSubmit}>
              <label className="sr-only" htmlFor="assistant-question">Ask a question</label>
              <textarea
                id="assistant-question"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    handleSubmit(event);
                  }
                }}
                maxLength={1500}
                rows={1}
                placeholder="Ask a question..."
                disabled={busy}
              />
              <button type="submit" aria-label="Send question" disabled={busy || !draft.trim()}><FiSend aria-hidden="true" /></button>
            </form>
            <p className="assistant-disclaimer">Your conversation isn&apos;t saved on this site. Messages are sent to Gemini to generate replies; don&apos;t share private information. AI can make mistakes.</p>
          </section>
        )}
        <button
          type="button"
          className={`assistant-launcher${open ? " active" : ""}`}
          aria-expanded={open}
          aria-label={open ? "Close AI assistant" : "Ask Renzo's AI assistant"}
          onClick={() => setOpen((current) => !current)}
        >
          {open ? <X size={20} /> : <><FiMessageCircle aria-hidden="true" /><span>Ask Renzo AI</span></>}
        </button>
      </div>
    </div>
  );
}

function Footer() {
  const socials = portfolio.socials;

  return (
    <footer className="footer section-shell">
      <button className="wordmark magnetic-button" data-magnetic onClick={() => scrollToSection("home")}>R<span>ENZO</span></button>
      <div className="footer-credit">
        <p>© {new Date().getFullYear()} Lawrence. Built with intention.</p>
        <div className="footer-links" role="group" aria-label="Social profiles and email">
          {socials.map(({ name, handle = "", url }) => {
            const SocialIcon = socialIcons[name];
            const icon = <Icon icon={SocialIcon} size={17} />;

            return url.trim()
              ? (
                <a key={name} href={url} target="_blank" rel="noreferrer" aria-label={handle ? `${name} ${handle}` : name} title={handle || name}>
                  {icon}
                </a>
              )
              : (
                <span
                  key={name}
                  className="unconfigured"
                  role="img"
                  aria-label={`${name} profile`}
                  title={handle || `Add the ${name} handle and URL in personalInfo.js`}
                >
                  {icon}
                </span>
              );
          })}
          <a href={`mailto:${portfolio.email}`} aria-label="Email" title="Email"><Mail size={17} /></a>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  const [activeSection, setActiveSection] = useState("home");
  const scrollProgressRef = useRef(null);

  useEffect(() => {
    const revealElements = [...document.querySelectorAll("[data-reveal]")];
    const navbar = document.querySelector(".navbar");
    let scrollFrame = 0;
    const updateScrollProgress = () => {
      navbar?.classList.toggle("scrolled", window.scrollY > 16);
      const revealLine = window.innerHeight * 0.92;
      revealElements.forEach((element) => {
        if (element.classList.contains("is-visible")) return;
        const { top, bottom } = element.getBoundingClientRect();
        if (top < revealLine && bottom > 0) element.classList.add("is-visible");
      });

      if (scrollFrame) return;
      scrollFrame = window.requestAnimationFrame(() => {
        const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollableHeight > 0
          ? Math.min(Math.max(window.scrollY / scrollableHeight, 0), 1)
          : 0;
        scrollProgressRef.current?.style.setProperty("--scroll-progress", String(progress));
        scrollFrame = 0;
      });
    };
    window.addEventListener("scroll", updateScrollProgress, { passive: true });
    updateScrollProgress();

    const activeObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.isIntersecting && setActiveSection(entry.target.id));
    }, { rootMargin: "-30% 0px -55% 0px", threshold: 0 });
    document.querySelectorAll("section[id]").forEach((section) => activeObserver.observe(section));
    return () => {
      window.removeEventListener("scroll", updateScrollProgress);
      if (scrollFrame) window.cancelAnimationFrame(scrollFrame);
      activeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const magneticMedia = window.matchMedia("(hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference)");
    const resetMagnet = (target) => {
      target.style.setProperty("--magnetic-x", "0px");
      target.style.setProperty("--magnetic-y", "0px");
    };
    const handleMagneticMove = (event) => {
      if (!magneticMedia.matches || !(event.target instanceof Element)) return;
      const target = event.target.closest("[data-magnetic]");
      if (!target) return;
      const bounds = target.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      const horizontal = (event.clientX - bounds.left) / bounds.width - 0.5;
      const vertical = (event.clientY - bounds.top) / bounds.height - 0.5;
      target.style.setProperty("--magnetic-x", `${Math.max(-5, Math.min(5, horizontal * 10))}px`);
      target.style.setProperty("--magnetic-y", `${Math.max(-3, Math.min(3, vertical * 6))}px`);
    };
    const handleMagneticOut = (event) => {
      if (!(event.target instanceof Element)) return;
      const target = event.target.closest("[data-magnetic]");
      if (target && !target.contains(event.relatedTarget)) resetMagnet(target);
    };
    const resetAllMagnets = () => {
      document.querySelectorAll("[data-magnetic]").forEach(resetMagnet);
    };
    const handleMagneticPreferenceChange = (event) => {
      if (!event.matches) resetAllMagnets();
    };

    document.addEventListener("pointermove", handleMagneticMove, { passive: true });
    document.addEventListener("pointerout", handleMagneticOut);
    magneticMedia.addEventListener("change", handleMagneticPreferenceChange);
    return () => {
      document.removeEventListener("pointermove", handleMagneticMove);
      document.removeEventListener("pointerout", handleMagneticOut);
      magneticMedia.removeEventListener("change", handleMagneticPreferenceChange);
      resetAllMagnets();
    };
  }, []);

  return (
    <>
      <div className="scroll-progress" ref={scrollProgressRef} />
      <Navbar activeSection={activeSection} />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Journey />
        <Contact />
        <PortfolioAssistant />
      </main>
      <Footer />
    </>
  );
}