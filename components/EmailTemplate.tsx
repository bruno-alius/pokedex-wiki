export interface EmailTemplateProps {
    name: string;
    email: string;
    message: string;
}

const EmailTemplate = (props: EmailTemplateProps) => {
    return `
<div
  style="
    background-color: black;
    padding: 12px;
    border-radius: 8px;
    font-family: &quot;Arial&quot;;
  "
>
  <div
    style="
      padding: 32px;
      background-color: #ffffff;
      border-radius: 8px;
    "
  >
    <div>
      <h1
        style="font-weight: 900; font-size: 32px; color: #0f1526; margin: 0px"
      >
        Nuevo contacto a través de formulario
      </h1>
      <div
        style="
          font-weight: 600;
          font-size: 18px;
          font-style: italic;
          color: #0f1526;
          margin: 0px;
          margin-bottom: 6px;
          margin-top: 8px;
        "
      >
        No respondas a este correo. Usa los siguientes datos para ponerte en
        contacto con el cliente.
      </div>
      <p
        style="
          font-weight: 600;
          font-size: 18px;
          color: #0f1526;
          margin: 0px;
          margin-bottom: 6px;
          margin-top: 20px;
        "
      >
        Nombre:
      </p>
      <p style="font-size: 16px; color: #0f1526; margin: 0px">${props.name}</p>
      <p
        style="
          font-weight: 600;
          font-size: 18px;
          color: #0f1526;
          margin: 0px;
          margin-bottom: 6px;
          margin-top: 20px;
        "
      >
        E-mail:
      </p>
      <p style="font-size: 16px; color: #0f1526; margin: 0px">${props.email}</p>
      <p
        style="
          font-weight: 600;
          font-size: 18px;
          color: #0f1526;
          margin: 0px;
          margin-bottom: 6px;
          margin-top: 20px;
        "
      >
        Mensaje:
      </p>
      <p style="font-size: 16px; color: #0f1526; margin: 0px">
        ${props.message}
      </p>
    </div>
  </div>
</div>

    `;
};

export default EmailTemplate;
