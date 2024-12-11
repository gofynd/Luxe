import React from "react";
import Base64 from "crypto-js/enc-base64";
import Utf8 from "crypto-js/enc-utf8";
import { useGlobalStore } from "fdk-core/utils";
import ContactPage from "fdk-react-templates/pages/contact-us/contact-us";
import { useSnackbar } from "../helper/hooks";
import { CREATE_TICKET } from "../queries/supportQuery";
import useHeader from "../components/header/useHeader";
import SocailMedia from "../components/socail-media/socail-media";
import "fdk-react-templates/pages/contact-us/contact-us.css";

function ContactUs({ fpi }) {
  const { contactInfo, supportInfo, appInfo } = useHeader(fpi);
  const THEME = useGlobalStore(fpi.getters.THEME);
  const mode = THEME?.config?.list.find(
    (f) => f.name === THEME?.config?.current
  );

  const pageConfig =
    mode?.page?.find((f) => f.page === "contact-us")?.settings?.props || {};

  const { showSnackbar } = useSnackbar();

  const handleSubmitForm = (data) => {
    try {
      let finalText = "";
      if (data?.name) {
        finalText += `<b>Name: </b>${data?.name}<br>`;
      }
      if (data?.phone) {
        finalText += `<b>Contact: </b>${data?.phone}<br>`;
      }
      if (data?.email) {
        finalText += `<b>Email: </b>${data?.email}<br>`;
      }
      if (data?.comment) {
        finalText += `<b>Comment: </b>${data?.comment}<br>`;
      }
      finalText = `<div>${finalText}</div>`;
      const wordArray = Utf8.parse(finalText);
      finalText = Base64.stringify(wordArray);
      const values = {
        addTicketPayloadInput: {
          _custom_json: {
            comms_details: {
              name: data?.name,
              email: data?.email,
              phone: data?.phone,
            },
          },
          category: "contact-us",
          content: {
            attachments: [],
            description: finalText,
            title: "Contact Request",
          },
          priority: "low",
        },
      };

      fpi
        .executeGQL(CREATE_TICKET, values)
        .then(() => {
          showSnackbar("Ticket created successfully", "success");
        })
        .catch(() => showSnackbar("Something went wrong", "error"));
    } catch (error) {
      console.error("Error submitting form:", error);
      showSnackbar("An error occurred while submitting the form", "error");
    }
  };

  return (
    <ContactPage
      contactInfo={contactInfo}
      supportInfo={supportInfo}
      handleSubmitForm={handleSubmitForm}
      pageConfig={pageConfig}
      SocailMedia={SocailMedia}
    />
  );
}

export const settings = JSON.stringify({
  props: [
    {
      id: "align_image",
      type: "select",
      options: [
        {
          value: "left",
          text: "Left",
        },
        {
          value: "right",
          text: "Right",
        },
      ],
      default: "right",
      label: "Banner alignment",
    },
    {
      type: "image_picker",
      id: "image_desktop",
      label: "Upload banner",
      default: "",
      options: {
        aspect_ratio: "3:4",
        aspect_ratio_strict_check: true,
      },
    },
    {
      type: "range",
      id: "opacity",
      min: 0,
      max: 100,
      step: 1,
      unit: "%",
      label: "Overlay Banner opacity",
      default: 30,
    },
    {
      type: "checkbox",
      id: "show_address",
      default: true,
      label: "Address",
      info: "Show Address",
    },
    {
      type: "checkbox",
      id: "show_phone",
      default: true,
      label: "Phone",
      info: "Show Phone",
    },
    {
      type: "checkbox",
      id: "show_email",
      default: true,
      label: "Email",
      info: "Show Email",
    },
    {
      type: "checkbox",
      id: "show_icons",
      default: true,
      label: "Social media icons",
      info: "Show Icons",
    },
    {
      type: "checkbox",
      id: "show_working_hours",
      default: true,
      label: "Working Hours",
      info: "Show Working Hours",
    },
  ],
});

export const sections = JSON.stringify([]);

export default ContactUs;
