import { useState, useEffect, useMemo, useRef } from "react";
import { useGlobalStore } from "fdk-core/utils";
import { FETCH_LOCALITIES } from "../../queries/internationlQuery";

export const useAddressFormSchema = ({
  fpi,
  countryCode,
  countryIso,
  addressTemplate,
  addressFields,
  addressItem,
}) => {
  const locationDetails = useGlobalStore(fpi?.getters?.LOCATION_DETAILS);
  const [formFields, SetFormFields] = useState(null);
  const [dropdownData, setDropdownData] = useState(null);
  const [disableField, setDisableField] = useState(null);
  const cityRef = useRef(null);

  function createValidation(validation, required, error_text, slug) {
    const result = {};
    if (slug === "phone") {
      result.validate = (value) => {
        if (!value || (required && !value.mobile) || !value.isValidNumber) {
          return error_text ?? "Invalid";
        }
        if (validation?.regex?.value) {
          try {
            const regex = new RegExp(validation.regex.value);
            const isValid = regex.test(value.mobile);
            if (!isValid) {
              return error_text ?? "Invalid";
            }
          } catch (error) {}
        }
        return true;
      };
      return result;
    }

    if (required) {
      result.required = error_text ?? "Field is required";
    }
    if (validation?.type === "regex") {
      result.pattern = {
        value: new RegExp(validation?.regex.value),
        message: error_text ?? "Invalid",
      };
      if (validation?.regex?.length?.max) {
        result.maxLength = {
          value: validation?.regex?.length?.max,
          message: error_text ?? "Invalid",
        };
      }
      if (validation?.regex?.length?.min) {
        result.minLength = {
          value: validation?.regex?.length?.min,
          message: error_text ?? "Invalid",
        };
      }
    }
    return result;
  }

  const handleFieldChange =
    ({ next, slug }) =>
    (value) => {
      if (!next) return;
      const key = next === "pincode" ? "area_code" : next;
      if (slug === "city") {
        cityRef.current = value;
      }
      getLocalityValues({
        slug: next,
        key,
        city: next !== "city" && cityRef.current ? cityRef.current : "",
      });
      setDisableField((prev) => ({ ...prev, [key]: false }));
    };

  function convertField(field) {
    const {
      input,
      slug,
      display_name: display,
      required,
      validation,
      error_text,
      next,
      prev,
    } = field;

    const type =
      input === "textbox" ? (slug === "phone" ? "mobile" : "text") : input;
    const key = slug === "pincode" ? "area_code" : slug;

    const formField = {
      key,
      display,
      type,
      required,
      fullWidth: false,
      validation: createValidation(validation, required, error_text, slug),
      disabled: addressItem?.[key] ? !addressItem[key] : !!prev,
    };

    if (slug === "phone") {
      formField.countryCode = countryCode?.replace("+", "");
    }
    if (type === "list") {
      if (!prev || !!addressItem?.[key]) {
        getLocalityValues({
          slug,
          key,
          city: key !== "city" && addressItem?.city ? addressItem.city : "",
        });
      }
      formField.onChange = handleFieldChange({ next, slug });
    }
    return formField;
  }

  const convertDropdownOptions = (items) => {
    return items.map(({ display_name }) => ({
      key: display_name,
      display: display_name,
    }));
  };

  const getLocalityValues = async ({ slug, key, city = "" }) => {
    const payload = {
      pageNo: 1,
      pageSize: 1000,
      country: countryIso,
      locality: slug,
      city,
    };
    try {
      fpi.executeGQL(FETCH_LOCALITIES, payload).then((res) => {
        if (res?.data?.localities) {
          const dropdownOptions = convertDropdownOptions(
            res?.data?.localities.items
          );
          setDropdownData((prev) => {
            return { ...prev, [key]: dropdownOptions };
          });
        }
      });
    } catch (error) {}
  };

  const renderTemplate = (template) => {
    let currentIndex = 0;
    const output = [
      {
        group: `addressInfo${currentIndex}`,
        groupLabel: `addressInfo${currentIndex}`,
        fields: [],
      },
    ];
    for (let i = 0; i < template?.length; i++) {
      const char = template[i];
      if (char === "{") {
        let braceCounter = 1;
        let closingIndex;
        for (let j = i + 1; j < template.length; j++) {
          if (template[j] === "{") braceCounter++;
          else if (template[j] === "}") braceCounter--;
          if (braceCounter === 0) {
            closingIndex = j;
            break;
          }
        }
        const key = template.slice(i + 1, closingIndex);
        const obj = addressFieldsMap[key];

        output[currentIndex]?.fields.push(convertField(obj));
        i = closingIndex;
      } else if (char === "_") {
        currentIndex++;
        output[currentIndex] = {
          group: `addressInfo${currentIndex}`,
          groupLabel: `addressInfo${currentIndex}`,
          fields: [],
        };
      }
    }
    return output;
  };

  const addressFieldsMap = useMemo(() => {
    if (!addressFields) return {};
    const prevFieldMap = addressFields.reduce((acc, field) => {
      if (field.next) {
        acc[field.next] = field.slug;
      }
      return acc;
    }, {});
    return addressFields.reduce((acc, field) => {
      acc[field.slug] = prevFieldMap[field.slug]
        ? { ...field, prev: prevFieldMap[field.slug] }
        : field;
      return acc;
    }, {});
  }, [addressFields]);

  useEffect(() => {
    if (!addressTemplate || !addressFields) return;

    const schema = renderTemplate(addressTemplate);
    SetFormFields(schema);

    return () => {
      SetFormFields(null);
      setDropdownData(null);
      setDisableField(null);
      cityRef.current = null;
    };
  }, [addressTemplate, addressFields]);

  const formSchema = useMemo(() => {
    if (!dropdownData) return formFields;

    return formFields?.map((group) => ({
      ...group,
      fields: group.fields.map((field) => {
        const updatedField = {
          ...field,
          disabled: disableField?.[field.key] ?? field.disabled,
        };
        if (dropdownData[field.key]) {
          updatedField.enum = dropdownData[field.key];
        }
        return updatedField;
      }),
    }));
  }, [formFields, dropdownData, disableField]);

  const defaultAddressItem = useMemo(() => {
    const addressfields = Object.keys(addressFieldsMap);
    return addressfields.reduce((acc, field) => {
      if (locationDetails?.[field]) {
        const key = field === "pincode" ? "area_code" : field;
        acc[key] = locationDetails[field];
      }
      return acc;
    }, {});
  }, [locationDetails, addressFieldsMap]);

  return { formSchema, defaultAddressItem };
};
