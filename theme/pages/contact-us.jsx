import React from "react";
import useHeader from "../components/header/useHeader";
import { CREATE_TICKET } from "../queries/supportQuery";
import { useSnackbar } from "../helper/hooks";
import Base64 from "crypto-js/enc-base64";
import Utf8 from "crypto-js/enc-utf8";
import { useGlobalStore, useGlobalTranslation } from "fdk-core/utils";
import ContactPage from "fdk-react-templates/pages/contact-us/contact-us";
import SocailMedia from "../components/socail-media/socail-media";
import "fdk-react-templates/pages/contact-us/contact-us.css";

function ContactUs({ fpi }) {
  const { t } = useGlobalTranslation("translation");
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
          showSnackbar(t("resource.common.ticket_success"), "success");
        })
        .catch(() => showSnackbar(t("resource.common.error_message"), "error"));
    } catch (error) {
      console.error("Error submitting form:", error);
      showSnackbar(t("resource.common.error_occurred_submitting_form"), "error");
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
          text: "t:resource.common.left",
        },
        {
          value: "right",
          text: "t:resource.common.right",
        },
      ],
      default: "right",
      label: "t:resource.sections.contact_us.banner_alignment"
    },
    {
      type: "image_picker",
      id: "image_desktop",
      label: "t:resource.sections.contact_us.upload_banner",
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
      label: "t:resource.sections.contact_us.overlay_banner_opacity",
      default: 30,
    },
    {
      type: "checkbox",
      id: "show_address",
      default: true,
      label: "t:resource.sections.contact_us.address",
      info: "t:resource.sections.contact_us.show_address",
    },
    {
      type: "checkbox",
      id: "show_phone",
      default: true,
      label: "t:resource.sections.contact_us.phone",
      info: "t:resource.sections.contact_us.show_phone",
    },
    {
      type: "checkbox",
      id: "show_email",
      default: true,
      label: "t:resource.sections.contact_us.email",
      info: "t:resource.sections.contact_us.show_email",
    },
    {
      type: "checkbox",
      id: "show_icons",
      default: true,
      label: "t:resource.sections.contact_us.social_media_icons",
      info: "t:resource.sections.contact_us.show_icons",
    },
    {
      type: "checkbox",
      id: "show_working_hours",
      default: true,
      label: "t:resource.sections.contact_us.working_hours",
      info: "t:resource.sections.contact_us.show_working_hours",
    },
  ],
});

export const sections = JSON.stringify([]);

export default ContactUs;
