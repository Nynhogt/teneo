import Link from "next/link";
import TeneoMark from "@/components/TeneoMark";

const services = [
  {
    number: "01",
    name: "Aplicação web",
    technology: "Next.js · TypeScript",
    description: "Interface para a operação e os futuros painéis de gestão.",
  },
  {
    number: "02",
    name: "API principal",
    technology: "Ruby on Rails · Active Record",
    description: "Base para empresas, usuários, obras e operações.",
  },
  {
    number: "03",
    name: "Análises",
    technology: "Go",
    description: "Serviço separado para processamento e análises.",
  },
  {
    number: "04",
    name: "Dados",
    technology: "PostgreSQL",
    description: "Banco relacional compartilhado, com isolamento por empresa a implementar.",
  },
];

export default function Home() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <Link className="brand" href="/" aria-label="TENEO início">
          <TeneoMark className="brand-mark" />
          <span>TENEO</span>
        </Link>
        <span className="environment"><span className="status-dot" /> Ambiente local</span>
      </header>

      <section className="hero">
        <div className="hero-mark" aria-hidden="true">
          <TeneoMark idle />
        </div>
        <p className="eyebrow">PLATAFORMA DE GESTÃO · CONSTRUÇÃO & AMBIENTE</p>
        <h1>Operação organizada.<br /><span>Decisões mais claras.</span></h1>
        <p className="hero-copy">
          Uma base para conectar empresas, obras e operações em uma plataforma
          preparada para crescer.
        </p>
        <div className="hero-actions">
          <a className="primary-button" href="#arquitetura">Conheça a arquitetura <span aria-hidden="true">↓</span></a>
          <span className="setup-note">Fundação do produto · versão inicial</span>
        </div>
      </section>

      <section className="architecture" id="arquitetura">
        <div className="section-heading">
          <div>
            <p className="eyebrow">FUNDAÇÃO DO PRODUTO</p>
            <h2>Peças independentes.<br />Uma plataforma integrada.</h2>
          </div>
          <p className="section-copy">
            Cada serviço tem um papel definido. O PostgreSQL centraliza os dados;
            o acesso por empresa deve ser autorizado na API.
          </p>
        </div>
        <div className="service-grid">
          {services.map((service) => (
            <article className="service-card" key={service.number}>
              <div className="card-topline">
                <span className="card-number">{service.number}</span>
                <span className="card-arrow" aria-hidden="true">↗</span>
              </div>
              <h3>{service.name}</h3>
              <p className="technology">{service.technology}</p>
              <p className="card-description">{service.description}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="footer">
        <span>TENEO <span className="footer-muted">· Base de desenvolvimento</span></span>
        <span>Construído para crescer com responsabilidade.</span>
      </footer>
    </main>
  );
}
