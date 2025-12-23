import ContactForm from "@/components/ContactForm";

const AboutMe = () => {
  return (
    <div>
      <h1>About me</h1>
      <h2>Section</h2>
      <h3>Subsection</h3>
      <h4>Subtitle</h4>
      <h5>Small text</h5>
      <h6>Smaller text</h6>
      <p data-aos="fade-up">Párrafo con un poco de todo</p>
      <ContactForm
        nameLabel="Your Name"
        emailLabel="Your Email"
        messageLabel="Your Message"
        submitLabel="Send"
        successMessage="Thank you! Your message has been sent."
        errorMessage="Oops! Something went wrong. Please try again."
        className="custom-contact-form"
      />
    </div>
  );
};

export default AboutMe;
