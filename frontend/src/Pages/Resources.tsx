import Statcards from "../components/Statcard";

export default function Resources() {
  return (
    <div>
        <header className="app-topbar">
          <h1>Resources</h1>
        </header>
        <section className="app-content">
          <p>Helpful Links</p>
          <Statcards />
        </section>
    </div>
  );
}