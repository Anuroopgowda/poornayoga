import React, { useState } from "react";

const services = [
  ["☀", "Residential Rooftop Solar", "Explore rooftop solar options designed around your home's energy use, available roof area and budget."],
  ["▦", "Commercial & Industrial Solar", "Solar project solutions for offices, shops, warehouses and industrial facilities."],
  ["⚡", "Solar EPC & Installation", "Project planning, equipment coordination, installation and commissioning support through qualified professionals."],
  ["▤", "Solar System Upgrades", "Discuss system expansion, inverter replacement and improvements to an existing solar setup."],
  ["▣", "Battery Storage", "Explore energy storage options to support backup needs and better energy management."],
  ["♧", "Energy Consultation", "Understand system sizing, site requirements, expected generation and the installation process."],
];

const steps = [
  ["01 / DISCOVER", "Understand your needs", "We discuss your electricity usage, goals, budget and site details."],
  ["02 / ASSESS", "Review the site", "Roof suitability, shade, electrical requirements and system size are assessed."],
  ["03 / PLAN", "Get your proposal", "Review the proposed system, equipment, scope, pricing and expected generation."],
  ["04 / DELIVER", "Install & commission", "Work is coordinated with appropriately qualified and authorised professionals."],
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [status, setStatus] = useState("Your enquiry will be sent securely to our team.");
  const [submitting, setSubmitting] = useState(false);

  async function submitEnquiry(event) {
    event.preventDefault();
    setSubmitting(true);
    setStatus("Sending your enquiry…");
    const form = event.currentTarget;
    try {
      const response = await fetch("/api/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const contentType = response.headers.get("content-type") || "";
      const result = contentType.includes("application/json")
        ? await response.json()
        : { error: "The enquiry service is unavailable. Start the app with its API server and try again." };
      if (!response.ok) throw new Error(result.error || "Unable to send your enquiry.");
      setStatus("Thank you. Your enquiry has been sent.");
      form.reset();
    } catch (error) {
      setStatus(error.message || "Unable to send your enquiry. Please call us directly.");
    } finally {
      setSubmitting(false);
    }
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <>
      <header>
        <div className="wrap nav">
          <a className="brand" href="#home" aria-label="Poornayoga Energy home">
            <img className="brand-logo" src="/logo.jpg" alt="Poornayoga Energy — Powering a Brighter Tomorrow" />
          </a>
          <nav id="navlinks" className={`links${menuOpen ? " show" : ""}`}>
            <a href="#services" onClick={closeMenu}>Services</a>
            <a href="#about" onClick={closeMenu}>About</a>
            <a href="#process" onClick={closeMenu}>Our Process</a>
            <a href="#contact" onClick={closeMenu}>Contact</a>
          </nav>
          <a className="btn" href="#contact">Get a Quote</a>
          <button className="menu" aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>☰</button>
        </div>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="wrap hero-grid">
            <div>
              <div className="eyebrow">Clean energy. Smarter future.</div>
              <h1>Powering a <span>Brighter</span> Tomorrow.</h1>
              <p>Make the switch to dependable solar energy with Poornayoga Energy Solutions. We help homes and businesses explore practical rooftop solar solutions.</p>
              <div className="hero-actions">
                <a className="btn" href="#contact">Request a Free Consultation</a>
                <a className="btn outline" href="#services">Explore Solutions</a>
              </div>
            </div>
            <div className="hero-art" aria-label="Illustration of the sun and a solar panel">
              <div className="sun" />
              <div className="panel">{Array.from({ length: 12 }, (_, i) => <i key={i} />)}</div>
              <div className="leaf" />
            </div>
          </div>
        </section>

        <div className="trust"><div className="wrap trust-grid">
          <div><strong>Residential Solar</strong><span>For homes and apartments</span></div>
          <div><strong>Commercial Solar</strong><span>For businesses and facilities</span></div>
          <div><strong>End-to-End Support</strong><span>From consultation to commissioning</span></div>
        </div></div>

        <section id="services"><div className="wrap">
          <div className="section-head"><div className="eyebrow">What we do</div><h2>Solar solutions for every ambition</h2><p>Whether you are planning a home rooftop system or exploring solar for your business, we can help you understand the right next step.</p></div>
          <div className="cards">{services.map(([icon, title, description]) => <article className="card" key={title}><div className="icon">{icon}</div><h3>{title}</h3><p>{description}</p></article>)}</div>
        </div></section>

        <section className="about" id="about"><div className="wrap about-grid">
          <div className="about-visual"><span>Clean power. Complete care.</span></div>
          <div className="about-copy"><div className="eyebrow">About Poornayoga</div><h2>A brighter future starts with a smarter energy choice.</h2><p>Poornayoga Energy Solutions Private Limited is being built around a simple idea: make clean energy easier to understand and adopt. We aim to bring customers clear guidance, thoughtful system planning and dependable project support.</p>
            <ul className="ticks"><li>Solutions planned around your site and energy needs</li><li>Clear communication at every project stage</li><li>Focus on quality, safety and responsible execution</li><li>Support for residential and business requirements</li></ul>
            <a className="btn" href="#contact">Talk to Our Team</a>
          </div>
          <div className="founder"><div><div className="eyebrow">Meet the Founder</div><h3>Varun</h3><p>Founder · Poornayoga Energy Solutions Private Limited</p><p>Focused on making reliable solar energy solutions more accessible to homes and businesses.</p><p><strong>Email:</strong> <a href="mailto:varun00333@gmail.com">varun00333@gmail.com</a><br /><strong>Phone:</strong> <a href="tel:+919380588302">+91 93805 88302</a></p></div></div>
        </div></section>

        <section id="process"><div className="wrap">
          <div className="section-head"><div className="eyebrow">How it works</div><h2>Your solar journey, made simple</h2><p>A clear process helps you make an informed decision before installation begins.</p></div>
          <div className="process">{steps.map(([label, title, description]) => <div className="step" key={label}><b>{label}</b><h3>{title}</h3><p>{description}</p></div>)}</div>
        </div></section>

        <section className="cta"><div className="wrap cta-inner"><div><h2>Ready to explore solar?</h2><p>Let's discuss a clean-energy solution for your home or business.</p></div><a className="btn" href="#contact">Get in Touch</a></div></section>

        <section className="contact" id="contact"><div className="wrap">
          <div className="section-head"><div className="eyebrow">Contact us</div><h2>Let's start a conversation</h2><p>Tell us about your solar requirement. Contact our team directly or send an enquiry using the form.</p></div>
          <div className="contact-grid">
            <div className="contact-info"><h3>Poornayoga Energy Solutions Private Limited</h3><p>Powering a Brighter Tomorrow.</p>
              <div className="contact-item"><b>Phone</b><span><a href="tel:+919380588302">+91 93805 88302</a></span></div>
              <div className="contact-item"><b>Company email</b><span><a href="mailto:PoornayogaEnergySolutionsPrivateLimited@gamil.com">PoornayogaEnergySolutionsPrivateLimited@gamil.com</a></span></div>
              <div className="contact-item"><b>Founder</b><span>Varun · <a href="mailto:varun00333@gmail.com">varun00333@gmail.com</a></span></div>
              <div className="contact-item"><b>Office</b><span>Karnataka, India · Contact us for service locations</span></div>
            </div>
            <form className="form" onSubmit={submitEnquiry}>
              <div className="form-grid">
                <div className="field"><label htmlFor="name">Your name</label><input id="name" name="name" placeholder="Enter your name" required /></div>
                <div className="field"><label htmlFor="phone">Phone number</label><input id="phone" name="phone" type="tel" placeholder="Enter your phone number" required /></div>
                <div className="field"><label htmlFor="email">Email address</label><input id="email" name="email" type="email" placeholder="Enter your email" /></div>
                <div className="field"><label htmlFor="type">Project type</label><select id="type" name="type"><option>Residential rooftop solar</option><option>Commercial solar</option><option>Industrial solar</option><option>Battery storage</option><option>Other enquiry</option></select></div>
                <div className="field full"><label htmlFor="message">Tell us about your requirement</label><textarea id="message" name="message" placeholder="Approximate electricity bill, location and any other details" /></div>
                <div className="field full"><button className="btn" type="submit" disabled={submitting}>{submitting ? "Sending…" : "Submit Enquiry"}</button><p className="form-note" aria-live="polite">{status}</p></div>
              </div>
            </form>
          </div>
        </div></section>
      </main>

      <footer><div className="wrap foot"><div><a className="brand" href="#home" aria-label="Poornayoga Energy home"><img className="brand-logo" src="/logo.jpg" alt="Poornayoga Energy — Powering a Brighter Tomorrow" /></a><p>© {new Date().getFullYear()} Poornayoga Energy Solutions Private Limited. All rights reserved.</p></div><div className="foot-links"><a href="#services">Services</a><a href="#about">About</a><a href="#contact">Contact</a></div></div></footer>
    </>
  );
}

export default App;
