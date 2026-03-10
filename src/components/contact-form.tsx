"use client";

import { useState } from "react";

export function ContactForm() {
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");

    // Simulate submission for this simple form.
    // In a real app, you would send this to an API endpoint.
    setTimeout(() => {
      setStatus("success");
    }, 1000);
  }

  if (status === "success") {
    return (
      <div className="form-alert form-alert-success">
        <p>Thanks for your message! We will get back to you shortly.</p>
      </div>
    );
  }

  return (
    <form
      className="form-shell"
      style={{ padding: 0, margin: 0 }}
      onSubmit={handleSubmit}
    >
      {status === "error" && (
        <div className="form-alert form-alert-error">
          <p>Something went wrong. Please try again later.</p>
        </div>
      )}
      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="name">Name</label>
          <input type="text" id="name" name="name" required />
        </div>
        <div className="form-field">
          <label htmlFor="email">Email Address</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div className="form-field full">
          <label htmlFor="subject">Subject</label>
          <input type="text" id="subject" name="subject" required />
        </div>
        <div className="form-field full">
          <label htmlFor="message">Message</label>
          <textarea id="message" name="message" required />
        </div>
      </div>
      <button
        type="submit"
        className="button button-primary"
        disabled={status === "submitting"}
        style={{ alignSelf: "flex-start" }}
      >
        {status === "submitting" ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
