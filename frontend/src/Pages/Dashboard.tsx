import Statcards from "../components/Statcard";

export default function Dashboard() {
  return (
    <div>
        <header className="app-topbar">
          <h1>Dashboard</h1>
        </header>
        <section className="app-content">
          <p>Hello Club Officer!</p>
          <Statcards />
        </section>
    </div>
  );
}

