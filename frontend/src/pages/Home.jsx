// الصفحة الرئيسية: Hero، الخدمات، من نحن، ليه تختارنا وفورم العملاء
import Header from '../components/Header.jsx';
import LeadForm from '../components/LeadForm.jsx';

const SERVICES = [
  ['Web Development', 'Fast, secure websites and web apps.'],
  ['Mobile Apps', 'iOS and Android apps people keep using.'],
  ['UI/UX Design', 'Clear interfaces tested with real users.'],
  ['E-Commerce', 'Online stores that convert and scale.'],
  ['Digital Marketing', 'SEO, ads and content that bring leads.'],
  ['Custom Software', 'Internal tools built around your workflow.']
];
const WHY = [
  ['Professional Team', 'Senior people on every project.'],
  ['Fast Delivery', 'Working releases every two weeks.'],
  ['Modern Tech', 'Current, well-supported tools.'],
  ['Support', 'We stay available after launch.'],
  ['Custom Solutions', 'Built for you, not from a template.'],
  ['Reliable', 'Clear estimates and honest updates.']
];
const TECH = ['React', 'Node.js', 'Python', 'Flutter', 'PostgreSQL', 'AWS', 'Figma'];

function Cards({ items, tag }) {
  const Tag = tag;
  return items.map(([title, text]) => (
    <Tag className="card" key={title}><h3>{title}</h3><p>{text}</p></Tag>
  ));
}

export default function Home() {
  return (
    <>
      <Header variant="public" />
      <main className="wrap">
        <section className="hero" id="home">
          <h1>Software that your business can actually grow on.</h1>
          <p>Ze tech designs and builds websites, apps and custom systems for growing companies. Tell us what you need and we will reply within one business day.</p>
          <div className="cta">
            <a className="btn" href="#contact">Get Started</a>
            <a className="btn alt" href="#contact">Contact Us</a>
          </div>
        </section>

        <section className="s" id="services">
          <h2>What we build</h2>
          <div className="grid"><Cards items={SERVICES} tag="div" /></div>
        </section>

        <section className="s" id="about">
          <div className="split">
            <div>
              <h2>About us</h2>
              <p>We are a team of 25 engineers, designers and marketers with more than 10 years of shipping products for clients in retail, logistics, health and finance.</p>
            </div>
            <div>
              <h3>Technologies we use</h3>
              <div className="tech">{TECH.map((t) => <span key={t}>{t}</span>)}</div>
            </div>
          </div>
        </section>

        <section className="s" id="why">
          <h2>Why choose us</h2>
          <ul className="grid plain"><Cards items={WHY} tag="li" /></ul>
        </section>

        <section className="s" id="contact">
          <h2>Tell us about your project</h2>
          <LeadForm />
        </section>
      </main>
      <footer><div className="wrap">© 2026 Ze tech. All rights reserved.</div></footer>
    </>
  );
}
