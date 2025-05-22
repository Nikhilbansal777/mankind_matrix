import "./ContactPage.css";
import withLayout from "../../layouts/HOC/withLayout";
function ContactPage() {
  return (
    <div className="container">
      <div className="contact-form">
        <h2>Please fill the form</h2>
        <form>
          <div className="form-group">
            <input type="text" placeholder="First Name" />
            <input type="text" placeholder="Last Name" />
          </div>
          <div className="form-group">
            <input type="email" placeholder="Enter your Email" />
            <input type="text" placeholder="Phone" />
          </div>
          <div className="form-group">
            <textarea placeholder="About Your Project"></textarea>
          </div>
          <button type="submit">SUBMIT</button>
        </form>
      </div>
      <div className="contact-info">
        <h2>Let's Connect!</h2>
        <div className="info-item">
          <a href="mailto:info@Mankindamerica.com">
            {" "}
            📧 info@Mankindamerica.com
          </a>
        </div>
        <div className="info-item">
          <a href="tel:+1(123) 456-7890"> 📱 + 1(123) 456-7890</a>
        </div>
        <div className="info-item">
          <span> 📍 808 S Eldorado Road Suite 105 D Bloomington Il, 61704</span>
        </div>
      </div>
    </div>
  );
}

export default withLayout(ContactPage);
