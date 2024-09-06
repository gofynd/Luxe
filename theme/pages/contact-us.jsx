import React from "react";
import styles from "../styles/contact-us.less"; // Ensure the LESS file is correctly compiled to CSS
import FyInput from "fdk-react-templates/components/core/fy-input/fy-input";
import "fdk-react-templates/components/core/fy-input/fy-input.css";
import useHeader from "../components/header/useHeader";
import { useForm, Controller } from "react-hook-form";
import { CREATE_TICKET } from "../queries/supportQuery";
import { useSnackbar } from "../helper/hooks";
import Base64 from "crypto-js/enc-base64";
import Utf8 from "crypto-js/enc-utf8";

function ContactUs({ fpi }) {
  const { contactInfo, supportInfo, appInfo } = useHeader(fpi);
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
      label: "Email Id",
      name: "email",
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
      label: "Please Leave Your Comment Here",
      name: "comment",
      showAsterik: false,
      required: false,
      error: errors?.comment,
      pattern: null,
      errorMessage: "Please enter your comment",
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
  return (
    <div
      className={`${styles.basePageContainer} ${styles.contactUs_mainContainer}`}
    >
      <div className={`${styles.contact_us} ${styles.card_container}`}>
        <div className={styles.headers}>
          <div className={`${styles.item} ${styles.title}`}>
            Connect With Us
          </div>
          <div className={styles.regular_sm}>
            We are always happy to serve our customers. Have a query or
            suggestion? Feel free to contact us.
          </div>
        </div>
      </div>
      <div className={`${styles.contact_us} ${styles.contact_container}`}>
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
                      label={field.label}
                      showAsterik={field.showAsterik}
                      required={field.required}
                      labelVariant="floating"
                      type={field.type}
                      error={errors[field.name]}
                      onChange={onChange}
                      value={value}
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
            <button
              className={`${styles.common_btn} ${styles.btn_submit} ${styles.bold_xs}`}
              type="submit"
            >
              Submit
            </button>
          </form>
        </div>
        <div className={`${styles.flex_item} ${styles.contact_details}`}>
          <div className={`${styles.item}`}>
            <div className={`${styles.bold_xl} ${styles.store_title}`}>
              {appInfo?.name}
            </div>
            <div className={`${styles.desc} ${styles.regular_sm}`}></div>
          </div>
          <div className={` ${styles.item}`}>
            <div className={`${styles.bold_xl} ${styles.store_title}`}>
              HEAD OFFICE ADDRESS
            </div>
            <div className={`${styles.desc} ${styles.regular_sm}`}>
              {contactInfo?.address?.address_line?.map((el, i) => (
                <span key={i}>{el}</span>
              ))}
              <span>{` ${contactInfo?.address?.city}`}</span>
              <span>,{` ${contactInfo?.address?.pincode}`}</span>
            </div>
          </div>
          <div className={styles.contact_details}>
            <h6
              className={`${styles.regular_sm} ${styles.item} ${styles.dustyColor}`}
            >
              For more details, queries, complaints, suggestion or feedback
            </h6>
            <div className={`${styles.contact} ${styles.item}`}>
              <h6>
                Phone: {contact?.code}-{contact?.number}
              </h6>
              <h6>Email: {email}</h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;
