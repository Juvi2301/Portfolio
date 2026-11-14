"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { ArrowUpRight, CircleAlert, Mail, MessageCircle } from "lucide-react";
import { mailtoLink, siteConfig, whatsappLink } from "@/lib/site";
import SectionHeader from "./SectionHeader";

/*
  There is no backend or email service on this site, so the form does not
  pretend to send anything. After validation it hands the message to the
  visitor's own email app (mailto) or to WhatsApp, and the status line says
  exactly that: the visitor still presses send there.
*/

type FieldName = "name" | "email" | "subject" | "message";
type Values = Record<FieldName, string>;
type Errors = Partial<Record<FieldName, string>>;
type Channel = "email" | "whatsapp";

const FIELD_ORDER: FieldName[] = ["name", "email", "subject", "message"];
const EMPTY_VALUES: Values = { name: "", email: "", subject: "", message: "" };
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const NAME_MIN = 2;
const SUBJECT_MIN = 3;
const MESSAGE_MIN = 10;
const MESSAGE_MAX = 1500; // keeps the mailto URL under common client limits

function validate(values: Values): Errors {
  const errors: Errors = {};
  if (values.name.trim().length < NAME_MIN) errors.name = "Enter your name.";
  if (!values.email.trim()) errors.email = "Enter your email address.";
  else if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = "Enter a valid email address, like name@company.com.";
  if (values.subject.trim().length < SUBJECT_MIN) errors.subject = "Add a short subject.";
  if (values.message.trim().length < MESSAGE_MIN) errors.message = `Write at least ${MESSAGE_MIN} characters.`;
  return errors;
}

const CHANNELS = [
  {
    label: "Email",
    value: siteConfig.email,
    action: "Write an email",
    href: `mailto:${siteConfig.email}`,
    icon: Mail,
    external: false,
  },
  {
    label: "WhatsApp",
    value: siteConfig.phone.display,
    action: "Open WhatsApp",
    href: whatsappLink(),
    icon: MessageCircle,
    external: true,
  },
  {
    label: "LinkedIn",
    value: "in/thayalan-pritheeve",
    action: "View profile",
    href: siteConfig.socials.linkedin,
    icon: ArrowUpRight,
    external: true,
  },
];

export default function Contact() {
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState<Values>(EMPTY_VALUES);
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [attempted, setAttempted] = useState(false);
  const [handedOff, setHandedOff] = useState<Channel | null>(null);

  const errors = validate(values);

  function onChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const name = event.target.name as FieldName;
    setValues({ ...values, [name]: event.target.value });
    setHandedOff(null);
  }

  function onBlur(name: FieldName) {
    setTouched({ ...touched, [name]: true });
  }

  // An error shows only after the visitor left the field or tried to send.
  function visibleError(name: FieldName) {
    if (!attempted && !touched[name]) return undefined;
    return errors[name];
  }

  function fieldProps(name: FieldName) {
    const error = visibleError(name);
    return {
      id: `contact-${name}`,
      name,
      value: values[name],
      onChange,
      onBlur: () => onBlur(name),
      "aria-invalid": error ? true : false,
      "aria-describedby": error ? `contact-${name}-error` : undefined,
    };
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAttempted(true);

    const firstInvalid = FIELD_ORDER.find((name) => errors[name]);
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`#contact-${firstInvalid}`)?.focus();
      setHandedOff(null);
      return;
    }

    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const channel: Channel = submitter?.value === "whatsapp" ? "whatsapp" : "email";
    const name = values.name.trim();
    const email = values.email.trim();
    const subject = values.subject.trim();
    const message = values.message.trim();

    if (channel === "whatsapp") {
      const text = `Hi Pritheeve, I'm ${name} (${email}).\n\n${subject}\n\n${message}`;
      window.open(whatsappLink(text), "_blank", "noopener,noreferrer");
    } else {
      const body = `${message}\n\n${name}\n${email}`;
      window.location.assign(mailtoLink(subject, body));
    }
    setHandedOff(channel);
  }

  function renderError(name: FieldName) {
    const error = visibleError(name);
    if (!error) return null;
    return (
      <p className="field-error" id={`contact-${name}-error`}>
        <CircleAlert size={14} aria-hidden="true" />
        {error}
      </p>
    );
  }

  return (
    <section id="contact" className="section contact" aria-labelledby="contact-title">
      <div className="section-inner">
        <SectionHeader
          index="06"
          label="Contact"
          titleId="contact-title"
          align="center"
          title={
            <>
              Let&apos;s talk about <span className="title-muted">your next project.</span>
            </>
          }
          lede="Full-stack development, API work and modern web applications. Write by email or WhatsApp, whichever suits you."
        />

        <ul className="contact-channels">
          {CHANNELS.map((channel) => {
            const Icon = channel.icon;
            return (
              <li key={channel.label}>
                <a
                  className="contact-channel glass spotlight reveal"
                  data-glass="panel"
                  href={channel.href}
                  target={channel.external ? "_blank" : undefined}
                  rel={channel.external ? "noopener noreferrer" : undefined}
                >
                  <span className="contact-channel-icon" aria-hidden="true">
                    <Icon size={18} strokeWidth={1.9} />
                  </span>
                  <span className="contact-channel-label">{channel.label}</span>
                  <span className="contact-channel-value">{channel.value}</span>
                  <span className="contact-channel-action">
                    {channel.action}
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </span>
                </a>
              </li>
            );
          })}
        </ul>

        <form ref={formRef} className="contact-form glass reveal" data-glass="panel" noValidate onSubmit={onSubmit}>
          <div className="contact-form-head">
            <h3 className="contact-form-title">Send a message</h3>
            <p className="contact-form-note">It opens in your email app or WhatsApp, ready to send.</p>
          </div>

          <div className="form-row">
            <div className="field">
              <label htmlFor="contact-name">
                Full name <span className="field-required">(required)</span>
              </label>
              <input type="text" autoComplete="name" required {...fieldProps("name")} />
              {renderError("name")}
            </div>
            <div className="field">
              <label htmlFor="contact-email">
                Email address <span className="field-required">(required)</span>
              </label>
              <input type="email" autoComplete="email" inputMode="email" required {...fieldProps("email")} />
              {renderError("email")}
            </div>
          </div>

          <div className="field">
            <label htmlFor="contact-subject">
              Subject <span className="field-required">(required)</span>
            </label>
            <input type="text" required {...fieldProps("subject")} />
            {renderError("subject")}
          </div>

          <div className="field">
            <label htmlFor="contact-message">
              Message <span className="field-required">(required)</span>
            </label>
            <textarea rows={5} maxLength={MESSAGE_MAX} required {...fieldProps("message")} />
            {renderError("message")}
          </div>

          <div className="form-actions">
            <button className="btn btn-primary" type="submit" name="channel" value="email">
              <Mail size={17} aria-hidden="true" />
              Send by email
            </button>
            <button className="btn btn-secondary" type="submit" name="channel" value="whatsapp">
              <MessageCircle size={17} aria-hidden="true" />
              Send on WhatsApp
            </button>
          </div>

          <p className="form-status" role="status">
            {handedOff === "email" &&
              `Your email app should now open with this message ready. It is sent only when you press send there. If nothing opened, write to ${siteConfig.email}.`}
            {handedOff === "whatsapp" &&
              "WhatsApp opened in a new tab with your message filled in. It is sent only when you press send there."}
          </p>
        </form>
      </div>
    </section>
  );
}
