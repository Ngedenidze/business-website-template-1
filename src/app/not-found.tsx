import Link from "next/link";

export default function NotFoundPage() {
  return (
    <section className="section">
      <div className="page-wrap">
        <div className="section-surface" style={{ display: "grid", gap: "0.8rem" }}>
          <h1>Page not found</h1>
          <p>We could not find that page. You can return home or request a booking directly.</p>
          <div className="button-row">
            <Link className="button button-primary" href="/">
              Go to Home
            </Link>
            <Link className="button button-secondary" href="/booking-request">
              Request a Booking
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
