import { useState } from "react";
import Spinner from "./Spinner";
import ReactMarkdown from "react-markdown";

export interface ContactFormProps {
  nameLabel: string;
  emailLabel: string;
  messageLabel: string;
  submitLabel: string;
  successMessage: string;
  errorMessage: string;
  className?: string;
}

type FormState = "idle" | "submitting" | "submitted" | "error";

const INPUT_COMMON_CLASSES = "p-2.5 pb-3 rounded text-[0.9em] text-black ";

async function handleSubmit(
  e: React.FormEvent<HTMLFormElement>,
  setFormState: React.Dispatch<React.SetStateAction<FormState>>,
  setSubmittedEmail: React.Dispatch<React.SetStateAction<string>>,
  props: ContactFormProps
) {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const message = formData.get("message") as string;
  setFormState("submitting");

  try {
    const response = await fetch("/api/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message }),
    });

    if (!response.ok) {
      throw new Error(props.errorMessage);
    }
    setSubmittedEmail(email);
    setFormState("submitted");
  } catch (error) {
    console.error("Failed to send email:", error);
    alert(props.errorMessage);
  }
}

const ContactForm = (props: ContactFormProps) => {
  const [formState, setFormState] = useState<FormState>("idle");
  const [submittedEmail, setSubmittedEmail] = useState<string>("");

  switch (formState) {
    case "submitted":
      return (
        <div
          className={`flex items-center justify-center ${props.className}`}
          data-aos="responsive-up"
        >
            <div className="flex flex-col gap-5 bg-white-alt p-8 rounded text-black">
          <ReactMarkdown>
            {props.successMessage.replace("[email]", submittedEmail)}
          </ReactMarkdown>
          </div>
        </div>
      );
      case "error":
        return (
          <div
            className={`flex items-center justify-center text text-white-alt ${props.className}`}
            data-aos="responsive-up"
          >
            <div className="flex flex-col gap-5 bg-white-alt p-8 rounded text-main">
            <ReactMarkdown>
              {props.errorMessage}
            </ReactMarkdown>
            </div>
          </div>
        );
    case "idle":
      return (
        <form
          className={`*:flex *:flex-col gap-5 *:gap-2 grid grid-cols-2 ${props.className}`}
          data-aos="responsive-up"
          onSubmit={(e) =>
            handleSubmit(e, setFormState, setSubmittedEmail, props)
          }
        >
          <div>
            <label htmlFor="name" className="font-bold">
              {props.nameLabel}
            </label>
            <input
              type="text"
              name="name"
              id="name"
              required
              className={INPUT_COMMON_CLASSES + "h-10"}
            />
          </div>

          <div>
            <label htmlFor="email" className="font-bold">
              {props.emailLabel}
            </label>
            <input
              type="email"
              name="email"
              id="email"
              required
              className={INPUT_COMMON_CLASSES + "h-10"}
            />
          </div>

          <div className="col-span-2">
            <label htmlFor="message" className="font-bold">
              {props.messageLabel}
            </label>
            <textarea
              name="message"
              id="message"
              required
              className={INPUT_COMMON_CLASSES + "h-[120px]"}
            ></textarea>
          </div>

          <button className="flex items-center col-span-2 bg-main mt-1 p-5 rounded font-bold hover:text-black text-center transition-all hover:bg-accent-2">
            {props.submitLabel}
          </button>
        </form>
      );
    case "submitting":
      return <Spinner className="col-span-2 md:col-span-1" />;
  }
};

export default ContactForm;
