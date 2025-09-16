import "./ContactPage.css";
import withLayout from "../../layouts/HOC/withLayout";
function ContactPage() {
  return (
    <div className="contact container">
      <div className="contact__form-panel">
        <h2 className="contact__title">Get in touch</h2>
        <form className="contact__form" noValidate>
          <div className="contact__row">
            <div className="contact__field">
              <label htmlFor="firstName" className="contact__label">First Name</label>
              <input id="firstName" type="text" className="contact__input" placeholder="First Name" />
            </div>
            <div className="contact__field">
              <label htmlFor="lastName" className="contact__label">Last Name</label>
              <input id="lastName" type="text" className="contact__input" placeholder="Last Name" />
            </div>
          </div>

          <div className="contact__row">
            <div className="contact__field">
              <label htmlFor="email" className="contact__label">Email</label>
              <input id="email" type="email" className="contact__input" placeholder="Enter your Email" />
            </div>
            <div className="contact__field">
              <label htmlFor="phone" className="contact__label">Phone</label>
              <input id="phone" type="tel" className="contact__input" placeholder="Phone" />
            </div>
          </div>

          <div className="contact__row contact__row--full">
            <div className="contact__field">
              <label htmlFor="message" className="contact__label">About Your Project</label>
              <textarea id="message" className="contact__textarea" placeholder="Tell us a bit about your project" />
            </div>
          </div>

          <div className="contact__actions">
            <button type="submit" className="contact__submit">Submit</button>
          </div>
        </form>
      </div>

      <aside className="contact__info-panel">
        <h2 className="contact__info-title">Let's Connect!</h2>
        <p className="contact__info-subtitle">We typically respond within 1 business day.</p>
        <ul className="contact__info-list">
          <li className="contact__info-item">
            <span className="contact__info-icon">📧</span>
            <a href="mailto:info@Mankindamerica.com" className="contact__info-text">info@Mankindamerica.com</a>
          </li>
          <li className="contact__info-item">
            <span className="contact__info-icon">📱</span>
            <a href="tel:+1(123) 456-7890" className="contact__info-text">+ 1(123) 456-7890</a>
          </li>
          <li className="contact__info-item">
            <span className="contact__info-icon">📍</span>
            <span className="contact__info-text">808 S Eldorado Road Suite 105 D Bloomington Il, 61704</span>
          </li>
        </ul>
      </aside>
    </div>
  );
}

export default withLayout(ContactPage);
