import React, { useState, useEffect } from "react";
import styles from "../styles/contact-us.less"; // Ensure the LESS file is correctly compiled to CSS
import FyInput from "fdk-react-templates/components/core/fy-input/fy-input";
import "fdk-react-templates/components/core/fy-input/fy-input.css";
import useHeader from "../components/header/useHeader";
import { useForm, Controller } from "react-hook-form";
import { CREATE_TICKET } from "../queries/supportQuery";
import { useSnackbar } from "../helper/hooks";
import Base64 from "crypto-js/enc-base64";
import Utf8 from "crypto-js/enc-utf8";
import { FDKLink } from "fdk-core/components";
import SvgWrapper from "../components/core/svgWrapper/SvgWrapper";
import FyButton from "fdk-react-templates/components/core/fy-button/fy-button";
import "fdk-react-templates/components/core/fy-button/fy-button.css";
import SocailMedia from "../components/socail-media/socail-media";
import { useGlobalStore } from "fdk-core/utils";
import FyImage from "../components/core/fy-image/fy-image";
import { isRunningOnClient } from "../helper/utils";

function ContactUs({ fpi }) {
  const { contactInfo, supportInfo, appInfo } = useHeader(fpi);
  const [isMobile, setIsMobile] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const THEME = useGlobalStore(fpi.getters.THEME);
  const mode = THEME?.config?.list.find(
    (f) => f.name === THEME?.config?.current
  );

  const pageConfig =
    mode?.page?.find((f) => f.page === "contact-us")?.settings?.props || {};

  useEffect(() => {
    if (isRunningOnClient()) {
      const localDetectMobileWidth = () =>
        document?.getElementsByTagName("body")?.[0]?.getBoundingClientRect()
          ?.width <= 800;
      setIsMobile(localDetectMobileWidth());
    }
  }, []);

  const { showSnackbar } = useSnackbar();
  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm({
    defaultValues: {
      email: "",
      name: "",
      phone: "",
      comment: "",
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const inputFields = [
    {
      type: "text",
      label: "Full Name",
      name: "name",
      multiline: false,
      showAsterik: true,
      required: true,
      error: errors?.name,
      pattern: null,
      errorMessage: "Please enter your name",
    },
    {
      type: "number",
      label: "Mobile Number",
      name: "phone",
      multiline: false,
      showAsterik: true,
      required: true,
      error: errors?.phone,
      pattern: {
        value: /^[0-9]{10}$/,
        message: "Invalid Mobile Number",
      },
      errorMessage: errors?.phone?.message || "Invalid Mobile Number",
    },
    {
      type: "email",
      label: "Email",
      name: "email",
      multiline: false,
      showAsterik: true,
      required: true,
      error: errors?.email,
      pattern: {
        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        message: "Invalid email address",
      },
      errorMessage: errors?.email?.message || "Invalid email address",
    },
    {
      type: "textarea",
      label: "Message",
      name: "comment",
      showAsterik: false,
      required: false,
      error: errors?.comment,
      pattern: null,
      errorMessage: "Please enter your comment",
      multiline: true,
    },
  ];

  const handleSubmitForm = async (data) => {
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
          reset();
        })
        .catch(() => showSnackbar("Something went wrong", "error"));
    } catch (error) {
      console.error("Error submitting form:", error);
      showSnackbar("An error occurred while submitting the form", "error");
    }
  };

  const contact = supportInfo?.contact?.phone?.phone[0];
  const email = supportInfo?.contact?.email?.email[0]?.value;

  const overlayStyles = {
    "--overlay-opacity": `${pageConfig?.opacity}%`,
  };

  return (
    <div
      className={`${styles.basePageContainer} ${styles.contactUs_mainContainer} ${pageConfig?.align_image === "left" && styles.invert}`}
    >
      <div
        className={`${styles.contact_container} ${!isMobile && pageConfig?.image_desktop && styles.onImageContainer}`}
      >
        <div className={`${styles.flex_item}`}>
          <h3 className={styles.fontHeader}>Contact Us</h3>
          <div className={styles.listItems}>
            {pageConfig?.show_address && (
              <div className={`${styles.item} fontBody b1`}>
                <div>
                  <SvgWrapper svgSrc="location" />
                </div>
                <div>
                  {contactInfo?.address?.address_line?.map((el, i) => (
                    <span key={i}>{el}</span>
                  ))}
                  <span>{` ${contactInfo?.address?.city}`}</span>
                  <span>,{` ${contactInfo?.address?.pincode}`}</span>
                </div>
              </div>
            )}
            {pageConfig?.show_phone && (
              <div className={`${styles.item} fontBody b1`}>
                <SvgWrapper svgSrc="call" />
                <FDKLink to={`tel:${contact?.number}`}>
                  {contact?.code}-{contact?.number}
                </FDKLink>
              </div>
            )}
            {pageConfig?.show_email && (
              <div className={`${styles.item} fontBody b1`}>
                <SvgWrapper svgSrc="contactEmail" />
                <FDKLink to={`mailto:${email}`}>{email}</FDKLink>
              </div>
            )}
            {pageConfig?.show_working_hours && (
              <div className={`${styles.item} fontBody b1`}>
                <SvgWrapper svgSrc="timer" />
                {contactInfo?.support?.timing}
              </div>
            )}
            {pageConfig?.show_icons && (
              <SocailMedia social_links={contactInfo?.social_links} />
            )}
          </div>
        </div>
        <div className={styles.flex_item}>
          <form onSubmit={handleSubmit(handleSubmitForm)}>
            {inputFields.map((field, index) => (
              <div className={styles.form_row} key={index}>
                <Controller
                  name={field.name}
                  control={control}
                  rules={{
                    required: field.required,
                    pattern: field.pattern,
                  }}
                  render={({ field: { onChange, value } }) => (
                    <FyInput
                      htmlFor={field.name}
                      labelClassName={styles.lableText}
                      inputClassName={`${styles.inputPlaceholder} fontBody`}
                      label={focusedInput === field.name ? field.label : ""}
                      onFocus={() => setFocusedInput(field.name)}
                      onBlur={() => setFocusedInput(null)}
                      placeholder={field.label}
                      showAsterik={field.showAsterik}
                      required={field.required}
                      labelVariant="floating"
                      type={field.type}
                      error={errors[field.name]}
                      onChange={onChange}
                      value={value}
                      multiline={field.multiline}
                      errorMessage={
                        errors[field.name]
                          ? errors[field.name].message || field.errorMessage
                          : ""
                      }
                    />
                  )}
                />
              </div>
            ))}
            <div>
              <FyButton
                className={`${styles.btn_submit}`}
                variant="outlined"
                size="large"
                color="primary"
                fullWidth={true}
                type="submit"
              >
                SEND MESSAGE
              </FyButton>
            </div>
          </form>
        </div>
      </div>
      {!isMobile && pageConfig?.image_desktop && (
        <div className={styles.imageContainer} style={overlayStyles}>
          <FyImage
            customClass={styles.imageWrapper}
            src={pageConfig?.image_desktop}
            aspectRatio={3 / 4}
            showOverlay={true}
            overlayColor="#000000"
            overlayCustomClass={styles.overlay}
          />
        </div>
      )}
    </div>
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
