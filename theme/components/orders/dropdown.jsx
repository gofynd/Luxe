import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import OutsideClickHandler from "react-outside-click-handler";
import styles from "./styles/dropdown.less";
import SvgWrapper from "../core/svgWrapper/SvgWrapper";

function Dropdown({ type, selectedOption, dropdownData }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const openDropdown = () => {
    setIsOpen(!isOpen);
  };
  const replaceQueryParam = (key, value) => {
    const querParams = new URLSearchParams(location.search);
    querParams.set(key, value);
    navigate({
      pathname: "/profile/orders",
      search: querParams.toString(),
    });
    close();
    getOrderDataWithFilterQuery();
  };
  const getOrderDataWithFilterQuery = () => {};
  const replaceQuery = (option) => {
    switch (type) {
      case "time": {
        replaceQueryParam("selected_date_filter", option.value);
        break;
      }
      case "status": {
        replaceQueryParam("status", option.value);
        break;
      }
      default:
        break;
    }
  };
  const close = () => {
    setIsOpen(false);
  };
  return (
    <OutsideClickHandler onOutsideClick={() => setIsOpen(false)}>
      <div className={`${styles.selected}`} onClick={openDropdown}>
        {selectedOption}
        <SvgWrapper svgSrc="arrowDropdownBlack" onBlur={close} />
        {isOpen && (
          <ul className={`${styles.menu}`}>
            {dropdownData.map((option, index) => (
              <li key={index} onClick={() => replaceQuery(option)}>
                {!option.is_selected && <SvgWrapper svgSrc="regular" />}
                {option.is_selected && <SvgWrapper svgSrc="radio-selected" />}
                <span>{option.display}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </OutsideClickHandler>
  );
}

export default Dropdown;
